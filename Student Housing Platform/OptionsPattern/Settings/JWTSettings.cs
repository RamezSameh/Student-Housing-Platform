namespace Student_Housing_Platform.OptionsPattern.Settings
{
    public class JWTSettings
    {
        public const string SectionName = "JWT";

        public string Secret { get; set; } = string.Empty;
        public string ValidIssuer { get; set; } = string.Empty;
        public string ValidAudience { get; set; } = string.Empty;
        public int ExpiryInHours { get; set; }
    }
}
