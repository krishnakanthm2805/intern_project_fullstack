const db = require('../database');

/**
 * Controller for College Discovery Platform API
 */
const collegeController = {
  // GET /api/colleges - Search, Filter, Sort, Paginate
  async getColleges(req, res) {
    try {
      const {
        q,
        city,
        state,
        min_fee,
        max_fee,
        min_rating,
        sort,
        page = 1,
        limit = 10,
        degree,
      } = req.query;

      const result = await db.getColleges({
        q,
        city,
        state,
        min_fee,
        max_fee,
        min_rating,
        sort,
        page,
        limit,
        degree,
      });

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      console.error('[CollegeController] getColleges error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/colleges/:identifier - Get single college by ID or Slug
  async getCollegeByIdOrSlug(req, res) {
    try {
      const { identifier } = req.params;
      const college = await db.getCollegeBySlugOrId(identifier);

      if (!college) {
        return res.status(404).json({ success: false, error: `College '${identifier}' not found` });
      }

      return res.status(200).json({
        success: true,
        data: college,
      });
    } catch (err) {
      console.error('[CollegeController] getCollegeByIdOrSlug error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/colleges/compare - Compare 2-3 colleges
  async compareColleges(req, res) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res.status(400).json({
          success: false,
          error: 'Missing ids query parameter. Format: /api/colleges/compare?ids=1,2,3',
        });
      }

      const idList = ids.split(',').map(id => id.trim()).filter(Boolean);
      if (idList.length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Please provide at least 2 college IDs to compare',
        });
      }

      const colleges = await db.compareColleges(idList);

      return res.status(200).json({
        success: true,
        count: colleges.length,
        data: colleges,
      });
    } catch (err) {
      console.error('[CollegeController] compareColleges error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/predictor - Predict college admission based on Exam, Rank, Category
  async predictAdmission(req, res) {
    try {
      const { exam, rank, category = 'General' } = req.body || {};

      if (!exam || typeof exam !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Please specify an exam (e.g. JEE Main, JEE Advanced, NEET, CAT, BITSAT)',
        });
      }
      if (rank === undefined || rank === null || isNaN(rank)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid rank or percentile number',
        });
      }

      const recommendations = await db.predict({ exam, rank: parseInt(rank, 10), category });

      // Group predictions by bucket
      const grouped = {
        safe: recommendations.filter(r => r.chance.includes('Safe')),
        target: recommendations.filter(r => r.chance.includes('Target')),
        reach: recommendations.filter(r => r.chance.includes('Reach')),
      };

      return res.status(200).json({
        success: true,
        input: { exam, rank: parseInt(rank, 10), category },
        totalMatches: recommendations.length,
        grouped,
        data: recommendations,
      });
    } catch (err) {
      console.error('[CollegeController] predictAdmission error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/meta/filters - Return filter options (cities, states, exams, degrees, fee bounds)
  async getFilterOptions(req, res) {
    try {
      const meta = await db.getFilterMetadata();
      return res.status(200).json({
        success: true,
        data: meta,
      });
    } catch (err) {
      console.error('[CollegeController] getFilterOptions error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/colleges/:id/reviews - Submit a student review
  async addCollegeReview(req, res) {
    try {
      const { id } = req.params;
      const { author_name, rating, headline, comment } = req.body || {};

      if (!headline || !comment) {
        return res.status(400).json({
          success: false,
          error: 'Review headline and comment are required',
        });
      }

      const review = await db.addReview(id, { author_name, rating, headline, comment });

      return res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (err) {
      console.error('[CollegeController] addCollegeReview error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // POST /api/newsletter - Free counseling & cutoff guide subscription
  async subscribeNewsletter(req, res) {
    try {
      const { name, email, targetExam } = req.body || {};
      if (!email || !email.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'A valid email address is required',
        });
      }

      const subscription = await db.addNewsletter({ name, email, targetExam });

      return res.status(201).json({
        success: true,
        message: 'Subscribed successfully. Your admission guide is on its way!',
        data: subscription,
      });
    } catch (err) {
      console.error('[CollegeController] subscribeNewsletter error:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },

  // GET /api/status - System and Database health telemetry
  async getStatus(req, res) {
    try {
      const status = await db.getStatus();
      return res.status(200).json({
        status: 'ok',
        platform: 'College Discovery Platform API',
        database: status,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(500).json({ status: 'error', error: err.message });
    }
  },

  // POST /api/db/reconnect - Test/Reconnect database connection
  async reconnectDatabase(req, res) {
    try {
      const status = await db.reconnect();
      return res.status(200).json({
        success: true,
        message: status.connected ? 'Successfully connected to PostgreSQL' : 'PostgreSQL connection failed, operating with resilient fallback',
        database: status,
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = collegeController;
