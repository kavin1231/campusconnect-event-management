
## 📦 Project Structure

```text
campusconnect-event-management/
├── backend/            # Express API & Prisma Schema
│   ├── config/         # App configurations
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & Role guards
│   ├── models/         # Database abstractions
│   ├── prisma/         # Schema, Migrations & Seeds
│   └── routes/         # API Endpoints
└── frontend/           # React Application
    ├── public/         # Static assets
    └── src/            # Components, Views & Logic
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL Database
- npm or yarn

### 1. Database Setup (Backend)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/itpm"
   JWT_SECRET="your-secret-key"
   ```
4. Run migrations and seed the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Default Seed Accounts

After running the seed command, you can use these default credentials to test the RBAC system:

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@campusconnect.edu` | `Admin@123` |
| **Event Organizer** | `organizer@campusconnect.edu` | `Organizer@123` |

---

## 🛡️ API Authentication

The API uses JWT for authentication. Include the token in the `Authorization` header for protected routes:

`Authorization: Bearer <your_token>`


