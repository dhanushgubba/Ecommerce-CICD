import React from 'react';
import './AdminNavbar.css';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <ul className="nav-links">
          <li>
            <a href="/admin-dashboard" className="nav-link">
              <span className="nav-icon">🏠</span>
              Home
            </a>
          </li>
          <li>
            <a href="/adminusers" className="nav-link">
              <span className="nav-icon">👥</span>
              Users
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="nav-link">
              <span className="nav-icon">⚙️</span>
              Settings
            </a>
          </li>
          <li>
            <a href="/admin/reports" className="nav-link">
              <span className="nav-icon">📊</span>
              Reports
            </a>
          </li>
          <li>
            <a href="/adminproducts" className="nav-link">
              <span className="nav-icon">📦</span>
              Products
            </a>
          </li>
          <li>
            <a href="/Login" className="nav-link logout">
              <span className="nav-icon">🚪</span>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
