//map the URL and HTTP method to the controller 
import express from 'express' ;
import { getAllExpensesHandler } from '../controllers/expense.controller.js';

const router = express.Router(); //creates a self contained set of routes

router.get('/' , getAllExpensesHandler); // -> GET/api/expenses

export default router;
