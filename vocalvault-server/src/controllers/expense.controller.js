//call get all expense from model and response the request info 

import { getAllExpenses, createExpense } from "../models/expense.model.js";

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

export { getAllExpensesHandler, createExpenseHandler };