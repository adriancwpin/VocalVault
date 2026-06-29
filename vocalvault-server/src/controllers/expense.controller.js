//call get all expense from model and response the request info 

import { getAllExpenses, createExpense, deleteExpense, getExpenseById } from "../models/expense.model.js";
import { parseExpense } from "../parser/expenses.parser.js"

async function createExpenseHandler(req,res){
    try{
        const {amount,categoryId, description, rawText, source} = req.body;

        const newExpense = await createExpense({amount, categoryId, description, rawText, source});
        
        //201 - created successfully
        return res.status(201).json({
            success: true,
            data: newExpense
        });
    }catch (err){
        console.error("Error creating expenses: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Could not create expense."
        });
    }
}

async function getAllExpensesHandler(req, res){
    try{
        //since getAllExpenses model is an async function so the controller has to be await
        //prevent unhandled rejection
        const expenses = await getAllExpenses();

        //success
        return res.status(200).json({
            success: true,
            data: expenses
        });
    } catch(err){
        console.error("Error in get all expenses: ", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Couldn't retrieve expenses."
        });
    }
}

async function deleteExpenseHandler(req, res){
    try{
        const{id} = req.params;
        const dltExpense = await deleteExpense(id);
        if(!dltExpense){
            return res.status(404).json({
                success: false,
                message: "Expense Not Found."
            });
        }
        return res.status(200).json({
            success: true,
            data: dltExpense
        });
    }catch (err){
        console.error("Failed to delete expense: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Couldn't delete expense."
        });
    }
}

async function getExpenseByIdHandler (req, res){
    try{
        const{id} = req.params; //extract the id from the URL
        const byId = await getExpenseById(id); //use that id to query the database
        if(!byId){
            return res.status(404).json({
                success: false,
                message: 'Expense Id not found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: byId
        });
    }catch(err){
        console.error("Fail to find expense by ID: " + err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

async function parseExpensesHandler(req, res){
    try{
        const { text } = req.body;
        const parsed = await parseExpense(text);
        return res.status(200).json({
            success : true,
            data: parsed
        });
    }catch(err){
        console.error("Error parsing expense: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error. Could not parse expense."
        });
    }
}
export { getAllExpensesHandler, createExpenseHandler, deleteExpenseHandler, getExpenseByIdHandler, parseExpensesHandler };