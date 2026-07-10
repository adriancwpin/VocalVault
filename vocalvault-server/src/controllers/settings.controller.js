import { getSettings, updateSettings } from "../models/settings.model.js";

async function getSettingsHandler(req,res){
    try{
        const settings = await getSettings();
        return res.status(200).json({
            success: true,
            data: settings,
        });
    } catch(error){
        console.error("Failed to get setting: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

async function updateSettingsHandler(req, res){
    try{
        const {monthly_budget, default_category_id} = req.body;
        if(monthly_budget !== undefined && monthly_budget <= 0){
            return res.status(400).json({
                success: false,
                message: "Monthly Budget must be greater than 0",
            });
        }
        
        const updated = await updateSettings({ monthly_budget, default_category_id });

        return res.status(200).json({
            success: true,
            data: updated,
        });
    }catch(error){
        console.error("Failed to update settings: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
        });
    }
}

export { getSettingsHandler, updateSettingsHandler };