namespace Student_Housing_Platform.OptionsPattern.Settings
{
    public class PaymobSettings
    {
        public const string SectionName = "Paymob";

        public string ApiKey { get; set; } = string.Empty;
        public string PublicKey { get; set; } = string.Empty;
        /// <summary>HMAC secret used to verify Paymob callbacks.</summary>
        public string HmacSecret { get; set; } = string.Empty;
        public int CardIntegrationId { get; set; }
        public int IframeId { get; set; }
        public string Currency { get; set; } = "EGP";
        public string BaseUrl { get; set; } = "https://accept.paymob.com/api";
        /// <summary>Where the browser is sent after Paymob redirects back to us.</summary>
        public string FrontendResultUrl { get; set; } = "http://localhost:5173/payment/result";
    }
}
