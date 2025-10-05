import React, { useState } from 'react';
import './CSSFiles/AllOrders.css';
const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const fetchAllOrders = async () => {
    // Function to fetch all orders from the backend
    // This can be called on component mount or via a refresh button
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8084/api/orders/all', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const startEditing = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setNewStatus(currentStatus);
  };
  const updateOrderStatus = async (orderId) => {
    setUpdating(true);
    try {
      const response = await fetch(
        `http://localhost:8084/api/orders/${orderId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      if (!response.ok) throw new Error('Failed to update order status');
      // Update the order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setEditingOrderId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };
  React.useEffect(() => {
    fetchAllOrders();
  }, []);
  return (
    <div className="aoi-container">
      <h1>All Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {editingOrderId === order.id ? (
                  <input
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                ) : (
                  order.status
                )}
              </td>
              <td>
                {editingOrderId === order.id ? (
                  <button onClick={() => updateOrderStatus(order.id)}>
                    Save
                  </button>
                ) : (
                  <button onClick={() => startEditing(order.id, order.status)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllOrders;
