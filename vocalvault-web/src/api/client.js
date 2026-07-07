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

export async function editExpense(id){
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