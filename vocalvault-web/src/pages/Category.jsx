import "./Category.css";
import { useState, useEffect } from "react";
import { getCategories, getExpenses, deleteCategory, updateCategory, createCategory } from "../api/client.js";

function Category() {
  const [newKeywords, setNewKeywords] = useState({});
  const [categories, setCategories] = useState([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    async function loadData(){
        try{
          const result = await getCategories();
          const expenseResult = await getExpenses();
          setCategories(result.data);
          setExpenses(expenseResult.data);
        } catch(error){
          console.error(error);
        }
    }
    loadData();
  }, []);

  async function confirmDelete(categoryId){
    try{
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category.id !== categoryId));
      setConfirmingDeleteId(null);
    } catch(error){
      console.error(error);
    }
  }
  async function handleAddKeyword(categoryId){
    const keywordToAdd =  newKeywords[categoryId];
    if(!keywordToAdd) return;

    const category = categories.find((c) => c.id === categoryId);
    const updatedKeywords = [...category.keywords, keywordToAdd];    
    
    try{
      await updateCategory(categoryId, {keywords: updatedKeywords});
      setCategories(
        categories.map((c) => c.id === categoryId ? {...c, keywords: updatedKeywords} : c)
      )
      setNewKeywords({...newKeywords, [categoryId]: ""}); /* clear inputs after adding*/
    } catch(error){
      console.error(error);
    }
  }

  async function handleRemoveKeyword(categoryId, keywordToRemove) {
    const category = categories.find((c) => c.id === categoryId);
    const updatedKeywords = category.keywords.filter((k) => k !== keywordToRemove);

    try {
      await updateCategory(categoryId, { keywords: updatedKeywords });
      setCategories(categories.map((c) => c.id === categoryId ? { ...c, keywords: updatedKeywords } : c));
    } catch (error) {
      console.error(error);
    }
  }
  
  function handleDeleteClick(categoryId){
    setConfirmingDeleteId(categoryId);
  }

  function cancelDelete(){
    setConfirmingDeleteId(null);
  }

  async function handleCreateCategory(){
    if (!newCategoryName.trim()) return;
    
    try{
      const result = await createCategory({name: newCategoryName, keywords: []});
      setCategories([...categories, result.data]);
      setNewCategoryName("");
      setShowAddForm(false);
    }catch(error){
      console.error(error);
    }
  }

  const expenseCount = {};
  expenses.forEach((expense) => {
    if (expense.category_id){
      expenseCount[expense.category_id] = (expenseCount[expense.category_id] || 0) + 1;
    }
  });
  return (
    <div className="category-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        {showAddForm ? (
          <div className="add-category-form">
            <input
              type="text"
              className="setting-input"
              placeholder="Category Name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button className="save-button" onClick={handleCreateCategory}>Add</button>
            <button className="text-button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        ): (
          <button className="add-button" onClick={() => setShowAddForm(true)}>+ Add Category</button>
        )}
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="card category-card">
            <div className="category-card-header">
              <h2 className="category-name">
                {category.name} <span className="category-count">({expenseCount[category.id] || 0} expenses)</span></h2>
              <input 
                type="text"
                className="keyword-input"
                value={newKeywords[category.id] || ""}
                onChange={ (e) => setNewKeywords({ ...newKeywords, [category.id]: e.target.value })}
                placeholder="Add Keyword"  
              />
              <button className="add-keyword-button" onClick={() => handleAddKeyword(category.id)}>Add</button>
              <div className="row-actions">
                <button className="text-button">Edit</button>
                {confirmingDeleteId === category.id ?(
                  <span className="confirm-delete-row">
                    Delete this category and its {expenseCount[category.id] || 0} expenses?
                    <button className="confirm-yes" onClick={() => confirmDelete(category.id)}>Yes, delete</button>
                    <button className="confirm-cancel" onClick={cancelDelete}>Cancel</button>
                  </span>
                ) : (
                  <button className="text-button danger" onClick={() => handleDeleteClick(category.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="keyword-chips">
              {category.keywords.map((keyword) => (
              <span key={keyword} className="keyword-chip">
                {keyword}
                <button
                  className="remove-keyword"
                  onClick={() => handleRemoveKeyword(category.id, keyword)}
                >
                  ×
                </button>
              </span>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Category;