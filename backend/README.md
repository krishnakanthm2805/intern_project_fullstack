# 🚀 College Discovery Platform - Backend REST API

[![Node.js](https://img.shields.io/badge/Node.js-Express_4.17-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.7-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

The backend REST API for the College Discovery Platform built with **Node.js, Express, and PostgreSQL** featuring connection pooling, resilient in-memory fallback, full-text search, and relational schema migrations.

---

## 🌟 Key Backend Capabilities

- **College Discovery Engine**:
  - `GET /api/colleges`: Multi-parameter search, multi-faceted filtering (State, City, Degree, Fee bounds, Rating), sorting (NIRF rank, fees, rating, package), and pagination.
  - `GET /api/colleges/:identifier`: Fetch single college by numeric ID or URL-friendly slug with related courses, placements, reviews, and cutoffs.
  - `GET /api/colleges/compare?ids=1,2,3`: Compare 2 to 3 institutions simultaneously.
- **Admission Predictor**:
  - `POST /api/predictor`: Calculates admission probability for competitive entrance exams (**JEE Main, JEE Advanced, NEET, CAT, BITSAT**) based on student rank and category (*General, OBC, SC, ST, EWS*).
- **Reviews & Newsletters**:
  - `POST /api/colleges/:id/reviews`: Add student and alumni ratings and reviews.
  - `POST /api/newsletter`: Subscribe for exam cutoff alerts and counseling guides.
- **User Management (CRUD)**:
  - Backward-compatible endpoints (`/users`) for user creation, updating, retrieval, and deletion.
- **Resilient Hybrid Data Layer**:
  - Automatically queries PostgreSQL using `pg.Pool` when available.
  - If PostgreSQL server is unavailable or offline, gracefully falls back to an extensive in-memory dataset without throwing 500 errors.
- **Database Telemetry**:
  - `GET /api/status`: Real-time health metrics, active connection status, latency, and table counts.
  - `POST /api/db/reconnect`: On-demand connection retry trigger.

---

## 📁 Backend Directory Structure

```
backend/
├── controllers/
│   └── collegeController.js    # College discovery, comparison, predictor, and review logic
├── scripts/
│   └── test-db.js              # Standalone DB connection diagnostic tool
├── database.js                 # PostgreSQL connection pool and in-memory fallback manager
├── index.js                    # Express app configuration and route definitions
├── users.js                    # Legacy user CRUD handlers
├── schema.sql                  # PostgreSQL table creation & index definitions
├── package.json                # NPM configuration & dependencies
├── .env.example                # Environment variable configuration template
└── .env                        # Local environment variables
```

---

## ⚡ Setup & Installation

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your PostgreSQL details:
```env
PORT=5050

# Local PostgreSQL Configuration
PGUSER=postgres
PGHOST=localhost
PGDATABASE=api
PGPASSWORD=your_password
PGPORT=5432
PGSSL=false

# OR Cloud PostgreSQL URI (Neon / Supabase / Railway)
# DATABASE_URL=postgresql://user:password@host:5432/api?sslmode=require
```

### 3. Setup Database Schema (Optional)
If running a local PostgreSQL instance:
```bash
# Create database
createdb -U postgres api

# Apply schema
psql -U postgres -d api -f schema.sql
```

### 4. Test Database Connection
Run the diagnostic script:
```bash
npm run db:test
```

### 5. Start Backend Server
```bash
# Development mode with nodemon hot-reloading
npm run dev

# Production mode
npm start
```
The server will start listening on `http://localhost:5050`.

---

## 📡 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API catalog & documentation summary |
| `GET` | `/api/status` | System health and database telemetry |
| `POST` | `/api/db/reconnect` | On-demand database reconnection test |
| `GET` | `/api/meta/filters` | Distinct filter options (cities, states, exams, degrees) |
| `GET` | `/api/colleges` | Search, filter, sort, and paginate colleges |
| `GET` | `/api/colleges/:identifier` | Get college by numeric ID or string slug |
| `GET` | `/api/colleges/compare?ids=1,2,3` | Side-by-side college comparison matrix |
| `POST` | `/api/predictor` | Predict college admission based on rank and exam |
| `POST` | `/api/colleges/:id/reviews` | Submit a college review |
| `POST` | `/api/newsletter` | Subscribe to cutoff alerts and newsletter |
| `GET` | `/users` | Get all users |
| `GET` | `/users/:id` | Get user by ID |
| `POST` | `/users` | Create user |
| `PUT` / `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user |
