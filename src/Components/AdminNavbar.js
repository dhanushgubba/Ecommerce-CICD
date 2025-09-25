import React from 'react';
const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <h1>Admin Dashboard</h1>
      <ul className="nav-links">
        <li>
          <a href="/admin/home">Home</a>
        </li>
        <li>
          <a href="/admin/users">Users</a>
        </li>
        <li>
          <a href="/admin/settings">Settings</a>
        </li>
        <li>
          <a href="/admin/reports">Reports</a>
        </li>
      </ul>
    </nav>
  );
};
export default AdminNavbar;
