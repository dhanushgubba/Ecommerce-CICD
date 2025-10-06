import React, { useState, useEffect } from 'react';
import { href, useNavigate } from 'react-router-dom';
import './CSSFiles/Dashboard.css';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  MoreHorizontal,
  Bell,
  Zap,
  Shield,
  Settings,
  Database,
  Crown,
  Server,
  Activity,
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const notifications = 8; // Super admin might have more notifications
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

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

      // Check if user has super admin privileges
      if (currentUserRole !== 'SUPER_ADMIN') {
        // Redirect based on actual role
        if (currentUserRole === 'ADMIN') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
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

  // Super Admin specific stats
  const superAdminStats = [
    {
      title: 'Total Revenue',
      value: '$125,847',
      change: '+24.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'All Users',
      value: '12,847',
      change: '+15.2%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'System Load',
      value: '23.4%',
      change: '-5.1%',
      trend: 'down',
      icon: Server,
      color: 'purple',
    },
    {
      title: 'Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity,
      color: 'orange',
    },
  ];

  const superAdminActions = [
    { title: 'User Management', icon: Users, color: 'blue', href: '/allusers' },
    {
      title: 'Admin Management',
      icon: Shield,
      color: 'red',
      href: '/alladmins',
    },
    {
      title: 'System Config',
      icon: Settings,
      color: 'gray',
      href: '/system-config',
    },
    {
      title: 'Database Control',
      icon: Database,
      color: 'purple',
      href: '/database-control',
    },
    {
      title: 'Server Management',
      icon: Server,
      color: 'green',
      href: '/server-management',
    },
    {
      title: 'Global Settings',
      icon: Crown,
      color: 'yellow',
      href: '/global-settings',
    },
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <Crown
                className="admin-icon"
                style={{ color: '#f59e0b', marginRight: '0.5rem' }}
              />
              Super Admin Dashboard - Welcome,{' '}
              {userEmail ? userEmail.split('@')[0] : 'Super Admin'}!
              <span className="wave">👑</span>
            </h1>
            <p className="dashboard-subtitle">
              Complete system control and global management
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
        {superAdminStats.map((stat, index) => (
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

      {/* Super Admin Actions Grid */}
      <div className="content-grid">
        <div className="content-card actions-card">
          <div className="card-header">
            <h2 className="card-title">Super Admin Controls</h2>
            <Crown className="lightning-icon" style={{ color: '#f59e0b' }} />
          </div>
          <div
            className="actions-grid"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
          >
            {superAdminActions.map((action, index) => (
              <button key={index} className={`action-btn ${action.color}`}>
                <div className={`action-icon ${action.color}`}>
                  <action.icon className="icon" />
                </div>
                <span className="action-title">{action.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global System Status */}
        <div className="content-card chart-card">
          <div className="card-header">
            <h2 className="card-title">Global System Status</h2>
            <div className="chart-controls">
              <button className="chart-btn active">Performance</button>
              <button className="chart-btn">Security</button>
              <button className="chart-btn">Analytics</button>
            </div>
          </div>
          <div className="chart-container">
            <div className="chart-placeholder">
              <Crown className="chart-icon" style={{ color: '#f59e0b' }} />
              <p className="chart-text">Global system analytics dashboard</p>
              <div className="chart-stats">
                <div className="chart-stat">
                  <span className="stat-label">Total Admins</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">System Health</span>
                  <span className="stat-value">99.9%</span>
                </div>
                <div className="chart-stat">
                  <span className="stat-label">Security Level</span>
                  <span className="stat-value">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
