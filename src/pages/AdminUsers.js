import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/AdminUsers.css';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // Initialize as empty array
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [postalcode, setPostalcode] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication and role
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');

    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/Login');
      return;
    }

    if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      navigate('/dashboard'); // Redirect to regular dashboard if not admin
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8082/api/users/all');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPostalcode('');
    setAddress('');
    setPassword('');
    setRole('');
    setId(null);
    setError('');
  };

  const validateForm = () => {
    // Convert all values to strings to avoid trim errors
    const nameStr = String(name || '');
    const emailStr = String(email || '');
    const phoneStr = String(phone || '');
    const postalcodeStr = String(postalcode || '');
    const addressStr = String(address || '');
    const passwordStr = String(password || '');
    const roleStr = String(role || '');
    if (
      !nameStr.trim() ||
      !emailStr.trim() ||
      !phoneStr.trim() ||
      !postalcodeStr.trim() ||
      !addressStr.trim() ||
      !passwordStr.trim() ||
      !roleStr.trim()
    ) {
      setError('All fields are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = { name, email, phone, postalcode, address, password, role };
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8082/api/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error('Failed to add user');

      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
      setError('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setId(user.id);
    setName(String(user.name || ''));
    setEmail(String(user.email || ''));
    setPhone(String(user.phone || ''));
    setPostalcode(String(user.postalcode || ''));
    setAddress(String(user.address || ''));
    setPassword(String(user.password || ''));
    setRole(String(user.role || ''));
    setError('');
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedUser = {
      name,
      email,
      phone,
      postalcode,
      address,
      password,
      role,
    };
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8082/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error('Failed to update user');

      const message = await response.text(); // Backend returns string message
      console.log('Update success:', message);

      await fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8082/api/users/${userId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete user');

      const message = await response.text(); // Backend returns string message
      console.log('Delete success:', message);

      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div>
            <h1 className="admin-title">User Management</h1>
            <p className="admin-subtitle">
              Manage and organize your users efficiently
            </p>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <div className="form-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h2>{id ? 'Edit User' : 'Add New User'}</h2>
            </div>
            {error && <div className="error-message">{error}</div>}
            <form
              className="admin-form"
              onSubmit={id ? handleUpdateUser : handleAddUser}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="postalcode">Postal Code</label>
                  <input
                    type="text"
                    id="postalcode"
                    value={postalcode}
                    onChange={(e) => setPostalcode(e.target.value)}
                    placeholder="Enter postal code"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group form-group-full">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <input
                    type="text"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Enter role (e.g., USER, ADMIN)"
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="form-actions">
                {id ? (
                  <>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Update User'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="table-section">
          <div className="table-card">
            <div className="table-header">
              <h2>Users ({users.length})</h2>
              <p>Manage and view all registered users</p>
            </div>

            {loading && users.length === 0 ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3>No users found</h3>
                <p>Add your first user to get started</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className={loading ? 'loading' : ''}>
                        <td>
                          <div className="user-info">
                            <div className="user-avatar">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-details">
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-info">{user.phone}</div>
                        </td>
                        <td>
                          <div className="location-info">
                            <div className="postal-code">{user.postalcode}</div>
                            <div className="address">{user.address}</div>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-edit"
                              onClick={() => handleEditUser(user)}
                              disabled={loading}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </button>
                            <button
                              className="btn btn-delete"
                              onClick={() =>
                                handleDeleteUser(user.id, user.name)
                              }
                              disabled={loading}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
