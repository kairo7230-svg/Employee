import User from "../models/Users.js";

// Get employee dashboard details
export const getEmployeeDetails = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get employee details error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get all employees (for admin)
export const getAllEmployees = async (req, res) => {
    try {
        const { search } = req.query;

        let query = { role: "employee" };

        if (search) {
            query = {
                role: "employee",
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }

        const employees = await User.find(query).select("-password");

        return res.status(200).json({
            success: true,
            employees,
            count: employees.length
        });
    } catch (error) {
        console.error("Get all employees error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Mark attendance
export const markAttendance = async (req, res) => {
    try {
        const { userId, status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ success: false, error: "UserId and status are required" });
        }

        if (!["present", "absent", "leave"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Check if already marked for today
        const today = new Date().toDateString();
        const existingAttendance = user.attendance.find(
            att => new Date(att.date).toDateString() === today
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            user.attendance.push({ date: new Date(), status });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            user
        });
    } catch (error) {
        console.error("Mark attendance error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Request leave
export const requestLeave = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate, reason } = req.body;

        if (!startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Calculate leave days
        const start = new Date(startDate);
        const end = new Date(endDate);
        const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (user.leaveBalance < leaveDays) {
            return res.status(400).json({ 
                success: false, 
                error: `Insufficient leave balance. Available: ${user.leaveBalance} days, Requested: ${leaveDays} days` 
            });
        }

        user.leaveRequests.push({
            startDate,
            endDate,
            reason,
            status: "pending"
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Leave request submitted",
            leaveRequests: user.leaveRequests
        });
    } catch (error) {
        console.error("Request leave error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Approve/Reject leave (admin only)
export const handleLeaveRequest = async (req, res) => {
    try {
        const { userId, leaveRequestId, status } = req.body;

        if (!userId || !leaveRequestId || !status) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const leaveRequest = user.leaveRequests.id(leaveRequestId);

        if (!leaveRequest) {
            return res.status(404).json({ success: false, error: "Leave request not found" });
        }

        leaveRequest.status = status;

        // If approved, update leave balance
        if (status === "approved") {
            const start = new Date(leaveRequest.startDate);
            const end = new Date(leaveRequest.endDate);
            const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            user.leaveBalance -= leaveDays;
            user.leaveTaken += leaveDays;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: `Leave request ${status}`,
            user
        });
    } catch (error) {
        console.error("Handle leave request error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Update salary, bonus, and hike (admin only)
export const updateSalaryDetails = async (req, res) => {
    try {
        const { userId, baseSalary, bonus, hike } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, error: "UserId is required" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        if (baseSalary !== undefined) user.baseSalary = baseSalary;
        if (bonus !== undefined) user.bonus = bonus;
        if (hike !== undefined) user.hike = hike;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Salary details updated",
            user
        });
    } catch (error) {
        console.error("Update salary details error:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
};
