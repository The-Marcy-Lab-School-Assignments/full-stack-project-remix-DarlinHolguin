const pool = require('../db/pool');

// Returns all expenses for a specific user, sorted by newest first
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Creates a new expense. Returns the newly created expense object
module.exports.create = async (title, amount, category, note, user_id) => {
  const query = `
    INSERT INTO expenses (title, amount, category, note, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
  const { rows } = await pool.query(query, [title, Number(amount), category, note, user_id]);
  return rows[0];
};

// Finds a single expense by ID — used for ownership checks before delete
module.exports.find = async (id) => {
  const query = 'SELECT * FROM expenses WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
};

// Deletes an expense by ID. Returns the deleted expense object
module.exports.destroy = async (id) => {
  const query = 'DELETE FROM expenses WHERE id = $1 RETURNING *';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};