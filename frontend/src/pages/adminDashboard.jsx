import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext.js';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({
    baseSalary: 0,
    bonus: 0,
    hike: 0,
    attendanceStatus: 'present',
    leaveRequestId: '',
    leaveStatus: 'approved'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async (search = '') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = search
        ? `http://localhost:5000/api/employee/all-employees?search=${search}`
        : 'http://localhost:5000/api/employee/all-employees';

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (err) {
      setError('Failed to fetch employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchEmployees(value);
  };

  const openModal = (type, employee) => {
    setSelectedEmployee(employee);
    setModalType(type);
    setFormData({
      baseSalary: employee.baseSalary || 0,
      bonus: employee.bonus || 0,
      hike: employee.hike || 0,
      attendanceStatus: 'present',
      leaveRequestId: '',
      leaveStatus: 'approved'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
    setModalType('');
  };

  const handleMarkAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/employee/mark-attendance',
        {
          userId: selectedEmployee._id,
          status: formData.attendanceStatus
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Attendance marked successfully');
        closeModal();
        fetchEmployees(searchTerm);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to mark attendance');
    }
  };

  const handleUpdateSalary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/employee/update-salary',
        {
          userId: selectedEmployee._id,
          baseSalary: parseFloat(formData.baseSalary),
          bonus: parseFloat(formData.bonus),
          hike: parseFloat(formData.hike)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert('Salary updated successfully');
        closeModal();
        fetchEmployees(searchTerm);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update salary');
    }
  };

  const handleHandleLeave = async (leaveRequestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/employee/handle-leave',
        {
          userId: selectedEmployee._id,
          leaveRequestId,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        alert(`Leave ${status} successfully`);
        closeModal();
        fetchEmployees(searchTerm);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to handle leave');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600">
        <div className="text-white text-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <input
          type="text"
          placeholder="Search employees by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-purple-500 text-lg"
        />
      </div>

      {/* Summary */}
      <div className="max-w-7xl mx-auto mb-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Total Employees</p>
            <p className="text-3xl font-bold text-blue-600">{employees.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-3xl font-bold text-green-600">{employees.filter(e => e.role === 'employee').length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Pending Leaves</p>
            <p className="text-3xl font-bold text-purple-600">
              {employees.reduce((sum, e) => sum + (e.leaveRequests?.filter(l => l.status === 'pending').length || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Employees List */}
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Employees</h2>

        {employees.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No employees found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-gray-700">Salary</th>
                  <th className="px-4 py-2 text-left text-gray-700">Pending Leaves</th>
                  <th className="px-4 py-2 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-semibold text-gray-800">{emp.name}</td>
                    <td className="px-4 py-2 text-gray-600">{emp.email}</td>
                    <td className="px-4 py-2 text-gray-800">₹{emp.totalSalary?.toLocaleString() || 'N/A'}</td>
                    <td className="px-4 py-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        {emp.leaveRequests?.filter(l => l.status === 'pending').length || 0}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => openModal('attendance', emp)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => openModal('salary', emp)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                      >
                        Salary
                      </button>
                      {emp.leaveRequests?.some(l => l.status === 'pending') && (
                        <button
                          onClick={() => openModal('leave', emp)}
                          className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm"
                        >
                          Leaves
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            {/* Attendance Modal */}
            {modalType === 'attendance' && (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Mark Attendance</h3>
                <div className="mb-6">
                  <p className="text-gray-600 mb-3">Employee: <span className="font-semibold">{selectedEmployee.name}</span></p>
                  <label className="block text-gray-700 font-semibold mb-2">Status</label>
                  <select
                    value={formData.attendanceStatus}
                    onChange={(e) => setFormData({ ...formData, attendanceStatus: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="leave">Leave</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleMarkAttendance}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Mark
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Salary Modal */}
            {modalType === 'salary' && (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Salary</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Base Salary</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bonus</label>
                    <input
                      type="number"
                      value={formData.bonus}
                      onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Hike (%)</label>
                    <input
                      type="number"
                      value={formData.hike}
                      onChange={(e) => setFormData({ ...formData, hike: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateSalary}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Update
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Leave Modal */}
            {modalType === 'leave' && (
              <>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Handle Leave Requests</h3>
                <div className="max-h-64 overflow-y-auto mb-6">
                  {selectedEmployee.leaveRequests
                    ?.filter(l => l.status === 'pending')
                    .map((leave, idx) => (
                      <div key={idx} className="p-4 mb-3 border-2 border-gray-300 rounded-lg">
                        <p className="text-sm text-gray-600">
                          {new Date(leave.startDate).toLocaleDateString()} to{' '}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">Reason: {leave.reason}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleHandleLeave(leave._id, 'approved')}
                            className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleHandleLeave(leave._id, 'rejected')}
                            className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  onClick={closeModal}
                  className="w-full px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition font-semibold"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;