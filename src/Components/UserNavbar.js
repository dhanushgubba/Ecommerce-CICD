import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Heart,
} from 'lucide-react';
import './UserNavbar.css';

const UserNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const cartItemCount = 3; // This would come from your state management
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.clear(); // Clear any other potential data

    // Navigate to login and replace the current history entry
    navigate('/Login', { replace: true });

    // Force a page reload to ensure complete state reset
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  return (
    <nav className="user-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/dashboard" className="logo-link">
            <span className="logo-text">ShopHub</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              className="search-input"
            />
          </div>
        </div>

        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/products" className="nav-link">
            Products
          </Link>
          <Link to="/wishlist" className="nav-link wishlist-link">
            <Heart className="nav-icon" />
            <span className="nav-text">Wishlist</span>
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <ShoppingCart className="nav-icon" />
            <span className="nav-text">Cart</span>
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </Link>
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          <div className="user-menu-container">
            <button className="user-menu-button" onClick={toggleUserMenu}>
              <User className="user-icon" />
              <span className="user-name">John Doe</span>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      <User className="avatar-icon" />
                    </div>
                    <div className="user-details">
                      <span className="user-display-name">John Doe</span>
                      <span className="user-email">john.doe@example.com</span>
                    </div>
                  </div>
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <User className="dropdown-icon" />
                    My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item">
                    <ShoppingCart className="dropdown-icon" />
                    My Orders
                  </Link>
                  <Link to="/settings" className="dropdown-item">
                    <Settings className="dropdown-icon" />
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item logout-item"
                    onClick={handleLogout}
                  >
                    <LogOut className="dropdown-icon" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="menu-icon" />
          ) : (
            <Menu className="menu-icon" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-content">
            <Link
              to="/dashboard"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/products"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/wishlist"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              <Heart className="mobile-nav-icon" />
              Wishlist
            </Link>
            <Link to="/cart" className="mobile-nav-link" onClick={toggleMenu}>
              <ShoppingCart className="mobile-nav-icon" />
              Cart ({cartItemCount})
            </Link>
            <Link
              to="/profile"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              <User className="mobile-nav-icon" />
              Profile
            </Link>
            <Link to="/orders" className="mobile-nav-link" onClick={toggleMenu}>
              My Orders
            </Link>
            <Link
              to="/settings"
              className="mobile-nav-link"
              onClick={toggleMenu}
            >
              <Settings className="mobile-nav-icon" />
              Settings
            </Link>
            <button
              className="mobile-nav-link logout-link"
              onClick={handleLogout}
            >
              <LogOut className="mobile-nav-icon" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
