import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import taskRouter from './routes/taskRoute.js';



const app = express();
const port = process.env.PORT || 4010;


//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));

//DB Connection
connectDB();


//Routes
app.use('/api/users', userRouter)
app.use('/api/tasks', taskRouter)



app.get('/',(req, res)=>{
    res.send("Api is running ")
})
app.listen(port,()=>{
    console.log(`server started on http://localhost:${port}`);
})
