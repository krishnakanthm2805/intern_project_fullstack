# ⚛️ College Discovery Platform - Frontend Client

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Lucide](https://img.shields.io/badge/Lucide_Icons-1.35-F56565?style=for-the-badge)](https://lucide.dev/)

A responsive web application for discovering, comparing, and evaluating Indian academic institutions. Built using **React 19**, **Vite**, **Lucide Icons**, and a custom **Vanilla CSS Design System**.

---

## 🌟 Frontend Features

- **Dynamic Search & Multi-Faceted Filters**:
  - Instant text search across college names, cities, states, and descriptions.
  - Granular dropdown filters for State, City, Degree Program, Maximum Budget (Annual Fees), and Minimum Rating.
  - Sorting options: NIRF Ranking, Highest / Average CTC Package, Tuition Fees, and Rating.
  - **URL Parameter Synchronization**: Search state is automatically synchronized with browser `URLSearchParams` (`?q=...&state=...&sort=...`) for shareability and seamless browser back/forward navigation.

- **Side-by-Side College Comparison**:
  - Select up to **3 institutions** simultaneously for direct comparison.
  - Floating comparison tray / drawer with badge counters.
  - Comprehensive comparison matrix covering NIRF Rankings, Placement Packages, Tuition Fees, Campus Size, and Exam Cutoffs.

- **Interactive Institution Detail Views**:
  - Dedicated route-driven detail views (`/colleges/:slug`).
  - Tabbed information system: *Overview*, *Degree Programs & Seats*, *Placement Statistics & Top Recruiters*, *Historical Entrance Exam Cutoffs*, and *Student & Alumni Reviews*.
  - User review submission form with instant validation.

- **Admission & Rank Predictor Tool**:
  - Input exam (JEE Main, JEE Advanced, NEET, CAT, BITSAT), student rank, and reservation category to view classified recommendations (*Safe*, *Target*, *Reach*).

- **Real-Time Database & Telemetry Health Indicator**:
  - Integrated status indicator in the top navigation bar.
  - Modal with real-time PostgreSQL connection telemetry, database ping latency, record counts, and live reconnect trigger.

- **Resilient Offline / Client-Side Fallback Engine**:
  - Automatically queries the backend REST API (`http://localhost:5050`).
  - If the backend or PostgreSQL database is offline, the client-side data engine seamlessly serves the embedded seed dataset so all search, filter, and comparison features remain 100% interactive.

---

## 📂 Component Structure

```
frontend/src/
├── assets/                  # Logos and visual illustrations
├── components/              # Modular UI components
│   ├── Navbar.jsx           # Top navigation, status indicator & comparison drawer toggle
│   ├── HeroSection.jsx      # Hero banner, 3D campus artwork & quick search card
│   ├── CollegeDirectorySection.jsx # Search input, filter controls, college grid & pagination
│   ├── CollegeCard.jsx      # College listing card with badge tags and action buttons
│   ├── CollegeDetailModal.jsx # Detailed college modal with multi-tab interface
│   ├── CompareDrawer.jsx    # Floating drawer showing selected colleges
│   ├── CompareView.jsx      # Full-width comparison matrix
│   ├── PredictorTool.jsx    # Admission probability predictor widget
│   ├── CourseModal.jsx      # Interactive directory search popup
│   ├── DatabaseStatusModal.jsx # Live PostgreSQL connection and diagnostics modal
│   ├── TellMeMoreAbout.jsx  # Highlight cards for Engineering, Management & Beginners
│   ├── LatestReviewsSection.jsx # Student reviews grid and sidebar newsletter form
│   ├── EquipmentReviewsSection.jsx # Institution reviews with rating counters
│   ├── ArticleModal.jsx     # Full-text reader for featured guides and reviews
│   ├── TipsNewsletterModal.jsx # Free cutoff guide & newsletter subscription modal
│   ├── UserCards.jsx        # User management cards
│   ├── UserTable.jsx        # User management table
│   ├── UserModal.jsx        # Create/edit user modal
│   ├── Toast.jsx            # Dynamic floating toast feedback notification system
│   └── Footer.jsx           # Global footer with resource links and newsletter capture
├── data/
│   └── collegeData.js       # Institution seed dataset for client-side fallback
├── services/
│   └── api.js               # REST API service client with automatic fallback logic
├── utils/                   # Helper functions and formatting utilities
├── App.jsx                  # Main application orchestrator & state manager
├── index.css                # CSS custom properties, responsive design tokens & animations
└── main.jsx                 # React root DOM bootstrap
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment (Optional)
By default, the frontend connects to `http://localhost:5050`. To customize the backend URL, create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:5050
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles and bundles production-ready static assets into `dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm run lint` | Runs Oxlint linter for lightning-fast code quality checks |

---

## 🎨 Styling & Design System

The application uses modern Vanilla CSS (`src/index.css`) featuring:
- **Design Tokens**: Standardized CSS variables for palette colors, spacing, shadows, and typography.
- **Glassmorphism & Depth**: Backdrop filters, subtle border highlights, and elevation shadows.
- **Micro-Animations**: Smooth hover transitions, scale-ups, and animated modals.
- **Fully Responsive**: Optimized layouts for mobile devices, tablets, laptops, and ultra-wide screens.
