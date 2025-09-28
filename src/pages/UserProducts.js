import React, { useState, useEffect } from 'react';
import './CSSFiles/UserProducts.css';

const UserProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:8083/api/products/all');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Error fetching products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    fetchProducts();
    const savedWishlist = JSON.parse(
      localStorage.getItem('userWishlist') || '[]'
    );
    setWishlist(savedWishlist);
  }, []);

  // Add notification function
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️',
    };
    const notification = {
      id,
      message,
      type,
      icon: icons[type] || icons.success,
    };
    setNotifications((prev) => [...prev, notification]);

    // Auto remove notification after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 4000);
  };

  // Toggle wishlist function
  const toggleWishlist = (product) => {
    const isAlreadyInWishlist = wishlist.some((item) => item.id === product.id);

    if (isAlreadyInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id);
      setWishlist(updatedWishlist);
      localStorage.setItem('userWishlist', JSON.stringify(updatedWishlist));
      addNotification(`${product.name} removed from wishlist`, 'info');
    } else {
      // Add to wishlist
      const updatedWishlist = [...wishlist, product];
      setWishlist(updatedWishlist);
      localStorage.setItem('userWishlist', JSON.stringify(updatedWishlist));
      addNotification(`${product.name} added to wishlist! ❤️`, 'success');
    }
  };

  // Remove notification function
  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span key="half" className="star half">
            ★
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">
            ☆
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="user-products">
      {/* Notifications Container */}
      <div className="notifications-container">
        {notifications.length > 1 && (
          <button
            className="clear-all-notifications"
            onClick={clearAllNotifications}
          >
            Clear All ({notifications.length})
          </button>
        )}
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification ${notification.type}`}
            onClick={() => removeNotification(notification.id)}
          >
            <span className="notification-icon">{notification.icon}</span>
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close">×</button>
          </div>
        ))}
      </div>

      <div className="products-header">
        <div className="header-content">
          <h1>Our Products</h1>
          <p>Discover our amazing collection of products</p>
        </div>
        {wishlist.length > 0 && (
          <div className="wishlist-counter">
            <span className="wishlist-icon">❤️</span>
            <span className="wishlist-count">{wishlist.length}</span>
            <span className="wishlist-text">items in wishlist</span>
          </div>
        )}
      </div>

      {message && (
        <div className="error-message">
          <p>{message}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 && !message ? (
        <div className="no-products">
          <h3>No products available</h3>
          <p>Check back later for new arrivals!</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
                {product.quantity < 10 && (
                  <div className="low-stock-badge">Low Stock</div>
                )}
              </div>

              <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                <div className="product-rating">
                  {renderStars(product.rating)}
                  <span className="rating-text">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                <div className="product-details">
                  <div className="price">${product.price}</div>
                  <div className="category">{product.category}</div>
                </div>

                <div className="product-meta">
                  <span className="sku">SKU: {product.sku}</span>
                  <span
                    className={`stock ${
                      product.quantity < 10 ? 'low' : 'good'
                    }`}
                  >
                    {product.quantity > 0
                      ? `${product.quantity} in stock`
                      : 'Out of stock'}
                  </span>
                </div>

                <div className="product-actions">
                  <button
                    className="btn-primary"
                    disabled={product.quantity === 0}
                  >
                    {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button className="btn-secondary">View Details</button>
                  <button
                    className={`btn-wishlist ${
                      isInWishlist(product.id) ? 'in-wishlist' : ''
                    }`}
                    onClick={() => toggleWishlist(product)}
                  >
                    {isInWishlist(product.id)
                      ? '❤️ Remove from Wishlist'
                      : '🤍 Add to Wishlist'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProducts;
