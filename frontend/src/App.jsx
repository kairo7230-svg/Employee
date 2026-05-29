import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from './context/authContext.js';
import Login from './pages/login.jsx';
import Signup from './pages/signup.jsx';
import AdminDashboard from './pages/adminDashboard.jsx';
import EmployeeDashboard from './pages/employeeDashboard.jsx';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/emp-dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" replace />} />
        <Route path='/login' element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path='/signup' element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path='/admin-dashboard' element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path='/emp-dashboard' element={<ProtectedRoute allowedRoles={['employee', 'user', 'emp']}><EmployeeDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
