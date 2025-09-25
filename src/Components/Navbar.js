import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
const Navbar = ({ cartCount, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h2>ShopHub</h2>
          </div>
          <nav className="navigation">
            <div className="nav-content">
              <ul className="nav-links">
                <li>
                  <a href="/  ">Home</a>
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/categories">Categories</a>
                </li>
                <li>
                  <a href="/deals">Deals</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
                <li>
                  <a href="/contact">Contact</a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>

          <div className="header-actions">
            <button className="user-btn">
              <Link to="/Login">👤</Link>
            </button>
            <button className="cart-btn">
              🛒
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
