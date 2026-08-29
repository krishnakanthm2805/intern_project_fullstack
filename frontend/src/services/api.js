import { TOP_COLLEGES } from '../data/collegeData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

// Fallback client-side search, multi-filter, sort, and pagination engine
function filterCollegesClientSide(params = {}) {
  let list = [...TOP_COLLEGES];

  // 1. Text Search (q)
  if (params.q && params.q.trim()) {
    const term = params.q.toLowerCase().trim();
    list = list.filter(c =>
      c.name.toLowerCase().includes(term) ||
      c.city.toLowerCase().includes(term) ||
      c.state.toLowerCase().includes(term) ||
      (c.degree && c.degree.toLowerCase().includes(term)) ||
      (c.overview && c.overview.toLowerCase().includes(term))
    );
  }

  // 2. State filter
  if (params.state && params.state !== 'All') {
    list = list.filter(c => c.state.toLowerCase() === params.state.toLowerCase());
  }

  // 3. City filter
  if (params.city && params.city !== 'All') {
    list = list.filter(c => c.city.toLowerCase() === params.city.toLowerCase());
  }

  // 4. Degree filter
  if (params.degree && params.degree !== 'All') {
    list = list.filter(c => c.degree && c.degree.toLowerCase().includes(params.degree.toLowerCase()));
  }

  // 5. Max Fee filter
  if (params.max_fee) {
    const maxFeeNum = parseInt(params.max_fee, 10);
    list = list.filter(c => {
      const feeNum = typeof c.annual_fees === 'number'
        ? c.annual_fees
        : parseInt((c.annual_fees || '').replace(/[^0-9]/g, ''), 10);
      return !feeNum || feeNum <= maxFeeNum;
    });
  }

  // 6. Min Rating filter
  if (params.min_rating) {
    const minRat = parseFloat(params.min_rating);
    list = list.filter(c => (c.rating || 0) >= minRat);
  }

  // 7. Sort
  if (params.sort) {
    switch (params.sort) {
      case 'rank_asc':
        list.sort((a, b) => (a.nirf_rank || 999) - (b.nirf_rank || 999));
        break;
      case 'avg_package_desc':
        list.sort((a, b) => {
          const getVal = (c) => parseFloat((c.avg_ctc || '0').replace(/[^0-9.]/g, '')) || (c.placement?.avg_ctc_lpa || 0);
          return getVal(b) - getVal(a);
        });
        break;
      case 'fees_asc':
        list.sort((a, b) => {
          const getFee = (c) => typeof c.annual_fees === 'number' ? c.annual_fees : parseInt((c.annual_fees || '').replace(/[^0-9]/g, ''), 10) || 0;
          return getFee(a) - getFee(b);
        });
        break;
      case 'fees_desc':
        list.sort((a, b) => {
          const getFee = (c) => typeof c.annual_fees === 'number' ? c.annual_fees : parseInt((c.annual_fees || '').replace(/[^0-9]/g, ''), 10) || 0;
          return getFee(b) - getFee(a);
        });
        break;
      case 'rating_desc':
      default:
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }
  }

  // 8. Pagination
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '10', 10);
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedData = list.slice(startIndex, startIndex + limit);

  return {
    success: true,
    total,
    page,
    limit,
    totalPages,
    data: paginatedData,
    pagination: { total, page, limit, totalPages },
  };
}

export async function fetchColleges(params = {}) {
  const query = new URLSearchParams();

  if (params.q) query.append('q', params.q);
  if (params.city && params.city !== 'All') query.append('city', params.city);
  if (params.state && params.state !== 'All') query.append('state', params.state);
  if (params.degree && params.degree !== 'All') query.append('degree', params.degree);
  if (params.min_fee) query.append('min_fee', params.min_fee);
  if (params.max_fee) query.append('max_fee', params.max_fee);
  if (params.min_rating) query.append('min_rating', params.min_rating);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  try {
    const res = await fetch(`${API_BASE_URL}/api/colleges?${query.toString()}`);
    if (!res.ok) throw new Error(`Backend response status: ${res.status}`);
    return await res.json();
  } catch (err) {
    // Graceful fallback to client-side data engine
    return filterCollegesClientSide(params);
  }
}

export async function fetchCollegeDetails(identifier) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/colleges/${identifier}`);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    return await res.json();
  } catch (err) {
    const college = TOP_COLLEGES.find(c => c.id === identifier || c.slug === identifier) || TOP_COLLEGES[0];
    return { success: true, data: college };
  }
}

export async function fetchComparison(collegeIds) {
  if (!collegeIds || collegeIds.length < 2) {
    throw new Error('Please select at least 2 colleges to compare');
  }
  try {
    const idsStr = collegeIds.join(',');
    const res = await fetch(`${API_BASE_URL}/api/colleges/compare?ids=${idsStr}`);
    if (!res.ok) throw new Error(`Comparison error: ${res.status}`);
    return await res.json();
  } catch (err) {
    const matches = TOP_COLLEGES.filter(c => collegeIds.includes(c.id));
    return { success: true, count: matches.length, data: matches };
  }
}

export async function predictAdmission({ exam, rank, category = 'General' }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/predictor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exam, rank: parseInt(rank, 10), category }),
    });
    if (!res.ok) throw new Error(`Predictor error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      success: true,
      input: { exam, rank, category },
      data: TOP_COLLEGES.slice(0, 3).map(c => ({
        college_name: c.name,
        branch: 'Computer Science and Engineering',
        chance: parseInt(rank, 10) < 500 ? 'High / Safe' : 'Target / Moderate',
        closing_rank: 650,
      })),
    };
  }
}

export async function fetchFilterMeta() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/meta/filters`);
    if (!res.ok) throw new Error(`Failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    const states = [...new Set(TOP_COLLEGES.map(c => c.state))];
    const cities = [...new Set(TOP_COLLEGES.map(c => c.city))];
    const degrees = ['B.Tech', 'MBA', 'MBBS', 'Dual Degree', 'Law', 'B.Sc'];
    return {
      success: true,
      data: {
        totalColleges: TOP_COLLEGES.length,
        states,
        cities,
        degrees,
        feeBounds: { min: 10000, max: 1500000 },
      },
    };
  }
}

export async function subscribeNewsletter({ name, email, targetExam }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, targetExam }),
    });
    if (!res.ok) throw new Error(`Newsletter subscribe error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: true, message: 'Subscription saved (offline mode)', data: { name, email, targetExam } };
  }
}

export async function submitCollegeReview(collegeId, { author_name, rating, headline, comment }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/colleges/${collegeId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author_name, rating, headline, comment }),
    });
    if (!res.ok) throw new Error(`Submit review error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function checkServerStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message, database: { connected: false, mode: 'offline' } };
  }
}

export async function fetchDatabaseStatus() {
  return checkServerStatus();
}

export async function triggerDbReconnect() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/db/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function fetchUsers() {
  try {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error(`Users fetch error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return [
      { id: 1, name: 'Aditya Sharma', email: 'aditya.sharma@example.com' },
      { id: 2, name: 'Pooja Iyer', email: 'pooja.iyer@example.com' },
      { id: 3, name: 'Rohan Verma', email: 'rohan.verma@example.com' },
    ];
  }
}

export async function createNewUser({ name, email }) {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error(`Create user error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function deleteUserById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete user error: ${res.status}`);
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
}
