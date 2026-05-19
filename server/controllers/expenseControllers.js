const expenseModel = require('../models/expenseModel');

// ====================================
// Expense Controllers
// ====================================

// Returns all expenses belonging to the logged-in user
module.exports.listExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseModel.listByUser(req.session.user_id);
    res.send(expenses);
  } catch (err) {
    next(err);
  }
};

// Creates a new expense for the logged-in user
module.exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, note } = req.body;
    if (!title || !amount || !category) {
      return res.status(400).send({ error: 'Title, amount, and category are required.' });
    }
    const expense = await expenseModel.create(title, amount, category, note, req.session.user_id);
    res.status(201).send(expense);
  } catch (err) {
    next(err);
  }
};

// Deletes an expense — only if it belongs to the logged-in user
module.exports.deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await expenseModel.find(id);
    if (!expense) return res.status(404).send({ error: 'Expense not found.' });
    if (expense.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const deleted = await expenseModel.destroy(id);
    res.send(deleted);
  } catch (err) {
    next(err);
  }
};