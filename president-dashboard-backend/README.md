# President Dashboard Backend (Spring Boot)

This module is a standalone Spring Boot + PostgreSQL backend for president-specific dashboard operations.
It was created in a separate folder to avoid impacting the existing Node backend.

## Features

- JWT authentication for presidents
- Role-based authorization with Spring Security
- Faculty/club scoped data isolation
- CRUD APIs for events, vendors, sponsorships
- Dashboard summary API
- Current president profile API
- Public faculty and club lookup APIs for registration forms
- Bootstrap seeding for initial faculties and clubs
- Structured JSON error responses for auth, validation, and domain errors
- Clean layered architecture:
  - controller
  - service
  - repository
  - dto
  - entity
  - exception

## Tech Stack

- Java 17
- Spring Boot 3.3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven

## Run

1. Set environment variables (PowerShell example):

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/itpm"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="rootcd"
$env:JWT_SECRET="this-is-a-very-strong-secret-key-with-at-least-32-chars"
$env:SERVER_PORT="8081"
```

2. Start backend:

```powershell
cd president-dashboard-backend
mvn spring-boot:run
```

## Auth Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

After login, send JWT in header:

- `Authorization: Bearer <token>`

## Organization Endpoints

- `GET /api/v1/organizations/faculties`
- `GET /api/v1/organizations/clubs`

These are public endpoints intended for registration form dropdowns.

## Core Endpoints

- `GET/POST/PUT/DELETE /api/v1/events`
- `GET/POST/PUT/DELETE /api/v1/vendors`
- `GET/POST/PUT/DELETE /api/v1/sponsorships`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/presidents/me`

## Auth Response

`POST /api/v1/auth/login` and `POST /api/v1/auth/register` return:

```json
{
  "token": "jwt-token",
  "email": "faculty@president.com",
  "role": "ROLE_PRESIDENT",
  "organizationType": "FACULTY",
  "organizationId": 1,
  "organizationName": "Faculty of Computing"
}
```

## Seeded Reference Data

If the database is empty on startup, the app seeds:

- Faculties: `FOC`, `FOE`, `FOB`
- Clubs: `IEEE`, `RAC`, `MDC`

## Data Isolation Rules

- If president belongs to a faculty, all APIs are restricted to that faculty's data.
- If president belongs to a club, all APIs are restricted to that club's data.
- Cross-organization access returns not found/forbidden errors.

## Notes

- `app.jwt.secret` must be at least 32 characters long or the app will fail fast on startup.
- `spring.jpa.open-in-view` is disabled to keep persistence boundaries explicit in the service layer.
- Maven is required to run the project. If your environment does not have `mvn`, add Maven or commit a Maven wrapper (`mvnw`, `mvnw.cmd`) to the repo.
