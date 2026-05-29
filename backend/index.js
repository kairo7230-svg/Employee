import 'dotenv/config'; // ← ADD THIS AS FIRST LINE
import express from 'express';
import cors from 'cors';
import authRouter from './Routes/auth.js';
import employeeRouter from './Routes/employee.js';
import connectToDb from './db/db.js';

connectToDb();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/employee', employeeRouter);

app.get("/", (req, res) => {
    res.send("server start");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});