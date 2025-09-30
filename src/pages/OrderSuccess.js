import React from 'react';
import { Link } from 'react-router-dom';
import './CSSFiles/OrderSuccess.css';

const OrderSuccess = () => {
  const orderDetails = JSON.parse(localStorage.getItem('lastOrder') || '{}');
  return (
    <div className="order-success-page">
      <div className="success-container">
        <div className="success-animation">
          <div className="checkmark">✓</div>
        </div>

        <h1>🎉 Order Placed Successfully!</h1>
        <p className="success-message">
          Thank you for your purchase! Your order has been confirmed and will be
          processed shortly.
        </p>

        {orderDetails.id && (
          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-item">
              <span>Order ID:</span>
              <span>#{orderDetails.id}</span>
            </div>
            <div className="detail-item">
              <span>Order Date:</span>
              <span>{orderDetails.orderDate}</span>
            </div>
            <div className="detail-item">
              <span>Total Amount:</span>
              <span>${orderDetails.totalPrice}</span>
            </div>
            <div className="detail-item">
              <span>Items:</span>
              <span>{orderDetails.itemCount} items</span>
            </div>
            <div className="detail-item">
              <span>Status:</span>
              <span
                className={`status-${
                  orderDetails.status?.toLowerCase() || 'new'
                }`}
              >
                {orderDetails.status || 'NEW'}
              </span>
            </div>
            {orderDetails.shippingAddress && (
              <div className="detail-item">
                <span>Delivery Address:</span>
                <span>{orderDetails.shippingAddress}</span>
              </div>
            )}
            {orderDetails.paymentMethod && (
              <div className="detail-item">
                <span>Payment Method:</span>
                <span>
                  {orderDetails.paymentMethod.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="delivery-info">
          <h3>📦 What's Next?</h3>
          <div className="info-steps">
            <div className="step">
              <span className="step-number">1</span>
              <p>Order confirmation email sent</p>
            </div>
            <div className="step">
              <span className="step-number">2</span>
              <p>Processing and packaging (1-2 days)</p>
            </div>
            <div className="step">
              <span className="step-number">3</span>
              <p>Shipping and delivery (3-5 days)</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/orders" className="btn-primary">
            📋 View My Orders
          </Link>
          <Link to="/userproducts" className="btn-secondary">
            🛍️ Continue Shopping
          </Link>
          <Link to="/dashboard" className="btn-secondary">
            🏠 Go to Dashboard
          </Link>
        </div>

        <div className="contact-info">
          <p>
            Need help? Contact us at <strong>support@shophub.com</strong> or
            call <strong>1-800-SHOP-HUB</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
