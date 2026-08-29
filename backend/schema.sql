-- PostgreSQL Schema for College Discovery Platform & User Management

-- 1. Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 4.0,
  review_count INT DEFAULT 0,
  annual_fees INT NOT NULL,
  nirf_rank INT,
  degree VARCHAR(100),
  established_year INT,
  campus_size VARCHAR(50),
  institute_type VARCHAR(100) DEFAULT 'Public',
  accreditation VARCHAR(100) DEFAULT 'NAAC A++',
  highest_ctc VARCHAR(50),
  avg_ctc VARCHAR(50),
  logo_url TEXT,
  banner_url TEXT,
  image TEXT,
  overview TEXT NOT NULL,
  signature_highlight TEXT,
  cutoff_info TEXT,
  features TEXT[]
);

-- 2. Degree Programs / Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  degree VARCHAR(50) NOT NULL,
  duration_years NUMERIC(3, 1) NOT NULL,
  annual_fees INT NOT NULL,
  total_seats INT DEFAULT 60
);

-- 3. Campus Placements Table
CREATE TABLE IF NOT EXISTS placements (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
  year INT NOT NULL,
  highest_ctc_lpa NUMERIC(5, 2) NOT NULL,
  avg_ctc_lpa NUMERIC(5, 2) NOT NULL,
  median_ctc_lpa NUMERIC(5, 2) NOT NULL,
  placement_rate NUMERIC(5, 2) NOT NULL,
  top_recruiters TEXT[] NOT NULL
);

-- 4. Entrance Exam Cutoffs Table
CREATE TABLE IF NOT EXISTS cutoffs (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
  exam_name VARCHAR(100) NOT NULL,
  branch_name VARCHAR(200) NOT NULL,
  closing_rank INT NOT NULL,
  category VARCHAR(50) DEFAULT 'General'
);

-- 5. Student & Alumni Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
  author_name VARCHAR(150) NOT NULL,
  rating NUMERIC(2, 1) NOT NULL,
  headline VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Users Table (for Backward Compatibility & User Management)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Newsletter & Counseling Subscriptions Table
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  target_exam VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search and Filter Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_colleges_slug ON colleges(slug);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_fees ON colleges(annual_fees);
CREATE INDEX IF NOT EXISTS idx_colleges_rating ON colleges(rating);
CREATE INDEX IF NOT EXISTS idx_courses_college_id ON courses(college_id);
CREATE INDEX IF NOT EXISTS idx_cutoffs_college_id ON cutoffs(college_id);
CREATE INDEX IF NOT EXISTS idx_reviews_college_id ON reviews(college_id);
