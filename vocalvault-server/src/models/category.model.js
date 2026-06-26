import pool from '../db/connection.js';

//send data to the database
async function createCategory({name, keywords = []}){ //if keyword not provided then []
    const result = await pool.query(
        'INSERT INTO categories (name, keywords) VALUES ($1, $2) RETURNING *',
        [name, keywords]
    );

    return result.rows[0];
}

//fetch all data from the categories database
async function getAllCategories(){
    const result = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
    return result.rows;
}

//delete category
async function deleteCategory(id){
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
}

//get data only from one category
async function getCategoryById(id){
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0];
}
export { createCategory, getAllCategories, deleteCategory, getCategoryById };