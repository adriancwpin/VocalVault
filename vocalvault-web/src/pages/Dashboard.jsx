import "./Dashboard.css";
import { useState, useEffect, useRef } from "react";
import { getExpenses, getCategories, parseExpense, createExpense, getSettings } from "../api/client.js";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const isSpeechSupported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  const [parsed, setParsed] = useState(null);

  //editable draft field
  const [draftAmount, setDraftAmount] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftCategory, setDraftCategory] = useState("");

  const [monthlyBudget, setMonthlyBudget] = useState(1000);

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
    if (!isSpeechSupported) {
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

  useEffect(() => {
    async function loadData() {
      try {
        const result = await getExpenses();
        const result_categories = await getCategories();
        const result_settings = await getSettings();
        setExpenses(result.data);
        setCategories(result_categories.data);
        setMonthlyBudget(Number(result_settings.data.monthly_budget));
      } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);

  async function handleParse(text) {
    try {
      const result = await parseExpense(text);
      setParsed(result.data);
      if (result.data) {
        setDraftAmount(result.data.amount !== null && result.data.amount !== undefined ? String(result.data.amount) : "");
        setDraftDescription(result.data.description ?? "");
        setDraftCategory(result.data.categoryId ?? "");
      } 
    } catch (error) {
      console.error(error);
    }
  }

  async function handleConfirmSave() {
    const amt = Number(draftAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      await createExpense({
        amount: amt,
        category_id: draftCategory ? Number(draftCategory) : null,
        description: draftDescription,
        rawText: transcript,
        source: "voice"
      });
      handleCancelDraft();

      // Refresh list
      const result = await getExpenses();
      const result_categories = await getCategories();
      setExpenses(result.data);
      setCategories(result_categories.data);
    } catch (error) {
      console.error("Failed to save draft expense:", error);
    }
  }

  function handleCancelDraft() {
    setParsed(null);
    setDraftAmount("");
    setDraftDescription("");
    setDraftCategory("");
  }


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
            {parsed && (
              <div className="draft-card">
                <h3 className="ledger-title">Confirm expense</h3>
                <label className="setting-label">Amount (£)</label>
                <input
                  type="number"
                  className="setting-input"
                  value={draftAmount}
                  onChange={(e) => setDraftAmount(e.target.value)}
                />

                <label className="setting-label">Description</label>
                <input
                  type="text"
                  className="setting-input"
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                />

                <label className="setting-label">Category</label>
                <select
                  className="setting-input"
                  value={draftCategory || ""}
                  onChange={(e) => setDraftCategory(e.target.value)}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <div className="draft-actions">
                  <button className="save-button" onClick={handleConfirmSave}>Confirm</button>
                  <button className="text-button" onClick={handleCancelDraft}>Cancel</button>
                </div>
              </div>

            )
            }

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