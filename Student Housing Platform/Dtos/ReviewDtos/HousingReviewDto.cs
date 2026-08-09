namespace Student_Housing_Platform.Dtos.ReviewDtos
{
    public class HousingReviewDto
    {
        public int HousingReviewId { get; set; }
        public int HousingId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
    }
}
