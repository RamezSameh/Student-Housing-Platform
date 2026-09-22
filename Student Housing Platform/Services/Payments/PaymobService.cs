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
        /// Creates a Paymob order + payment key and returns the hosted iframe URL
        /// the student must be redirected to in order to pay.
        /// </summary>
        Task<PaymobPaymentResult> CreatePaymentAsync(Booking booking, CancellationToken cancellationToken = default);

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

        private void EnsureConfigured()
        {
            if (string.IsNullOrWhiteSpace(_settings.ApiKey)
                || string.IsNullOrWhiteSpace(_settings.HmacSecret)
                || _settings.CardIntegrationId == 0
                || _settings.IframeId == 0)
            {
                throw new InvalidOperationException(
                    "Paymob is not configured. Fill the Paymob section in appsettings.json (ApiKey, HmacSecret, CardIntegrationId, IframeId).");
            }
        }

        public async Task<PaymobPaymentResult> CreatePaymentAsync(Booking booking, CancellationToken cancellationToken = default)
        {
            EnsureConfigured();
            var baseUrl = _settings.BaseUrl.TrimEnd('/');

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
                integration_id = _settings.CardIntegrationId,
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
