# Promco 2.0 – Backend (ASP.NET Core 7 Web API)

```bash
dotnet run        # http://localhost:5000, Swagger at /swagger
```

- **Storage**: `Storage:Provider` = `Json` (default, file `App_Data/promco-data.json`) or `SqlServer`
  (uses `ConnectionStrings:DefaultConnection`; database and `dbo.Documents` table are created automatically).
- **Auth**: `POST /api/auth/login` returns a JWT; send it as `Authorization: Bearer <token>`.
- **Seeding**: `Seed:DemoAccounts` (Development: on) creates the accounts listed in the root README;
  `Seed:SampleData` (off by default) adds a little sample master data.

## Endpoints

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/login`, `GET /api/auth/me` |
| Users | `GET/POST /api/users`, `GET/PUT/DELETE /api/users/{id}`, `GET /api/users/lookup` |
| Machines | `GET/POST /api/machines`, `GET/PUT/DELETE /api/machines/{id}` |
| Faults | `GET /api/faults`, `GET/POST /api/machines/{id}/faults`, `PUT /api/faults/{id}/status`, `DELETE /api/faults/{id}` |
| Maintenance | `GET /api/maintenance`, `GET/POST /api/machines/{id}/maintenance`, `PUT/DELETE /api/maintenance/{id}` |
| Master data | `GET /api/masterdata`, `GET/POST /api/masterdata/{table}`, `PUT/DELETE /api/masterdata/{table}/{id}` |
| Parameter readings | `GET/POST /api/parameters/{id}/values` |
| Notifications | `GET /api/notifications`, `POST /api/notifications/{id}/read`, `POST /api/notifications/read-all` |
| Messages | `GET/POST /api/messages`, `PUT /api/messages/{id}/resolve` |
| Activity | `GET /api/activity?date=YYYY-MM-DD&tzOffset=-330` |
| Reports | `GET /api/reports/daily?date=YYYY-MM-DD&tzOffset=-330` |

`tzOffset` is the browser's `Date.getTimezoneOffset()` so "a day" means the user's local day.
Role rules are enforced on every endpoint (see the `[Authorize(Roles = ...)]` attributes).
