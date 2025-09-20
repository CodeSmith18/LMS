import express from 'express';
import http from 'http';
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import leadRouter from './routes/leadRoutes.js';
dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);


connectDB()
.then((result)=>{
    console.log(result);
    server.listen(port,()=>{
        console.log(`server is listening in http://localhost:${port}`);
    })
})
.catch((err)=>{
    console.error(err)
})


app.use("/api/users",userRouter);
app.use("/api/leads",leadRouter);

