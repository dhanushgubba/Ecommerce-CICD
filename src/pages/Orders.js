import { useState, useEffect } from 'react';
import './CSSFiles/Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    if (!userId) {
      setError('User not logged in. Please login to view orders.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      console.log('🔍 Fetching orders for user ID:', userId);

      const response = await fetch(
        `http://localhost:8084/api/orders/user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📥 Orders API response status:', response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.log('📦 No orders found for user');
          setOrders([]);
          return;
        }
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      let ordersData;
      try {
        const responseText = await response.text();
        console.log('📥 Raw response:', responseText.substring(0, 500) + '...');
        ordersData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('❌ JSON Parse Error:', jsonError);
        console.error(
          '❌ This indicates a backend serialization issue with circular references'
        );
        throw new Error(
          'Invalid response from server. Please check backend Order/OrderItem models for circular references.'
        );
      }

      console.log('📦 Orders data received:', ordersData);
      console.log('📊 Number of orders:', ordersData?.length || 0);

      ordersData?.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          id: order.id,
          userId: order.userId,
          status: order.status,
          totalPrice: order.totalPrice,
          itemsCount: order.items?.length || 0,
          items: order.items?.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        });
      });

      setOrders(ordersData || []);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      setError(`Failed to load orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cancelUserOrder = async (orderId) => {
    if (!userId) {
      setError('User not logged in. Please login to manage orders.');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8084/api/orders/${orderId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.status}`);
      }
      // Optionally, you can update the UI or state after a successful cancellation
    } catch (error) {
      console.error('❌ Error cancelling order:', error);
      setError(`Failed to cancel order: ${error.message}`);
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return 'status-new';
      case 'PROCESSING':
        return 'status-processing';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'CONFIRMED':
        return 'status-processing';
      case 'SHIPPED':
        return 'status-processing';
      case 'DELIVERED':
        return 'status-completed';
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
                    {order.address && (
                      <div className="summary-item">
                        <span>Delivery Address:</span>
                        <span className="address">{order.address}</span>
                      </div>
                    )}
                    {order.phoneno && (
                      <div className="summary-item">
                        <span>Contact:</span>
                        <span className="phone">{order.phoneno}</span>
                      </div>
                    )}
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-items">
                      <h4>Order Items:</h4>
                      <div className="items-list">
                        {order.items.map((item, index) => (
                          <div key={item.id || index} className="order-item">
                            <div className="item-info">
                              <div className="item-main">
                                <span className="product-name">
                                  {item.name || `Product #${item.productId}`}
                                </span>
                                <span className="product-brand">
                                  {item.brand && `by ${item.brand}`}
                                </span>
                              </div>
                              <div className="item-details">
                                <span className="product-id">
                                  ID: {item.productId}
                                </span>
                                <span className="quantity">
                                  Qty: {item.quantity}
                                </span>
                                <span className="price">
                                  ${item.price?.toFixed(2) || '0.00'} each
                                </span>
                                <span className="total">
                                  Total: $
                                  {(
                                    (item.price || 0) * (item.quantity || 0)
                                  ).toFixed(2)}
                                </span>
                              </div>
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
                    <button
                      className="btn-danger"
                      onClick={() => cancelUserOrder(order.id)}
                    >
                      Cancel Order
                    </button>
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
