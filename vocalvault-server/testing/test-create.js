import 'dotenv/config';
import { createExpense, getAllExpenses, deleteExpense, getExpenseById } from '../src/models/expense.model.js';

const result = await createExpense({
  amount: 15.00,
  categoryId: null,
  description: 'coffee',
  rawText: 'spent fifteen dollars on coffee',
  source: 'manual',
});

const expenses = await getAllExpenses();

const id = await getExpenseById(3);

const deleted = await deleteExpense(2);




console.log('Created:', result);
console.log("");
console.log('Deleted: ', deleted);
console.log("");
console.log('All expenses: ', expenses);
console.log('Expense: ', id);
