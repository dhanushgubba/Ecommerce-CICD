import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) newErrors.email = 'Email is required';
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatusMessage('Please fix the errors below.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('http://localhost:8082/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.email && data.role) {
          // Store user data
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userRole', data.role);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('isAuthenticated', 'true');

          setStatusMessage(`Login successful! Welcome back, ${data.email}!`);

          // Role-based navigation
          setTimeout(() => {
            switch (data.role) {
              case 'SUPER_ADMIN':
                navigate('/super-admin-dashboard');
                break;
              case 'ADMIN':
                navigate('/admin-dashboard');
                break;
              case 'USER':
              default:
                navigate('/dashboard');
                break;
            }
          }, 1000);

          setFormData({
            email: '',
            password: '',
          });
        } else {
          setStatusMessage('Login failed. Invalid response from server.');
        }
      } else {
        // Handle error response
        const errorData = await response.text();
        setStatusMessage(
          errorData || 'Login failed. Please check your credentials.'
        );
      }
    } catch (error) {
      setStatusMessage('Error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#forgot" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {statusMessage && (
            <div
              className={`status-message ${
                statusMessage.includes('successful') ? 'success' : 'error'
              }`}
            >
              {statusMessage}
            </div>
          )}
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="register-link">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
