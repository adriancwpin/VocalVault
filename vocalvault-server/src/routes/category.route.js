import express from 'express';
import { allCategoriesHandler, categoryByIdHandler, createCategoryHandler, deleteCategoryHandler, updateCategoryHandler } from '../controllers/category.controller.js';

const router = express();

router.post('/', createCategoryHandler);
router.get('/' , allCategoriesHandler); // -> GET/api/category
router.delete('/:id', deleteCategoryHandler);
router.put('/:id',updateCategoryHandler)
router.get('/:id', categoryByIdHandler);

export default router;