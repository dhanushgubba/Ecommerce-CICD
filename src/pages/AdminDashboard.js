import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/Dashboard.css';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Filter,
  MoreHorizontal,
  Bell,
  Target,
  Zap,
  Shield,
  Settings,
  Database,
} from 'lucide-react';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const notifications = 5; // Admin might have more notifications
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  // Check authentication and role on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const currentUserEmail = localStorage.getItem('userEmail');
      const currentUserRole = localStorage.getItem('userRole');

      if (!isAuthenticated || !currentUserEmail || isAuthenticated !== 'true') {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('isAuthenticated');
        navigate('/Login', { replace: true });
        return false;
      }

      // Check if user has admin privileges
      if (currentUserRole !== 'ADMIN' && currentUserRole !== 'SUPER_ADMIN') {
        navigate('/dashboard', { replace: true }); // Redirect to regular dashboard
        return false;
      }

      return true;
    };

    checkAuth();

    // Set up periodic check every 5 seconds
    const authInterval = setInterval(() => {
      checkAuth();
    }, 5000);

    // Listen for storage changes (logout in another tab)
    const handleStorageChange = (e) => {
      if (
        e.key === 'isAuthenticated' ||
        e.key === 'userEmail' ||
        e.key === 'userRole'
      ) {
        if (!e.newValue) {
          navigate('/Login', { replace: true });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(authInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [navigate]);

  // Admin-specific stats
  const adminStats = [
    {
      title: 'Total Revenue',
      value: '$45,892',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Orders',
      value: '1,634',
      change: '+8.7%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'purple',
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Shield,
      color: 'orange',
    },
  ];

  const adminActions = [
    { title: 'Manage Users', icon: Users, color: 'blue' },
    { title: 'System Settings', icon: Settings, color: 'gray' },
    { title: 'View Reports', icon: TrendingUp, color: 'green' },
    { title: 'Database Admin', icon: Database, color: 'purple' },
    { title: 'Product Management', icon: Package, color: 'orange' },
    { title: 'Order Management', icon: ShoppingBag, color: 'red' },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <Shield
                className="admin-icon"
                style={{ color: '#3b82f6', marginRight: '0.5rem' }}
              />
              Admin Dashboard - Welcome,{' '}
              {userEmail ? userEmail.split('@')[0] : 'Admin'}!
              <span className="wave">👋</span>
            </h1>
            <p className="dashboard-subtitle">
              Administrative overview and system management
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
        {adminStats.map((stat, index) => (
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

      {/* Admin Actions Grid */}
      <div className="content-grid">
        <div className="content-card actions-card">
          <div className="card-header">
            <h2 className="card-title">Admin Actions</h2>
            <Zap className="lightning-icon" />
          </div>
          <div
            className="actions-grid"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            {adminActions.map((action, index) => (
              <button key={index} className={`action-btn ${action.color}`}>
                <div className={`action-icon ${action.color}`}>
                  <action.icon className="icon" />
                </div>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="content-card chart-card">
          <div className="card-header">
            <h2 className="card-title">System Overview</h2>
            <div className="chart-controls">
              <button className="chart-btn active">Users</button>
              <button className="chart-btn">Orders</button>
              <button className="chart-btn">Revenue</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <Shield className="chart-icon" />
              <p className="chart-text">Admin analytics would go here</p>
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">Active Users</span>
                  <span className="stat-value">2,847</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Pending Orders</span>
                  <span className="stat-value">23</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">System Load</span>
                  <span className="stat-value">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
