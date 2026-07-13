import "./Expense.css";
import { useState, useEffect } from "react";
import { getExpenses, getCategories, deleteExpense, editExpense} from "../api/client.js";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");


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

  function startEdit(expense) {
    setEditingId(expense.id);
    setEditAmount(expense.amount);
    setEditDescription(expense.description);
    setEditCategoryId(expense.category_id || "");
  }

  async function handleDelete(id){
      try{
        await deleteExpense(id);
        setExpenses(expenses.filter((expense) => expense.id !== id));
      } catch(error){
        console.error(error);
      }
    }
  
  async function handleSaveEdit(id) {
    try{
      await editExpense(id, {
        amount: Number(editAmount),
        description: editDescription,
        category_id: editCategoryId || null,
      });
      setExpenses(
        expenses.map((e) => 
          e.id == id
            ? { ...e, amount:editAmount, description: editDescription, category_id: editCategoryId || null}
            : e
        ) 
      );
      setEditingId(null);
    } catch(error){
      console.error(error);
    }
  }

  function cancelEdit(){
    setEditingId(null);
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
                {editingId === expense.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="setting-input"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="setting-input"
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        >
                          <option value="">Uncategorized</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                    </td>
                    <td className="cell-muted">{new Date(expense.created_at).toLocaleDateString()}</td>
                    <td><span className={`source-badge ${expense.source}`}>{expense.source}</span></td>
                    <td className="expense-amount">
                      <input
                        type="number"
                        step="0.01"
                        className="setting-input"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                      />
                    </td>
                    <td className="row-actions">
                      <button className="text-button" onClick={() => handleSaveEdit(expense.id)}>Save</button>
                      <button className="text-button" onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : ( /* else create a new expense*/
                  <>
                    <td>{expense.description}</td>
                    <td className="cell-muted">{categoryNames[expense.category_id] || "Uncategorized"}</td>
                    <td className="cell-muted">{new Date(expense.created_at).toLocaleDateString()}</td>
                    <td><span className={`source-badge ${expense.source}`}>{expense.source}</span></td>
                    <td className="expense-amount">£{Number(expense.amount).toFixed(2)}</td>
                    <td className="row-actions">
                      <button className="text-button" onClick={() => startEdit(expense)}>Edit</button>
                      <button className="text-button danger" onClick={() => handleDelete(expense.id)}>Delete</button>
                    </td>
                  </>
                ) }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expense;