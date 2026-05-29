import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    profileImage: { type: String },
    
    // Salary Information
    baseSalary: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    hike: { type: Number, default: 0 }, // Salary increase in percentage
    totalSalary: { type: Number, default: 0 }, // baseSalary + bonus
    
    // Attendance
    attendance: [{
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["present", "absent", "leave"], default: "absent" }
    }],
    
    // Leave Information
    leaveBalance: { type: Number, default: 20 }, // Total leaves available
    leaveTaken: { type: Number, default: 0 },
    leaveRequests: [{
        startDate: { type: Date },
        endDate: { type: Date },
        reason: { type: String },
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        requestedAt: { type: Date, default: Date.now }
    }],
    
    // Metadata
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Update totalSalary whenever baseSalary, bonus, or hike changes
userSchema.pre('save', function(next) {
    if (this.baseSalary !== undefined) {
        const hikeAmount = (this.baseSalary * this.hike) / 100;
        this.totalSalary = this.baseSalary + hikeAmount + this.bonus;
    }
    next();
});

const User = mongoose.model("User", userSchema);
export default User;