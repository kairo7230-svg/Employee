import express from 'express';
import { login } from "../controller/authController.js"; // Ensure .js extension is present

const route = express.Router();
route.post('/login', login);

export default route;