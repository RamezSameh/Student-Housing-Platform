# Database Design

The project uses SQL Server with Entity Framework Core.

## ER Diagram

```mermaid
erDiagram
    APPLICATION_USER ||--o{ BOOKING : makes
    APPLICATION_USER ||--o{ FAVORITE : saves
    APPLICATION_USER ||--o{ HOUSING_REVIEW : writes
    APPLICATION_USER ||--o{ REVIEW : writes
    APPLICATION_USER ||--o{ NOTIFICATION : receives
    APPLICATION_USER ||--o{ HOUSING : owns
    APPLICATION_USER ||--o{ MESSAGE : sends

    HOUSING_TYPE ||--o{ HOUSING : categorizes
    HOUSING ||--o{ HOUSING_ROOM : contains
    HOUSING ||--o{ HOUSING_IMAGE : has
    HOUSING ||--o{ HOUSING_REVIEW : receives
    HOUSING ||--o{ HOUSING_AMENITY : provides
    HOUSING ||--o{ FAVORITE : saved_as
    HOUSING ||--o{ BOOKING : booked

    AMENITY ||--o{ HOUSING_AMENITY : assigned_to

    HOUSING_ROOM ||--o{ BOOKING : booked

    BOOKING ||--|| PAYMENT : has
    BOOKING ||--o| REVIEW : receives

    CONVERSATION ||--o{ MESSAGE : contains
    APPLICATION_USER ||--o{ MESSAGE : sends

    APPLICATION_USER {
        string Id PK
        string FirstName
        string LastName
        string Email
    }

    UNIVERSITY {
        int UniversityId PK
        string Name
        string Address
        string City
        double Latitude
        double Longitude
        bool IsActive
    }

    HOUSING {
        int HousingId PK
        string OwnerId FK
        int HousingTypeId FK
        string Title
        string Address
        string City
        double Latitude
        double Longitude
        decimal Price
        bool IsVerified
        bool IsAvailable
    }

    HOUSING_ROOM {
        int RoomId PK
        int HousingId FK
        string RoomType
        int Capacity
        int AvailableBeds
        decimal Price
        bool IsAvailable
    }

    HOUSING_IMAGE {
        int Id PK
        int HousingId FK
        string ImageUrl
        string PublicId
        bool IsPrimary
    }

    HOUSING_TYPE {
        int HousingTypeId PK
        string Name
        int Capacity
        decimal PricePerMonth
    }

    AMENITY {
        int AmenityId PK
        string Name
    }

    HOUSING_AMENITY {
        int Id PK
        int HousingId FK
        int AmenityId FK
    }

    BOOKING {
        int BookingId PK
        string UserId FK
        int HousingId FK
        int HousingRoomId FK
        datetime CheckInDate
        datetime CheckOutDate
        decimal TotalAmount
        string BookingStatus
    }

    PAYMENT {
        int PaymentId PK
        int BookingId FK
        decimal Amount
        string Method
        string Status
        string TransactionId
    }

    HOUSING_REVIEW {
        int HousingReviewId PK
        int HousingId FK
        string UserId FK
        int Rating
        string Comment
    }

    FAVORITE {
        string UserId FK
        int HousingId FK
        datetime CreatedAt
    }

    CONVERSATION {
        int ConversationId PK
        string Title
        datetime CreatedAt
    }

    MESSAGE {
        int MessageId PK
        int ConversationId FK
        string SenderId FK
        string Content
        datetime SentAt
    }

    NOTIFICATION {
        int Id PK
        string UserId FK
        string Title
        string Message
        bool IsRead
    }
```

## Important Design Notes

- `Housing` stores both latitude/longitude and a spatial `Point`.
- `HousingAmenity` implements the many-to-many relationship between housing and amenities.
- `HousingImage` stores the Cloudinary URL and public ID.
- `Booking` can reference a housing and optionally a specific room.
- `Payment` is linked one-to-one with a booking.
- `HousingReview` stores housing-level ratings and comments.
- `ApplicationUser` is based on ASP.NET Core Identity.
