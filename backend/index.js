import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Add a test route to check in your browser
app.get("/", (req, res) => {
    res.send("Employee Server is Running!");
});

// Use uppercase PORT to match standard .env conventions
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));