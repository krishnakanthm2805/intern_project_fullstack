# 🎓 College Discovery & Review Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_4.17-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.7-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](LICENSE)

A modern, high-performance **Full-Stack College Discovery, Comparison & Review Platform** built with **React 19, Vite, Node.js, Express, and PostgreSQL**. The platform empowers students and parents to search, filter, compare, evaluate, and predict admissions for premier academic institutions across India with real-time analytics and verified student reviews.

---

## 🌟 Key Highlights & Features

### 🏛️ 1. Intelligent College Directory & Discovery
- **Faceted Multi-Filter Search**: Filter institutions by keyword search, state, city, degree program (B.Tech, M.Tech, MBA, MBBS, B.Des), annual fee range, and student rating threshold.
- **Dynamic Sorting**: Sort seamlessly by NIRF Ranking, Highest / Average CTC Package, Tuition Fees, or Student Ratings.
- **Deep-linking & URL State Sync**: Search filters and pagination state are automatically synced with URL query parameters (`?q=...&state=...&sort=...`) for shareable and bookmarkable results.

### ⚖️ 2. Side-by-Side Comparison Engine
- Compare up to **3 colleges simultaneously** across key institutional metrics.
- Multi-dimensional matrix comparing NIRF Ranking, Average & Highest Placement CTC, Annual Tuition, Campus Size, Accreditation, and Cutoff criteria.
- Quick interactive floating drawer with one-click clear, add, and inspect capabilities.

### 🎯 3. Admission Predictor Tool
- Predict admission probabilities into colleges and branches based on entrance exams (**JEE Main, JEE Advanced, NEET, CAT, BITSAT**), candidate rank/percentile, and category (**General, OBC, SC, ST, EWS**).
- Automated categorization into **Safe Bets**, **Target Matches**, and **Dream / Reach** colleges.

### 📖 4. Comprehensive College Profiles
- Deep modal & dedicated route (`/colleges/:slug`) views for every institution.
- Detailed tabs for **Overview & Highlights**, **Offered Degree Programs & Seats**, **Placement Analytics & Top Recruiters**, **Historical Exam Cutoffs**, and **Verified Student Reviews**.
- Interactive Review Submission module with real-time feedback.

### 🔌 5. Resilient Hybrid Data Architecture
- **PostgreSQL Connection Pooling**: Built with `pg.Pool` for robust database queries, parameterized SQL injections protection, and indexing on key search attributes.
- **Resilient Fallback Mode**: If PostgreSQL is offline or credentials are misconfigured, the backend smoothly operates on an in-memory seed dataset, ensuring zero downtime during local development or frontend testing.
- **In-App Health & Diagnostics**: Real-time telemetry modal showing database connection state, latency, active table records, and single-click reconnect testing.

### 👥 6. Legacy & User Management APIs
- Full RESTful CRUD capabilities (`GET`, `POST`, `PUT`/`PATCH`, `DELETE`) for user management with email validation and sanitized inputs.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([🌐 End User / Student]) -->|Interacts with UI| ReactApp[⚛️ React 19 + Vite Frontend\nhttp://localhost:5173]
    
    subgraph Frontend Layer
        ReactApp --> Directory[College Directory & Filters]
        ReactApp --> Comparison[Comparison Engine]
        ReactApp --> Predictor[Admission Predictor]
        ReactApp --> Diagnostics[Database Telemetry Modal]
    end

    ReactApp -->|REST API Requests / JSON| ExpressAPI[🚀 Express.js API Server\nhttp://localhost:5050]

    subgraph Backend Layer
        ExpressAPI --> Controller[College & User Controllers]
        Controller --> DataAccess[database.js Abstraction Layer]
        DataAccess -->|Active Connection| Postgres[(🐘 PostgreSQL Database\n'api' db / Cloud Neon)]
        DataAccess -.->|Fallback if Offline| MockEngine[📦 Resilient In-Memory Engine]
    end
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19.2, Vite 8.2, Lucide React Icons, Modern Vanilla CSS Design System |
| **Backend** | Node.js, Express.js 4.17, CORS, dotenv, Body-Parser |
| **Database** | PostgreSQL 14+, `pg` (node-postgres Connection Pool) |
| **Linting & Tooling** | Oxlint, Nodemon, Native ES Modules |

---

## 📁 Repository Structure

```
fullstack-react-node-postgreSQL/
├── backend/
│   ├── controllers/
│   │   └── collegeController.js    # Business logic for colleges, comparison, predictor, reviews
│   ├── scripts/
│   │   └── test-db.js              # PostgreSQL connection & table diagnostic CLI utility
│   ├── database.js                 # PostgreSQL connection pool & resilient fallback layer
│   ├── index.js                    # Express application entry point & API route mapping
│   ├── users.js                    # User management CRUD controller
│   ├── schema.sql                  # PostgreSQL database table schemas & indexes
│   ├── package.json                # Backend dependencies & npm scripts
│   ├── .env.example                # Environment variable template
│   └── .env                        # Local environment configuration
├── frontend/
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # React modular UI components
│   │   │   ├── Navbar.jsx          # Header, navigation, telemetry trigger, compare counter
│   │   │   ├── HeroSection.jsx     # Hero banner, 3D artwork, quick search bar
│   │   │   ├── CollegeDirectorySection.jsx # Search, filter bar, cards grid, pagination
│   │   │   ├── CollegeCard.jsx     # Individual college card with action badges
│   │   │   ├── CollegeDetailModal.jsx # Full-page modal with tabs (Overview, Courses, Placements, Reviews)
│   │   │   ├── CompareDrawer.jsx   # Floating comparison tray
│   │   │   ├── CompareView.jsx     # Full side-by-side comparison matrix
│   │   │   ├── PredictorTool.jsx   # Cutoff and college rank admission calculator
│   │   │   ├── DatabaseStatusModal.jsx # Real-time DB telemetry & diagnostics modal
│   │   │   ├── TipsNewsletterModal.jsx # Counseling guide & email capture modal
│   │   │   └── ...                 # Additional layout and feedback components
│   │   ├── data/
│   │   │   └── collegeData.js      # Seed institution dataset & mock records
│   │   ├── services/
│   │   │   └── api.js              # Axios/Fetch API client & client-side fallback engine
│   │   ├── App.jsx                 # Top-level state coordinator and routing handlers
│   │   ├── index.css               # Modern CSS variables, typography, animations, responsive design
│   │   └── main.jsx                # React root bootstrap
│   ├── index.html                  # HTML entry point
│   ├── package.json                # Frontend dependencies & npm scripts
│   ├── vite.config.js              # Vite configuration
│   └── README.md                   # Frontend-specific documentation
└── README.md                       # Main project documentation
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **PostgreSQL** *(Optional, platform runs with resilient fallback if offline)*: v13+ ([Download PostgreSQL](https://www.postgresql.org/download/)) or a free cloud instance (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com))

---

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/fullstack-react-node-postgreSQL.git
cd fullstack-react-node-postgreSQL
```

---

### 3. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory (or edit existing):
   ```env
   # Server Port
   PORT=5050

   # PostgreSQL Connection (Local option)
   PGUSER=postgres
   PGHOST=localhost
   PGDATABASE=api
   PGPASSWORD=your_postgres_password
   PGPORT=5432
   PGSSL=false

   # OR PostgreSQL Connection URI (Cloud option e.g. Neon, Supabase)
   # DATABASE_URL=postgresql://user:password@ep-sample-123.us-east-2.aws.neon.tech/api?sslmode=require
   ```

4. **Initialize the Database (If using PostgreSQL)**:
   - Create the database:
     ```sql
     CREATE DATABASE api;
     ```
   - Execute the schema file:
     ```bash
     psql -U postgres -d api -f schema.sql
     ```

5. **Test PostgreSQL Connectivity**:
   ```bash
   npm run db:test
   ```

6. **Start the Backend Server**:
   ```bash
   # Development mode with hot-reload
   npm run dev

   # Production mode
   npm start
   ```
   The API will be live at: `http://localhost:5050`

---

### 4. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Frontend Environment (Optional)**:
   Create a `.env` file in `frontend/` if you want to customize the API base URL:
   ```env
   VITE_API_URL=http://localhost:5050
   ```

4. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   The frontend application will be running at: `http://localhost:5173` (or the port specified in terminal).

---

## 🗄️ Database Schema & Tables

The database schema (`backend/schema.sql`) includes structured relations optimized with B-Tree indexes:

| Table Name | Description | Key Fields |
|---|---|---|
| `colleges` | Master table for colleges & universities | `id`, `name`, `slug`, `city`, `state`, `annual_fees`, `rating`, `nirf_rank`, `highest_ctc`, `avg_ctc`, `overview` |
| `courses` | Academic degrees offered per college | `id`, `college_id`, `name`, `degree`, `duration_years`, `annual_fees`, `total_seats` |
| `placements` | Yearly placement records & packages | `id`, `college_id`, `year`, `highest_ctc_lpa`, `avg_ctc_lpa`, `median_ctc_lpa`, `top_recruiters` |
| `cutoffs` | Entrance exam cutoff ranks | `id`, `college_id`, `exam_name`, `branch_name`, `closing_rank`, `category` |
| `reviews` | Student & alumni verified reviews | `id`, `college_id`, `author_name`, `rating`, `headline`, `comment`, `created_at` |
| `users` | User management records (CRUD) | `id`, `name`, `email`, `created_at` |
| `newsletters` | Counseling & cutoff alert subscriptions | `id`, `name`, `email`, `target_exam`, `created_at` |

---

## 📡 REST API Reference

The backend exposes a clean, standardized JSON API with CORS enabled.

### 🏛️ College Discovery Endpoints

#### 1. List Colleges (with Filters, Search & Pagination)
- **Endpoint**: `GET /api/colleges`
- **Query Parameters**:
  - `q` *(string)*: Search term (name, city, state, description)
  - `state` *(string)*: Filter by Indian state (e.g. `Maharashtra`, `Delhi`, `Karnataka`)
  - `city` *(string)*: Filter by city (e.g. `Mumbai`, `New Delhi`, `Bengaluru`)
  - `degree` *(string)*: Filter by degree (e.g. `B.Tech`, `MBA`, `MBBS`)
  - `min_fee` / `max_fee` *(number)*: Maximum annual tuition budget
  - `min_rating` *(number)*: Minimum rating (e.g. `4.5`)
  - `sort` *(string)*: `rating_desc`, `rank_asc`, `fees_asc`, `fees_desc`, `avg_package_desc`
  - `page` *(number)*: Page number (Default: `1`)
  - `limit` *(number)*: Items per page (Default: `10`)
- **Sample Response**:
  ```json
  {
    "success": true,
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "data": [
      {
        "id": 1,
        "name": "Indian Institute of Technology Bombay (IITB)",
        "slug": "iit-bombay",
        "city": "Mumbai",
        "state": "Maharashtra",
        "rating": 4.9,
        "nirf_rank": 1,
        "annual_fees": 230000,
        "highest_ctc": "₹1.68 Cr",
        "avg_ctc": "₹23.5 LPA"
      }
    ]
  }
  ```

#### 2. Get College Details by ID or Slug
- **Endpoint**: `GET /api/colleges/:identifier`
- **Example**: `GET /api/colleges/iit-bombay` or `GET /api/colleges/1`

#### 3. Compare Colleges
- **Endpoint**: `GET /api/colleges/compare?ids=1,2,3`
- **Description**: Returns detailed comparative matrices for 2 to 3 colleges.

#### 4. Admission Predictor
- **Endpoint**: `POST /api/predictor`
- **Request Body**:
  ```json
  {
    "exam": "JEE Advanced",
    "rank": 250,
    "category": "General"
  }
  ```
- **Response**: Categorized recommendations (`safe`, `target`, `reach`) with branch-level cutoff matches.

#### 5. Submit College Review
- **Endpoint**: `POST /api/colleges/:id/reviews`
- **Request Body**:
  ```json
  {
    "author_name": "Rohan Sharma",
    "rating": 5.0,
    "headline": "Top-tier faculty and campus culture",
    "comment": "Unmatched research opportunities and great placement assistance."
  }
  ```

#### 6. Subscribe to Counseling Newsletter
- **Endpoint**: `POST /api/newsletter`
- **Request Body**:
  ```json
  {
    "name": "Aditi Roy",
    "email": "aditi@example.com",
    "targetExam": "JEE Main"
  }
  ```

---

### 👥 User Management Endpoints (CRUD)

| Method | Endpoint | Description | Payload / Params |
|---|---|---|---|
| `GET` | `/users` | Fetch all registered users | None |
| `GET` | `/users/:id` | Fetch a single user by ID | `:id` (integer) |
| `POST` | `/users` | Create a new user | `{ "name": "John Doe", "email": "john@example.com" }` |
| `PUT` / `PATCH` | `/users/:id` | Update user name or email | `{ "name": "Updated Name", "email": "new@example.com" }` |
| `DELETE` | `/users/:id` | Delete a user by ID | `:id` (integer) |

---

### 🩺 Health & Diagnostic Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | Server and database telemetry status |
| `POST` | `/api/db/reconnect` | Attempt database reconnection on-demand |
| `GET` | `/api/meta/filters` | Dynamic list of available cities, states, exams, degrees |

---

## 🧪 Testing & Diagnostics

Run the interactive database diagnostic tool from the backend:
```bash
cd backend
npm run db:test
```
This utility tests the connection string, latency, server version, and table record counts across all schema entities.

---

## 🚢 Deployment

### Deploy Frontend (Vercel / Netlify)
1. Set the root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variable: `VITE_API_URL=https://your-backend-api.com`

### Deploy Backend (Render / Railway / Heroku)
1. Set the root directory to `backend`.
2. Start command: `npm start`
3. Configure environment variables (`PORT`, `DATABASE_URL` or `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`, `PGPORT`).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
