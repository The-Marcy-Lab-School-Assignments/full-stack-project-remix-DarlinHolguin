const bcrypt = require('bcrypt');
const pool = require('../db/pool');

const SALT_ROUNDS = 8;

// ====================================
// User Model Logic
// ====================================

// Creates a new user in the database. Returns { id, username }
module.exports.create = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const query = `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    RETURNING id, username`;
  const { rows } = await pool.query(query, [username, hashedPassword]);
  return rows[0];
};

// Returns { id, username } or null — used to check if a username is taken
module.exports.findByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(query, [username]);
  return rows[0];
};

// Verifies a password against the stored hash. Returns { id, username } if
// valid, or null if the username doesn't exist or the password is wrong.
module.exports.validatePassword = async (username, password) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const { rows } = await pool.query(query, [username]);
  const user = rows[0];
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;
  return { id: user.id, username: user.username };
};

// Returns a user by ID — used for session rehydration in /api/auth/me
module.exports.findById = async (id) => {
  const query = 'SELECT id, username FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};