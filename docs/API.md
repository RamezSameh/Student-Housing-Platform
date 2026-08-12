# API Overview

The API is organized around the following main resources.

| Resource | Purpose |
|---|---|
| Accounts | Registration, login, JWT authentication |
| Housings | Housing CRUD, search, nearby, comparison, recommendations |
| Bookings | Housing/room booking lifecycle |
| Favorites | Save and remove favorite housing |
| Reviews | Reviews and ratings |
| Housing Reviews | Housing-specific reviews |
| Universities | University management and discovery |
| Notifications | User notifications |
| Conversations | Conversation management |
| Messages | Real-time/persisted messaging |
| Admin | Administrative management |

## Authentication

Use the JWT returned from login:

```http
Authorization: Bearer <token>
```

Admin endpoints require:

```text
Role = Admin
```

## Example

```http
GET /api/Housings?page=1&pageSize=20
```

```http
GET /api/Housings/nearby?universityId=1&radius=2&page=1&pageSize=20
```
