import "./Category.css";
import { useState } from "react";

function Category() {
  const [newKeywords, setNewKeywords] = useState({});
  const [categories, setCategories] = useState([
    { id: 1, name: "Food/Drink", keywords: ["coffee", "lunch", "groceries", "restaurant"], count: 12},
    { id: 2, name: "Transport", keywords: ["bus", "train", "taxi", "fuel"], count:5 },
    { id: 3, name: "Shopping", keywords: ["clothes", "amazon", "shoes"], count: 4 },
    { id: 4, name: "Bills", keywords: ["rent", "electricity", "water", "internet"], count: 4 },
    { id: 5, name: "Entertainment", keywords: ["netflix", "cinema", "spotify", "games"], count: 4 },
  ]);

  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  function handleAddKeyword(categoryId){
    const keywordToAdd =  newKeywords[categoryId];
    if(!keywordToAdd) return;

    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {...category, keywords: [...category.keywords, keywordToAdd]}
          : category
      )
    );

    setNewKeywords({...newKeywords, [categoryId]: ""}) /* clear inputs after adding*/
  }

  function handleDeleteClick(categoryId){
    setConfirmingDeleteId(categoryId);
  }

  function confirmDelete(categoryId){ /*Set everything aside the one that is being deleted */
    setCategories(categories.filter((category) => category.id !== categoryId));
    setConfirmingDeleteId(null);
  }

  function cancelDelete(){
    setConfirmingDeleteId(null);
  }

  return (
    <div className="category-page">
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="add-button">+ Add Category</button>
      </div>

      <div className="category-list">
        {categories.map((category) => (
          <div key={category.id} className="card category-card">
            <div className="category-card-header">
              <h2 className="category-name">
                {category.name} <span className="category-count">({category.count} expenses)</span></h2>
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
                    Delete this category and its {category.count} expenses?
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
                <span key={keyword} className="keyword-chip">{keyword}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


export default Category;