//map the URL and HTTP method to the controller 
import express from 'express' ;
import { getAllExpensesHandler, createExpenseHandler, deleteExpenseHandler, getExpenseByIdHandler, updateExpenseHandler} from '../controllers/expense.controller.js';
import { parseExpensesHandler } from '../controllers/expense.controller.js';

const router = express.Router(); //creates a self contained set of routes

router.post('/', createExpenseHandler);
router.get('/' , getAllExpensesHandler); // -> GET/api/expenses
router.delete('/:id', deleteExpenseHandler);
router.get('/:id', getExpenseByIdHandler);
router.put('/:id', updateExpenseHandler);
router.post('/parse', parseExpensesHandler);

export default router;
