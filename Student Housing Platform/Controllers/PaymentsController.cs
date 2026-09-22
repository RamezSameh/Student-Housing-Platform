using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;
using System.Text.Json;
using Student_Housing_Platform.Services.Payments;

namespace Student_Housing_Platform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly SHP_DbContext _context;
        private readonly IPaymobService _paymob;
        private readonly PaymobSettings _paymobSettings;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(
            SHP_DbContext context,
            IPaymobService paymob,
            IOptions<PaymobSettings> paymobSettings,
            ILogger<PaymentsController> logger)
        {
            _context = context;
            _paymob = paymob;
            _paymobSettings = paymobSettings.Value;
            _logger = logger;
        }

        public record InitiatePaymobDto(int BookingId, string? PaymentType = "card", string? WalletNumber = null);

        /// <summary>
        /// Starts a Paymob payment for an owner-approved booking.
        /// PaymentType: "card" (default) or "wallet" (mobile wallet, requires WalletNumber).
        /// Returns the URL the student must be redirected to in order to pay.
        /// </summary>
        [HttpPost("paymob/initiate")]
        [Authorize]
        public async Task<IActionResult> InitiatePaymob([FromBody] InitiatePaymobDto dto, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("User ID not found in token.");

            var booking = await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == dto.BookingId && b.UserId == userId, cancellationToken);

            if (booking == null)
                return NotFound("Booking not found or you do not have permission.");
            if (booking.PaymentMethod != PaymentMethod.Paymob)
                return BadRequest("This booking is not set to pay with Paymob.");
            if (booking.bookingStatus != BookingStatus.OwnerApproved)
                return BadRequest("Booking must be approved by the owner before payment.");
            if (booking.Payment != null && booking.Payment.Status == PaymentStatus.Succeeded)
                return BadRequest("This booking is already paid.");

            try
            {
                var useWallet = string.Equals(dto.PaymentType, "wallet", StringComparison.OrdinalIgnoreCase);
                var result = await _paymob.CreatePaymentAsync(booking, useWallet, dto.WalletNumber, cancellationToken);
                return Ok(new { paymentUrl = result.PaymentUrl, paymobOrderId = result.PaymobOrderId });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Paymob initiation failed for booking {BookingId}", dto.BookingId);
                return BadRequest(ex.Message);
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "Paymob API call failed for booking {BookingId}", dto.BookingId);
                return StatusCode(StatusCodes.Status502BadGateway, "Could not reach the payment provider. Please try again.");
            }
        }

        /// <summary>
        /// Paymob redirects the student here after the card payment attempt
        /// (transaction processed callback). The HMAC is verified before the
        /// booking is marked as paid, then the student is sent to the frontend.
        /// </summary>
        [HttpGet("paymob/callback")]
        [AllowAnonymous]
        public async Task<IActionResult> PaymobCallback(CancellationToken cancellationToken)
        {
            var query = Request.Query;

            if (!_paymob.VerifyCallbackHmac(query))
            {
                _logger.LogWarning("Paymob callback rejected: invalid HMAC.");
                return Redirect($"{_paymobSettings.FrontendResultUrl}?status=failed&reason=invalid_signature");
            }

            var success = string.Equals(query["success"].ToString(), "true", StringComparison.OrdinalIgnoreCase)
                          && string.Equals(query["is_voided"].ToString(), "false", StringComparison.OrdinalIgnoreCase)
                          && string.Equals(query["is_refunded"].ToString(), "false", StringComparison.OrdinalIgnoreCase)
                          && string.Equals(query["error_occured"].ToString(), "false", StringComparison.OrdinalIgnoreCase);

            if (!int.TryParse(query["order.merchant_order_id"].ToString(), out var bookingId))
                return Redirect($"{_paymobSettings.FrontendResultUrl}?status=failed&reason=unknown_booking");

            var transactionId = query["id"].ToString();

            if (success)
                await MarkBookingPaidAsync(bookingId, transactionId, cancellationToken);

            var target = success
                ? $"{_paymobSettings.FrontendResultUrl}?status=success&bookingId={bookingId}"
                : $"{_paymobSettings.FrontendResultUrl}?status=failed&bookingId={bookingId}";

            return Redirect(target);
        }

        /// <summary>
        /// Server-to-server Paymob webhook (transaction processed callback).
        /// Kept idempotent: an already-paid booking is not touched twice.
        /// </summary>
        [HttpPost("paymob/webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> PaymobWebhook([FromBody] JsonElement payload, CancellationToken cancellationToken)
        {
            // The webhook posts JSON; HMAC verification for JSON callbacks uses the
            // same field ordering on the flattened "obj" node. We accept the event
            // only when the top-level hmac matches our own computation.
            if (!payload.TryGetProperty("hmac", out var hmacProp) ||
                !payload.TryGetProperty("obj", out var obj))
            {
                return BadRequest("Invalid Paymob webhook payload.");
            }

            if (!VerifyWebhookHmac(obj, hmacProp.GetString()))
            {
                _logger.LogWarning("Paymob webhook rejected: invalid HMAC.");
                return Unauthorized("Invalid signature.");
            }

            var success = obj.TryGetProperty("success", out var s) && s.GetBoolean();
            var bookingId = obj.TryGetProperty("order", out var order)
                && order.TryGetProperty("merchant_order_id", out var moid)
                && int.TryParse(moid.GetString(), out var parsed)
                ? parsed : (int?)null;
            var transactionId = obj.TryGetProperty("id", out var tid) ? tid.GetRawText() : null;

            if (success && bookingId.HasValue && transactionId != null)
                await MarkBookingPaidAsync(bookingId.Value, transactionId, cancellationToken);

            return Ok();
        }

        private async Task MarkBookingPaidAsync(int bookingId, string transactionId, CancellationToken cancellationToken)
        {
            var booking = await _context.Bookings
                .Include(b => b.Payment)
                .FirstOrDefaultAsync(b => b.BookingId == bookingId, cancellationToken);

            if (booking == null)
            {
                _logger.LogWarning("Paymob callback for unknown booking {BookingId}", bookingId);
                return;
            }

            // Idempotency: never record the same payment twice.
            if (booking.Payment != null && booking.Payment.Status == PaymentStatus.Succeeded)
                return;

            var payment = booking.Payment ?? new Payment
            {
                BookingId = booking.BookingId,
                Amount = booking.TotalAmount,
                PaymentDate = DateTime.UtcNow,
                Method = PaymentMethod.Paymob,
            };

            payment.TransactionId = transactionId;
            payment.Status = PaymentStatus.Succeeded;
            payment.PaymentDate = DateTime.UtcNow;

            if (booking.Payment == null)
                await _context.Payments.AddAsync(payment, cancellationToken);

            booking.bookingStatus = BookingStatus.Confirmed;
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Booking {BookingId} marked paid via Paymob (txn {TransactionId})", bookingId, transactionId);
        }

        private bool VerifyWebhookHmac(JsonElement obj, string? providedHmac)
        {
            if (string.IsNullOrWhiteSpace(_paymobSettings.HmacSecret) || string.IsNullOrWhiteSpace(providedHmac))
                return false;

            string[] keys =
            {
                "amount_cents", "created_at", "currency", "error_occured",
                "has_parent_transaction", "id", "integration_id", "is_3d_secure",
                "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
                "is_voided", "order.id", "owner", "pending",
                "source_data.pan", "source_data.sub_type", "source_data.type", "success",
            };

            static string Get(JsonElement node, string path)
            {
                var current = node;
                foreach (var part in path.Split('.'))
                {
                    if (!current.TryGetProperty(part, out current)) return string.Empty;
                }
                return current.ValueKind switch
                {
                    JsonValueKind.String => current.GetString() ?? string.Empty,
                    JsonValueKind.True => "true",
                    JsonValueKind.False => "false",
                    JsonValueKind.Null or JsonValueKind.Undefined => string.Empty,
                    _ => current.GetRawText(),
                };
            }

            var concatenated = string.Concat(keys.Select(k => Get(obj, k)));
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(_paymobSettings.HmacSecret));
            var computed = BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(concatenated)))
                .Replace("-", string.Empty)
                .ToLowerInvariant();

            return CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(computed),
                Encoding.UTF8.GetBytes(providedHmac.ToLowerInvariant()));
        }
    }
}
