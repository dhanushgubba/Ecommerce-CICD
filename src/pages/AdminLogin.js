import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

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
      const response = await fetch('http://localhost:8082/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.text();

      if (response.ok && data.includes('Login Successful')) {
        localStorage.setItem('adminEmail', formData.email);
        localStorage.setItem('isAdminAuthenticated', 'true');
        setStatusMessage('Login successful! Welcome back, Admin!');
        setTimeout(() => {
          navigate('/admin/home');
        }, 1000);
        setFormData({
          email: '',
          password: '',
        });
      } else {
        setStatusMessage(data || 'Login failed. Please try again later.');
      }
    } catch (error) {
      setStatusMessage(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="brand-section">
          <div className="brand-logo">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M9 19C7.9 19 7 19.9 7 21S7.9 23 9 23 11 22.1 11 21 10.1 19 9 19ZM20 19C18.9 19 18 19.9 18 21S18.9 23 20 23 22 22.1 22 21 21.1 19 20 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="brand-title">ECommerce Admin</h1>
          <p className="brand-subtitle">Secure access to your dashboard</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label">Email Address</label>
            <div className="field-container">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`field-input ${errors.email ? 'field-error' : ''}`}
                placeholder="admin@company.com"
                disabled={isSubmitting}
                autoComplete="email"
              />
              <div className="field-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="22,6 12,13 2,6"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            {errors.email && (
              <span className="field-message">{errors.email}</span>
            )}
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`field-input ${
                  errors.password ? 'field-error' : ''
                }`}
                placeholder="Enter your password"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field-toggle"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="1"
                      y1="1"
                      x2="23"
                      y2="23"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <span className="field-message">{errors.password}</span>
            )}
          </div>

          {statusMessage && (
            <div
              className={`status-alert ${
                statusMessage.includes('successful')
                  ? 'status-success'
                  : 'status-error'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submit-loading' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner"></div>
                Authenticating...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>&copy; 2025 ECommerce Admin Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
