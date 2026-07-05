import "./Category.css";

function Category() {
  const categories = [
    { id: 1, name: "Food/Drink", keywords: ["coffee", "lunch", "groceries", "restaurant"] },
    { id: 2, name: "Transport", keywords: ["bus", "train", "taxi", "fuel"] },
    { id: 3, name: "Shopping", keywords: ["clothes", "amazon", "shoes"] },
    { id: 4, name: "Bills", keywords: ["rent", "electricity", "water", "internet"] },
    { id: 5, name: "Entertainment", keywords: ["netflix", "cinema", "spotify", "games"] },
  ];

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
              <h2 className="category-name">{category.name}</h2>
              <div className="row-actions">
                <button className="text-button">Edit</button>
                <button className="text-button danger">Delete</button>
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