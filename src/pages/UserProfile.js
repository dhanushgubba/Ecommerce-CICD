import React, { useEffect, useState } from 'react';
import './CSSFiles/UserProfile.css';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Debug: Log all localStorage keys for user data
        console.log('🔍 Debugging UserProfile localStorage:');
        console.log(
          'isAuthenticated:',
          localStorage.getItem('isAuthenticated')
        );
        console.log('userEmail:', localStorage.getItem('userEmail'));
        console.log('userRole:', localStorage.getItem('userRole'));
        console.log('userId:', localStorage.getItem('userId'));
        console.log('username:', localStorage.getItem('username'));
        console.log('currentUser:', localStorage.getItem('currentUser'));

        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');
        const userId = localStorage.getItem('userId');

        if (!isAuthenticated || isAuthenticated !== 'true') {
          setError('User not authenticated. Please login.');
          setLoading(false);
          return;
        }

        // Try to get complete user data from localStorage first
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          try {
            const parsedUser = JSON.parse(currentUser);
            setUser(parsedUser);
            setLoading(false);
            return;
          } catch (parseError) {
            console.log(
              'Failed to parse currentUser from localStorage:',
              parseError
            );
          }
        }

        // Fallback to individual localStorage items
        if (userEmail && userRole && userId) {
          const userName = localStorage.getItem('username');
          const userPhone = localStorage.getItem('userPhone');
          const userAddress = localStorage.getItem('userAddress');

          // Try to fetch complete user profile from the API
          try {
            const response = await fetch(
              `http://localhost:8083/api/users/${userId}`
            );
            if (response.ok) {
              const userData = await response.json();
              setUser(userData);
              // Update localStorage with fresh data
              localStorage.setItem('currentUser', JSON.stringify(userData));
            } else {
              // Fallback to localStorage data if API fails
              const fallbackUser = {
                id: userId,
                email: userEmail,
                role: userRole,
                name: userName || userEmail.split('@')[0], // Use stored name or extract from email
                phone: userPhone || null,
                address: userAddress || null,
              };
              setUser(fallbackUser);
            }
          } catch (apiError) {
            console.log('API fetch failed, using localStorage data:', apiError);
            // Fallback to localStorage data
            const fallbackUser = {
              id: userId,
              email: userEmail,
              role: userRole,
              name: userName || userEmail.split('@')[0], // Use stored name or extract from email
              phone: userPhone || null,
              address: userAddress || null,
            };
            setUser(fallbackUser);
          }
        } else {
          setError('No user data found in localStorage.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);
  const handleLogout = () => {
    // Clear all user-related localStorage items
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userWishlist');
    navigate('/Login');
  };

  if (loading) {
    return (
      <div className="user-profile">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="user-profile">
        <div className="error-container">
          <h2>Profile Not Available</h2>
          <p>{error || 'No User Data available or User is not logged in.'}</p>
          <button onClick={() => navigate('/Login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-title">
          <h1>User Profile</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="profile-details">
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{user.name || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <label>Email Address:</label>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <label>User ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="detail-item">
              <label>Account Role:</label>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <span>{user.phone || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <label>Address:</label>
              <span>{user.address || 'Not provided'}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-primary">
            <Link to="/edit-profile">Edit Profile</Link>
          </button>
          <button className="btn-secondary">Change Password</button>
          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Debug Information (remove in production) */}
        <div
          className="debug-info"
          style={{
            background: '#f3f4f6',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '20px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            Debug Info:
          </h3>
          <p>
            <strong>localStorage.isAuthenticated:</strong>{' '}
            {localStorage.getItem('isAuthenticated')}
          </p>
          <p>
            <strong>localStorage.userEmail:</strong>{' '}
            {localStorage.getItem('userEmail')}
          </p>
          <p>
            <strong>localStorage.userRole:</strong>{' '}
            {localStorage.getItem('userRole')}
          </p>
          <p>
            <strong>localStorage.userId:</strong>{' '}
            {localStorage.getItem('userId')}
          </p>
          <p>
            <strong>localStorage.userName:</strong>{' '}
            {localStorage.getItem('userName')}
          </p>
          <p>
            <strong>localStorage.currentUser:</strong>{' '}
            {localStorage.getItem('currentUser')}
          </p>
          <p>
            <strong>User object:</strong> {JSON.stringify(user, null, 2)}
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
