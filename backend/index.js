<<<<<<< HEAD
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
=======
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("Employee Server is Running!");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> 29dd67af688d594a12840cd70e851aafb240da73
