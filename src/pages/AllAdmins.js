import React, { useState, useEffect } from 'react';
import './CSSFiles/AllAdmins.css';

const AllAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAdminId, setEditingAdminId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchAllAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Fetching all admins...');
      const response = await fetch(
        'http://localhost:8082/api/users/alladmins',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch admins: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Fetched admins:', data);
      console.log('👥 Total admins found:', data?.length || 0);

      setAdmins(data || []);
    } catch (error) {
      console.error('❌ Error fetching admins:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (adminId, updateData) => {
    setUpdating(true);
    try {
      console.log(`🔄 Updating admin ${adminId}:`, updateData);

      const response = await fetch(
        `http://localhost:8082/api/users/${adminId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log('📥 Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update error response:', errorText);
        throw new Error(
          `Failed to update admin: ${response.status} - ${errorText}`
        );
      }

      const updatedAdmin = await response.json();
      console.log('✅ Admin updated successfully:', updatedAdmin);

      // Update local state
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === adminId ? { ...admin, ...updateData } : admin
        )
      );

      setEditingAdminId(null);
      setEditForm({ name: '', email: '', role: '' });

      alert(`Admin updated successfully!`);
    } catch (error) {
      console.error('❌ Error updating admin:', error);
      setError(`Failed to update admin: ${error.message}`);
      alert(`Failed to update admin: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const deleteAdmin = async (adminId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this admin? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeleting(adminId);
    try {
      console.log(`🗑️ Deleting admin ${adminId}...`);

      const response = await fetch(
        `http://localhost:8082/api/users/${adminId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('📥 Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Delete error response:', errorText);
        throw new Error(
          `Failed to delete admin: ${response.status} - ${errorText}`
        );
      }

      console.log('✅ Admin deleted successfully');

      // Update local state
      setAdmins((prevAdmins) =>
        prevAdmins.filter((admin) => admin.id !== adminId)
      );

      alert('Admin deleted successfully!');
    } catch (error) {
      console.error('❌ Error deleting admin:', error);
      setError(`Failed to delete admin: ${error.message}`);
      alert(`Failed to delete admin: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const startEditing = (admin) => {
    setEditingAdminId(admin.id);
    setEditForm({
      name: admin.name || '',
      email: admin.email || '',
      role: admin.role || '',
    });
  };

  const cancelEditing = () => {
    setEditingAdminId(null);
    setEditForm({ name: '', email: '', role: '' });
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (
      !editForm.name.trim() ||
      !editForm.email.trim() ||
      !editForm.role.trim()
    ) {
      alert('Please fill in all fields');
      return;
    }

    updateAdmin(editingAdminId, editForm);
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'super_admin':
      case 'superadmin':
        return 'role-superadmin';
      case 'moderator':
        return 'role-moderator';
      default:
        return 'role-default';
    }
  };

  useEffect(() => {
    fetchAllAdmins();
  }, []);
  if (loading) {
    return (
      <div className="all-admins-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading administrators...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-admins-container">
        <div className="error-container">
          <h3>❌ Error Loading Admins</h3>
          <p>{error}</p>
          <button onClick={fetchAllAdmins} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="all-admins-container">
      <div className="admins-header">
        <h1>👥 Administrator Management</h1>
        <p>Manage all system administrators</p>
        <button
          className="refresh-button"
          onClick={fetchAllAdmins}
          disabled={loading}
        >
          🔄 Refresh Admins
        </button>
      </div>

      <div className="admins-summary">
        <div className="summary-card">
          <h3>Total Administrators</h3>
          <span className="count">{admins.length}</span>
        </div>
        <div className="summary-card">
          <h3>Last Updated</h3>
          <span className="timestamp">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {admins.length === 0 ? (
        <div className="no-admins">
          <h3>No Administrators Found</h3>
          <p>No admin accounts have been created yet.</p>
        </div>
      ) : (
        <div className="admins-table-container">
          <table className="admins-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td data-label="ID">#{admin.id}</td>

                  <td data-label="Name">
                    {editingAdminId === admin.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          handleFormChange('name', e.target.value)
                        }
                        className="edit-input"
                        disabled={updating}
                      />
                    ) : (
                      <span className="admin-name">{admin.name || 'N/A'}</span>
                    )}
                  </td>

                  <td data-label="Email">
                    {editingAdminId === admin.id ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          handleFormChange('email', e.target.value)
                        }
                        className="edit-input"
                        disabled={updating}
                      />
                    ) : (
                      <span className="admin-email">
                        {admin.email || 'N/A'}
                      </span>
                    )}
                  </td>

                  <td data-label="Role">
                    {editingAdminId === admin.id ? (
                      <select
                        value={editForm.role}
                        onChange={(e) =>
                          handleFormChange('role', e.target.value)
                        }
                        className="edit-select"
                        disabled={updating}
                      >
                        <option value="">Select Role</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                        <option value="MODERATOR">MODERATOR</option>
                      </select>
                    ) : (
                      <span
                        className={`role-badge ${getRoleBadgeClass(
                          admin.role
                        )}`}
                      >
                        {admin.role || 'USER'}
                      </span>
                    )}
                  </td>

                  <td data-label="Created Date">
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString()
                      : admin.created_at
                      ? new Date(admin.created_at).toLocaleDateString()
                      : 'N/A'}
                  </td>

                  <td data-label="Status">
                    <span
                      className={`status-badge ${
                        admin.active ? 'active' : 'inactive'
                      }`}
                    >
                      {admin.active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td data-label="Actions" className="actions-cell">
                    {editingAdminId === admin.id ? (
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={handleSave}
                          disabled={updating}
                        >
                          {updating ? '⏳' : '💾'}{' '}
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={cancelEditing}
                          disabled={updating}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="admin-actions">
                        <button
                          className="edit-btn"
                          onClick={() => startEditing(admin)}
                          disabled={updating || deleting === admin.id}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => deleteAdmin(admin.id)}
                          disabled={updating || deleting === admin.id}
                        >
                          {deleting === admin.id
                            ? '⏳ Deleting...'
                            : '🗑️ Delete'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AllAdmins;
