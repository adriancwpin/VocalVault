import './Dashboard.css';

function Dashboard() {
  {/*small test case */}
  const totalSpent = 123;
  const monthlyBudget = 1000;
  const recentExpenses = [
  { id: 1, description: "Coffee", amount: 3.50, category: "Food/Drink" },
  { id: 2, description: "Bus fare", amount: 2.80, category: "Transport" },
  { id: 3, description: "Netflix", amount: 12.99, category: "Entertainment" },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        <h1>Dashboard</h1>

        {/*Split into two columns left and right */}
        <div className="capture-hub card">
          <div className="capture-hub-top">
            <button className="record-button" aria-label="Tap to record expense">
              <svg width="28" height="28" viewBox='0 0 24 24' fill='none' xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/*budget summary card */}
          <div className="budget-summary card">
            <p className="budget-figure">£{totalSpent}</p>
            <p className="budget-label">spent of £{monthlyBudget} this monthly</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;