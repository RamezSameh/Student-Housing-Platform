using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Student_Housing_Platform.Models;
using Student_Housing_Platform.Models.Enums;

namespace Student_Housing_Platform.Data
{
    /// <summary>
    /// Seeds a large, realistic dataset across every table in the schema so the
    /// app is fully usable out of the box: multiple owners/students, housing
    /// types, amenities, housings with rooms/images/amenities, university
    /// links, reviews (both housing-level and booking-level), favorites,
    /// bookings in every status with matching payments, notifications, and a
    /// few sample conversations.
    ///
    /// Every section is guarded by an "any rows already exist?" check, so this
    /// is safe to run on every app start and will never duplicate data.
    /// </summary>
    public static class SampleSeed
    {
        // Deterministic random so re-seeding on a fresh DB is reproducible.
        private static readonly Random Rng = new Random(20260831);

        public static async Task EnsureSampleDataAsync(IServiceProvider services, CancellationToken cancellationToken = default)
        {
            using var scope = services.CreateScope();
            var sp = scope.ServiceProvider;
            var context = sp.GetRequiredService<SHP_DbContext>();
            var userManager = sp.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = sp.GetRequiredService<RoleManager<IdentityRole>>();

            // ================================================================
            // Roles
            // ================================================================
            string[] roles = new[] { "Admin", "Student", "Owner", "Customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // ================================================================
            // Owners (property owners who list housing)
            // ================================================================
            var ownerSeeds = new (string Email, string First, string Last)[]
            {
                ("owner1@example.com", "Mostafa", "Kamel"),
                ("owner2@example.com", "Nour", "El-Sayed"),
                ("owner3@example.com", "Hassan", "Aboul-Fotouh"),
                ("owner4@example.com", "Salma", "Rady"),
                ("owner5@example.com", "Tarek", "Younis"),
                ("owner6@example.com", "Dina", "Farouk"),
            };

            var owners = new List<ApplicationUser>();
            foreach (var (email, first, last) in ownerSeeds)
            {
                var user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new ApplicationUser { Email = email, UserName = email, FirstName = first, LastName = last, EmailConfirmed = true };
                    await userManager.CreateAsync(user, "Owner@123");
                    await userManager.AddToRoleAsync(user, "Owner");
                }
                owners.Add(user);
            }

            // ================================================================
            // Students / Customers (people who search and book housing)
            // ================================================================
            var studentSeeds = new (string Email, string First, string Last, string Role)[]
            {
                ("student1@example.com", "Ahmed", "Mahmoud", "Student"),
                ("student2@example.com", "Mariam", "Adel", "Student"),
                ("student3@example.com", "Youssef", "Nabil", "Student"),
                ("student4@example.com", "Farida", "Hesham", "Student"),
                ("student5@example.com", "Omar", "Zaki", "Student"),
                ("student6@example.com", "Nada", "Fathy", "Student"),
                ("student7@example.com", "Karim", "Sherif", "Student"),
                ("student8@example.com", "Laila", "Mostafa", "Student"),
                ("student9@example.com", "Ziad", "Ashraf", "Student"),
                ("student10@example.com", "Rana", "Gaber", "Student"),
                ("customer1@example.com", "Sara", "Ibrahim", "Customer"),
                ("customer2@example.com", "Hesham", "Talaat", "Customer"),
                ("customer3@example.com", "Yasmin", "Ezzat", "Customer"),
                ("customer4@example.com", "Amr", "Lotfy", "Customer"),
            };

            var students = new List<ApplicationUser>();
            foreach (var (email, first, last, role) in studentSeeds)
            {
                var user = await userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    user = new ApplicationUser { Email = email, UserName = email, FirstName = first, LastName = last, EmailConfirmed = true };
                    await userManager.CreateAsync(user, $"{role}@123");
                    await userManager.AddToRoleAsync(user, role);
                }
                students.Add(user);
            }

            // ================================================================
            // Amenities
            // ================================================================
            if (!await context.Amenities.AnyAsync(cancellationToken))
            {
                var amenityNames = new[]
                {
                    "WiFi", "Air Conditioning", "Washing Machine", "Kitchen", "Furniture",
                    "Parking", "Elevator", "24/7 Security", "Study Room", "Gym Access",
                    "Balcony", "Central Heating",
                };

                var ams = amenityNames.Select(n => new Amenity { Name = n }).ToList();
                await context.Amenities.AddRangeAsync(ams, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
            var allAmenities = await context.Amenities.ToListAsync(cancellationToken);

            // ================================================================
            // Housing Types
            // ================================================================
            if (!await context.HousingTypes.AnyAsync(cancellationToken))
            {
                var housingTypes = new List<HousingType>
                {
                    new HousingType { HousingTypeName = "Apartment", Description = "Private apartment", Capacity = 4, PricePerMonth = 2500 },
                    new HousingType { HousingTypeName = "Room", Description = "Private student room", Capacity = 1, PricePerMonth = 1800 },
                    new HousingType { HousingTypeName = "Shared Housing", Description = "Shared student accommodation", Capacity = 2, PricePerMonth = 1200 },
                    new HousingType { HousingTypeName = "Studio", Description = "Compact self-contained studio", Capacity = 1, PricePerMonth = 2100 },
                    new HousingType { HousingTypeName = "Villa", Description = "Large shared villa, several bedrooms", Capacity = 6, PricePerMonth = 3200 },
                };

                await context.HousingTypes.AddRangeAsync(housingTypes, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
            var housingTypesByName = await context.HousingTypes.ToDictionaryAsync(t => t.HousingTypeName, cancellationToken);

            // ================================================================
            // Housings (+ everything that hangs off a housing: rooms, images,
            // amenities, university links, housing-level reviews)
            // ================================================================
            if (!await context.Housings.AnyAsync(cancellationToken))
            {
                var universities = await context.Universities.ToListAsync(cancellationToken);
                University? NearestUniversity(double lat, double lng) =>
                    universities
                        .OrderBy(u => Math.Pow(u.Latitude - lat, 2) + Math.Pow(u.Longitude - lng, 2))
                        .FirstOrDefault();

                var genderTypes = new[] { "Male", "Female", "Mixed" };
                var roomTypes = new[] { "Single", "Double", "Triple", "Studio" };

                var housingSeeds = new (string Title, string City, string Address, double Lat, double Lng, decimal Price, string TypeName, bool Furnished, bool Verified)[]
                {
                    ("Cozy Student House Near Cairo University", "Giza", "Al-Haram St, Giza", 30.0330, 31.2075, 2500, "Apartment", true, true),
                    ("Budget Room by Cairo University", "Giza", "Faisal St, Giza", 30.0290, 31.2050, 1500, "Room", false, false),
                    ("Nile View Studio, Dokki", "Giza", "Tahrir St, Dokki", 30.0380, 31.2120, 2900, "Studio", true, true),
                    ("Shared Flat Near Ain Shams", "Cairo", "Abbassia St, Cairo", 30.0700, 31.2800, 1300, "Shared Housing", false, true),
                    ("Modern Apartment, Abbassia", "Cairo", "Ramses Extension, Abbassia", 30.0650, 31.2850, 2600, "Apartment", true, true),
                    ("Quiet Room for Students, Ain Shams", "Cairo", "El-Zaher St, Cairo", 30.0600, 31.2600, 1600, "Room", false, false),
                    ("Helwan Family Villa Share", "Cairo", "Corniche El-Nile, Helwan", 29.8500, 31.3000, 3200, "Villa", true, true),
                    ("Affordable Room, Helwan", "Cairo", "20th St, Helwan", 29.8650, 31.2950, 1400, "Room", false, false),
                    ("6th of October Modern Studio", "6th of October", "Central Axis, 6th of October", 29.9750, 30.9300, 2400, "Studio", true, true),
                    ("Shared Apartment Near O6U", "6th of October", "Al Hosary Square, 6th of October", 29.9650, 30.9200, 1800, "Shared Housing", true, false),
                    ("Sheikh Zayed Comfort Apartment", "Giza", "Sheikh Zayed City", 30.0300, 31.2050, 2700, "Apartment", true, true),
                    ("Nile University Nearby Room", "Giza", "Juhayna Square, Sheikh Zayed", 30.0270, 31.2000, 1700, "Room", false, true),
                    ("New Cairo Deluxe Apartment", "New Cairo", "Fifth Settlement, New Cairo", 30.0230, 31.4900, 3400, "Apartment", true, true),
                    ("GUC/AUC Shared Villa", "New Cairo", "Teseen St, New Cairo", 30.0100, 31.4700, 3600, "Villa", true, true),
                    ("Student Studio, New Cairo", "New Cairo", "First Settlement, New Cairo", 30.0250, 31.4600, 2500, "Studio", true, false),
                    ("Budget Shared Flat, New Cairo", "New Cairo", "El-Banafseg, New Cairo", 30.0170, 31.4550, 1500, "Shared Housing", false, false),
                    ("Alexandria Corniche Apartment", "Alexandria", "El-Shatby, Alexandria", 31.2050, 29.9100, 2800, "Apartment", true, true),
                    ("Smouha Student Room", "Alexandria", "Smouha, Alexandria", 31.2150, 29.9450, 1600, "Room", false, true),
                    ("Mansoura City Center Studio", "Mansoura", "Elgomhouria St, Mansoura", 31.0400, 31.3800, 2000, "Studio", true, false),
                    ("Zagazig Shared Housing", "Zagazig", "University St, Zagazig", 30.5880, 31.5000, 1200, "Shared Housing", false, false),
                    ("Tanta Comfort Room", "Tanta", "El-Giesh St, Tanta", 30.7870, 30.9950, 1400, "Room", false, true),
                    ("Assiut Student Apartment", "Assiut", "El-Nile St, Assiut", 27.1800, 31.1800, 1900, "Apartment", true, false),
                    ("Ismailia Nile Villa Share", "Ismailia", "Sultan Hussein St, Ismailia", 30.6000, 32.2700, 2600, "Villa", true, true),
                    ("Beni Suef Budget Room", "Beni Suef", "Corniche St, Beni Suef", 29.0650, 31.0980, 1100, "Room", false, false),
                    ("Maadi Quiet Apartment", "Cairo", "Road 9, Maadi", 29.9600, 31.2600, 3000, "Apartment", true, true),
                    ("Nasr City Shared Flat", "Cairo", "Makram Ebeid, Nasr City", 30.0650, 31.3450, 1700, "Shared Housing", true, true),
                };

                var housings = new List<Housing>();
                int ownerCursor = 0;

                foreach (var seed in housingSeeds)
                {
                    var owner = owners[ownerCursor % owners.Count];
                    ownerCursor++;

                    var housing = new Housing
                    {
                        Title = seed.Title,
                        Description = $"{seed.Title} — a {(seed.Furnished ? "furnished" : "unfurnished")} student housing option in {seed.City}, close to public transport and local shops.",
                        Address = seed.Address,
                        City = seed.City,
                        Latitude = seed.Lat,
                        Longitude = seed.Lng,
                        Price = seed.Price,
                        HousingTypeId = housingTypesByName[seed.TypeName].HousingTypeId,
                        GenderType = genderTypes[Rng.Next(genderTypes.Length)],
                        IsFurnished = seed.Furnished,
                        IsVerified = seed.Verified,
                        IsAvailable = true,
                        OwnerId = owner.Id,
                        CreatedAt = DateTime.UtcNow.AddDays(-Rng.Next(5, 240)),
                    };

                    housings.Add(housing);
                }

                await context.Housings.AddRangeAsync(housings, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                // ---- Rooms: 2-3 per housing ----
                var allRooms = new List<HousingRoom>();
                foreach (var housing in housings)
                {
                    var roomCount = Rng.Next(2, 4);
                    for (int i = 0; i < roomCount; i++)
                    {
                        var capacity = Rng.Next(1, 4);
                        allRooms.Add(new HousingRoom
                        {
                            HousingId = housing.HousingId,
                            RoomType = roomTypes[Rng.Next(roomTypes.Length)],
                            Capacity = capacity,
                            AvailableBeds = Rng.Next(0, capacity + 1),
                            Price = Math.Round(housing.Price / capacity * (0.9m + (decimal)Rng.NextDouble() * 0.3m), 2),
                            IsAvailable = true,
                        });
                    }
                }
                await context.HousingRooms.AddRangeAsync(allRooms, cancellationToken);

                // ---- Images: 2-4 per housing, first one primary ----
                var allImages = new List<HousingImage>();
                foreach (var housing in housings)
                {
                    var imageCount = Rng.Next(2, 5);
                    for (int i = 0; i < imageCount; i++)
                    {
                        allImages.Add(new HousingImage
                        {
                            HousingId = housing.HousingId,
                            ImageUrl = $"https://picsum.photos/seed/housing{housing.HousingId}-{i}/900/600",
                            IsPrimary = i == 0,
                            CreatedAt = housing.CreatedAt,
                        });
                    }
                }
                await context.HousingImages.AddRangeAsync(allImages, cancellationToken);

                // ---- Amenities: 3-6 random amenities per housing ----
                var allHousingAmenities = new List<HousingAmenity>();
                foreach (var housing in housings)
                {
                    var pickCount = Rng.Next(3, 7);
                    var picked = allAmenities.OrderBy(_ => Rng.Next()).Take(pickCount);
                    foreach (var amenity in picked)
                    {
                        allHousingAmenities.Add(new HousingAmenity { HousingId = housing.HousingId, AmenityId = amenity.AmenityId });
                    }
                }
                await context.HousingAmenities.AddRangeAsync(allHousingAmenities, cancellationToken);

                // ---- University links: nearest university (+ a second nearby one sometimes) ----
                var allUniversityHousings = new List<UniversityHousing>();
                foreach (var housing in housings)
                {
                    var nearest = NearestUniversity(housing.Latitude, housing.Longitude);
                    if (nearest != null)
                    {
                        allUniversityHousings.Add(new UniversityHousing { UniversityId = nearest.UniversityId, HousingId = housing.HousingId });

                        var second = universities
                            .Where(u => u.UniversityId != nearest.UniversityId)
                            .OrderBy(u => Math.Pow(u.Latitude - housing.Latitude, 2) + Math.Pow(u.Longitude - housing.Longitude, 2))
                            .FirstOrDefault();
                        if (second != null && Rng.NextDouble() < 0.4)
                        {
                            allUniversityHousings.Add(new UniversityHousing { UniversityId = second.UniversityId, HousingId = housing.HousingId });
                        }
                    }
                }
                await context.UniversityHousings.AddRangeAsync(allUniversityHousings, cancellationToken);

                // ---- Housing-level reviews: 2-5 per housing from random students ----
                var reviewComments = new[]
                {
                    "Great location and very responsive owner.",
                    "Clean, comfortable, and close to campus.",
                    "Good value for the price, would recommend.",
                    "WiFi could be faster but overall a solid stay.",
                    "Exactly as described, no surprises.",
                    "A bit noisy at night but otherwise great.",
                    "Loved the furniture and the balcony view.",
                    "Owner was helpful throughout the whole stay.",
                    "Perfect for students, walking distance to everything.",
                    "Would book again next semester.",
                };

                var allHousingReviews = new List<HousingReview>();
                foreach (var housing in housings)
                {
                    var reviewerCount = Rng.Next(2, 6);
                    var reviewers = students.OrderBy(_ => Rng.Next()).Take(reviewerCount);
                    foreach (var reviewer in reviewers)
                    {
                        allHousingReviews.Add(new HousingReview
                        {
                            HousingId = housing.HousingId,
                            UserId = reviewer.Id,
                            Rating = Rng.Next(3, 6),
                            Comment = reviewComments[Rng.Next(reviewComments.Length)],
                            CreatedAt = DateTime.UtcNow.AddDays(-Rng.Next(1, 200)),
                        });
                    }
                }
                await context.HousingReviews.AddRangeAsync(allHousingReviews, cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
            }

            // ================================================================
            // Favorites
            // ================================================================
            if (!await context.Favorites.AnyAsync(cancellationToken))
            {
                var allHousingIds = await context.Housings.Select(h => h.HousingId).ToListAsync(cancellationToken);
                var favorites = new List<Favorite>();
                var seenPairs = new HashSet<(string, int)>();

                foreach (var student in students)
                {
                    var favCount = Rng.Next(2, 6);
                    var picks = allHousingIds.OrderBy(_ => Rng.Next()).Take(favCount);
                    foreach (var housingId in picks)
                    {
                        var key = (student.Id, housingId);
                        if (seenPairs.Add(key))
                        {
                            favorites.Add(new Favorite
                            {
                                UserId = student.Id,
                                HousingId = housingId,
                                CreatedAt = DateTime.UtcNow.AddDays(-Rng.Next(1, 90)),
                            });
                        }
                    }
                }

                await context.Favorites.AddRangeAsync(favorites, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }

            // ================================================================
            // Bookings (+ matching Payments, + Reviews for confirmed stays)
            // ================================================================
            if (!await context.Bookings.AnyAsync(cancellationToken))
            {
                var allRooms = await context.HousingRooms.ToListAsync(cancellationToken);
                var bookings = new List<Booking>();
                var bookingCount = Math.Min(30, students.Count * 3);

                for (int i = 0; i < bookingCount; i++)
                {
                    var student = students[Rng.Next(students.Count)];
                    var room = allRooms[Rng.Next(allRooms.Count)];

                    var checkIn = DateTime.UtcNow.AddDays(Rng.Next(-120, 60));
                    var nights = Rng.Next(30, 180); // student stays tend to be long
                    var checkOut = checkIn.AddDays(nights);

                    // Weighted status: more Confirmed than Pending than Cancelled.
                    var roll = Rng.NextDouble();
                    var status = roll < 0.55 ? BookingStatus.Confirmed
                               : roll < 0.85 ? BookingStatus.Pending
                               : BookingStatus.Cancelled;

                    bookings.Add(new Booking
                    {
                        UserId = student.Id,
                        HousingId = room.HousingId,
                        HousingRoomId = room.RoomId,
                        CheckInDate = checkIn,
                        CheckOutDate = checkOut,
                        BookingDate = checkIn.AddDays(-Rng.Next(1, 10)),
                        TotalAmount = Math.Round(room.Price * nights, 2),
                        bookingStatus = status,
                    });
                }

                await context.Bookings.AddRangeAsync(bookings, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                // ---- Payments: one per Confirmed booking (Succeeded), a few for Cancelled (Refunded/Failed) ----
                var payments = new List<Payment>();
                foreach (var booking in bookings)
                {
                    if (booking.bookingStatus == BookingStatus.Confirmed)
                    {
                        payments.Add(new Payment
                        {
                            BookingId = booking.BookingId,
                            Amount = booking.TotalAmount,
                            PaymentDate = booking.BookingDate.AddHours(2),
                            Method = Rng.NextDouble() < 0.8 ? PaymentMethod.Stripe : PaymentMethod.CashOnArrival,
                            Status = PaymentStatus.Succeeded,
                            TransactionId = $"SEED-TXN-{booking.BookingId}-{Rng.Next(100000, 999999)}",
                        });
                    }
                    else if (booking.bookingStatus == BookingStatus.Cancelled && Rng.NextDouble() < 0.4)
                    {
                        payments.Add(new Payment
                        {
                            BookingId = booking.BookingId,
                            Amount = booking.TotalAmount,
                            PaymentDate = booking.BookingDate.AddHours(2),
                            Method = PaymentMethod.Stripe,
                            Status = PaymentStatus.Refunded,
                            TransactionId = $"SEED-TXN-{booking.BookingId}-{Rng.Next(100000, 999999)}",
                        });
                    }
                }
                await context.Payments.AddRangeAsync(payments, cancellationToken);

                // ---- Booking-linked reviews: one per confirmed booking, for about half of them ----
                var bookingComments = new[]
                {
                    "Stay matched the listing perfectly, would book again.",
                    "Great experience overall, minor issues with hot water.",
                    "Owner was communicative and the room was spotless.",
                    "Good location but a little pricier than expected.",
                    "Comfortable stay, recommended for first-year students.",
                };

                var reviews = new List<Review>();
                foreach (var booking in bookings.Where(b => b.bookingStatus == BookingStatus.Confirmed))
                {
                    if (Rng.NextDouble() < 0.5)
                    {
                        reviews.Add(new Review
                        {
                            UserId = booking.UserId,
                            BookingId = booking.BookingId,
                            Rating = Rng.Next(3, 6),
                            Comment = bookingComments[Rng.Next(bookingComments.Length)],
                            ReviewDate = booking.CheckOutDate.AddDays(Rng.Next(1, 14)),
                        });
                    }
                }
                await context.Reviews.AddRangeAsync(reviews, cancellationToken);

                await context.SaveChangesAsync(cancellationToken);
            }

            // ================================================================
            // Notifications
            // ================================================================
            if (!await context.Notifications.AnyAsync(cancellationToken))
            {
                var notificationTemplates = new (string Title, string Message)[]
                {
                    ("Welcome to Sakan Talaba!", "Start browsing verified student housing near your university."),
                    ("Booking request received", "Your booking request has been created and is awaiting payment."),
                    ("Payment confirmed", "Your payment was received and your booking is now confirmed."),
                    ("New message from owner", "You have a new message regarding your housing inquiry."),
                    ("Price drop alert", "A housing option in your favorites just dropped in price."),
                    ("Reminder: complete your profile", "Add your details to get more personalized housing matches."),
                };

                var notifications = new List<Notification>();
                foreach (var student in students)
                {
                    var count = Rng.Next(2, 4);
                    for (int i = 0; i < count; i++)
                    {
                        var template = notificationTemplates[Rng.Next(notificationTemplates.Length)];
                        notifications.Add(new Notification
                        {
                            UserId = student.Id,
                            Title = template.Title,
                            Message = template.Message,
                            IsRead = Rng.NextDouble() < 0.5,
                            CreatedAt = DateTime.UtcNow.AddDays(-Rng.Next(0, 60)),
                        });
                    }
                }
                await context.Notifications.AddRangeAsync(notifications, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }

            // ================================================================
            // Conversations + Messages
            // ================================================================
            if (!await context.Conversations.AnyAsync(cancellationToken))
            {
                var openingLines = new[]
                {
                    "Hi, is this housing still available for next semester?",
                    "Hello, can you tell me more about the utilities included?",
                    "Is the deposit refundable if I cancel early?",
                    "Would you be open to a shorter 3-month stay?",
                };
                var replyLines = new[]
                {
                    "Yes, it's still available — happy to answer any questions.",
                    "Utilities are included except electricity, billed monthly.",
                    "Yes, the deposit is refundable with 2 weeks' notice.",
                    "We can discuss a shorter stay, let's set up a call.",
                };
                var followUps = new[]
                {
                    "Great, thank you! I'll confirm by this weekend.",
                    "Sounds good, appreciate the quick reply.",
                    "Perfect, I'll go ahead and submit a booking request.",
                    "Thanks for the info, I'll get back to you soon.",
                };

                var conversations = new List<Conversation>();
                var conversationCount = Math.Min(10, students.Count);

                for (int i = 0; i < conversationCount; i++)
                {
                    var student = students[i % students.Count];
                    var owner = owners[i % owners.Count];

                    conversations.Add(new Conversation
                    {
                        Title = $"{student.FirstName} & {owner.FirstName}",
                        CreatedAt = DateTime.UtcNow.AddDays(-Rng.Next(1, 45)),
                    });
                }
                await context.Conversations.AddRangeAsync(conversations, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);

                var messages = new List<Message>();
                for (int i = 0; i < conversations.Count; i++)
                {
                    var conversation = conversations[i];
                    var student = students[i % students.Count];
                    var owner = owners[i % owners.Count];
                    var baseTime = conversation.CreatedAt;

                    messages.Add(new Message { ConversationId = conversation.ConversationId, SenderId = student.Id, Content = openingLines[Rng.Next(openingLines.Length)], SentAt = baseTime });
                    messages.Add(new Message { ConversationId = conversation.ConversationId, SenderId = owner.Id, Content = replyLines[Rng.Next(replyLines.Length)], SentAt = baseTime.AddHours(3) });
                    messages.Add(new Message { ConversationId = conversation.ConversationId, SenderId = student.Id, Content = followUps[Rng.Next(followUps.Length)], SentAt = baseTime.AddHours(5) });
                }
                await context.Messages.AddRangeAsync(messages, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
