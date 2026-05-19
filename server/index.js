const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();

const logRoutes = require('./middleware/logRoutes');
const checkAuthentication = require('./middleware/checkAuthentication');
const authControllers = require('./controllers/authControllers');
const expenseControllers = require('./controllers/expenseControllers');

const app = express();
const PORT = process.env.PORT || 8080;

// ====================================
// Middleware
// ====================================
app.use(logRoutes);
app.use(cookieSession({ name: 'session', keys: [process.env.SESSION_SECRET] }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ====================================
// Auth Routes
// ====================================
app.post('/api/auth/register', authControllers.register);
app.post('/api/auth/login', authControllers.login);
app.get('/api/auth/me', authControllers.getMe);
app.delete('/api/auth/logout', authControllers.logout);

// ====================================
// Expense Routes
// ====================================
app.get('/api/expenses', checkAuthentication, expenseControllers.listExpenses);
app.post('/api/expenses', checkAuthentication, expenseControllers.createExpense);
app.delete('/api/expenses/:id', checkAuthentication, expenseControllers.deleteExpense);

// ====================================
// Global Error Handler
// ====================================
const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};
app.use(handleError);

// ====================================
// Listen
// ====================================
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));