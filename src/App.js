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
import UserNavbar from './Components/UserNavbar';
import ProtectedRoute from './Components/ProtectedRoute';

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
  ].includes(location.pathname);
  const showUserNavbar = [
    '/dashboard',
    '/products',
    '/cart',
    '/profile',
    '/settings',
    '/logout',
  ].includes(location.pathname);

  return (
    <div>
      {showNavbar && <Navbar />}
      {showUserNavbar && <UserNavbar />}
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
