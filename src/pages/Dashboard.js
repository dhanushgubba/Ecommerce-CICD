import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/Dashboard.css';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Heart,
  Clock,
  Filter,
  MoreHorizontal,
  Bell,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [notifications, setNotifications] = useState(3);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  // Check authentication on component mount and periodically
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const currentUserEmail = localStorage.getItem('userEmail');

      if (!isAuthenticated || !currentUserEmail || isAuthenticated !== 'true') {
        // Clear any stale data
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAuthenticated');
        navigate('/Login', { replace: true });
        return false;
      }
      return true;
    };

    // Initial check
    checkAuth();

    // Set up periodic check every 5 seconds
    const authInterval = setInterval(() => {
      checkAuth();
    }, 5000);

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'isAuthenticated' || e.key === 'userEmail') {
        if (!e.newValue) {
          navigate('/Login', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup interval and event listener on component unmount
    return () => {
      clearInterval(authInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // Mock data - in real app this would come from API
  const stats = [
    {
      title: 'Total Revenue',
      value: '$24,567',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'blue',
    },
    {
      title: 'Active Users',
      value: '8,945',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: '+0.8%',
      trend: 'up',
      icon: Target,
      color: 'orange',
    },
  ];

  const recentOrders = [
    {
      id: '#ORD-001',
      customer: 'John Smith',
      product: 'Wireless Headphones',
      amount: '$299.99',
      status: 'completed',
      time: '2 hours ago',
    },
    {
      id: '#ORD-002',
      customer: 'Sarah Johnson',
      product: 'Smart Watch',
      amount: '$199.99',
      status: 'processing',
      time: '4 hours ago',
    },
    {
      id: '#ORD-003',
      customer: 'Mike Davis',
      product: 'Laptop Stand',
      amount: '$89.99',
      status: 'shipped',
      time: '6 hours ago',
    },
    {
      id: '#ORD-004',
      customer: 'Emily Brown',
      product: 'Phone Case',
      amount: '$24.99',
      status: 'pending',
      time: '8 hours ago',
    },
  ];

  const topProducts = [
    {
      name: 'Wireless Earbuds Pro',
      sales: 245,
      revenue: '$12,250',
      image:
        'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    {
      name: 'Smart Fitness Watch',
      sales: 189,
      revenue: '$9,450',
      image:
        'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    {
      name: 'Premium Headphones',
      sales: 156,
      revenue: '$7,800',
      image:
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
    {
      name: 'Wireless Charger',
      sales: 134,
      revenue: '$6,700',
      image:
        'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    },
  ];

  const quickActions = [
    { title: 'Add Product', icon: Package, color: 'blue' },
    { title: 'View Analytics', icon: TrendingUp, color: 'green' },
    { title: 'Manage Orders', icon: ShoppingBag, color: 'purple' },
    { title: 'Customer Support', icon: Users, color: 'orange' },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              Welcome back, {userEmail ? userEmail.split('@')[0] : 'User'}!
              <span className="wave">👋</span>
            </h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your store today
            </p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="notification-btn">
                <Bell className="notification-icon" />
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>
              <div className="period-selector">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="period-select"
                >
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-header">
              <div className={`stat-icon ${stat.color}`}>
                <stat.icon className="icon" />
              </div>
              <button className="stat-menu">
                <MoreHorizontal className="menu-icon" />
              </button>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <div className={`stat-change ${stat.trend}`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="trend-icon" />
                ) : (
                  <ArrowDownRight className="trend-icon" />
                )}
                <span className="change-value">{stat.change}</span>
                <span className="change-period">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Recent Orders */}
        <div className="content-card orders-card">
          <div className="card-header">
            <h2 className="card-title">Recent Orders</h2>
            <button className="view-all-btn">
              View All
              <ArrowUpRight className="btn-icon" />
            </button>
          </div>
          <div className="orders-list">
            {recentOrders.map((order, index) => (
              <div key={index} className="order-item">
                <div className="order-info">
                  <div className="order-main">
                    <span className="order-id">{order.id}</span>
                    <span className="order-customer">{order.customer}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-product">{order.product}</span>
                    <span className="order-time">
                      <Clock className="time-icon" />
                      {order.time}
                    </span>
                  </div>
                </div>
                <div className="order-right">
                  <span className="order-amount">{order.amount}</span>
                  <span className={`order-status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="content-card products-card">
          <div className="card-header">
            <h2 className="card-title">Top Products</h2>
            <button className="filter-btn">
              <Filter className="filter-icon" />
              Filter
            </button>
          </div>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h4 className="product-name">{product.name}</h4>
                  <div className="product-stats">
                    <span className="product-sales">{product.sales} sales</span>
                    <span className="product-revenue">{product.revenue}</span>
                  </div>
                </div>
                <div className="product-trend">
                  <TrendingUp className="trend-icon up" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="content-card actions-card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
            <Zap className="lightning-icon" />
          </div>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <button key={index} className={`action-btn ${action.color}`}>
                <div className={`action-icon ${action.color}`}>
                  <action.icon className="icon" />
                </div>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="content-card chart-card">
          <div className="card-header">
            <h2 className="card-title">Sales Performance</h2>
            <div className="chart-controls">
              <button className="chart-btn active">Revenue</button>
              <button className="chart-btn">Orders</button>
              <button className="chart-btn">Visitors</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <TrendingUp className="chart-icon" />
              <p className="chart-text">Interactive chart would go here</p>
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">Peak Sales</span>
                  <span className="stat-value">$3,247</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Avg. Order</span>
                  <span className="stat-value">$127</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Growth</span>
                  <span className="stat-value">+23%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
