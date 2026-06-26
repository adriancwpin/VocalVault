import 'dotenv/config';
import { createExpense } from '../src/models/expense.model.js';

const result = await createExpense({
  amount: 15.00,
  categoryId: null,
  description: 'coffee',
  rawText: 'spent fifteen dollars on coffee',
  source: 'manual',
});

console.log('Created:', result);