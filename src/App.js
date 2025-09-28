import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Deals from './pages/Deals';
import About from './pages/About';
import Categories from './pages/Categories';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserNavbar from './Components/UserNavbar';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminNavbar from './Components/AdminNavbar';
import AdminLogin from './pages/AdminLogin';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import UserProducts from './pages/UserProducts';

const App = () => {
  const location = useLocation();

  const showNavbar = [
    '/',
    '/register',
    '/Login',
    '/contact',
    '/products',
    '/categories',
    '/deals',
    '/about',
    '/adminlogin',
  ].includes(location.pathname);
  const showUserNavbar = [
    '/dashboard',
    '/products',
    '/cart',
    '/profile',
    '/userproducts',
    '/settings',
    '/logout',
  ].includes(location.pathname);
  const showAdminNavbar = [
    '/admin-dashboard',
    '/super-admin-dashboard',
    '/admin/home',
    '/admin/users',
    '/admin/settings',
    '/admin/reports',
    '/admin/products',
    '/admin/orders',
    '/admin/database',
    '/adminusers',
    '/adminproducts',
  ].includes(location.pathname);
  return (
    <div>
      {showNavbar && <Navbar />}
      {showUserNavbar && <UserNavbar />}
      {showAdminNavbar && <AdminNavbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userproducts"
          element={
            <ProtectedRoute>
              <UserProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/super-admin-dashboard"
          element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminproducts"
          element={
            <ProtectedRoute>
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminusers"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route path="/adminlogin" element={<AdminLogin />} />
      </Routes>
    </div>
  );
};

// Wrap App in Router at the top level
const Main = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default Main;
