using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Models;
using System.Reflection.Emit;

namespace Student_Housing_Platform.Data
{
    public class SHP_DbContext : IdentityDbContext<ApplicationUser>
    {
        public SHP_DbContext(DbContextOptions<SHP_DbContext> options) : base(options)
        {
        }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<RoomImage> RoomImages { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // ----- convert all the enums to string -----

            builder.Entity<Room>()
                .Property(r => r.status).HasConversion<string>();// Storing the RoomStatus enum as string in the database

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
                .OnDelete(DeleteBehavior.Restrict); //DeleteBehavior.Restrict: يمنع حذف حجز (Booking) إذا كان مرتبطاً بريفيو (Review). هذا يحافظ على سجلاتك.

            // user - review one to many
            builder.Entity<ApplicationUser>()
                .HasMany(u => u.Reviews)
                .WithOne(r => r.User)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade); //DeleteBehavior.Cascade: إذا تم حذف مستخدم (User)، يتم حذف جميع الريفيوهات المرتبطة به تلقائياً.

            builder.Entity<RoomImage>()
                .HasOne(ri => ri.Room).WithMany(r => r.RoomImages)
                .HasForeignKey(ri => ri.RoomId).OnDelete(DeleteBehavior.Cascade); // عند حذف غرفة، يتم حذف جميع الصور المرتبطة بها تلقائياً.


            /*
            builder.Entity<RoomType>().HasData(
                new RoomType
                {
                    RoomTypeId = 1,
                    Name = "Single Room",
                    Description = "Room suitable for one student.",
                    Capacity = 1,
                    PricePerNight = 150
                },

                new RoomType
                {
                    RoomTypeId = 2,
                    Name = "Double Room",
                    Description = "Room suitable for two students.",
                    Capacity = 2,
                    PricePerNight = 250
                },

                new RoomType
                {
                    RoomTypeId = 3,
                    Name = "Triple Room",
                    Description = "Room suitable for three students.",
                    Capacity = 3,
                    PricePerNight = 350
                },

                new RoomType
                {
                    RoomTypeId = 4,
                    Name = "Quad Room",
                    Description = "Room suitable for four students.",
                    Capacity = 4,
                    PricePerNight = 450
                }
            );
            */
            /*
            builder.Entity<Room>().HasData(

                new Room
                {
                RoomId = 1,
                RoomNumber = "101",
                Floor = 1,
                status = RoomStatus.Available,
                RoomTypeId = 1
                },

                new Room
                {
                RoomId = 2,
                RoomNumber = "102",
                Floor = 1,
                status = RoomStatus.Available,
                RoomTypeId = 1
                },

                new Room
                {
                RoomId = 3,
                RoomNumber = "103",
                Floor = 1,
                status = RoomStatus.Occupied,
                RoomTypeId = 2
                },

                new Room
                {
                RoomId = 4,
                RoomNumber = "201",
                Floor = 2,
                status = RoomStatus.Available,
                RoomTypeId = 2
                },

                new Room
                {
                RoomId = 5,
                RoomNumber = "202",
                Floor = 2,
                status = RoomStatus.Available,
                RoomTypeId = 3
                },

                new Room
                {
                RoomId = 6,
                RoomNumber = "203",
                Floor = 2,
                status = RoomStatus.UnderMaintenance,
                RoomTypeId = 3
                },

                new Room
                {
                RoomId = 7,
                RoomNumber = "301",
                Floor = 3,
                status = RoomStatus.Available,
                RoomTypeId = 4
                },

                new Room
                {
                RoomId = 8,
                RoomNumber = "302",
                Floor = 3,
                status = RoomStatus.Available,
                RoomTypeId = 4
                }
            );*/

        }
    }
    
}

