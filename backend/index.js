import express from'express';
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
    res.send("server start");
})
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log("started");
})