import "./Dashboard.css";

function Dashboard() {
  const totalSpent = 123;
  const monthlyBudget = 1000;
  const recentExpenses = [
    { id: 1, description: "Coffee", amount: 3.50, category: "Food/Drink" },
    { id: 2, description: "Bus fare", amount: 2.80, category: "Transport" },
    { id: 3, description: "Netflix", amount: 12.99, category: "Entertainment" },
  ];

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="dashboard-grid">
        {/* LEFT: Capture Hub */}
        <div className="capture-hub card">
          <div className="capture-hub-top">
            <button className="record-button" aria-label="Tap to record an expense">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
            <p className="capture-label">Tap to Record</p>
          </div>
          <div className="capture-hub-bottom">
            <p className="transcript-placeholder">
              Your spoken transcript will appear here once you start recording.
            </p>
          </div>
        </div>

        {/* RIGHT: Ledger */}
        <div className="ledger-column">
          <div className="budget-summary card">
            <p className="budget-figure">£{totalSpent}</p>
            <p className="budget-label">spent of £{monthlyBudget} this month</p>
          </div>

          <div className="expense-ledger card">
            <h2 className="ledger-title">Recent Expenses</h2>
            <table className="expense-table">
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id} className="expense-row">
                    <td className="expense-name">
                      {expense.description}
                      <span className="expense-category"> • {expense.category}</span>
                    </td>
                    <td className="expense-amount">£{expense.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;