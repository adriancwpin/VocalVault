//backend communication 
export async function getExpenses(){
    const response = await fetch ("http://localhost:3000/api/expenses");
    if(!response.ok){
        throw new Error(`Failed to fetch expenses: ${response.status}`);
    }
    return response.json();
}

export async function getCategories(){
    const response = await fetch ("http://localhost:3000/api/categories");
    if(!response.ok){
        throw new Error(`Failed to fetch category: ${response.status}`);
    }
    return response.json();
}

export async function deleteExpense(id){
    const response = await fetch(`http://localhost:3000/api/expenses/${id}`,
        {method: "DELETE",}
    );

    if(!response.ok){
        throw new Error(`Failed to delete expense: ${response.status}`);
    }
    return response.json();
}

export async function editExpense(id, updates){
    const response = await fetch(`http://localhost:3000/api/expenses/${id}`,
        {method: "PUT",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(updates),   /* fetch body must be a string not JS object*/
    });

    if(!response.ok){
        throw new Error(`Failed to update expense: ${response.status}`);
    }
    return response.json();
}

export async function deleteCategory(id){
    const response = await fetch (`http://localhost:3000/api/categories/${id}`,
        {method: "DELETE",
    });

    if(!response.ok){
        throw new Error(`Failed to delete category: ${response.status}`);
    }

    return response.json();
}

export async function updateCategory(id, updates){
    const response = await fetch (`http://localhost:3000/api/categories/${id}`,
        {method: "PUT",
         headers: {"Content-Type": "application/json"},
         body: JSON.stringify(updates),
    });

    if(!response.ok){
        throw new Error(`Failed to update category: ${response.status}`);
    }

    return response.json();
}

export async function createCategory(category){
    const response = await fetch ("http://localhost:3000/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(category),
    });

    if(!response.ok){
        throw new Error(`Failed to create category: ${response.status} `);
    }

    return response.json();
}

/*Send the parse msg to the backend*/
export async function parseExpense(text){
    const response = await fetch("http://localhost:3000/api/expenses/parse", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text}),
    });

    if(!response.ok){
        throw new Error(`Failed to parse expense: ${response.status}`);
    }
    
    return response.json();
}

export async function createExpense(expenseData){
    const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(expenseData),
    });

    if(!response.ok){
        throw new Error(`Failed to create expense: ${response.status}`);
    }

    return response.json();
}

export async function getSettings() {
  const response = await fetch("http://localhost:3000/api/settings");
  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.status}`);
  }
  return response.json();
}

export async function updateSettings(updates) {
  const response = await fetch("http://localhost:3000/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error(`Failed to update settings: ${response.status}`);
  }
  return response.json();
}

