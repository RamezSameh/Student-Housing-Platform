using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace Student_Housing_Platform.Data
{
    public class SHP_DbContext : IdentityDbContext<ApplicationUser>
    {
        public SHP_DbContext(DbContextOptions<SHP_DbContext> options) : base(options)
        {
        }

        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }

        // Housings
        public DbSet<Housing> Housings { get; set; }
        public DbSet<HousingRoom> HousingRooms { get; set; }
        public DbSet<HousingType> HousingTypes { get; set; }
        public DbSet<Amenity> Amenities { get; set; }
        public DbSet<HousingAmenity> HousingAmenities { get; set; }
        public DbSet<HousingImage> HousingImages { get; set; }
        public DbSet<HousingReview> HousingReviews { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }

        // Universities
        public DbSet<University> Universities { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ----- convert all the enums to string -----

            builder.Entity<Housing>()
                .Property(r => r.IsAvailable).HasConversion<bool>();// Storing the RoomStatus enum as string in the database

            builder.Entity<Booking>()
                .Property(b => b.bookingStatus).HasConversion<string>();// Storing the BookingStatus enum as string in the database

            builder.Entity<Payment>()
                .Property(p => p.Method).HasConversion<string>(); // Storing the PaymentMethod enum as string in the database
            builder.Entity<Payment>()
                .Property(p => p.Status).HasConversion<string>();// Storing the PaymentStatus enum as string in the database

            //-----------------relationships-----------------------
            builder.Entity<Booking>()
                .HasOne(b => b.Payment)
                .WithOne(p => p.Booking)
                .HasForeignKey<Payment>(p => p.BookingId);

            // booking - review one to one
            builder.Entity<Booking>()
                .HasOne(b => b.Review).WithOne(r => r.Booking)
                .HasForeignKey<Review>(r => r.BookingId)
                .OnDelete(DeleteBehavior.Restrict); //DeleteBehavior.Restrict: prevents deleting Booking if related Review exists

            // user - review one to many
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Reviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<HousingImage>()
                .HasOne(ri => ri.Housing).WithMany(r => r.Images)
                .HasForeignKey(ri => ri.HousingId).OnDelete(DeleteBehavior.Cascade);

            // University configuration
            builder.Entity<University>(b =>
            {
                b.HasKey(u => u.UniversityId);
                b.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
                b.HasIndex(u => u.City);
                b.HasIndex(u => u.Name);
            });

            // Housing configuration
            builder.Entity<Housing>(b =>
            {
                b.HasKey(h => h.HousingId);
                b.HasOne(h => h.Owner).WithMany().HasForeignKey(h => h.OwnerId).OnDelete(DeleteBehavior.Restrict);
                b.HasIndex(h => h.OwnerId);
                b.HasOne(h => h.HousingType).WithMany(ht => ht.Housings).HasForeignKey(h => h.HousingTypeId).OnDelete(DeleteBehavior.Restrict);
                b.HasIndex(h => h.City);
                b.Property(h => h.Price).HasColumnType("decimal(18,2)");
            });

            builder.Entity<HousingRoom>(b =>
            {
                b.HasKey(r => r.RoomId);
                b.HasOne(r => r.Housing).WithMany(h => h.Rooms).HasForeignKey(r => r.HousingId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Amenity>(b =>
            {
                b.HasKey(a => a.AmenityId);
                b.HasIndex(a => a.Name);
            });

            builder.Entity<HousingAmenity>(b =>
            {
                b.HasKey(ha => ha.Id);
                b.HasOne(ha => ha.Housing).WithMany(h => h.HousingAmenities).HasForeignKey(ha => ha.HousingId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(ha => ha.Amenity).WithMany(a => a.HousingAmenities).HasForeignKey(ha => ha.AmenityId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<HousingImage>(b =>
            {
                b.HasKey(i => i.Id);
                b.HasOne(i => i.Housing).WithMany(h => h.Images).HasForeignKey(i => i.HousingId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<HousingReview>(b =>
            {
                b.HasKey(r => r.HousingReviewId);
                b.HasOne(r => r.Housing).WithMany(h => h.HousingReviews).HasForeignKey(r => r.HousingId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(r => r.User).WithMany().HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Conversation>(b =>
            {
                b.HasKey(c => c.ConversationId);
                b.Property(c => c.Title).HasMaxLength(200);
            });

            builder.Entity<Message>(b =>
            {
                b.HasKey(m => m.MessageId);
                b.HasOne(m => m.Conversation).WithMany(c => c.Messages).HasForeignKey(m => m.ConversationId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(m => m.Sender).WithMany().HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Cascade);
            });

            // Favorite configuration
            builder.Entity<Favorite>(b =>
            {
                b.HasKey(f => new { f.UserId, f.HousingId });
                b.HasOne(f => f.User).WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
                b.HasOne(f => f.Housing).WithMany().HasForeignKey(f => f.HousingId).OnDelete(DeleteBehavior.Cascade);
                b.HasIndex(f => new { f.UserId, f.HousingId }).IsUnique();
            });

            // (existing seed/data comments retained)
        }
    }
}

