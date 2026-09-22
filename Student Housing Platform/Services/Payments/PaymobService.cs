using System.Security.Cryptography;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Student_Housing_Platform.Services.Payments
{
    public class PaymobPaymentResult
    {
        public string PaymentUrl { get; set; } = string.Empty;
        public int PaymobOrderId { get; set; }
        public string PaymentToken { get; set; } = string.Empty;
    }

    public interface IPaymobService
    {
        /// <summary>
        /// Creates a Paymob order + payment key and returns the URL the student
        /// must be redirected to in order to pay (hosted card iframe, or the
        /// wallet provider redirect for mobile-wallet payments).
        /// </summary>
        /// <param name="booking">The booking being paid.</param>
        /// <param name="useWallet">When true, pays with a mobile wallet (Vodafone Cash, Orange Money, ...).</param>
        /// <param name="walletNumber">Egyptian mobile number linked to the wallet (01xxxxxxxxx). Required when useWallet is true.</param>
        Task<PaymobPaymentResult> CreatePaymentAsync(Booking booking, bool useWallet = false, string? walletNumber = null, CancellationToken cancellationToken = default);

        /// <summary>
        /// Verifies the HMAC signature Paymob sends on the transaction-processed
        /// callback (query string). Returns false when the signature is missing/invalid.
        /// </summary>
        bool VerifyCallbackHmac(IQueryCollection query);
    }

    public class PaymobService : IPaymobService
    {
        private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

        private readonly HttpClient _http;
        private readonly PaymobSettings _settings;
        private readonly ILogger<PaymobService> _logger;

        public PaymobService(HttpClient http, IOptions<PaymobSettings> settings, ILogger<PaymobService> logger)
        {
            _http = http;
            _settings = settings.Value;
            _logger = logger;
        }

        private void EnsureConfigured(bool useWallet)
        {
            var integrationOk = useWallet ? _settings.WalletIntegrationId != 0 : _settings.CardIntegrationId != 0;
            if (string.IsNullOrWhiteSpace(_settings.ApiKey)
                || string.IsNullOrWhiteSpace(_settings.HmacSecret)
                || !integrationOk
                || (!useWallet && _settings.IframeId == 0))
            {
                throw new InvalidOperationException(
                    "Paymob is not configured. Fill the Paymob section in appsettings.json (ApiKey, HmacSecret, CardIntegrationId, WalletIntegrationId, IframeId).");
            }
        }

        private static bool IsValidEgyptianMobile(string? number) =>
            !string.IsNullOrWhiteSpace(number) &&
            System.Text.RegularExpressions.Regex.IsMatch(number.Trim(), @"^01[0-9]{9}$");

        public async Task<PaymobPaymentResult> CreatePaymentAsync(Booking booking, bool useWallet = false, string? walletNumber = null, CancellationToken cancellationToken = default)
        {
            EnsureConfigured(useWallet);

            if (useWallet && !IsValidEgyptianMobile(walletNumber))
                throw new InvalidOperationException("A valid Egyptian mobile wallet number (01xxxxxxxxx) is required.");

            var baseUrl = _settings.BaseUrl.TrimEnd('/');

            var integrationId = useWallet ? _settings.WalletIntegrationId : _settings.CardIntegrationId;

            // ---- Step 1: authentication token ----
            var authBody = JsonSerializer.Serialize(new { api_key = _settings.ApiKey }, JsonOptions);
            using var authResponse = await _http.PostAsync(
                $"{baseUrl}/auth/tokens",
                new StringContent(authBody, Encoding.UTF8, "application/json"),
                cancellationToken);
            authResponse.EnsureSuccessStatusCode();
            var authJson = await authResponse.Content.ReadAsStringAsync(cancellationToken);
            var authToken = JsonDocument.Parse(authJson).RootElement.GetProperty("token").GetString()
                ?? throw new InvalidOperationException("Paymob auth token was empty.");

            // ---- Step 2: create order ----
            var amountCents = (int)Math.Round(booking.TotalAmount * 100m);
            var orderBody = JsonSerializer.Serialize(new
            {
                auth_token = authToken,
                delivery_needed = false,
                amount_cents = amountCents,
                currency = _settings.Currency,
                merchant_order_id = booking.BookingId,
                items = Array.Empty<object>(),
            }, JsonOptions);
            using var orderResponse = await _http.PostAsync(
                $"{baseUrl}/ecommerce/orders",
                new StringContent(orderBody, Encoding.UTF8, "application/json"),
                cancellationToken);
            orderResponse.EnsureSuccessStatusCode();
            var orderJson = await orderResponse.Content.ReadAsStringAsync(cancellationToken);
            var paymobOrderId = JsonDocument.Parse(orderJson).RootElement.GetProperty("id").GetInt32();

            // ---- Step 3: payment key ----
            var keyBody = JsonSerializer.Serialize(new
            {
                auth_token = authToken,
                amount_cents = amountCents,
                expiration = 3600,
                order_id = paymobOrderId,
                billing_data = new
                {
                    first_name = booking.StudentName ?? booking.User?.FirstName ?? "Student",
                    last_name = booking.User?.LastName ?? "Housing",
                    email = booking.Email ?? booking.User?.Email ?? "student@example.com",
                    phone_number = booking.Mobile ?? "+201000000000",
                    apartment = "NA",
                    floor = "NA",
                    street = "NA",
                    building = "NA",
                    city = "Cairo",
                    country = "EG",
                    state = "NA",
                    postal_code = "NA",
                },
                currency = _settings.Currency,
                integration_id = integrationId,
            }, JsonOptions);
            using var keyResponse = await _http.PostAsync(
                $"{baseUrl}/acceptance/payment_keys",
                new StringContent(keyBody, Encoding.UTF8, "application/json"),
                cancellationToken);
            keyResponse.EnsureSuccessStatusCode();
            var keyJson = await keyResponse.Content.ReadAsStringAsync(cancellationToken);
            var paymentToken = JsonDocument.Parse(keyJson).RootElement.GetProperty("token").GetString()
                ?? throw new InvalidOperationException("Paymob payment token was empty.");

            _logger.LogInformation("Paymob order {OrderId} created for booking {BookingId}", paymobOrderId, booking.BookingId);

            // ---- Step 4 (wallet only): ask Paymob for the wallet-provider redirect URL ----
            if (useWallet)
            {
                var payBody = JsonSerializer.Serialize(new
                {
                    source = new { identifier = walletNumber!.Trim(), subtype = "WALLET" },
                    payment_token = paymentToken,
                }, JsonOptions);
                using var payResponse = await _http.PostAsync(
                    $"{baseUrl}/acceptance/payments/pay",
                    new StringContent(payBody, Encoding.UTF8, "application/json"),
                    cancellationToken);
                payResponse.EnsureSuccessStatusCode();
                var payJson = await payResponse.Content.ReadAsStringAsync(cancellationToken);
                var redirectUrl = JsonDocument.Parse(payJson).RootElement.GetProperty("redirect_url").GetString()
                    ?? throw new InvalidOperationException("Paymob wallet redirect URL was empty.");

                return new PaymobPaymentResult
                {
                    PaymentUrl = redirectUrl,
                    PaymobOrderId = paymobOrderId,
                    PaymentToken = paymentToken,
                };
            }

            return new PaymobPaymentResult
            {
                PaymentUrl = $"{baseUrl}/acceptance/iframes/{_settings.IframeId}?payment_token={paymentToken}",
                PaymobOrderId = paymobOrderId,
                PaymentToken = paymentToken,
            };
        }

        public bool VerifyCallbackHmac(IQueryCollection query)
        {
            if (string.IsNullOrWhiteSpace(_settings.HmacSecret))
                return false;

            // Field order mandated by Paymob for the transaction-processed callback.
            string[] keys =
            {
                "amount_cents", "created_at", "currency", "error_occured",
                "has_parent_transaction", "id", "integration_id", "is_3d_secure",
                "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
                "is_voided", "order.id", "owner", "pending",
                "source_data.pan", "source_data.sub_type", "source_data.type", "success",
            };

            var concatenated = string.Concat(keys.Select(k => query[k].ToString()));
            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(_settings.HmacSecret));
            var computed = BitConverter.ToString(hmac.ComputeHash(Encoding.UTF8.GetBytes(concatenated)))
                .Replace("-", string.Empty)
                .ToLowerInvariant();

            var provided = query["hmac"].ToString().ToLowerInvariant();
            return !string.IsNullOrEmpty(provided) &&
                   CryptographicOperations.FixedTimeEquals(
                       Encoding.UTF8.GetBytes(computed),
                       Encoding.UTF8.GetBytes(provided));
        }
    }
}
