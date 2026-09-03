using Student_Housing_Platform.Dtos.BookingDtos;
using Student_Housing_Platform.Models.Enums;
using Student_Housing_Platform.RepositoryPattern.Interfaces;

namespace Student_Housing_Platform.RepositoryPattern.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly SHP_DbContext _context;
        public BookingRepository(SHP_DbContext context)
        {
            _context = context;
        }
        public async Task<Booking> CreateHousingBookingAsync(CreateHousingBookingDto createHousingBookingDto, string userId)
        {
            var room = await _context.HousingRooms.FirstOrDefaultAsync(r => r.RoomId == createHousingBookingDto.HousingRoomId);
            if (room == null)
            {
                throw new KeyNotFoundException("Housing room not found");
            }

            // check availability: ensure no overlapping confirmed/approved bookings for same housing room
            var overlap = await _context.Bookings.AnyAsync(b => b.HousingRoomId == room.RoomId &&
                !(createHousingBookingDto.CheckOut <= b.CheckInDate || createHousingBookingDto.CheckIn >= b.CheckOutDate) &&
                b.bookingStatus != BookingStatus.Cancelled);
            if (overlap)
            {
                throw new InvalidOperationException("Selected room is not available for the requested dates.");
            }

            var numberOfNights = (createHousingBookingDto.CheckOut - createHousingBookingDto.CheckIn).Days;
            if (numberOfNights <= 0)
                throw new InvalidOperationException("Check-out date must be after check-in date");

            var totalAmount = room.Price * numberOfNights;

            var booking = new Booking
            {
                HousingRoomId = room.RoomId,
                HousingId = room.HousingId,
                UserId = userId,
                CheckInDate = createHousingBookingDto.CheckIn,
                CheckOutDate = createHousingBookingDto.CheckOut,
                BookingDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                bookingStatus = BookingStatus.Pending
            };

            await _context.Bookings.AddAsync(booking);
            await _context.SaveChangesAsync();
            return booking;
        }
        public async Task<Booking> CreateBookingAsync(CreateBookingDto createBookingDto, string UserId)
        {
            // Legacy CreateBookingDto.RoomId is now interpreted as HousingRoomId
            var room = await _context.HousingRooms.FirstOrDefaultAsync(r => r.RoomId == createBookingDto.RoomId);
            if (room == null)
            {
                throw new Exception("Room not found");
            }
            var pricePerNight = room.Price;
            var numberOfNights = (createBookingDto.CheckOut - createBookingDto.CheckIn).Days;
            if (numberOfNights <= 0)
            { throw new Exception("Check-out date must be after check-in date"); }
            var TotalAmount = pricePerNight * numberOfNights;
            var newBooking = new Booking
            {
                HousingRoomId = createBookingDto.RoomId,
                HousingId = room.HousingId,
                UserId = UserId, // parameter from token
                CheckInDate = createBookingDto.CheckIn,
                CheckOutDate = createBookingDto.CheckOut,
                BookingDate = DateTime.UtcNow,
                TotalAmount = TotalAmount,
                bookingStatus = BookingStatus.Pending
            };
            await _context.Bookings.AddAsync(newBooking);
            await _context.SaveChangesAsync();
            return newBooking;
        }
        public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(string userId)
        {
            return await _context.Bookings.Where(b => b.UserId == userId)
                .Include(b => b.Payment)
                .Include(b => b.HousingRoom).ThenInclude(r => r.Housing)
                .Select(b => new BookingDto
                {
                    //booking props
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalCost = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    // room/housing props (mapped for housing rooms)
                    RoomNumber = b.HousingRoom != null ? b.HousingRoom.RoomType : "",
                    Floor = 0,
                    RoomTypeName = b.HousingRoom != null ? b.HousingRoom.RoomType : "",
                    // Payment props
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A"
                })
                .ToListAsync();
        }

        public Task<BookingDto> GetBookingByIdAsync(int bookingId, string userId)
        {
            var booking = _context.Bookings
                .Where(b => b.BookingId == bookingId && b.UserId == userId)
                .Include(b => b.HousingRoom).ThenInclude(r => r.Housing)
                .Include(b => b.Payment)
                .Select(b => new BookingDto
                {
                    //booking props
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalCost = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    //housing room props
                    RoomNumber = b.HousingRoom != null ? b.HousingRoom.RoomType : "",
                    Floor = 0,
                    RoomTypeName = b.HousingRoom != null ? b.HousingRoom.RoomType : "",
                    // Payment props
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A"
                })
                .FirstOrDefaultAsync();
            return booking;
        }

        public async Task<Booking> GetBookingEntityByIdAsync(int bookingId, string userId)
        {
            return await _context.Bookings.FirstOrDefaultAsync(b => b.BookingId == bookingId && b.UserId == userId);
        }

        public async Task<Booking> UpdateBookingStatusAsync(int bookingId, BookingStatus newStatus)
        {
            // 1. ابحث عن الـ Entity الأصلية في الداتا بيز
            var bookingToUpdate = await _context.Bookings.FindAsync(bookingId);

            if (bookingToUpdate == null)
            {
                return null;
            }

            bookingToUpdate.bookingStatus = newStatus;

            // 4. (اختياري) إخبار الـ DbContext أن الحالة "تعدلت"
            _context.Entry(bookingToUpdate).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return bookingToUpdate; // (ارجع "نجاح" - تم التعديل)
        }
        public async Task ConfirmPaymentAsync(int bookingId, string userId, string transactionId)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var booking = await GetBookingEntityByIdAsync(bookingId, userId);
                    if (booking == null)
                        throw new KeyNotFoundException("Booking is not Found or user unauthorized");
                    if (booking.bookingStatus != BookingStatus.Pending)
                        throw new InvalidOperationException("Booking is already processed!");
                    // لو عدي من ال 2 check 
                    // يبقي كده الغرفة موجودة و الدفع لسا قيد الانتظار
                    var newPayment = new Payment
                    {
                        BookingId = booking.BookingId,
                        TransactionId = transactionId,
                        Amount = booking.TotalAmount,
                        PaymentDate = DateTime.Now,
                        Method = PaymentMethod.Stripe, // default
                        Status = PaymentStatus.Succeeded
                    };
                    await _context.Payments.AddAsync(newPayment);
                    //  update the booking status before saving the payment
                    booking.bookingStatus = BookingStatus.Confirmed;
                    _context.Entry(booking).State = EntityState.Modified;
                    // save both of them at once
                    await _context.SaveChangesAsync();
                    // لو كله نجح بنأكد الدفع
                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw; // throw it to controller
                }
            }


        }

        // =========================================================
        // Management views (Owner Dashboard / Admin Dashboard)
        // =========================================================

        public async Task<IEnumerable<ManagementBookingDto>> GetBookingsForOwnerAsync(string ownerId)
        {
            return await _context.Bookings
                .Where(b => b.Housing != null && b.Housing.OwnerId == ownerId)
                .Include(b => b.User)
                .Include(b => b.Housing)
                .Include(b => b.HousingRoom)
                .Include(b => b.Payment)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new ManagementBookingDto
                {
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    HousingId = b.HousingId,
                    HousingTitle = b.Housing != null ? b.Housing.Title : null,
                    HousingRoomId = b.HousingRoomId,
                    RoomType = b.HousingRoom != null ? b.HousingRoom.RoomType : null,
                    StudentId = b.UserId,
                    StudentName = b.User != null ? (b.User.FirstName + " " + b.User.LastName) : "",
                    StudentEmail = b.User != null ? b.User.Email : null,
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A"
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<ManagementBookingDto>> GetAllBookingsAsync()
        {
            return await _context.Bookings
                .Include(b => b.User)
                .Include(b => b.Housing)
                .Include(b => b.HousingRoom)
                .Include(b => b.Payment)
                .OrderByDescending(b => b.BookingDate)
                .Select(b => new ManagementBookingDto
                {
                    BookingId = b.BookingId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    BookingDate = b.BookingDate,
                    TotalAmount = b.TotalAmount,
                    Status = b.bookingStatus.ToString(),
                    HousingId = b.HousingId,
                    HousingTitle = b.Housing != null ? b.Housing.Title : null,
                    HousingRoomId = b.HousingRoomId,
                    RoomType = b.HousingRoom != null ? b.HousingRoom.RoomType : null,
                    StudentId = b.UserId,
                    StudentName = b.User != null ? (b.User.FirstName + " " + b.User.LastName) : "",
                    StudentEmail = b.User != null ? b.User.Email : null,
                    PaymentMethod = b.Payment != null ? b.Payment.Method.ToString() : "N/A",
                    PaymentStatus = b.Payment != null ? b.Payment.Status.ToString() : "N/A"
                })
                .ToListAsync();
        }
    }
}
