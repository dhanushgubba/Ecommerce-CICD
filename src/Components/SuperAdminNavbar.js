import React from 'react';
import './SuperAdminNavbar.css';
const SuperAdminNavbar = () => {
  return (
    <nav className="super-admin-navbar">
      <h1>Super Admin Dashboard</h1>
      <ul>
        <li>
          <a href="/super-admin-dashboard">Dashboard</a>
        </li>
        <li>
          <a href="/allusers">Manage Users</a>
        </li>
        <li>
          <a href="/alladmins">Manage Admins</a>
        </li>
        <li>
          <a href="/allorders">Manage Orders</a>
        </li>
        <li>
          <a href="/allproducts">Manage Products</a>
        </li>
        <li>
          <a href="/Login">Logout</a>
        </li>
      </ul>
    </nav>
  );
};
export default SuperAdminNavbar;
