import 'dotenv/config';
import { createCategory, getAllCategories, getCategoryById, deleteCategory } from '../src/models/category.model.js';

const created = await createCategory({ name: 'Food/Drink', keywords: ['coffee', 'lunch', 'restaurant'] });
console.log('Created:', created);

const all = await getAllCategories();
console.log('All categories:', all);

const one = await getCategoryById(created.id);
console.log('Found by id:', one);

const deleted = await deleteCategory(created.id);
console.log('Deleted:', deleted);