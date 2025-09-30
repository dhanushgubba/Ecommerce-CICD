import React, { useState, useEffect } from 'react';
import './CSSFiles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://localhost:8084/api/orders/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const ordersData = await response.json();
      console.log('Orders data received:', ordersData);
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'status-new';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return 'status-new';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={fetchUserOrders} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <p>Track and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h2>No orders yet</h2>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
            <a href="/userproducts" className="start-shopping-btn">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">{formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status">
                    <span
                      className={`status-badge ${getStatusColor(order.status)}`}
                    >
                      {order.status || 'NEW'}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="order-summary">
                    <div className="summary-item">
                      <span>Items:</span>
                      <span>{order.items?.length || 0} items</span>
                    </div>
                    <div className="summary-item">
                      <span>Total:</span>
                      <span className="total-price">
                        ${order.totalPrice?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>Order Items:</h4>
                      <div className="items-list">
                        {order.items.map((item, index) => (
                          <div key={item.id || index} className="order-item">
                            <div className="item-info">
                              <span className="product-id">
                                Product ID: {item.productId}
                              </span>
                              <span className="quantity">
                                Qty: {item.quantity}
                              </span>
                              <span className="price">
                                ${item.price?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button className="btn-secondary">View Details</button>
                  {order.status === 'NEW' && (
                    <button className="btn-danger">Cancel Order</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
