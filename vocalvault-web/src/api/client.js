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