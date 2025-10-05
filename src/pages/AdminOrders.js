import React, { useState, useEffect } from 'react';
import './CSSFiles/AdminOrders.css';
const AdminOrders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [editingOrderId, setEditingOrderId] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [updating, setUpdating] = React.useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('🔍 Admin fetching all orders...');

      const response = await fetch(`http://localhost:8084/api/orders/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📥 Admin orders API response status:', response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }

      const ordersData = await response.json();
      console.log('📦 Admin orders data received:', ordersData);
      console.log('📊 Total orders found:', ordersData?.length || 0);

      setOrders(ordersData || []);
    } catch (error) {
      console.error('❌ Error fetching admin orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      console.log(`🔄 Updating order ${orderId} status to: ${newStatus}`);
      console.log(
        '📤 Request URL:',
        `http://localhost:8084/api/orders/${orderId}/status`
      );
      console.log('📤 Request body:', JSON.stringify({ status: newStatus }));

      const response = await fetch(
        `http://localhost:8084/api/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      console.log('📥 Update status API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response body:', errorText);
        throw new Error(
          `Failed to update order status: ${response.status} - ${errorText}`
        );
      }

      let updatedOrder;
      try {
        const responseText = await response.text();
        console.log('📥 Raw response text:', responseText);

        if (responseText.trim()) {
          updatedOrder = JSON.parse(responseText);
        } else {
          updatedOrder = { id: orderId, status: newStatus };
        }
      } catch (jsonError) {
        console.warn('⚠️ Response is not JSON, assuming success');
        updatedOrder = { id: orderId, status: newStatus };
      }

      console.log(
        '✅ Frontend: Order status updated successfully:',
        updatedOrder
      );

      // 🔍 VERIFY: Fetch fresh data to confirm database update
      console.log('🔍 Verifying database update by fetching fresh data...');
      setTimeout(async () => {
        try {
          const verifyResponse = await fetch(
            `http://localhost:8084/api/orders/${orderId}`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
            }
          );

          if (verifyResponse.ok) {
            const verifyOrder = await verifyResponse.json();
            console.log(
              '🔍 Database verification - Current status in DB:',
              verifyOrder.status
            );

            if (verifyOrder.status === newStatus) {
              console.log('✅ SUCCESS: Status successfully saved to database!');
            } else {
              console.error('❌ FAILURE: Status NOT saved to database!');
              console.error(
                `Expected: ${newStatus}, Got: ${verifyOrder.status}`
              );
            }
          }
        } catch (verifyError) {
          console.error('❌ Error verifying database update:', verifyError);
        }
      }, 1000);

      // Update the local orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Reset editing state
      setEditingOrderId(null);
      setSelectedStatus('');

      alert(
        `Order #${orderId} status updated to ${newStatus} successfully!\nCheck console for database verification.`
      );
    } catch (error) {
      console.error('❌ Error updating order status:', error);
      alert(`Failed to update order status: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleEditStatus = (orderId, currentStatus) => {
    console.log('✏️ Starting edit mode:', {
      orderId,
      currentStatus,
      defaultStatus: currentStatus || 'NEW',
    });
    setEditingOrderId(orderId);
    setSelectedStatus(currentStatus || 'NEW');
  };

  const handleStatusChange = (newStatus) => {
    console.log('📝 Status changed to:', newStatus);
    setSelectedStatus(newStatus);
  };

  const handleSaveStatus = (orderId) => {
    console.log('💾 Attempting to save status:', {
      orderId,
      selectedStatus,
      editingOrderId,
    });

    if (!selectedStatus || selectedStatus.trim() === '') {
      alert('Please select a valid status before saving.');
      return;
    }

    if (editingOrderId !== orderId) {
      alert('Order ID mismatch. Please try again.');
      return;
    }

    updateOrderStatus(orderId, selectedStatus);
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setSelectedStatus('');
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  if (loading) {
    return (
      <div className="admin-orders-container">
        <h1>Admin Orders Management</h1>
        <div className="loading-container">
          <p>Loading all orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-orders-container">
        <h1>Admin Orders Management</h1>
        <div className="error-container">
          <p style={{ color: 'red' }}>Error: {error}</p>
          <button onClick={fetchOrders}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <div className="admin-header">
        <h1>📦 Admin Orders Management</h1>
        <p>Manage all customer orders from here</p>
        <button
          className="refresh-button"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Orders'}
        </button>
      </div>

      <div className="orders-summary">
        <p>
          <strong>Total Orders:</strong> {orders.length}
        </p>
        <p>
          <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <h3>No orders found</h3>
          <p>No customer orders have been placed yet.</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer ID</th>
                <th>Status</th>
                <th>Total Price</th>
                <th>Items</th>
                <th>Order Date</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td data-label="Order ID">#{order.id}</td>
                  <td data-label="Customer ID">{order.userId}</td>
                  <td data-label="Status">
                    {editingOrderId === order.id ? (
                      <select
                        value={selectedStatus}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="status-select"
                        disabled={updating}
                      >
                        <option value="NEW">NEW</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    ) : (
                      <span
                        className={`status-badge status-${order.status?.toLowerCase()}`}
                      >
                        {order.status || 'NEW'}
                      </span>
                    )}
                  </td>
                  <td data-label="Total Price">
                    ${order.totalPrice?.toFixed(2) || '0.00'}
                  </td>
                  <td data-label="Items">{order.items?.length || 0} items</td>
                  <td data-label="Order Date">
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td data-label="Address">{order.address || 'N/A'}</td>
                  <td data-label="Phone">{order.phoneno || 'N/A'}</td>
                  <td data-label="Actions">
                    <button className="btn-view">View</button>
                    {editingOrderId === order.id ? (
                      <>
                        <button
                          className="btn-save"
                          onClick={() => handleSaveStatus(order.id)}
                          disabled={updating}
                        >
                          {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={handleCancelEdit}
                          disabled={updating}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-edit"
                        onClick={() => handleEditStatus(order.id, order.status)}
                        disabled={updating}
                      >
                        Edit Status
                      </button>
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
export default AdminOrders;
