require('dotenv').config();
const { Pool } = require('pg');

// Parse PostgreSQL Configuration (Supports DATABASE_URL or individual PG* env variables)
function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    const isLocalhost = process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1');
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
    };
  }

  const isLocal = !process.env.PGHOST || process.env.PGHOST === 'localhost' || process.env.PGHOST === '127.0.0.1';
  const sslConfig = process.env.PGSSL === 'true' || (!isLocal && process.env.PGSSL !== 'false')
    ? { rejectUnauthorized: false }
    : false;

  return {
    user: process.env.PGUSER || 'postgres',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'api',
    password: process.env.PGPASSWORD || '12345',
    port: parseInt(process.env.PGPORT || '5432', 10),
    ssl: sslConfig,
    connectionTimeoutMillis: 4000,
    idleTimeoutMillis: 30000,
  };
}

const poolConfig = getPoolConfig();
let pool = null;
let isPostgresConnected = false;
let dbErrorDetails = null;
let lastPingTime = null;
let cachedTableCounts = {
  colleges: 0,
  courses: 0,
  placements: 0,
  cutoffs: 0,
  reviews: 0,
  users: 0,
  newsletters: 0,
};

// Complete Seed Dataset for Indian Colleges (Engineered for College Discovery Platform)
const seedColleges = [
  {
    id: 1,
    name: 'Indian Institute of Technology Bombay (IITB)',
    slug: 'iit-bombay',
    city: 'Mumbai',
    state: 'Maharashtra',
    rating: 4.9,
    review_count: 1420,
    annual_fees: 230000,
    nirf_rank: 1,
    degree: 'B.Tech / M.Tech',
    established_year: 1958,
    campus_size: '550 Acres',
    institute_type: 'Institute of National Importance',
    accreditation: 'Autonomous / NIRF Engineering #1',
    highest_ctc: '₹1.68 Cr',
    avg_ctc: '₹23.5 LPA',
    logo_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80',
    overview: 'Recognized worldwide for academic excellence, cutting-edge semiconductor labs, vibrant Mood Indigo festival, and premier tech startup incubator in Powai, Mumbai.',
    signature_highlight: 'Unmatched coding culture and tier-1 algorithmic trading & global Big Tech placements.',
    cutoff_info: 'JEE Advanced CSE Closing Rank: ~67 (General)',
    features: ['Institute of National Importance', '550 Acre Campus', 'Top Tech Placements', 'Global Alumni'],
    courses: [
      { id: 101, name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 230000, total_seats: 120 },
      { id: 102, name: 'B.Tech Electrical Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 230000, total_seats: 90 },
      { id: 103, name: 'B.Tech Mechanical Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 230000, total_seats: 110 },
      { id: 104, name: 'M.Tech Artificial Intelligence & Data Science', degree: 'M.Tech', duration_years: 2, annual_fees: 110000, total_seats: 40 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 168.0,
      avg_ctc_lpa: 23.5,
      median_ctc_lpa: 19.8,
      placement_rate: 98.4,
      top_recruiters: ['Google', 'Microsoft', 'Apple', 'Jane Street', 'Qualcomm', 'Rubrik', 'Goldman Sachs'],
    },
    cutoffs: [
      { exam_name: 'JEE Advanced', branch_name: 'Computer Science and Engineering', closing_rank: 67, category: 'General' },
      { exam_name: 'JEE Advanced', branch_name: 'Electrical Engineering', closing_rank: 450, category: 'General' },
      { exam_name: 'JEE Advanced', branch_name: 'Mechanical Engineering', closing_rank: 1400, category: 'General' },
      { exam_name: 'JEE Advanced', branch_name: 'Computer Science and Engineering', closing_rank: 35, category: 'OBC' },
      { exam_name: 'GATE', branch_name: 'M.Tech Computer Science', closing_rank: 820, category: 'General' },
    ],
    reviews: [
      { id: 201, author_name: 'Arjun Mehta (CSE 2024)', rating: 5.0, headline: 'World-Class Coding Culture & Tech Clubs', comment: 'The exposure at IIT Bombay is unmatched. Mood Indigo and Techfest provide tremendous leadership opportunities. Placement season is electric.', verified: true, created_at: '2025-11-12' },
      { id: 202, author_name: 'Pooja Iyer (EE 2023)', rating: 4.8, headline: 'Rigorous academics with top research facilities', comment: 'Labs are state-of-the-art. Faculty are approachable and provide ample research opportunities in robotics and semiconductors.', verified: true, created_at: '2025-08-19' },
    ],
  },
  {
    id: 2,
    name: 'Indian Institute of Technology Delhi (IITD)',
    slug: 'iit-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 4.8,
    review_count: 1280,
    annual_fees: 225000,
    nirf_rank: 2,
    degree: 'B.Tech / M.Tech',
    established_year: 1961,
    campus_size: '320 Acres',
    institute_type: 'Institute of National Importance',
    accreditation: 'Autonomous / NIRF Engineering #2',
    highest_ctc: '₹1.55 Cr',
    avg_ctc: '₹22.8 LPA',
    logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
    overview: 'Located in Hauz Khas, New Delhi. Renowned for producing high numbers of startup unicorn founders, quantitative finance recruits, and premier AI research breakthroughs.',
    signature_highlight: 'Proximity to national capital tech hubs, VC firms, and government policy research.',
    cutoff_info: 'JEE Advanced CSE Closing Rank: ~115 (General)',
    features: ['NIRF #2 Engineering', '320 Acre Campus', 'Unicorn Incubator', 'Modern Labs'],
    courses: [
      { id: 105, name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 225000, total_seats: 115 },
      { id: 106, name: 'B.Tech Mathematics and Computing', degree: 'B.Tech', duration_years: 4, annual_fees: 225000, total_seats: 60 },
      { id: 107, name: 'B.Tech Civil Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 225000, total_seats: 95 },
      { id: 108, name: 'MBA Executive', degree: 'MBA', duration_years: 2, annual_fees: 600000, total_seats: 50 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 155.0,
      avg_ctc_lpa: 22.8,
      median_ctc_lpa: 18.5,
      placement_rate: 97.2,
      top_recruiters: ['Microsoft', 'Amazon', 'Tower Research', 'McKinsey & Co', 'BCG', 'NVIDIA'],
    },
    cutoffs: [
      { exam_name: 'JEE Advanced', branch_name: 'Computer Science and Engineering', closing_rank: 115, category: 'General' },
      { exam_name: 'JEE Advanced', branch_name: 'Mathematics and Computing', closing_rank: 380, category: 'General' },
      { exam_name: 'JEE Advanced', branch_name: 'Civil Engineering', closing_rank: 3200, category: 'General' },
      { exam_name: 'CAT', branch_name: 'MBA Executive', closing_rank: 98, category: 'General' },
    ],
    reviews: [
      { id: 203, author_name: 'Rohan Sharma (MnC 2024)', rating: 4.9, headline: 'Best startup and quantitative finance launchpad', comment: 'Being in the heart of Delhi gives massive proximity to tech summits, VC networks, and top internships. MnC curriculum is extremely quantitative.', verified: true, created_at: '2025-10-04' },
    ],
  },
  {
    id: 3,
    name: 'BITS Pilani (Pilani Campus)',
    slug: 'bits-pilani',
    city: 'Pilani',
    state: 'Rajasthan',
    rating: 4.8,
    review_count: 1100,
    annual_fees: 530000,
    nirf_rank: 20,
    degree: 'B.E. / M.Sc Dual',
    established_year: 1964,
    campus_size: '328 Acres',
    institute_type: 'Private Deemed University',
    accreditation: 'NAAC A Grade',
    highest_ctc: '₹1.33 Cr',
    avg_ctc: '₹20.9 LPA',
    logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80',
    overview: 'Birla Institute of Technology and Science (BITS Pilani) is India’s premier private university known for its merit-based admission via BITSAT, zero-attendance policy, and Practice School industry immersion.',
    signature_highlight: 'Zero attendance policy fosters intense entrepreneurial freedom and coding mastery.',
    cutoff_info: 'BITSAT Score: ~331 / 390 for Computer Science',
    features: ['Deemed University', 'Practice School System', 'No Attendance Rule', 'Elite Alumni Network'],
    courses: [
      { id: 109, name: 'B.E. Computer Science', degree: 'B.E.', duration_years: 4, annual_fees: 530000, total_seats: 140 },
      { id: 110, name: 'B.E. Electronics & Communication', degree: 'B.E.', duration_years: 4, annual_fees: 530000, total_seats: 120 },
      { id: 111, name: 'M.Sc (Hons) Economics + B.E. Dual Degree', degree: 'Dual Degree', duration_years: 5, annual_fees: 530000, total_seats: 80 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 133.0,
      avg_ctc_lpa: 20.9,
      median_ctc_lpa: 17.2,
      placement_rate: 96.5,
      top_recruiters: ['Google', 'DE Shaw', 'Uber', 'Cisco', 'Texas Instruments', 'Sprinklr'],
    },
    cutoffs: [
      { exam_name: 'BITSAT', branch_name: 'Computer Science', closing_rank: 331, category: 'General' },
      { exam_name: 'BITSAT', branch_name: 'Electronics & Communication', closing_rank: 295, category: 'General' },
      { exam_name: 'BITSAT', branch_name: 'Economics Dual Degree', closing_rank: 275, category: 'General' },
    ],
    reviews: [
      { id: 204, author_name: 'Siddharth Rao (CS 2024)', rating: 4.8, headline: 'Zero attendance policy breeds true entrepreneurship', comment: 'The flexibility to choose courses, schedule, and professors is unmatched in India. Practice School PS-2 provides guaranteed 6-month corporate exposure.', verified: true, created_at: '2025-09-14' },
    ],
  },
  {
    id: 4,
    name: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
    slug: 'aiims-delhi',
    city: 'New Delhi',
    state: 'Delhi',
    rating: 5.0,
    review_count: 950,
    annual_fees: 1628,
    nirf_rank: 1,
    degree: 'MBBS / MD',
    established_year: 1956,
    campus_size: '115 Acres',
    institute_type: 'Institute of National Importance',
    accreditation: 'Autonomous / NIRF Medical #1',
    highest_ctc: 'Govt Residency',
    avg_ctc: '₹18.0 LPA',
    logo_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80',
    overview: 'The zenith of medical education and patient care in Asia. Heavily subsidized medical education with unparalleled clinical case exposure and top research labs.',
    signature_highlight: '100% clinical patient diversity and zero tuition barrier for top national NEET rankers.',
    cutoff_info: 'NEET UG Closing Rank: 55 (General Category)',
    features: ['NIRF #1 Medical', 'World Class Hospital', 'Subsidized Fee', 'Top Research'],
    courses: [
      { id: 124, name: 'MBBS Bachelor of Medicine & Surgery', degree: 'MBBS', duration_years: 5.5, annual_fees: 1628, total_seats: 125 },
      { id: 125, name: 'MD General Medicine', degree: 'MD', duration_years: 3, annual_fees: 2500, total_seats: 35 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 36.0,
      avg_ctc_lpa: 18.0,
      median_ctc_lpa: 16.5,
      placement_rate: 100.0,
      top_recruiters: ['AIIMS Residency', 'Apollo Hospitals', 'Max Healthcare', 'Fortis', 'NHS UK', 'Johns Hopkins'],
    },
    cutoffs: [
      { exam_name: 'NEET UG', branch_name: 'MBBS', closing_rank: 55, category: 'General' },
      { exam_name: 'NEET UG', branch_name: 'MBBS', closing_rank: 240, category: 'OBC' },
      { exam_name: 'INI-CET', branch_name: 'MD Radio-Diagnosis', closing_rank: 12, category: 'General' },
    ],
    reviews: [
      { id: 207, author_name: 'Dr. Priya Nambiar (MD 2024)', rating: 5.0, headline: 'The greatest hospital for clinical experience in Asia', comment: 'The patient diversity seen at AIIMS Delhi cannot be replicated anywhere in the world. Tuition fee is under ₹2,000 total.', verified: true, created_at: '2025-04-12' },
    ],
  },
  {
    id: 5,
    name: 'Indian Institute of Management Ahmedabad (IIMA)',
    slug: 'iim-ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    rating: 4.9,
    review_count: 820,
    annual_fees: 1250000,
    nirf_rank: 1,
    degree: 'MBA / PGP',
    established_year: 1961,
    campus_size: '102 Acres',
    institute_type: 'Institute of National Importance',
    accreditation: 'EQUIS Accredited / NIRF Management #1',
    highest_ctc: '₹1.15 Cr',
    avg_ctc: '₹34.2 LPA',
    logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    overview: 'The gold standard of management education in India. Famous for Harvard-style case pedagogy, Louis Kahn red brick campus, and global executive leadership.',
    signature_highlight: '100% placement rate with top global consulting, private equity, and product management recruiters.',
    cutoff_info: 'CAT Percentile: ~99.6+ with strong academic profile',
    features: ['NIRF #1 Management', 'Louis Kahn Heritage', 'Case Method', 'Global Leadership'],
    courses: [
      { id: 128, name: 'Post Graduate Programme in Management (PGP)', degree: 'MBA', duration_years: 2, annual_fees: 1250000, total_seats: 385 },
      { id: 129, name: 'PGP in Food and Agri-Business (PGP-FABM)', degree: 'MBA', duration_years: 2, annual_fees: 1100000, total_seats: 45 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 115.0,
      avg_ctc_lpa: 34.2,
      median_ctc_lpa: 31.5,
      placement_rate: 100.0,
      top_recruiters: ['McKinsey & Company', 'Boston Consulting Group', 'Bain & Co', 'Goldman Sachs', 'Avendus Capital'],
    },
    cutoffs: [
      { exam_name: 'CAT', branch_name: 'PGP Management', closing_rank: 99, category: 'General' },
      { exam_name: 'CAT', branch_name: 'PGP-FABM', closing_rank: 96, category: 'General' },
    ],
    reviews: [
      { id: 208, author_name: 'Kavita Menon (PGP 2024)', rating: 4.9, headline: 'WAC, dorm culture, and unmatched career lift', comment: 'The case pedagogy turns engineers and freshers into decisive business leaders. Dorm life at Louis Kahn heritage plaza is unforgettable.', verified: true, created_at: '2025-03-02' },
    ],
  },
  {
    id: 6,
    name: 'International Institute of Information Technology (IIIT Hyderabad)',
    slug: 'iiit-hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    rating: 4.9,
    review_count: 890,
    annual_fees: 360000,
    nirf_rank: 55,
    degree: 'B.Tech / MS by Research',
    established_year: 1998,
    campus_size: '66 Acres',
    institute_type: 'Autonomous University',
    accreditation: 'NAAC A / Premier Research',
    highest_ctc: '₹1.02 Cr',
    avg_ctc: '₹31.5 LPA',
    logo_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80',
    overview: 'Unmatched coding environment with regular ACM-ICPC World Finalists, premier Computer Vision (CVIT) and NLP research labs in Gachibowli.',
    signature_highlight: 'Highest average CSE package in India exceeding ₹31.5 LPA.',
    cutoff_info: 'JEE Mains CSE Percentile: ~99.92+',
    features: ['Autonomous Tech Institute', 'ICPC Powerhouse', 'Top AI/NLP Labs', 'High ROI'],
    courses: [
      { id: 120, name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 360000, total_seats: 120 },
      { id: 121, name: 'B.Tech Electronics & Communication', degree: 'B.Tech', duration_years: 4, annual_fees: 360000, total_seats: 90 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 102.0,
      avg_ctc_lpa: 31.5,
      median_ctc_lpa: 28.0,
      placement_rate: 99.1,
      top_recruiters: ['Google', 'Apple', 'Meta', 'Uber', 'Directi', 'DE Shaw', 'NVIDIA'],
    },
    cutoffs: [
      { exam_name: 'JEE Main', branch_name: 'Computer Science and Engineering', closing_rank: 950, category: 'General' },
      { exam_name: 'UGEE', branch_name: 'CSE Dual Degree', closing_rank: 120, category: 'General' },
    ],
    reviews: [
      { id: 209, author_name: 'Patrick Chen (CSE 2023)', rating: 4.9, headline: 'Pure computer science paradise', comment: 'If your sole goal is software engineering, deep learning research, or top US tech placements, IIIT Hyderabad is superior to almost every college.', verified: true, created_at: '2025-02-14' },
    ],
  },
  {
    id: 7,
    name: 'National Institute of Technology Tiruchirappalli (NIT Trichy)',
    slug: 'nit-trichy',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    rating: 4.6,
    review_count: 850,
    annual_fees: 160000,
    nirf_rank: 9,
    degree: 'B.Tech / MCA',
    established_year: 1964,
    campus_size: '800 Acres',
    institute_type: 'National Institute of Technology',
    accreditation: 'NBA / NIRF Engineering #9',
    highest_ctc: '₹52.8 LPA',
    avg_ctc: '₹17.5 LPA',
    logo_url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1568792923760-d70635a89fa1?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1568792923760-d70635a89fa1?w=1200&auto=format&fit=crop&q=80',
    overview: 'NIT Trichy is ranked as the #1 NIT in India. It offers exceptional undergraduate and postgraduate courses in engineering, architecture, and management with a massive 800-acre self-contained campus.',
    signature_highlight: 'Premier NIT with Festember, Pragyan festivals, and industry partnerships.',
    cutoff_info: 'JEE Main CSE Closing Rank: ~4800 (General)',
    features: ['NIRF #9 Engineering', '800 Acre Campus', 'Top NIT Placements', 'Strong Alumni'],
    courses: [
      { id: 112, name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 160000, total_seats: 120 },
      { id: 113, name: 'B.Tech Electronics & Communication', degree: 'B.Tech', duration_years: 4, annual_fees: 160000, total_seats: 100 },
      { id: 114, name: 'B.Tech Instrumentation & Control', degree: 'B.Tech', duration_years: 4, annual_fees: 160000, total_seats: 80 },
      { id: 115, name: 'MCA Master of Computer Applications', degree: 'MCA', duration_years: 3, annual_fees: 95000, total_seats: 60 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 52.8,
      avg_ctc_lpa: 17.5,
      median_ctc_lpa: 14.8,
      placement_rate: 94.8,
      top_recruiters: ['Morgan Stanley', 'Amazon', 'Qualcomm', 'Cisco', 'Samsung R&D', 'Oracle'],
    },
    cutoffs: [
      { exam_name: 'JEE Main', branch_name: 'Computer Science and Engineering', closing_rank: 4800, category: 'General' },
      { exam_name: 'JEE Main', branch_name: 'Electronics & Communication', closing_rank: 8200, category: 'General' },
      { exam_name: 'NIMCET', branch_name: 'MCA', closing_rank: 85, category: 'General' },
    ],
    reviews: [
      { id: 205, author_name: 'Kavitha S. (CSE 2023)', rating: 4.7, headline: 'Top NIT experience and stellar peer community', comment: 'Festember and Pragyan are among the biggest college festivals in South India. Top IT and core electronics companies visit every year.', verified: true, created_at: '2025-07-22' },
    ],
  },
  {
    id: 8,
    name: 'Vellore Institute of Technology (VIT)',
    slug: 'vit-vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    rating: 4.4,
    review_count: 2300,
    annual_fees: 198000,
    nirf_rank: 11,
    degree: 'B.Tech / M.Tech',
    established_year: 1984,
    campus_size: '372 Acres',
    institute_type: 'Private Deemed University',
    accreditation: 'NAAC A++ Grade',
    highest_ctc: '₹1.02 Cr',
    avg_ctc: '₹10.2 LPA',
    logo_url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
    image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1200&auto=format&fit=crop&q=80',
    overview: 'VIT Vellore is one of India’s most popular private institutions with a Fully Flexible Credit System (FFCS), high volume campus placements, modern student hostels, and international partner universities.',
    signature_highlight: 'Fully Flexible Credit System (FFCS) and 900+ visiting recruiters.',
    cutoff_info: 'VITEEE CSE Closing Rank: ~7500',
    features: ['NAAC A++ Grade', 'Flexible Credits', 'High Volume Placements', 'Global Exchange'],
    courses: [
      { id: 116, name: 'B.Tech Computer Science and Engineering', degree: 'B.Tech', duration_years: 4, annual_fees: 198000, total_seats: 600 },
      { id: 117, name: 'B.Tech Information Technology', degree: 'B.Tech', duration_years: 4, annual_fees: 198000, total_seats: 240 },
      { id: 118, name: 'B.Tech Biotechnology', degree: 'B.Tech', duration_years: 4, annual_fees: 175000, total_seats: 120 },
      { id: 119, name: 'M.Tech Software Engineering', degree: 'M.Tech', duration_years: 2, annual_fees: 150000, total_seats: 80 },
    ],
    placement: {
      year: 2025,
      highest_ctc_lpa: 102.0,
      avg_ctc_lpa: 10.2,
      median_ctc_lpa: 8.5,
      placement_rate: 91.0,
      top_recruiters: ['Microsoft', 'Amazon', 'PayPal', 'Infosys', 'TCS Digital', 'Wipro Turbo', 'Deloitte'],
    },
    cutoffs: [
      { exam_name: 'VITEEE', branch_name: 'Computer Science (Cat 1)', closing_rank: 7500, category: 'General' },
      { exam_name: 'VITEEE', branch_name: 'Information Technology (Cat 1)', closing_rank: 14000, category: 'General' },
      { exam_name: 'JEE Main', branch_name: 'B.Tech CSE (Direct)', closing_rank: 25000, category: 'General' },
    ],
    reviews: [
      { id: 206, author_name: 'Nikhil Verma (IT 2024)', rating: 4.3, headline: 'Great placement volume and flexible credits', comment: 'Over 900+ companies visited during our placement season. FFCS allows choosing your own class slots and teachers.', verified: true, created_at: '2025-05-18' },
    ],
  },
];

const seedUsers = [
  { id: 1, name: 'Aditya Sharma', email: 'aditya.sharma@example.com', created_at: new Date().toISOString() },
  { id: 2, name: 'Pooja Iyer', email: 'pooja.iyer@example.com', created_at: new Date().toISOString() },
  { id: 3, name: 'Rohan Verma', email: 'rohan.verma@example.com', created_at: new Date().toISOString() },
];

const seedNewsletters = [];

// In-Memory Database Store (High-performance fallback)
const memoryStore = {
  colleges: JSON.parse(JSON.stringify(seedColleges)),
  users: JSON.parse(JSON.stringify(seedUsers)),
  newsletters: [...seedNewsletters],
  nextUserId: 4,
  nextReviewId: 300,
  nextNewsletterId: 1,
};

// PostgreSQL Schema Initialization & Seeding Script
async function initPostgres() {
  try {
    pool = new Pool(poolConfig);
    const client = await pool.connect();
    lastPingTime = new Date().toISOString();

    // 1. Create Tables
    await client.query(`
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

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        degree VARCHAR(50) NOT NULL,
        duration_years NUMERIC(3, 1) NOT NULL,
        annual_fees INT NOT NULL,
        total_seats INT DEFAULT 60
      );

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

      CREATE TABLE IF NOT EXISTS cutoffs (
        id SERIAL PRIMARY KEY,
        college_id INT REFERENCES colleges(id) ON DELETE CASCADE,
        exam_name VARCHAR(100) NOT NULL,
        branch_name VARCHAR(200) NOT NULL,
        closing_rank INT NOT NULL,
        category VARCHAR(50) DEFAULT 'General'
      );

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

      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS newsletters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        target_exam VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Check if seeding is needed
    const countCheck = await client.query('SELECT COUNT(*) FROM colleges');
    if (parseInt(countCheck.rows[0].count, 10) === 0) {
      console.log('[PostgreSQL] Database tables initialized. Seeding initial dataset...');
      for (const c of seedColleges) {
        const colRes = await client.query(
          `INSERT INTO colleges (name, slug, city, state, rating, review_count, annual_fees, nirf_rank, degree, established_year, campus_size, institute_type, accreditation, highest_ctc, avg_ctc, logo_url, banner_url, image, overview, signature_highlight, cutoff_info, features)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22) RETURNING id`,
          [c.name, c.slug, c.city, c.state, c.rating, c.review_count, c.annual_fees, c.nirf_rank, c.degree, c.established_year, c.campus_size, c.institute_type, c.accreditation, c.highest_ctc, c.avg_ctc, c.logo_url, c.banner_url, c.image, c.overview, c.signature_highlight, c.cutoff_info, c.features]
        );
        const colId = colRes.rows[0].id;

        // Courses
        for (const crs of c.courses) {
          await client.query(
            `INSERT INTO courses (college_id, name, degree, duration_years, annual_fees, total_seats) VALUES ($1, $2, $3, $4, $5, $6)`,
            [colId, crs.name, crs.degree, crs.duration_years, crs.annual_fees, crs.total_seats]
          );
        }

        // Placement
        if (c.placement) {
          await client.query(
            `INSERT INTO placements (college_id, year, highest_ctc_lpa, avg_ctc_lpa, median_ctc_lpa, placement_rate, top_recruiters) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [colId, c.placement.year, c.placement.highest_ctc_lpa, c.placement.avg_ctc_lpa, c.placement.median_ctc_lpa, c.placement.placement_rate, c.placement.top_recruiters]
          );
        }

        // Cutoffs
        for (const cut of c.cutoffs) {
          await client.query(
            `INSERT INTO cutoffs (college_id, exam_name, branch_name, closing_rank, category) VALUES ($1, $2, $3, $4, $5)`,
            [colId, cut.exam_name, cut.branch_name, cut.closing_rank, cut.category || 'General']
          );
        }

        // Reviews
        for (const rev of c.reviews) {
          await client.query(
            `INSERT INTO reviews (college_id, author_name, rating, headline, comment, verified) VALUES ($1, $2, $3, $4, $5, $6)`,
            [colId, rev.author_name, rev.rating, rev.headline, rev.comment, rev.verified]
          );
        }
      }

      // Seed sample users
      for (const u of seedUsers) {
        await client.query('INSERT INTO users (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', [u.name, u.email]);
      }
      console.log('[PostgreSQL] Database seeded successfully.');
    }

    // Refresh table counts
    await refreshTableCounts(client);

    client.release();
    isPostgresConnected = true;
    dbErrorDetails = null;
    const dbTarget = poolConfig.connectionString ? 'Cloud / URL target' : `${poolConfig.database} on ${poolConfig.host}:${poolConfig.port}`;
    console.log(`[Database] Successfully connected to PostgreSQL database (${dbTarget})`);
  } catch (err) {
    isPostgresConnected = false;
    dbErrorDetails = err.message;
    console.warn(`[Database] PostgreSQL notice: ${err.message}. Seamlessly operating with built-in high-performance dataset store.`);
  }
}

async function refreshTableCounts(clientOrPool) {
  try {
    const qColleges = await clientOrPool.query('SELECT COUNT(*) FROM colleges');
    const qCourses = await clientOrPool.query('SELECT COUNT(*) FROM courses');
    const qPlacements = await clientOrPool.query('SELECT COUNT(*) FROM placements');
    const qCutoffs = await clientOrPool.query('SELECT COUNT(*) FROM cutoffs');
    const qReviews = await clientOrPool.query('SELECT COUNT(*) FROM reviews');
    const qUsers = await clientOrPool.query('SELECT COUNT(*) FROM users');
    const qNewsletters = await clientOrPool.query('SELECT COUNT(*) FROM newsletters');

    cachedTableCounts = {
      colleges: parseInt(qColleges.rows[0].count, 10),
      courses: parseInt(qCourses.rows[0].count, 10),
      placements: parseInt(qPlacements.rows[0].count, 10),
      cutoffs: parseInt(qCutoffs.rows[0].count, 10),
      reviews: parseInt(qReviews.rows[0].count, 10),
      users: parseInt(qUsers.rows[0].count, 10),
      newsletters: parseInt(qNewsletters.rows[0].count, 10),
    };
  } catch (e) {
    // Non-blocking
  }
}

// Attempt PostgreSQL initialization
initPostgres();

const db = {
  // Execute raw query (used by users.js and general SQL)
  async query(sqlText, params = []) {
    if (isPostgresConnected && pool) {
      try {
        return await pool.query(sqlText, params);
      } catch (err) {
        console.error('[PostgreSQL Query Error]', err.message);
        throw err;
      }
    }

    // In-memory SQL simulator for users & generic tables
    const normalized = sqlText.trim().toUpperCase();

    // SELECT * FROM users
    if (normalized.startsWith('SELECT') && normalized.includes('USERS')) {
      if (normalized.includes('WHERE ID = $1')) {
        const id = parseInt(params[0], 10);
        const user = memoryStore.users.find(u => u.id === id);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }
      return { rows: [...memoryStore.users], rowCount: memoryStore.users.length };
    }

    // INSERT INTO users(name, email) VALUES($1, $2)
    if (normalized.startsWith('INSERT INTO USERS')) {
      const name = params[0];
      const email = params[1];
      const newUser = {
        id: memoryStore.nextUserId++,
        name,
        email,
        created_at: new Date().toISOString(),
      };
      memoryStore.users.push(newUser);
      return { rows: [newUser], rowCount: 1 };
    }

    // UPDATE users SET name = $1, email = $2 WHERE id = $3
    if (normalized.startsWith('UPDATE USERS')) {
      const id = parseInt(params[2], 10);
      const userIndex = memoryStore.users.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        memoryStore.users[userIndex].name = params[0];
        memoryStore.users[userIndex].email = params[1];
        return { rows: [memoryStore.users[userIndex]], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // DELETE FROM users WHERE id = $1
    if (normalized.startsWith('DELETE FROM USERS')) {
      const id = parseInt(params[0], 10);
      const initialLen = memoryStore.users.length;
      memoryStore.users = memoryStore.users.filter(u => u.id !== id);
      const deletedCount = initialLen - memoryStore.users.length;
      return { rows: [], rowCount: deletedCount };
    }

    return { rows: [], rowCount: 0 };
  },

  // 1. GET /api/colleges with Multi-Filter, Search, Sort, Pagination
  async getColleges({ q, city, state, min_fee, max_fee, min_rating, sort = 'rating_desc', page = 1, limit = 10, degree }) {
    if (isPostgresConnected && pool) {
      try {
        const conditions = [];
        const params = [];
        let paramIdx = 1;

        if (q && q.trim() !== '') {
          const searchPattern = `%${q.trim()}%`;
          params.push(searchPattern);
          conditions.push(`(
            c.name ILIKE $${paramIdx} OR 
            c.city ILIKE $${paramIdx} OR 
            c.state ILIKE $${paramIdx} OR 
            c.degree ILIKE $${paramIdx} OR 
            c.overview ILIKE $${paramIdx} OR
            EXISTS (SELECT 1 FROM courses crs WHERE crs.college_id = c.id AND (crs.name ILIKE $${paramIdx} OR crs.degree ILIKE $${paramIdx}))
          )`);
          paramIdx++;
        }

        if (city && city !== 'All') {
          const cities = Array.isArray(city) ? city : [city];
          params.push(cities);
          conditions.push(`c.city = ANY($${paramIdx})`);
          paramIdx++;
        }

        if (state && state !== 'All') {
          const states = Array.isArray(state) ? state : [state];
          params.push(states);
          conditions.push(`c.state = ANY($${paramIdx})`);
          paramIdx++;
        }

        if (degree && degree !== 'All') {
          const degrees = Array.isArray(degree) ? degree : [degree];
          const degPatterns = degrees.map(d => `%${d}%`);
          params.push(degPatterns);
          conditions.push(`(
            c.degree ILIKE ANY($${paramIdx}) OR
            EXISTS (SELECT 1 FROM courses crs WHERE crs.college_id = c.id AND crs.degree ILIKE ANY($${paramIdx}))
          )`);
          paramIdx++;
        }

        if (min_fee) {
          params.push(parseInt(min_fee, 10));
          conditions.push(`c.annual_fees >= $${paramIdx}`);
          paramIdx++;
        }

        if (max_fee) {
          params.push(parseInt(max_fee, 10));
          conditions.push(`c.annual_fees <= $${paramIdx}`);
          paramIdx++;
        }

        if (min_rating) {
          params.push(parseFloat(min_rating));
          conditions.push(`c.rating >= $${paramIdx}`);
          paramIdx++;
        }

        let orderByClause = 'ORDER BY c.rating DESC, c.nirf_rank ASC';
        if (sort === 'rating_desc') {
          orderByClause = 'ORDER BY c.rating DESC, c.review_count DESC';
        } else if (sort === 'fees_asc') {
          orderByClause = 'ORDER BY c.annual_fees ASC';
        } else if (sort === 'fees_desc') {
          orderByClause = 'ORDER BY c.annual_fees DESC';
        } else if (sort === 'rank_asc') {
          orderByClause = 'ORDER BY COALESCE(c.nirf_rank, 999) ASC';
        } else if (sort === 'avg_package_desc') {
          orderByClause = 'ORDER BY (SELECT p.avg_ctc_lpa FROM placements p WHERE p.college_id = c.id LIMIT 1) DESC NULLS LAST';
        }

        const pageNum = Math.max(1, parseInt(page || '1', 10));
        const limitNum = Math.max(1, parseInt(limit || '10', 10));
        const offset = (pageNum - 1) * limitNum;

        const whereSql = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

        const sql = `
          SELECT 
            c.*,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cr.id,
                'name', cr.name,
                'degree', cr.degree,
                'duration_years', cr.duration_years,
                'annual_fees', cr.annual_fees,
                'total_seats', cr.total_seats
              ))
              FROM courses cr WHERE cr.college_id = c.id
            ), '[]'::json) AS courses,
            (
              SELECT json_build_object(
                'year', p.year,
                'highest_ctc_lpa', p.highest_ctc_lpa,
                'avg_ctc_lpa', p.avg_ctc_lpa,
                'median_ctc_lpa', p.median_ctc_lpa,
                'placement_rate', p.placement_rate,
                'top_recruiters', p.top_recruiters
              )
              FROM placements p WHERE p.college_id = c.id LIMIT 1
            ) AS placement,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cu.id,
                'exam_name', cu.exam_name,
                'branch_name', cu.branch_name,
                'closing_rank', cu.closing_rank,
                'category', cu.category
              ))
              FROM cutoffs cu WHERE cu.college_id = c.id
            ), '[]'::json) AS cutoffs,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', r.id,
                'author_name', r.author_name,
                'rating', r.rating,
                'headline', r.headline,
                'comment', r.comment,
                'verified', r.verified,
                'created_at', r.created_at
              ) ORDER BY r.created_at DESC)
              FROM reviews r WHERE r.college_id = c.id
            ), '[]'::json) AS reviews,
            COUNT(*) OVER() AS full_count
          FROM colleges c
          ${whereSql}
          ${orderByClause}
          LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
        `;

        params.push(limitNum, offset);

        const result = await pool.query(sql, params);
        const total = result.rows.length > 0 ? parseInt(result.rows[0].full_count, 10) : 0;
        const totalPages = Math.max(1, Math.ceil(total / limitNum));

        return {
          data: result.rows.map(r => {
            const { full_count, ...cleanCollege } = r;
            return cleanCollege;
          }),
          pagination: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages,
          },
        };
      } catch (err) {
        console.error('[PostgreSQL getColleges Error, falling back to memory store]:', err.message);
      }
    }

    // In-memory fallback
    let results = [...memoryStore.colleges];

    if (q && q.trim() !== '') {
      const query = q.trim().toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query) ||
        c.overview.toLowerCase().includes(query) ||
        (c.degree && c.degree.toLowerCase().includes(query)) ||
        c.courses.some(crs => crs.name.toLowerCase().includes(query) || crs.degree.toLowerCase().includes(query))
      );
    }

    if (city && city !== 'All') {
      const cities = Array.isArray(city) ? city : [city];
      results = results.filter(c => cities.map(ct => ct.toLowerCase()).includes(c.city.toLowerCase()));
    }

    if (state && state !== 'All') {
      const states = Array.isArray(state) ? state : [state];
      results = results.filter(c => states.map(st => st.toLowerCase()).includes(c.state.toLowerCase()));
    }

    if (degree && degree !== 'All') {
      const degrees = Array.isArray(degree) ? degree : [degree];
      results = results.filter(c =>
        (c.degree && degrees.some(d => c.degree.toLowerCase().includes(d.toLowerCase()))) ||
        c.courses.some(crs => degrees.some(d => crs.degree.toLowerCase().includes(d.toLowerCase())))
      );
    }

    if (min_rating) {
      const minRat = parseFloat(min_rating);
      results = results.filter(c => (c.rating || 0) >= minRat);
    }

    if (min_fee) {
      results = results.filter(c => c.annual_fees >= parseInt(min_fee, 10));
    }
    if (max_fee) {
      results = results.filter(c => c.annual_fees <= parseInt(max_fee, 10));
    }

    if (sort === 'rating_desc') {
      results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'fees_asc') {
      results.sort((a, b) => a.annual_fees - b.annual_fees);
    } else if (sort === 'fees_desc') {
      results.sort((a, b) => b.annual_fees - a.annual_fees);
    } else if (sort === 'rank_asc') {
      results.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
    } else if (sort === 'avg_package_desc') {
      results.sort((a, b) => (b.placement?.avg_ctc_lpa || 0) - (a.placement?.avg_ctc_lpa || 0));
    }

    const total = results.length;
    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.max(1, parseInt(limit || '10', 10));
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = results.slice(startIndex, startIndex + limitNum);

    return {
      data: paginatedItems,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.max(1, Math.ceil(total / limitNum)),
      },
    };
  },

  // 2. GET /api/colleges/:identifier (by numeric id or string slug)
  async getCollegeBySlugOrId(identifier) {
    if (isPostgresConnected && pool) {
      try {
        const isNum = !isNaN(identifier);
        const sql = `
          SELECT 
            c.*,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cr.id,
                'name', cr.name,
                'degree', cr.degree,
                'duration_years', cr.duration_years,
                'annual_fees', cr.annual_fees,
                'total_seats', cr.total_seats
              ))
              FROM courses cr WHERE cr.college_id = c.id
            ), '[]'::json) AS courses,
            (
              SELECT json_build_object(
                'year', p.year,
                'highest_ctc_lpa', p.highest_ctc_lpa,
                'avg_ctc_lpa', p.avg_ctc_lpa,
                'median_ctc_lpa', p.median_ctc_lpa,
                'placement_rate', p.placement_rate,
                'top_recruiters', p.top_recruiters
              )
              FROM placements p WHERE p.college_id = c.id LIMIT 1
            ) AS placement,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cu.id,
                'exam_name', cu.exam_name,
                'branch_name', cu.branch_name,
                'closing_rank', cu.closing_rank,
                'category', cu.category
              ))
              FROM cutoffs cu WHERE cu.college_id = c.id
            ), '[]'::json) AS cutoffs,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', r.id,
                'author_name', r.author_name,
                'rating', r.rating,
                'headline', r.headline,
                'comment', r.comment,
                'verified', r.verified,
                'created_at', r.created_at
              ) ORDER BY r.created_at DESC)
              FROM reviews r WHERE r.college_id = c.id
            ), '[]'::json) AS reviews
          FROM colleges c
          WHERE ${isNum ? 'c.id = $1' : 'c.slug = $1'}
          LIMIT 1
        `;

        const res = await pool.query(sql, [isNum ? parseInt(identifier, 10) : identifier]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.error('[PostgreSQL getCollegeBySlugOrId Error]:', err.message);
      }
    }

    const isNum = !isNaN(identifier);
    return memoryStore.colleges.find(c =>
      isNum ? c.id === parseInt(identifier, 10) : c.slug === identifier || c.id.toString() === identifier
    ) || null;
  },

  // 3. GET /api/colleges/compare?ids=1,2,3
  async compareColleges(idsArray) {
    if (isPostgresConnected && pool) {
      try {
        const numIds = idsArray.map(id => parseInt(id, 10)).filter(n => !isNaN(n));
        const strSlugs = idsArray.map(id => id.toString().trim());

        const sql = `
          SELECT 
            c.*,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cr.id,
                'name', cr.name,
                'degree', cr.degree,
                'duration_years', cr.duration_years,
                'annual_fees', cr.annual_fees,
                'total_seats', cr.total_seats
              ))
              FROM courses cr WHERE cr.college_id = c.id
            ), '[]'::json) AS courses,
            (
              SELECT json_build_object(
                'year', p.year,
                'highest_ctc_lpa', p.highest_ctc_lpa,
                'avg_ctc_lpa', p.avg_ctc_lpa,
                'median_ctc_lpa', p.median_ctc_lpa,
                'placement_rate', p.placement_rate,
                'top_recruiters', p.top_recruiters
              )
              FROM placements p WHERE p.college_id = c.id LIMIT 1
            ) AS placement,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', cu.id,
                'exam_name', cu.exam_name,
                'branch_name', cu.branch_name,
                'closing_rank', cu.closing_rank,
                'category', cu.category
              ))
              FROM cutoffs cu WHERE cu.college_id = c.id
            ), '[]'::json) AS cutoffs,
            COALESCE((
              SELECT json_agg(json_build_object(
                'id', r.id,
                'author_name', r.author_name,
                'rating', r.rating,
                'headline', r.headline,
                'comment', r.comment,
                'verified', r.verified,
                'created_at', r.created_at
              ) ORDER BY r.created_at DESC)
              FROM reviews r WHERE r.college_id = c.id
            ), '[]'::json) AS reviews
          FROM colleges c
          WHERE c.id = ANY($1) OR c.slug = ANY($2)
        `;

        const res = await pool.query(sql, [numIds, strSlugs]);
        if (res.rows.length > 0) return res.rows;
      } catch (err) {
        console.error('[PostgreSQL compareColleges Error]:', err.message);
      }
    }

    return memoryStore.colleges.filter(c =>
      idsArray.includes(c.id.toString()) || idsArray.includes(c.slug) || idsArray.includes(c.id)
    );
  },

  // 4. POST /api/predictor
  async predict({ exam, rank, category = 'General' }) {
    if (!exam || !rank) return [];
    const userRank = parseInt(rank, 10);

    if (isPostgresConnected && pool) {
      try {
        const sql = `
          SELECT 
            c.id AS college_id,
            c.name AS college_name,
            c.slug,
            c.city,
            c.state,
            c.rating,
            c.annual_fees,
            c.nirf_rank,
            c.logo_url,
            p.highest_ctc_lpa,
            p.avg_ctc_lpa,
            cu.exam_name,
            cu.branch_name,
            cu.closing_rank,
            cu.category
          FROM cutoffs cu
          JOIN colleges c ON cu.college_id = c.id
          LEFT JOIN placements p ON p.college_id = c.id
          WHERE (cu.exam_name ILIKE $1 OR $1 ILIKE '%' || cu.exam_name || '%')
            AND (cu.category ILIKE $2 OR $2 ILIKE 'General' OR cu.category IS NULL)
        `;

        const examPattern = `%${exam.trim()}%`;
        const res = await pool.query(sql, [examPattern, category.trim()]);

        const predictions = res.rows.map(row => {
          const closingRank = row.closing_rank;
          let chance = 'Reach (Competitive)';
          let chancePercentage = 35;
          let badgeColor = 'red';

          if (userRank <= closingRank * 0.85) {
            chance = 'High Chance (Safe)';
            chancePercentage = 95;
            badgeColor = 'green';
          } else if (userRank <= closingRank * 1.15) {
            chance = 'Medium Chance (Target)';
            chancePercentage = 68;
            badgeColor = 'yellow';
          } else {
            chance = 'Reach (Competitive)';
            chancePercentage = 35;
            badgeColor = 'red';
          }

          return {
            ...row,
            user_rank: userRank,
            chance,
            chancePercentage,
            badgeColor,
          };
        });

        const chancePriority = { 'High Chance (Safe)': 1, 'Medium Chance (Target)': 2, 'Reach (Competitive)': 3 };
        predictions.sort((a, b) => {
          const pDiff = (chancePriority[a.chance] || 3) - (chancePriority[b.chance] || 3);
          if (pDiff !== 0) return pDiff;
          return (b.rating || 0) - (a.rating || 0);
        });

        return predictions;
      } catch (err) {
        console.error('[PostgreSQL predict Error, falling back to memory]:', err.message);
      }
    }

    // In-memory prediction logic
    const predictions = [];
    for (const college of memoryStore.colleges) {
      for (const cutoff of college.cutoffs) {
        const examMatch =
          cutoff.exam_name.toLowerCase() === exam.toLowerCase() ||
          cutoff.exam_name.toLowerCase().includes(exam.toLowerCase()) ||
          exam.toLowerCase().includes(cutoff.exam_name.toLowerCase());

        const categoryMatch =
          !cutoff.category ||
          cutoff.category.toLowerCase() === category.toLowerCase() ||
          category.toLowerCase() === 'general';

        if (examMatch && categoryMatch) {
          const closingRank = cutoff.closing_rank;
          let chance = 'Reach (Competitive)';
          let chancePercentage = 35;
          let badgeColor = 'red';

          if (userRank <= closingRank * 0.85) {
            chance = 'High Chance (Safe)';
            chancePercentage = 95;
            badgeColor = 'green';
          } else if (userRank <= closingRank * 1.15) {
            chance = 'Medium Chance (Target)';
            chancePercentage = 68;
            badgeColor = 'yellow';
          } else {
            chance = 'Reach (Competitive)';
            chancePercentage = 35;
            badgeColor = 'red';
          }

          predictions.push({
            college_id: college.id,
            college_name: college.name,
            slug: college.slug,
            city: college.city,
            state: college.state,
            rating: college.rating,
            annual_fees: college.annual_fees,
            nirf_rank: college.nirf_rank,
            logo_url: college.logo_url,
            highest_ctc_lpa: college.placement?.highest_ctc_lpa,
            avg_ctc_lpa: college.placement?.avg_ctc_lpa,
            exam_name: cutoff.exam_name,
            branch_name: cutoff.branch_name,
            closing_rank: closingRank,
            user_rank: userRank,
            category: cutoff.category || 'General',
            chance,
            chancePercentage,
            badgeColor,
          });
        }
      }
    }

    const chancePriority = { 'High Chance (Safe)': 1, 'Medium Chance (Target)': 2, 'Reach (Competitive)': 3 };
    predictions.sort((a, b) => {
      const pDiff = (chancePriority[a.chance] || 3) - (chancePriority[b.chance] || 3);
      if (pDiff !== 0) return pDiff;
      return (b.rating || 0) - (a.rating || 0);
    });

    return predictions;
  },

  // 5. GET /api/meta/filters
  async getFilterMetadata() {
    if (isPostgresConnected && pool) {
      try {
        const [citiesRes, statesRes, degreesRes, examsRes, feeRes] = await Promise.all([
          pool.query('SELECT DISTINCT city FROM colleges ORDER BY city ASC'),
          pool.query('SELECT DISTINCT state FROM colleges ORDER BY state ASC'),
          pool.query('SELECT DISTINCT degree FROM colleges WHERE degree IS NOT NULL UNION SELECT DISTINCT degree FROM courses ORDER BY degree ASC'),
          pool.query('SELECT DISTINCT exam_name FROM cutoffs ORDER BY exam_name ASC'),
          pool.query('SELECT MIN(annual_fees) AS min_fee, MAX(annual_fees) AS max_fee, COUNT(*) AS total FROM colleges'),
        ]);

        return {
          cities: citiesRes.rows.map(r => r.city),
          states: statesRes.rows.map(r => r.state),
          degrees: degreesRes.rows.map(r => r.degree),
          exams: examsRes.rows.map(r => r.exam_name),
          feeRange: {
            min: parseInt(feeRes.rows[0]?.min_fee || '10000', 10),
            max: parseInt(feeRes.rows[0]?.max_fee || '1500000', 10),
          },
          totalColleges: parseInt(feeRes.rows[0]?.total || '0', 10),
        };
      } catch (err) {
        console.error('[PostgreSQL getFilterMetadata Error]:', err.message);
      }
    }

    const cities = [...new Set(memoryStore.colleges.map(c => c.city))].sort();
    const states = [...new Set(memoryStore.colleges.map(c => c.state))].sort();
    const degrees = [...new Set(
      memoryStore.colleges.flatMap(c => [
        ...(c.degree ? [c.degree] : []),
        ...(c.courses ? c.courses.map(crs => crs.degree) : []),
      ])
    )].sort();
    const exams = [...new Set(
      memoryStore.colleges.flatMap(c => c.cutoffs.map(ct => ct.exam_name))
    )].sort();

    const allFees = memoryStore.colleges.map(c => c.annual_fees);
    const minFee = allFees.length ? Math.min(...allFees) : 10000;
    const maxFee = allFees.length ? Math.max(...allFees) : 1500000;

    return {
      cities,
      states,
      degrees,
      exams,
      feeRange: { min: minFee, max: maxFee },
      totalColleges: memoryStore.colleges.length,
    };
  },

  // 6. POST /api/colleges/:id/reviews
  async addReview(collegeId, { author_name, rating, headline, comment }) {
    const isNum = !isNaN(collegeId);
    let numericCollegeId = isNum ? parseInt(collegeId, 10) : null;

    if (!numericCollegeId) {
      const match = memoryStore.colleges.find(c => c.slug === collegeId || c.id === parseInt(collegeId, 10));
      if (match) numericCollegeId = match.id;
    }

    const newReview = {
      id: memoryStore.nextReviewId++,
      college_id: numericCollegeId || 1,
      author_name: author_name || 'Verified Student',
      rating: parseFloat(rating) || 5.0,
      headline: headline || 'Insightful Campus Experience',
      comment: comment || 'Great academic environment and faculty.',
      verified: true,
      created_at: new Date().toISOString().split('T')[0],
    };

    // Update in memory store
    const memCollege = memoryStore.colleges.find(c => c.id === numericCollegeId || c.slug === collegeId);
    if (memCollege) {
      memCollege.reviews.unshift(newReview);
      memCollege.review_count = (memCollege.review_count || 0) + 1;
      const totalRating = memCollege.reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
      memCollege.rating = parseFloat((totalRating / memCollege.reviews.length).toFixed(1));
    }

    // Persist to PostgreSQL if connected
    if (isPostgresConnected && pool && numericCollegeId) {
      try {
        const ins = await pool.query(
          `INSERT INTO reviews (college_id, author_name, rating, headline, comment, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [numericCollegeId, newReview.author_name, newReview.rating, newReview.headline, newReview.comment, true]
        );

        // Recalculate average rating in PostgreSQL
        const avgRes = await pool.query(
          `SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE college_id = $1`,
          [numericCollegeId]
        );
        const newAvg = parseFloat(avgRes.rows[0].avg_rating).toFixed(1);
        const newCount = parseInt(avgRes.rows[0].count, 10);

        await pool.query(
          `UPDATE colleges SET rating = $1, review_count = $2 WHERE id = $3`,
          [newAvg, newCount, numericCollegeId]
        );

        cachedTableCounts.reviews = (cachedTableCounts.reviews || 0) + 1;
        return ins.rows[0];
      } catch (err) {
        console.warn('[PostgreSQL Review Persist Warning]', err.message);
      }
    }

    return newReview;
  },

  // 7. POST /api/newsletter
  async addNewsletter({ name, email, targetExam }) {
    const subscription = {
      id: memoryStore.nextNewsletterId++,
      name: name || 'Student',
      email: email.trim().toLowerCase(),
      target_exam: targetExam || 'JEE / General',
      created_at: new Date().toISOString(),
    };

    memoryStore.newsletters.push(subscription);

    if (isPostgresConnected && pool) {
      try {
        const ins = await pool.query(
          `INSERT INTO newsletters (name, email, target_exam) VALUES ($1, $2, $3) RETURNING *`,
          [subscription.name, subscription.email, subscription.target_exam]
        );
        cachedTableCounts.newsletters = (cachedTableCounts.newsletters || 0) + 1;
        return ins.rows[0];
      } catch (err) {
        console.warn('[PostgreSQL Newsletter Persist Warning]', err.message);
      }
    }

    return subscription;
  },

  // 8. GET /api/status
  async getStatus() {
    let latencyMs = 0;
    if (isPostgresConnected && pool) {
      try {
        const start = Date.now();
        await pool.query('SELECT 1');
        latencyMs = Date.now() - start;
        lastPingTime = new Date().toISOString();
      } catch (err) {
        isPostgresConnected = false;
        dbErrorDetails = err.message;
      }
    }

    const targetHost = poolConfig.connectionString
      ? (poolConfig.connectionString.includes('@') ? poolConfig.connectionString.split('@')[1].split('/')[0] : 'Cloud URL')
      : poolConfig.host;

    return {
      connected: isPostgresConnected,
      mode: isPostgresConnected ? 'postgresql' : 'in-memory (high-performance fallback)',
      host: targetHost,
      database: poolConfig.database || 'api',
      port: poolConfig.port || 5432,
      user: poolConfig.user || 'postgres',
      ssl: !!poolConfig.ssl,
      latencyMs: isPostgresConnected ? `${latencyMs}ms` : null,
      lastPing: lastPingTime || new Date().toISOString(),
      error: dbErrorDetails || null,
      tables: isPostgresConnected ? cachedTableCounts : {
        colleges: memoryStore.colleges.length,
        courses: memoryStore.colleges.reduce((acc, c) => acc + (c.courses?.length || 0), 0),
        placements: memoryStore.colleges.filter(c => c.placement).length,
        cutoffs: memoryStore.colleges.reduce((acc, c) => acc + (c.cutoffs?.length || 0), 0),
        reviews: memoryStore.colleges.reduce((acc, c) => acc + (c.reviews?.length || 0), 0),
        users: memoryStore.users.length,
        newsletters: memoryStore.newsletters.length,
      },
    };
  },

  // Explicit retry connection method
  async reconnect() {
    await initPostgres();
    return this.getStatus();
  },
};

module.exports = db;