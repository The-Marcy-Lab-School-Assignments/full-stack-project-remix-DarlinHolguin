import { useState } from 'react';
import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;

    const { error } = await createExpense({ title, amount, category, note });
    if (error) return console.error(error);

    await loadExpenses();
    setTitle('');
    setAmount('');
    setCategory('');
    setNote('');
  };

  return (
    <form id="add-expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What did you spend on?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Amount ($)"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="">Select Category</option>
        <option value="food">Food</option>
        <option value="restaurants">Restaurants</option>
        <option value="groceries">Groceries</option>
        <option value="video games">Video Games</option>
        <option value="hobbies">Hobbies</option>
        <option value="gifts">Gifts</option>
        <option value="clothing">Clothing</option>
        <option value="subscriptions">Subscriptions</option>
        <option value="transport">Transport</option>
        <option value="other">Other</option>
      </select>
      <input
        type="text"
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default AddExpenseForm;