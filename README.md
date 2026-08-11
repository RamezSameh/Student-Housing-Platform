# 🏠 Sakan Talaba — Student Housing Platform

> A .NET 8 Web API that helps university students discover, compare, and book suitable housing near their universities.

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-Web%20API-512BD4?logo=dotnet&logoColor=white)](https://learn.microsoft.com/aspnet/core/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-Database-CC2927?logo=microsoftsqlserver&logoColor=white)](https://www.microsoft.com/sql-server)
[![Entity Framework Core](https://img.shields.io/badge/EF%20Core-8.0-512BD4)](https://learn.microsoft.com/ef/core/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Images-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

## 📌 Overview

**Sakan Talaba** is a student-housing backend platform built with **ASP.NET Core 8 Web API**.

The system is designed to make it easier for students to find housing close to their universities while considering factors such as:

- 📍 Distance from university
- 💰 Budget
- 🛏️ Room type
- 🚻 Gender preference
- 🛜 Amenities
- ⭐ Housing ratings
- ✅ Housing availability and verification

The API also supports housing comparison, personalized recommendations, favorites, bookings, reviews, notifications, and real-time conversations.

---

## 🚀 Key Features

### 👨‍🎓 Student / User Features

- 🔐 Registration and login
- 🎟️ JWT authentication
- 👤 Role-based authorization
- 🏠 Browse available housing
- 🔎 Search and filter housing
- 📍 Find housing near a university
- ⚖️ Compare multiple housing options
- 🤖 Recommended housing based on user preferences
- ❤️ Add/remove housing favorites
- 📅 Create and manage bookings
- 💳 Payment confirmation support
- ⭐ Submit and view housing/room reviews
- 🔔 Notifications
- 💬 Conversations and messaging
- 🏫 Browse universities

### 👨‍💼 Admin Features

- Manage housing types
- Create, update, and delete housing
- Manage users and roles
- Promote users to Admin
- Demote Admin users
- View users and roles
- View bookings
- Upload housing images
- Upload multiple images
- Delete housing images
- Cloudinary image management

### 📍 Location & Recommendation Engine

The platform includes location-aware housing discovery.

It supports:

- University-based nearby search
- Radius-based filtering
- Distance calculation using latitude/longitude
- Housing comparison
- Recommendation scoring
- Budget matching
- Distance matching
- Amenities matching
- Rating matching
- Room-type matching

The recommendation engine combines these factors into a **match score** to rank suitable housing options.

---

## 🛠️ Tech Stack

### Backend

- C#
- .NET 8
- ASP.NET Core Web API
- ASP.NET Core Identity
- JWT Bearer Authentication
- Entity Framework Core 8
- LINQ
- FluentValidation
- RESTful API

### Database & Spatial Data

- Microsoft SQL Server
- Entity Framework Core Code First
- EF Core Migrations
- NetTopologySuite
- Spatial/location support

### Architecture & Patterns

- Repository Pattern
- Dependency Injection
- DTO Pattern
- Service Layer
- Options Pattern
- Separation of Concerns
- Async/Await
- SOLID-oriented architecture

### External Services & Tools

- Cloudinary
- Swagger / OpenAPI
- SignalR
- Docker
- GitHub Actions
- Postman
- Visual Studio

---

## 🏗️ Project Architecture

```text
Student Housing Platform
│
├── Controllers
│   ├── AccountsController
│   ├── AdminController
│   ├── BookingsController
│   ├── ConversationsController
│   ├── FavoritesController
│   ├── HousingReviewsController
│   ├── HousingsController
│   ├── NotificationsController
│   ├── ReviewsController
│   └── UniversitiesController
│
├── Data
│   ├── SHP_DbContext
│   ├── SeedData
│   └── SampleSeed
│
├── Models
│   ├── ApplicationUser
│   ├── Housing
│   ├── HousingRoom
│   ├── HousingType
│   ├── HousingImage
│   ├── Amenity
│   ├── HousingAmenity
│   ├── University
│   ├── Booking
│   ├── Payment
│   ├── Review
│   ├── HousingReview
│   ├── Favorite
│   ├── Notification
│   ├── Conversation
│   └── Message
│
├── DTOs
│   ├── AccountDtos
│   ├── BookingDtos
│   ├── HousingDtos
│   ├── Common
│   └── ...
│
├── RepositoryPattern
│   ├── Interfaces
│   └── Repositories
│
├── Services
│   ├── Admin
│   ├── CloudinaryService
│   ├── Distance
│   ├── Recommendation
│   └── TokenService
│
├── Validators
├── Middleware
├── Hubs
├── Extensions
├── OptionsPattern
└── Tests
```

---

## 🔐 Authentication & Authorization

Authentication is implemented using **ASP.NET Core Identity + JWT**.

The application supports roles including:

```text
Admin
Student
Owner
Customer
```

Protected endpoints use role-based authorization, for example:

```csharp
[Authorize(Roles = "Admin")]
```

JWT claims are configured for:

- User identity
- User name
- User role

A default Admin role/user can also be seeded through application settings.

---

## 📚 Main API Endpoints

### 🔑 Accounts

```http
POST /api/Accounts/register
POST /api/Accounts/login
```

### 🏠 Housing

```http
GET    /api/Housings
GET    /api/Housings/{id}
POST   /api/Housings
PUT    /api/Housings/{id}
DELETE /api/Housings/{id}
```

### 🔎 Housing Discovery

```http
GET /api/Housings/search
GET /api/Housings/nearby
GET /api/Housings/compare
GET /api/Housings/recommended
```

Example pagination:

```http
GET /api/Housings?page=1&pageSize=20
```

Nearby search supports a university and radius:

```http
GET /api/Housings/nearby?universityId=1&radius=2&page=1&pageSize=20
```

### 🖼️ Housing Images

```http
POST   /api/Housings/{id}/images
DELETE /api/Housings/images/{imageId}
```

Admin bulk image management:

```http
POST   /api/Admin/rooms/{roomId}/images
POST   /api/Admin/rooms/{roomId}/images/bulk
DELETE /api/Admin/rooms/{roomId}/images/{imageId}
```

### 📅 Bookings

```http
POST /api/Bookings/housing
POST /api/Bookings
GET  /api/Bookings/my-bookings
GET  /api/Bookings/{id}
POST /api/Bookings/confirm-payment
```

### ❤️ Favorites

```http
GET    /api/Favorites
POST   /api/Favorites/{housingId}
DELETE /api/Favorites/{housingId}
```

### ⭐ Housing Reviews

```http
GET  /api/housings/{housingId}/reviews
POST /api/housings/{housingId}/reviews
```

### 💬 Conversations

```http
POST /api/Conversations
GET  /api/Conversations
GET  /api/Conversations/{id}/messages
```

### 🔔 Notifications

```http
GET /api/Notifications
PUT /api/Notifications/{id}/read
```

### 🏫 Universities

```http
GET    /api/Universities
GET    /api/Universities/{id}
POST   /api/Universities
PUT    /api/Universities/{id}
DELETE /api/Universities/{id}
```

---

## 🧠 Recommendation System

The recommendation service ranks available housing using multiple signals.

Current scoring factors include:

| Factor | Weight |
|---|---:|
| 💰 Price | 30% |
| 📍 Distance | 30% |
| 🛜 Amenities | 20% |
| ⭐ Rating | 10% |
| 🛏️ Room Type | 10% |

The resulting score is returned as a **Match Score** from 0–100.

Example:

```text
Budget       → 30%
Distance     → 30%
Amenities    → 20%
Rating       → 10%
Room Type    → 10%
                    ─────
                     100%
```

---

## 📍 Distance Calculation

The project contains a dedicated `DistanceCalculator` service using latitude and longitude to calculate distance in kilometers.

This supports features such as:

- Nearby housing
- Distance filtering
- Recommendation scoring
- University-based housing discovery

SQL Server is configured with **NetTopologySuite** for spatial data support.

---

## 🗄️ Main Database Relationships

```text
ApplicationUser
│
├── Bookings
├── Reviews
├── Favorites
├── HousingReviews
├── Notifications
└── Messages
        │
        ▼
   Conversation

University
   │
   └── Location
       (Latitude / Longitude)

Housing
│
├── Owner → ApplicationUser
├── HousingType
├── HousingRooms
├── HousingImages
├── HousingAmenities
├── HousingReviews
└── Bookings

HousingRoom
   │
   └── Housing

Amenity
   │
   └── HousingAmenities

Booking
│
├── User
├── Housing
├── HousingRoom
├── Payment
└── Review
```

---

## ☁️ Cloudinary Image Storage

Housing images are uploaded to **Cloudinary** rather than being stored directly on the server.

Supported formats:

```text
.jpg
.jpeg
.png
```

Maximum image size:

```text
5 MB
```

Each image can store:

- Image URL
- Cloudinary Public ID
- Primary image flag
- Creation date

---

## 💬 Real-Time Messaging

The project includes **SignalR** for real-time chat.

Hub endpoint:

```text
/hubs/chat
```

Messages are also persisted through the `MessageRepository`.

---

## 🧪 Testing

The repository contains automated tests for important application services.

Current test areas include:

```text
Tests/
├── DistanceTests.cs
└── RecommendationServiceTests.cs
```

Run tests with:

```bash
dotnet test Tests/StudentHousingPlatform.Tests.csproj
```

---

## 🔄 CI Pipeline

GitHub Actions is configured to run on pushes and pull requests to `master`.

The pipeline performs:

```text
Checkout
   ↓
Setup .NET 8
   ↓
Restore
   ↓
Build
   ↓
Run Tests
```

Workflow:

```text
Student Housing Platform/.github/workflows/ci.yml
```

---

## 🐳 Docker

The project includes a multi-stage Dockerfile based on .NET 8.

Build:

```bash
docker build -t sakan-talaba .
```

Run:

```bash
docker run -p 8080:80 sakan-talaba
```

> Database and external service configuration should be supplied through environment variables or deployment configuration.

---

## ⚙️ Getting Started

### Prerequisites

Make sure you have:

- .NET 8 SDK
- SQL Server
- Git
- Visual Studio / VS Code
- Cloudinary account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/RamezSameh/Sakan-Talaba.git
cd Sakan-Talaba
```

### 2. Configure the Database

Update the connection string in:

```text
Student Housing Platform/appsettings.json
```

Example:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.;Database=StudentHousingDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### 3. Configure Cloudinary

```json
{
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

### 4. Configure JWT

Configure the JWT settings required by the application:

```json
{
  "JWTSettings": {
    "Secret": "YOUR_SECRET",
    "ValidIssuer": "YOUR_ISSUER",
    "ValidAudience": "YOUR_AUDIENCE"
  }
}
```

### 5. Configure Admin

The application supports seeded Admin credentials through the Admin settings section.

**Do not commit real passwords, JWT secrets, API keys, or Cloudinary credentials to GitHub.**

### 6. Apply Migrations

```bash
dotnet ef database update
```

### 7. Run the API

```bash
dotnet run
```

The application exposes a root endpoint:

```text
GET /
```

which returns:

```text
API is running...
```

---

## 📖 Swagger / OpenAPI

When running in the Development environment, Swagger is enabled.

Open:

```text
/swagger
```

Swagger can be used to test:

- Authentication
- Housing discovery
- Recommendations
- Bookings
- Favorites
- Reviews
- Admin operations
- Universities
- Notifications
- Conversations

For protected endpoints, authenticate using the JWT Bearer token.

---

## 🔒 Security Notes

Before deploying the project:

- Move secrets out of `appsettings.json`.
- Use environment variables or a secret manager.
- Never commit production database credentials.
- Never commit Cloudinary API secrets.
- Use a strong JWT signing secret.
- Enable HTTPS in production.
- Configure CORS for the production frontend domain.
- Review default Admin credentials before deployment.

---

## 🗺️ Roadmap

Potential future improvements:

- [ ] Full student-facing frontend
- [ ] Advanced map integration
- [ ] Interactive housing map
- [ ] More advanced recommendation algorithms
- [ ] Real payment gateway integration
- [ ] Email/SMS notifications
- [ ] Owner dashboard
- [ ] Advanced admin analytics
- [ ] Housing availability calendar
- [ ] More comprehensive automated tests
- [ ] Production deployment / cloud hosting

---

## 👨‍💻 Author

**Ramez Sameh**

Full Stack .NET Developer

Focused on:

- C#
- ASP.NET Core
- Web API
- Entity Framework Core
- SQL Server
- React / Angular
- REST APIs
- Clean and maintainable backend architecture

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project is intended for educational, portfolio, and demonstration purposes.
