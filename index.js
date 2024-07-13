process.on('uncaughtException',(err)=>{
    console.log('ERROR in code: ', err);
});

import express, { json } from 'express';
import { dbConnection } from './database/dbConnection.js';
import cors from "cors";
import { AppError } from './src/utils/catchError.js';
import { globalError } from './src/utils/globalError.js';
import userRouter from './src/modules/user/user.routers.js';
import taskRouter from './src/modules/task/task.routes.js';
import categoryRouter from './src/modules/category/category.routs.js';

const app = express();
const port =process.env.PORT || 3000;

app.use(json());
app.use(cors());
dbConnection();

app.use('/auth',userRouter);
app.use('/task',taskRouter);
app.use('/category',categoryRouter);

//handel Error Path
app.use('*', (req,res,next)=>{
    next (new AppError (`Route Not Found ${req.originalUrl}`, 404))
});

//handel global error
app.use(globalError);

//handel express error:
process.on('unhandledRejection', (err)=>{
    console.log('ERROR: ', err);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))