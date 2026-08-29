require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const collegeController = require('./controllers/collegeController');
const usersDb = require('./users');
const port = parseInt(process.env.PORT || '5050', 10);

// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Info & Endpoints Catalog
app.get('/', (req, res) => {
  res.json({
    platform: 'College Discovery Platform API (Track A)',
    version: '2.0.0',
    endpoints: {
      status: 'GET /api/status',
      colleges: 'GET /api/colleges (Params: q, city, state, degree, min_fee, max_fee, min_rating, sort, page, limit)',
      collegeDetail: 'GET /api/colleges/:identifier (by numeric id or string slug)',
      compare: 'GET /api/colleges/compare?ids=1,2,3',
      predictor: 'POST /api/predictor (Body: { exam, rank, category })',
      filterMeta: 'GET /api/meta/filters',
      submitReview: 'POST /api/colleges/:id/reviews (Body: { author_name, rating, headline, comment })',
      newsletter: 'POST /api/newsletter (Body: { name, email, targetExam })',
      users: 'GET /users, POST /users, PUT /users/:id, DELETE /users/:id',
    },
  });
});

// Health & Metadata Routes
app.get('/api/status', collegeController.getStatus);
app.get('/status', collegeController.getStatus);
app.get('/api/db/status', collegeController.getStatus);
app.post('/api/db/reconnect', collegeController.reconnectDatabase);
app.get('/api/meta/filters', collegeController.getFilterOptions);

// College Discovery Platform Routes (Track A)
app.get('/api/colleges/compare', collegeController.compareColleges);
app.get('/api/colleges', collegeController.getColleges);
app.get('/api/colleges/:identifier', collegeController.getCollegeByIdOrSlug);
app.post('/api/colleges/:id/reviews', collegeController.addCollegeReview);
app.post('/api/predictor', collegeController.predictAdmission);
app.post('/api/newsletter', collegeController.subscribeNewsletter);

// Backward Compatible User Management Routes
app.get('/users', usersDb.getUsers);
app.get('/users/:id', usersDb.getUserById);
app.post('/users', usersDb.createUser);
app.patch('/users/:id', usersDb.updateUser);
app.put('/users/:id', usersDb.updateUser);
app.delete('/users/:id', usersDb.deleteUser);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', details: err.message });
});

app.listen(port, () => {
  console.log(`[Backend] College Discovery API running on http://localhost:${port}`);
});