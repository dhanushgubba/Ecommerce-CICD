import React, { useState, useEffect } from 'react';
import './CSSFiles/AllOrders.css';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch all orders
  const fetchAllOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8084/api/orders/all');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update order status
  const updateOrderStatus = async (orderId, statusToUpdate) => {
    setUpdating(true);
    setError(''); // Clear any previous errors

    try {
      console.log(`🔄 Updating order ${orderId} status to: ${statusToUpdate}`);
      console.log(
        '📤 Request URL:',
        `http://localhost:8084/api/orders/${orderId}/status`
      );
      console.log(
        '📤 Request body:',
        JSON.stringify({ status: statusToUpdate })
      );

      const response = await fetch(
        `http://localhost:8084/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: statusToUpdate }),
        }
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(
          `Failed to update order status: ${response.status} - ${errorText}`
        );
      }

      // Try to parse response
      let updatedOrder;
      try {
        const responseText = await response.text();
        console.log('📥 Response text:', responseText);
        if (responseText.trim()) {
          updatedOrder = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.warn('⚠️ Response parsing failed, assuming success');
      }

      console.log('✅ Status update successful');

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: statusToUpdate } : order
        )
      );

      setEditingOrderId(null);
      setNewStatus('');

      // Show success message
      alert(
        `Order #${orderId} status updated to ${statusToUpdate} successfully!`
      );
    } catch (err) {
      console.error('❌ Update failed:', err);
      setError(`Failed to update order status: ${err.message}`);
      alert(`Failed to update order status: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Delete order
  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(
        `http://localhost:8084/api/orders/${orderId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete order');

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // ✅ Start editing mode
  const startEditing = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setNewStatus(currentStatus);
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="aoi-container">
      <div className="aoi-header">
        <h1>📦 All Orders (Super Admin)</h1>
        <button className="refresh-btn" onClick={fetchAllOrders}>
          🔄 Refresh
        </button>
      </div>

      {loading && <p className="loading">Loading orders...</p>}
      {error && <p className="error">{error}</p>}

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Total Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  No orders found
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.userId}</td>
                  <td>{order.phoneno}</td>
                  <td>{order.address}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    {editingOrderId === order.id ? (
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="status-select"
                        disabled={updating}
                      >
                        <option value="NEW">NEW</option>
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    ) : (
                      <span
                        className={`status-badge ${order.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td>{order.totalPrice?.toFixed(2)}</td>
                  <td className="actions">
                    {editingOrderId === order.id ? (
                      <>
                        <button
                          className="save-btn"
                          onClick={() => updateOrderStatus(order.id, newStatus)}
                          disabled={updating}
                        >
                          {updating && editingOrderId === order.id
                            ? '⏳ Saving...'
                            : '💾 Save'}
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingOrderId(null)}
                          disabled={updating}
                        >
                          ❌ Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(order.id, order.status)}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order.id)}
                    >
                      🗑️ Delete
                    </button>
                    {updating && editingOrderId === order.id && (
                      <span className="updating-text">⏳ Updating...</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
