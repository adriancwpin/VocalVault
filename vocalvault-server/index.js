//bring in the tools we need to build the app
//set the basic rules about our app
//tell where is our expense route live
//add a simple health-check route
//start the server listening
import 'dotenv/config';
import express from 'express';
import cors from 'cors'; //allows the frontend to talk to the backend without browser blocking it
import expensesRouter from './src/routes/expense.route.js';
import categoryRouter from './src/routes/category.route.js';
import settingRouter from './src/routes/settings.route.js';

const app = express(); //creates server application
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/settings', settingRouter);

app.get('/api/health', (req,res) => {
    res.json({status: 'ok'});
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});