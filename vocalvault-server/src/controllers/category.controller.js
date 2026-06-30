import { getAllCategories, getCategoryById, createCategory, deleteCategory, updateCategory } from "../models/category.model.js";

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

async function updateCategoryHandler(req, res){
    try{
        const {id} = req.params;
        const {name, keywords} = req.body;

        if (name !== undefined && name.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Category name cannot be empty."
            });
        }
        const updated = await updateCategory(id, {name,keywords});

        if(!updated){
            return res.status(404).json({
                success: false,
                message: "Category id is not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: updated
        });
    }catch(err){
        console.error("Error updating category: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.Could not update category"
        });
    }
}

export { allCategoriesHandler, categoryByIdHandler, createCategoryHandler, deleteCategoryHandler, updateCategoryHandler};