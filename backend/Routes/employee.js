import express from 'express';
import authMiddleware from '../middlware/authMiddlware.js';
import { 
    getEmployeeDetails, 
    getAllEmployees, 
    markAttendance, 
    requestLeave, 
    handleLeaveRequest,
    updateSalaryDetails 
} from '../controller/employeeController.js';

const route = express.Router();

// Employee routes (protected)
route.get('/dashboard', authMiddleware, getEmployeeDetails);
route.post('/request-leave', authMiddleware, requestLeave);

// Admin routes (protected) - can verify role later if needed
route.get('/all-employees', authMiddleware, getAllEmployees);
route.post('/mark-attendance', authMiddleware, markAttendance);
route.post('/handle-leave', authMiddleware, handleLeaveRequest);
route.post('/update-salary', authMiddleware, updateSalaryDetails);

export default route;
