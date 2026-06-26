// expense.model.js
// Handles all database queries related to expenses.
// Takes in plain JS data, runs an SQL query using pool.query,
// and returns the result back to whoever called it.

import pool from '../db/connection.js';

async function createExpense({ amount, categoryId, description, rawText, source }) {
  const result = await pool.query(
    'INSERT INTO expenses (amount, category_id, description, raw_text, source) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [amount, categoryId, description, rawText, source]
  );
  return result.rows[0];
}

export { createExpense };