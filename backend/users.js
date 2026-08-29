const db = require('./database');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getUsers = async (request, response) => {
  try {
    const results = await db.query('SELECT * FROM users ORDER BY id ASC');
    return response.status(200).json(results.rows);
  } catch (error) {
    console.error('Error in getUsers:', error);
    return response.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID provided' });
  }

  try {
    const results = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (results.rows.length === 0) {
      return response.status(404).json({ error: `User with ID ${id} not found` });
    }
    return response.status(200).json(results.rows[0]);
  } catch (error) {
    console.error(`Error in getUserById (${id}):`, error);
    return response.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

const createUser = async (request, response) => {
  const { name, email } = request.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return response.status(400).json({ error: 'Valid name is required' });
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    return response.status(400).json({ error: 'Valid email address is required' });
  }

  try {
    const results = await db.query(
      'INSERT INTO users(name, email) VALUES($1, $2) RETURNING *',
      [name.trim(), email.trim().toLowerCase()]
    );
    const createdUser = results.rows[0];
    return response.status(201).json({
      message: 'User added successfully',
      data: createdUser,
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    return response.status(500).json({ error: 'Failed to create user', details: error.message });
  }
};

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID provided' });
  }

  const { name, email } = request.body || {};

  if (!name && !email) {
    return response.status(400).json({ error: 'At least name or email must be provided to update' });
  }

  if (email && !emailRegex.test(email.trim())) {
    return response.status(400).json({ error: 'Valid email address is required' });
  }

  try {
    // Check if user exists first
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return response.status(404).json({ error: `User with ID ${id} not found` });
    }

    const updatedName = name !== undefined && name.trim() ? name.trim() : existing.rows[0].name;
    const updatedEmail = email !== undefined && email.trim() ? email.trim().toLowerCase() : existing.rows[0].email;

    const results = await db.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [updatedName, updatedEmail, id]
    );

    return response.status(200).json({
      message: `User updated successfully`,
      data: results.rows[0],
    });
  } catch (error) {
    console.error(`Error in updateUser (${id}):`, error);
    return response.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id, 10);
  if (isNaN(id)) {
    return response.status(400).json({ error: 'Invalid user ID provided' });
  }

  try {
    const results = await db.query('DELETE FROM users WHERE id = $1', [id]);
    if (results.rowCount === 0) {
      return response.status(404).json({ error: `User with ID ${id} not found` });
    }

    return response.status(200).json({
      message: `User deleted with ID: ${id}`,
      id: id,
    });
  } catch (error) {
    console.error(`Error in deleteUser (${id}):`, error);
    return response.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

const getStatus = (request, response) => {
  const status = db.getStatus();
  return response.status(200).json({
    status: 'ok',
    database: status,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getStatus,
};