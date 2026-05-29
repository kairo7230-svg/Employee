import express from 'express';
import { signup, login, verify } from "../controller/authController.js"; // Ensure .js extension is present
import authMiddlware from '../middlware/authMiddlware.js'; // Ensure .js extension is present
const route = express.Router();

route.post('/signup', signup);
route.post('/login', login);
route.post('/verify', authMiddlware, verify);

export default route;