import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes";
import chatRoutes from "./routes/chat.routes"


const app = express();


app.use(cors({
    origin: process.env.FRONTEND_URL
}))

//middle ware to parse the incoming json request
app.use(express.json());

app.use('/api',healthRoutes);
app.use('/api',chatRoutes);


app.get('/',(_req,res)=>{
    res.send(`ai chat backend is running ${process.env.FRONTEND_URL}`)
})

export default app;