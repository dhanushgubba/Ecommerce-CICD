import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  Mail,
  Phone,
  ShoppingBag,
  Home,
  FileText,
} from 'lucide-react';
import './CSSFiles/OrderSuccess.css';

const OrderSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrderDetails = () => {
      try {
        const lastOrder = localStorage.getItem('lastOrder');
        if (lastOrder) {
          setOrderDetails(JSON.parse(lastOrder));
        }
      } catch (error) {
        console.error('Error loading order details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, []);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      processing: 'status-processing',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return colors[statusLower] || 'status-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price) => {
    if (!price) return '$0.00';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="order-success-content">
        <div className="success-header">
          <div className="success-icon-wrapper">
            <CheckCircle className="success-icon" size={64} />
          </div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        {orderDetails && (
          <div className="order-info-card">
            <div className="card-header">
              <FileText size={24} />
              <h2>Order Information</h2>
            </div>
            <div className="order-info-grid">
              <div className="info-row">
                <span className="info-label">Order Number</span>
                <span className="info-value order-number">
                  #{orderDetails.id || 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Order Date</span>
                <span className="info-value">
                  {formatDate(
                    orderDetails.orderDate || orderDetails.created_at
                  )}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Amount</span>
                <span className="info-value total-amount">
                  {formatPrice(
                    orderDetails.totalPrice || orderDetails.total_amount
                  )}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Payment Method</span>
                <span className="info-value payment-method">
                  {orderDetails.paymentMethod
                    ?.replace(/-/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Card Payment'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span
                  className={`info-value status-badge ${getStatusColor(
                    orderDetails.status
                  )}`}
                >
                  {orderDetails.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              {orderDetails.shippingAddress && (
                <div className="info-row full-width">
                  <span className="info-label">Shipping Address</span>
                  <span className="info-value address">
                    {orderDetails.shippingAddress}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="timeline-card">
          <div className="card-header">
            <Package size={24} />
            <h2>What Happens Next?</h2>
          </div>
          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-icon">
                <CheckCircle size={24} />
              </div>
              <div className="timeline-content">
                <h3>Order Confirmed</h3>
                <p>We've received your order and sent a confirmation email</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Clock size={24} />
              </div>
              <div className="timeline-content">
                <h3>Processing</h3>
                <p>Your order is being prepared (1-2 business days)</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Truck size={24} />
              </div>
              <div className="timeline-content">
                <h3>Shipped</h3>
                <p>Your package is on its way (3-5 business days)</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon">
                <Package size={24} />
              </div>
              <div className="timeline-content">
                <h3>Delivered</h3>
                <p>Your order arrives at your doorstep</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <a href="/orders" className="btn btn-primary">
            <FileText size={20} />
            <span>View Order Details</span>
          </a>
          <a href="/products" className="btn btn-secondary">
            <ShoppingBag size={20} />
            <span>Continue Shopping</span>
          </a>
          <a href="/dashboard" className="btn btn-outline">
            <Home size={20} />
            <span>Back to Dashboard</span>
          </a>
        </div>

        <div className="support-card">
          <h3>Need Assistance?</h3>
          <p>
            Our customer support team is here to help you with any questions.
          </p>
          <div className="support-contact">
            <div className="contact-item">
              <Mail size={20} />
              <a href="mailto:support@shophub.com">support@shophub.com</a>
            </div>
            <div className="contact-item">
              <Phone size={20} />
              <a href="tel:1-800-SHOP-HUB">1-800-SHOP-HUB</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
