import "./Expense.css";
import { useState, useEffect } from "react";
import { getExpenses, getCategories, deleteExpense} from "../api/client.js";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);

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

  async function handleDelete(id){
      try{
        await deleteExpense(id);
        setExpenses(expenses.filter((expense) => expense.id !== id));
      } catch(error){
        console.error(error);
      }
    }

  const categoryNames = {};
  categories.forEach((c) => { categoryNames[c.id] = c.name; });

  
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
                <td className="cell-muted">{categoryNames[expense.category_id] || "Uncategorized"}</td>
                <td className="cell-muted">{new Date(expense.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`source-badge ${expense.source}`}>{expense.source}</span>
                </td>
                <td className="expense-amount">£{Number(expense.amount).toFixed(2)}</td>
                <td className="row-actions">
                  <button className="text-button">Edit</button>
                  <button className="text-button danger" onClick={() => handleDelete(expense.id)}>Delete</button>
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