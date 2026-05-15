import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// Alias the imports to have Capital letters so React recognizes them as components
import Login from '../pages/login.jsx'; 
import AdminDashboard from '../pages/admin-dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirects root path to admin dashboard */}
        <Route path='/' element={<Navigate to="/admin-dashboard" />} />
        
        {/* Correctly capitalized component elements */}
        <Route path='/login' element={<Login />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;