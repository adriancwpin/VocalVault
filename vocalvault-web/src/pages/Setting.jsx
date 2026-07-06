import { useState } from "react";
import "./Setting.css";

function Setting() {
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
  const [defaultCategory, setDefaultCategory] = useState("none");

  const categories = ["Food/Drink", "Transport", "Shopping", "Bills", "Entertainment"];

  return (
    <div className="setting-page">
      <h1 className="page-title">Settings</h1>
      <p className="page-subtitle">Preferences for how VocalVault tracks your spending.</p>
    
      <div className="card settings-card">
        <div className="setting-row">
          <label className="setting-label" htmlFor="budget-input">
            Monthly budget (£)
          </label>
          <input
            id="budget-input"
            className="setting-input"
            type="number"
            min="0"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
          />
        </div>

        <div className="setting-row">
          <label className="setting-label" htmlFor="default-category">
            Default category for unmatched voice entries
          </label>
          <select
            id="default-category"
            className="setting-input"
            value={defaultCategory}
            onChange={(e) => setDefaultCategory(e.target.value)}
          >
            <option value="none">None (leave unmatched)</option>
            {categories.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="setting-hint">Applied when a voice entry doesn't match any category keywords.</p>
        </div>

        <button className="save-button">Save</button>
      </div>
    </div>
  );
}

export default Setting;