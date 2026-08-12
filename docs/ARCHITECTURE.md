# System Architecture

```mermaid
flowchart TD
    Client[Student / Admin / Frontend] --> API[ASP.NET Core 8 Web API]

    API --> Controllers[Controllers]
    Controllers --> Services[Application Services]
    Controllers --> Repositories[Repository Pattern]

    Services --> Recommendation[Recommendation Service]
    Services --> Distance[Distance Calculator]
    Services --> Token[JWT Token Service]
    Services --> Cloudinary[Cloudinary Service]

    Repositories --> EF[Entity Framework Core]
    EF --> SQL[(SQL Server)]

    API --> Identity[ASP.NET Core Identity]
    Identity --> SQL

    API --> SignalR[SignalR Chat Hub]
    SignalR --> Conversations[(Conversations / Messages)]

    Cloudinary --> CDN[Cloudinary CDN]
```

## Layers

### Controllers
Expose REST endpoints and handle HTTP requests/responses.

### DTOs
Define API input/output contracts without exposing the persistence model directly.

### Services
Contain business logic such as:

- Distance calculation
- Housing recommendations
- JWT token creation
- Cloudinary image operations

### Repository Pattern
Encapsulates database access behind interfaces and keeps controllers independent from EF Core queries.

### Entity Framework Core
Maps domain models to SQL Server and handles migrations and persistence.

### External Services

- **Cloudinary:** housing image storage
- **SignalR:** real-time messaging
- **JWT:** stateless API authentication
