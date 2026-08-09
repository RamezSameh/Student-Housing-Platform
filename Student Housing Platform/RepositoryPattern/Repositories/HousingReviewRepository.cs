using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Data;
using Student_Housing_Platform.Dtos.ReviewDtos;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class HousingReviewRepository : IHousingReviewRepository
    {
        private readonly SHP_DbContext _context;
        public HousingReviewRepository(SHP_DbContext context)
        {
            _context = context;
        }

        public async Task<HousingReviewDto> CreateAsync(CreateHousingReviewDto dto, string userId)
        {
            var housing = await _context.Housings.FindAsync(dto.HousingId);
            if (housing == null) throw new KeyNotFoundException("Housing not found");

            // Only allow users who have at least one confirmed booking to create a housing review
            var hasConfirmedBooking = await _context.Bookings.AnyAsync(b => b.UserId == userId && b.bookingStatus == Student_Housing_Platform.Models.Enums.BookingStatus.Confirmed);
            if (!hasConfirmedBooking)
            {
                throw new InvalidOperationException("User must have a confirmed booking before creating a housing review.");
            }

            var review = new HousingReview
            {
                HousingId = dto.HousingId,
                UserId = userId,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };
            await _context.AddAsync(review);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            return new HousingReviewDto
            {
                HousingReviewId = review.HousingReviewId,
                HousingId = review.HousingId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                AuthorName = user != null ? user.FirstName : ""
            };
        }

        public async Task<IEnumerable<HousingReviewDto>> GetByHousingIdAsync(int housingId)
        {
            return await _context.Set<HousingReview>()
                .Where(r => r.HousingId == housingId)
                .Include(r => r.User)
                .Select(r => new HousingReviewDto
                {
                    HousingReviewId = r.HousingReviewId,
                    HousingId = r.HousingId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    AuthorName = r.User.FirstName
                }).ToListAsync();
        }

        public async Task<double> GetAverageRatingAsync(int housingId)
        {
            var avg = await _context.Set<HousingReview>().Where(r => r.HousingId == housingId).Select(r => (double?)r.Rating).AverageAsync();
            return avg ?? 0.0;
        }
    }
}
