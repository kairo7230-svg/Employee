import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.js';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchEmployeeDetails();
  }, []);

  const fetchEmployeeDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/employee/dashboard',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setEmployee(response.data.user);
      }
    } catch (err) {
      setError('Failed to load employee details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/employee/request-leave',
        leaveForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Leave request submitted successfully');
        setLeaveForm({ startDate: '', endDate: '', reason: '' });
        setShowLeaveForm(false);
        fetchEmployeeDetails();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request leave');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-2xl">{error}</div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-white text-2xl">No employee data found</div>
      </div>
    );
  }

  const presentCount = employee.attendance?.filter(a => a.status === 'present').length || 0;
  const absentCount = employee.attendance?.filter(a => a.status === 'absent').length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Employee Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
              {employee.profileImage ? (
                <img src={employee.profileImage} alt={employee.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white text-4xl font-bold">{employee.name?.charAt(0)}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-sm text-gray-500 mt-2 capitalize">Role: {employee.role}</p>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Attendance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Present:</span>
              <span className="font-bold text-green-600">{presentCount} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Absent:</span>
              <span className="font-bold text-red-600">{absentCount} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Records:</span>
              <span className="font-bold text-blue-600">{employee.attendance?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Leave Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Available:</span>
              <span className="font-bold text-green-600">{employee.leaveBalance} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Used:</span>
              <span className="font-bold text-orange-600">{employee.leaveTaken} days</span>
            </div>
            <button
              onClick={() => setShowLeaveForm(!showLeaveForm)}
              className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Request Leave
            </button>
          </div>
        </div>
      </div>

      {/* Salary Section */}
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Salary Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Base Salary</p>
            <p className="text-2xl font-bold text-blue-600">₹{employee.baseSalary?.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Hike ({employee.hike}%)</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{((employee.baseSalary * employee.hike) / 100)?.toLocaleString()}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Bonus</p>
            <p className="text-2xl font-bold text-yellow-600">₹{employee.bonus?.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
            <p className="text-gray-600 text-sm font-semibold">Total Salary</p>
            <p className="text-2xl font-bold text-purple-600">₹{employee.totalSalary?.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Leave Requests */}
      {employee.leaveRequests && employee.leaveRequests.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">From</th>
                  <th className="px-4 py-2 text-left text-gray-700">To</th>
                  <th className="px-4 py-2 text-left text-gray-700">Reason</th>
                  <th className="px-4 py-2 text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {employee.leaveRequests.map((leave, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-gray-800">{leave.reason}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          leave.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : leave.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leave Request Form */}
      {showLeaveForm && (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Request Leave</h3>
          <form onSubmit={handleRequestLeave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  value={leaveForm.startDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  value={leaveForm.endDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Reason</label>
              <textarea
                value={leaveForm.reason}
                onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => setShowLeaveForm(false)}
                className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Attendance Records */}
      {employee.attendance && employee.attendance.length > 0 && (
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Attendance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Date</th>
                  <th className="px-4 py-2 text-left text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {employee.attendance.slice(-10).reverse().map((att, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          att.status === 'present'
                            ? 'bg-green-100 text-green-800'
                            : att.status === 'leave'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;