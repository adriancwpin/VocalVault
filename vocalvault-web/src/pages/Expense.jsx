import "./Expense.css";

function Expense() {
  const expenses = [
    { id: 1, description: "Coffee", amount: 3.50, category: "Food/Drink", date: "2026-07-04", source: "voice" },
    { id: 2, description: "Bus fare", amount: 2.80, category: "Transport", date: "2026-07-04", source: "manual" },
    { id: 3, description: "Netflix", amount: 12.99, category: "Entertainment", date: "2026-07-01", source: "manual" },
    { id: 4, description: "Groceries", amount: 34.20, category: "Food/Drink", date: "2026-06-30", source: "voice" },
  ];

  return (
    <div className="expense-page">
      <div className="page-header">
        <h1 className="page-title">Expenses</h1>
        <button className="add-button">+ Add Expense</button>
      </div>

      <div className="card">
        <table className="expense-table full-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Source</th>
              <th className="col-amount">Amount</th>
              <th className="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="expense-row">
                <td>{expense.description}</td>
                <td className="cell-muted">{expense.category}</td>
                <td className="cell-muted">{expense.date}</td>
                <td>
                  <span className={`source-badge ${expense.source}`}>{expense.source}</span>
                </td>
                <td className="expense-amount">£{expense.amount.toFixed(2)}</td>
                <td className="row-actions">
                  <button className="text-button">Edit</button>
                  <button className="text-button danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expense;