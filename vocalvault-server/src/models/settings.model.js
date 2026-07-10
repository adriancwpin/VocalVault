import pool from '../db/connection.js';

async function getSettings(){
    const result = await pool.query(
        'SELECT * FROM settings WHERE id = 1'
    );

    return result.rows[0];
}

async function updateSettings({monthly_budget, default_category_id}){
    const result = await pool.query(
        'UPDATE settings SET monthly_budget = COALESCE($1, monthly_budget), default_category_id = COALESCE($2, default_category_id) WHERE id = 1 RETURNING *',
        [monthly_budget, default_category_id]
    );

    return result.rows[0];

}

export { getSettings, updateSettings };