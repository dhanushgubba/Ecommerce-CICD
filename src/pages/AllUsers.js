import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/AllUsers.css';

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [formState, setFormState] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    postalcode: '',
    address: '',
    password: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAllUsers();
  }, [navigate]);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8082/api/users/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormState({
      id: null,
      name: '',
      email: '',
      phone: '',
      postalcode: '',
      address: '',
      password: '',
      role: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.role) {
      setError('Name, Email, and Role are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const url = formState.id
        ? `http://localhost:8082/api/users/${formState.id}`
        : 'http://localhost:8082/api/users/add';
      const method = formState.id ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      if (!response.ok) throw new Error('Failed to save user');
      await fetchAllUsers();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => setFormState({ ...user });

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete ${userName}?`)) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8082/api/users/${userId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchAllUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aui-container">
      <h1 className="aui-page-title">All Users Dashboard</h1>

      {loading && <p className="aui-loading">Loading...</p>}
      {error && <p className="aui-error">{error}</p>}

      <form className="aui-form" onSubmit={handleSubmit}>
        <h2 className="aui-form-title">
          {formState.id ? 'Edit User' : 'Add New User'}
        </h2>
        <input
          className="aui-input"
          name="name"
          placeholder="Name"
          value={formState.name}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="phone"
          placeholder="Phone"
          value={formState.phone}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="postalcode"
          placeholder="Postal Code"
          value={formState.postalcode}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="address"
          placeholder="Address"
          value={formState.address}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleFormChange}
        />
        <input
          className="aui-input"
          name="role"
          placeholder="Role"
          value={formState.role}
          onChange={handleFormChange}
        />
        <button className="aui-btn-primary" type="submit">
          {formState.id ? 'Update User' : 'Add User'}
        </button>
        {formState.id && (
          <button
            className="aui-btn-secondary"
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="aui-table-title">User List</h2>
      <table className="aui-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Postal</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.postalcode}</td>
              <td>{user.address}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="aui-btn-edit"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button
                  className="aui-btn-delete"
                  onClick={() => handleDelete(user.id, user.name)}
                >
                  Delete
                </button>
                <button className="aui-btn-promote">Promote</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="aui-btn-back"
        onClick={() => navigate('/super-admin-dashboard')}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AllUsers;
