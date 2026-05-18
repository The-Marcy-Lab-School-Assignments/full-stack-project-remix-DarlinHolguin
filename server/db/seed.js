const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  console.log("🌱 Seeding database...");

  await pool.query('DROP TABLE IF EXISTS expenses');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE expenses (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      category TEXT NOT NULL,
      note TEXT,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  const hash = await bcrypt.hash('password123', SALT_ROUNDS);
  const { rows: users } = await pool.query(`
    INSERT INTO users (username, password_hash) 
    VALUES ('pocket_tester', $1) 
    RETURNING id, username
  `, [hash]);

  const testUser = users[0];

  await pool.query(`
    INSERT INTO expenses (title, amount, category, note, user_id) VALUES
      ('Grocery Run', 85.50, 'groceries', 'Weekly essentials', $1),
      ('Dinner Date', 45.00, 'restaurants', 'Taco Tuesday', $1),
      ('Steam Sale', 29.99, 'video games', 'Elden Ring', $1)
  `, [testUser.id]);

  console.log(`Seeded ${testUser.username} with sample expenses!`);
};

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding:', err);
    process.exit(1);
  });