import 'dotenv/config';
import { createExpense, getAllExpenses } from '../src/models/expense.model.js';

const result = await createExpense({
  amount: 15.00,
  categoryId: null,
  description: 'coffee',
  rawText: 'spent fifteen dollars on coffee',
  source: 'manual',
});

const expenses = await getAllExpenses();

console.log('Created:', result);
console.log('All expenses: ', expenses);