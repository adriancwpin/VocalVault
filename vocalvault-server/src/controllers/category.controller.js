import { getAllCategories, getCategoryById, createCategory, deleteCategory } from "../models/category.model.js";

async function allCategoriesHandler(req, res){
    try{
        const categories = await getAllCategories();
        return res.status(200).json({
            success: true,
            data: categories
        });

    }catch(err){
        console.error("Error getting all expenses: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function categoryByIdHandler(req, res){
    try{
        const{id} = req.params;
        const categories = await getCategoryById(id);
        if(!categories){
            return res.status(404).json({
                success: false,
                message: "Categories ID not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: categories
        });
    }catch(err){
        console.error("Error finding category: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function createCategoryHandler(req, res){
    try{
        const {name, keywords} = req.body;
        const category = await createCategory({name, keywords});
        return res.status(201).json({
            success: true,
            data: category
        });
    }catch(err){
        console.error("Error creating category: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function deleteCategoryHandler(req, res){
    try{
        const{id} = req.params;
        const dlt = await deleteCategory(id);
        if(!dlt){
            return res.status(404).json({
                success: false,
                message: "This id is not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: dlt
        });

    }catch(err){
        console.error("Error deleting category: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export { allCategoriesHandler, categoryByIdHandler, createCategoryHandler, deleteCategoryHandler};