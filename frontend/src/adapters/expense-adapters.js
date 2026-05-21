const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllExpenses = async () => {
  return handleFetch('/api/expenses');
};

export const createExpense = async (expenseData) => {
  return handleFetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData)
  });
};

export const deleteExpense = async (id) => {
  return handleFetch(`/api/expenses/${id}`, { method: 'DELETE' });
};