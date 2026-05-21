import { deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.id);
    if (error) return console.error(error);
    loadExpenses();
  };

  return (
    <li className="expense-item">
      <div className="expense-info">
        <span className="expense-title">{expense.title}</span>
        <span className="expense-category">{expense.category}</span>
        {expense.note && <span className="expense-note">{expense.note}</span>}
      </div>
      <div className="expense-right">
        <span className="expense-amount">${expense.amount}</span>
        <button className="delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </li>
  );
}

export default ExpenseItem;