import "./Dashboard.css";
import { useState, useEffect, useRef } from "react";
import { getExpenses, getCategories, parseExpense } from "../api/client.js";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const isSpeechSupported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const [parsed, setParsed] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-GB";

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleParse(text);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  function handleRecordClick() {
    if(!isSpeechSupported){
      alert("Speech recognition is not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setIsRecording(true);
      recognitionRef.current.start();
    }
  }

  async function handleParse(text){
    try{
      const result = await parseExpense(text);
      setParsed(result.data);
    }catch(error){
      console.error(error);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getExpenses();
        const result_categories = await getCategories();
        setExpenses(result.data);
        setCategories(result_categories.data);
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);

  const monthlyBudget = 1000;   // stays hardcoded until Settings is wired to the backend
  const totalSpent = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );
  const recentExpenses = expenses.slice(0, 3);
  const percentUsed = Math.round((totalSpent / monthlyBudget) * 100);
  const spendingByCategory = {};
  expenses.forEach((expense) => {
    if (expense.category_id) {
      spendingByCategory[expense.category_id] =
        (spendingByCategory[expense.category_id] || 0) + Number(expense.amount);
    }
  });
  const categoryNames = {};
  categories.forEach((c) => { categoryNames[c.id] = c.name; });
  const categorySpending = Object.entries(spendingByCategory).map(([id, amount]) => ({
    id,
    name: categoryNames[id] || "Unknown",
    amount,
  }));
  const maxAmount = Math.max(...categorySpending.map((c) => c.amount), 1);


  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="dashboard-grid">
        {/* LEFT: Capture Hub */}
        <div className="capture-hub card">
          <div className="capture-hub-top">
            <button 
              className={`record-button ${isRecording ? "recording" : ""}`}
              aria-label="Tap to record an expense" 
              onClick={handleRecordClick}
              disabled={!isSpeechSupported}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M19 11a7 7 0 0 1-14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <p className="capture-label">Tap to Record</p>
          </div>
          <div className="capture-hub-bottom">
            <p className="transcript-placeholder">
              {transcript || "Your spoken transcript will appear here once you start recording."}
            </p>
             {parsed && <pre>{JSON.stringify(parsed, null, 2)}</pre>}

             {/* TEMPORARY — remove once mic testing works */}
            <input
              type="text"
              placeholder="Type a test transcript..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setTranscript(e.target.value);
                  handleParse(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT: Ledger */}
        <div className="ledger-column">
          <div className="budget-summary card">
            <p className="budget-figure">£{totalSpent.toFixed(2)}</p>
            <p className="budget-label">spent of £{monthlyBudget} this month</p>
            <span className="budget-pill">{percentUsed}% used</span>
          </div>
          <div className="category-spending card">
            <h2 className="ledger-title">Spending by Category</h2>
            <div className="category-table">
              {categorySpending.map((category) => (
                <div key={category.id} className="category-row">
                  <span className="category-name">{category.name}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${(category.amount / maxAmount) * 100}%` }}
                    ></div>
                  </div>
                  <span className="category-amount">£{category.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="expense-ledger card">
            <h2 className="ledger-title">Recent Expenses</h2>
            <table className="expense-table">
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id} className="expense-row">
                    <td className="expense-name">
                      {expense.description}
                      <span className="expense-category"> • {categoryNames[expense.category_id] || "Uncategorized"}</span>
                    </td>
                    <td className="expense-amount">£{Number(expense.amount).toFixed(2)}</td>
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