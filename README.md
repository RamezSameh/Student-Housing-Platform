# 🏠 Sakan Talaba – Student Housing Platform

A full-stack student housing platform that helps university students find suitable and affordable accommodation near their universities.

The platform allows students to search for available housing, explore room details and images, and manage their bookings. Administrators can manage housing, room types, users, bookings, and room images.

---

## 📌 Project Overview

**Sakan Talaba** is designed to solve a common problem for university students: finding safe, affordable, and conveniently located accommodation near their university.

The platform provides a centralized system where students can:

* 🔍 Search for available housing.
* 📍 Find housing near universities.
* 🏠 View housing and room details.
* 🖼️ View room images.
* 📅 Make and manage bookings.
* 👤 Manage their accounts.
* ⭐ Explore different room types and housing options.

Administrators can manage the entire platform through an admin dashboard.

---

## 🚀 Features

### 👨‍🎓 Student Features

* User Registration & Login
* JWT Authentication
* Role-based Authorization
* Browse available housing
* Search and filter housing
* Find housing near universities
* View room details
* View room images
* Room type information
* Booking management
* View booking history

### 👨‍💼 Admin Features

* Admin authentication
* Manage users
* Promote users to Admin
* Demote Admin users
* Manage housing
* Add / Update / Delete housing
* Manage room types
* Add / Update / Delete room types
* Upload room images
* Upload multiple room images
* Delete room images
* Set main room images
* Manage bookings

### ☁️ Image Management

Room images are uploaded and stored using **Cloudinary**.

The system supports:

* JPG
* JPEG
* PNG
* Maximum file size: 5 MB
* Multiple image uploads
* Main image selection
* Cloudinary image deletion

---

## 🛠️ Technologies

### Backend

* C#
* ASP.NET Core Web API
* Entity Framework Core
* LINQ
* ASP.NET Core Identity
* JWT Authentication
* RESTful APIs

### Database

* Microsoft SQL Server
* Entity Framework Core
* Code First
* Migrations

### Architecture & Design

* Repository Pattern
* Dependency Injection
* DTOs
* Service Layer
* SOLID Principles
* Separation of Concerns
* Async/Await

### Cloud & Tools

* Cloudinary
* Swagger / OpenAPI
* Postman
* Git
* GitHub
* Visual Studio

---

## 🏗️ Architecture

The backend follows a layered architecture:

```text
Student Housing Platform
│
├── Controllers
│   ├── AdminController
│   ├── HousingController
│   ├── BookingController
│   └── AuthController
│
├── DTOs
│   ├── HousingDtos
│   ├── RoomTypeDtos
│   ├── BookingDtos
│   └── UserDtos
│
├── Models
│   ├── Housing
│   ├── Room
│   ├── RoomImage
│   ├── RoomType
│   ├── Booking
│   └── ApplicationUser
│
├── RepositoryPattern
│   ├── Interfaces
│   └── Repositories
│
├── Services
│   ├── CloudinaryService
│   └── Authentication Services
│
├── Data
│   └── ApplicationDbContext
│
└── Migrations
```

---

## 🔐 Authentication & Authorization

The application uses **ASP.NET Core Identity** and **JWT Bearer Authentication**.

Users can have different roles, such as:

```text
Student
Admin
```

Protected endpoints use role-based authorization:

```csharp
[Authorize(Roles = "Admin")]
```

The JWT token contains the required claims and roles to control access to protected resources.

---

## 🏠 Housing Management

Administrators can manage housing through REST APIs.

### Create Housing

```http
POST /api/Admin/housing
```

### Update Housing

```http
PUT /api/Admin/housing/{id}
```

### Delete Housing

```http
DELETE /api/Admin/housing/{id}
```

### Get All Housing

```http
GET /api/Housings
```

Pagination is supported:

```http
GET /api/Housings?page=1&pageSize=20
```

---

## 🖼️ Room Images

Room images are stored using Cloudinary.

### Upload Image

```http
POST /api/Admin/rooms/{roomId}/images
```

### Upload Multiple Images

```http
POST /api/Admin/rooms/{roomId}/images/bulk
```

### Delete Image

```http
DELETE /api/Admin/rooms/{roomId}/images/{imageId}
```

---

## 📍 Nearby Housing

The platform supports finding housing based on proximity to universities.

Example:

```http
GET /api/Housings/nearby
```

The nearby search can be extended to support:

* University location
* Latitude / Longitude
* Search radius
* Distance sorting
* Available housing only

---

## 📅 Booking System

Students can book available accommodation through the platform.

The booking system is designed to prevent invalid bookings and maintain booking status.

Example statuses:

```text
Pending
Confirmed
Cancelled
Completed
```

---

## 🗄️ Database

The application uses SQL Server with Entity Framework Core.

Main entities include:

```text
ApplicationUser
      │
      ├── Bookings
      │
      └── Roles

Housing
   │
   ├── RoomType
   │
   └── RoomImages

Room
   │
   ├── RoomType
   └── RoomImages

Booking
   │
   ├── User
   └── Housing
```

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RamezSameh/Sakan-Talaba.git
```

```bash
cd Sakan-Talaba
```

### 2. Configure Database

Update your connection string in:

```text
appsettings.json
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

Add your Cloudinary credentials:

```json
{
  "Cloudinary": {
    "CloudName": "YOUR_CLOUD_NAME",
    "ApiKey": "YOUR_API_KEY",
    "ApiSecret": "YOUR_API_SECRET"
  }
}
```

> Do not commit real Cloudinary credentials to GitHub.

### 4. Apply Migrations

```bash
dotnet ef database update
```

If migrations don't exist:

```bash
dotnet ef migrations add InitialCreate
```

Then:

```bash
dotnet ef database update
```

### 5. Run the Project

```bash
dotnet run
```

The API can then be tested through Swagger.

---

## 📚 API Documentation

Swagger / OpenAPI is included in the project.

After running the application, open:

```text
/swagger
```

Swagger can be used to:

* Test authentication
* Test housing endpoints
* Test booking endpoints
* Test admin endpoints
* Upload room images
* Test CRUD operations

---

## 🔑 Example API Flow

A typical student flow:

```text
Register
   ↓
Login
   ↓
Receive JWT Token
   ↓
Browse Housing
   ↓
Search Near University
   ↓
View Housing
   ↓
View Room Images
   ↓
Create Booking
   ↓
Manage Booking
```

Admin flow:

```text
Admin Login
   ↓
Manage Users
   ↓
Manage Room Types
   ↓
Manage Housing
   ↓
Upload Room Images
   ↓
Manage Bookings
```

---

## 🔮 Future Improvements

Planned improvements include:

* ⭐ Housing ratings and reviews
* ❤️ Favorite housing
* 🔔 Booking notifications
* 💬 Student / owner messaging
* 🗺️ Interactive maps
* 📍 Advanced location-based search
* 💰 Price range filtering
* 🏫 University-based filtering
* 📱 Responsive frontend
* 📊 Admin dashboard analytics
* 🔎 Advanced search and filtering
* 🧠 Smart housing recommendations
* 💳 Online payment integration

---

## 👨‍💻 Author

**Ramez Sameh**

Full Stack .NET Developer

* ASP.NET Core
* C#
* SQL Server
* Entity Framework Core
* React
* Angular

---

## ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

---

## 📄 License

This project is available for educational and portfolio purposes.

```
```
