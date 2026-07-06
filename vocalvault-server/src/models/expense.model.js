// expense.model.js
// Handles all database queries related to expenses.
// Takes in plain JS data, runs an SQL query using pool.query,
// and returns the result back to whoever called it.
import 'dotenv/config'; 
import pool from '../db/connection.js';
import { config } from 'dotenv';

//send data to the database
async function createExpense({ amount, categoryId, description, rawText, source }) {
  const result = await pool.query(
    'INSERT INTO expenses (amount, category_id, description, raw_text, source) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [amount, categoryId, description, rawText, source]
  );
  return result.rows[0];
}

//fetch all expenses from the database
async function getAllExpenses(){
  const result = await pool.query('SELECT * FROM expenses ORDER BY created_at DESC');
  return result.rows;
}

//fetch only one expense from the database
async function getExpenseById(id){
  const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
  return result.rows[0];
}

//delete expenses from the database 
//to find a way to delete, we have to go through the id
async function deleteExpense(id){
  const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
}

//update expense
async function updateExpense(id, { amount, categoryId, description, createdAt }){
  const result = await pool.query(
    `UPDATE expenses
     SET amount = COALESCE($1, amount),
         category_id = COALESCE($2, category_id),
         description = COALESCE($3, description),
         created_at = COALESCE($4, created_at)
     WHERE id = $5
     RETURNING *`,
    [amount, categoryId, description, createdAt, id]
  );
  return result.rows[0];
}
export { createExpense, getAllExpenses, getExpenseById, deleteExpense, updateExpense };