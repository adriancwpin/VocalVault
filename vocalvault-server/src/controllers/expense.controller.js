//call get all expense from model and response the request info 

import { getAllExpenses } from "../models/expense.model.js";

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

export { getAllExpensesHandler };