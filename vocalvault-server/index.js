import 'dotenv/config';
import pool from './src/db/connection.js';

pool.query('SELECT NOW()')
    .then(result => console.log('DB connected: ', result.rows[0]))
    .catch(err => console.error('DB connection failed:', err));