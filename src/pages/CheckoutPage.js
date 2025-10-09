import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CSSFiles/CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    address: '',
    phoneNumber: '',
    paymentMethod: 'credit-card',
    cardDetails: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const [paymentStatus, setPaymentStatus] = useState({
    processing: false,
    completed: false,
    failed: false,
    transactionId: null,
  });

  // Payment method options
  const paymentMethods = [
    { id: 'credit-card', label: 'Credit Card', icon: '💳' },
    { id: 'debit-card', label: 'Debit Card', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'google-pay', label: 'Google Pay', icon: '🔵' },
    { id: 'apple-pay', label: 'Apple Pay', icon: '🍎' },
    { id: 'upi', label: 'UPI Payment', icon: '📱' },
    { id: 'bank-transfer', label: 'Bank Transfer', icon: '🏦' },
    { id: 'cash-on-delivery', label: 'Cash on Delivery', icon: '💵' },
  ];

  const userId = localStorage.getItem('userId');

  // Utility function to help track orders by product ID
  const getOrderTrackingInfo = () => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      const order = JSON.parse(lastOrder);
      console.log('Order Tracking Info:');
      console.log('Order ID:', order.id);
      console.log('Products in this order:');
      order.items?.forEach((item, index) => {
        console.log(
          `${index + 1}. Product ID: ${item.productId}, Name: ${
            item.name
          }, Qty: ${item.quantity}`
        );
      });
      return order;
    }
    return null;
  };

  useEffect(() => {
    // Get cart items from navigation state or localStorage
    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
    } else {
      // Fallback: get from localStorage
      const savedCartItems = localStorage.getItem('checkoutCartItems');
      if (savedCartItems) {
        setCartItems(JSON.parse(savedCartItems));
      } else {
        // No cart items, redirect back to cart
        navigate('/cart');
      }
    }
  }, [location.state, navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTax = () => {
    return (parseFloat(calculateSubtotal()) * 0.08).toFixed(2); // 8% tax
  };

  const calculateShipping = () => {
    return parseFloat(calculateSubtotal()) > 50 ? 0 : 9.99;
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax());
    const shipping = calculateShipping();
    return (subtotal + tax + shipping).toFixed(2);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardDetailsChange = (e) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        [name]: value,
      },
    }));
  };

  // Clear cart after successful order
  const clearCart = async () => {
    try {
      await fetch(`http://localhost:8085/api/cart/${userId}/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Process payment through payment microservice
  const processPayment = async (orderId, totalAmount) => {
    setPaymentStatus({
      processing: true,
      completed: false,
      failed: false,
      transactionId: null,
    });

    try {
      const paymentPayload = {
        orderId: orderId,
        amount: totalAmount,
        currency: 'USD',
        paymentMethod: checkoutData.paymentMethod,
        paymentDetails: checkoutData.paymentMethod.includes('card')
          ? {
              cardNumber: checkoutData.cardDetails.cardNumber,
              expiryDate: checkoutData.cardDetails.expiryDate,
              cvv: checkoutData.cardDetails.cvv,
              cardholderName: checkoutData.cardDetails.cardholderName,
            }
          : null,
        userId: parseInt(userId),
        customerInfo: {
          address: checkoutData.address,
          phoneNumber: checkoutData.phoneNumber,
        },
      };

      console.log('💳 Processing payment:', paymentPayload);

      // Call your payment microservice (adjust port as needed)
      const paymentResponse = await fetch(
        'http://localhost:8086/api/payments/process',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(paymentPayload),
        }
      );

      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        console.log('✅ Payment processed successfully:', paymentResult);

        setPaymentStatus({
          processing: false,
          completed: true,
          failed: false,
          transactionId: paymentResult.transactionId || paymentResult.id,
        });

        return paymentResult;
      } else {
        throw new Error(`Payment failed: ${paymentResponse.status}`);
      }
    } catch (error) {
      console.error('❌ Payment processing failed:', error);
      setPaymentStatus({
        processing: false,
        completed: false,
        failed: true,
        transactionId: null,
      });
      throw error;
    }
  };

  // Process the order
  const processOrder = async () => {
    if (!checkoutData.address.trim()) {
      alert('Please enter a delivery address.');
      return;
    }

    if (!checkoutData.phoneNumber.trim()) {
      alert('Please enter a phone number.');
      return;
    }

    // Validate phone number is numeric and within range
    const phoneNum = parseInt(checkoutData.phoneNumber);
    if (isNaN(phoneNum) || phoneNum <= 0) {
      alert('Please enter a valid phone number (numbers only).');
      return;
    }

    if (
      checkoutData.paymentMethod === 'credit-card' ||
      checkoutData.paymentMethod === 'debit-card'
    ) {
      if (
        !checkoutData.cardDetails.cardNumber.trim() ||
        !checkoutData.cardDetails.expiryDate.trim() ||
        !checkoutData.cardDetails.cvv.trim() ||
        !checkoutData.cardDetails.cardholderName.trim()
      ) {
        alert('Please fill in all card details.');
        return;
      }
    }

    try {
      setLoading(true);

      const orderPayLoad = {
        userId: parseInt(userId),
        totalPrice: parseFloat(calculateTotal()),
        address: checkoutData.address,
        phoneno: parseInt(checkoutData.phoneNumber), // Convert to Long as expected by backend
        status: 'NEW',
        items: cartItems.map((item) => ({
          productId: parseInt(item.productId || item.id), // Store in OrderItem where it belongs
          quantity: parseInt(item.quantity), // Store in OrderItem where it belongs
          price: parseFloat(item.price), // Store in OrderItem where it belongs
        })),
      };

      console.log('🛒 Cart items before mapping:', cartItems);
      console.log('📦 Order payload being sent:', orderPayLoad);

      // Debug: Show exactly which product IDs and quantities are being sent
      const productDetails = cartItems.map((item) => ({
        originalId: item.id,
        productId: item.productId,
        finalProductId: parseInt(item.productId || item.id),
        name: item.name,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
      }));
      console.log('📊 Product details for OrderItems:', productDetails);

      const response = await fetch('http://localhost:8084/api/orders/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayLoad),
      });

      if (response.ok) {
        let orderResult;
        try {
          orderResult = await response.json();
        } catch (jsonError) {
          console.log('Response is not JSON, treating as success');
          orderResult = {
            id: Math.floor(Math.random() * 100000),
            status: 'NEW',
          };
        }

        console.log('✅ Order placed successfully:', orderResult);

        // Process payment after successful order creation
        let paymentResult = null;
        if (checkoutData.paymentMethod !== 'cash-on-delivery') {
          try {
            console.log('💳 Processing payment for order:', orderResult.id);
            paymentResult = await processPayment(
              orderResult.id,
              parseFloat(calculateTotal())
            );
            console.log('✅ Payment processed successfully:', paymentResult);

            // Update order status to PAID after successful payment
            await fetch(
              `http://localhost:8084/api/orders/${orderResult.id}/status`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: 'PAID',
                  paymentMethod: checkoutData.paymentMethod,
                  transactionId:
                    paymentResult.transactionId || paymentResult.id,
                }),
              }
            );
          } catch (paymentError) {
            console.error('❌ Payment failed:', paymentError);
            alert(`Order created but payment failed: ${paymentError.message}`);
            // Don't return here - still show order confirmation
          }
        }
        console.log('🎯 ORDER TRACKING SUMMARY:');
        console.log('   📋 Order ID:', orderResult.id);
        console.log('   👤 User ID:', userId);
        console.log('   💰 Total Price:', calculateTotal());
        console.log('   📦 Items Count:', cartItems.length);
        console.log('   🏠 Address:', checkoutData.address);
        console.log('   📞 Phone:', checkoutData.phoneNumber);

        cartItems.forEach((item, index) => {
          console.log(
            `   ${index + 1}. Product ID: ${item.productId || item.id} | ${
              item.name
            } | Qty: ${item.quantity} | Price: $${item.price}`
          );
        });

        // Store order details for success page with PRODUCT IDs and PAYMENT INFO
        localStorage.setItem(
          'lastOrder',
          JSON.stringify({
            id: orderResult.id || Math.floor(Math.random() * 100000),
            totalPrice: calculateTotal(),
            orderDate: new Date().toLocaleDateString(),
            status: paymentResult ? 'PAID' : orderResult.status || 'NEW',
            itemCount: cartItems.length,
            phoneNumber: checkoutData.phoneNumber || checkoutData.phoneno,
            shippingAddress: checkoutData.address,
            // PAYMENT INFORMATION STORED
            paymentMethod: checkoutData.paymentMethod,
            paymentStatus: paymentResult ? 'COMPLETED' : 'PENDING',
            transactionId: paymentResult?.transactionId || null,
            paymentTimestamp: paymentResult ? new Date().toISOString() : null,
            // IMPORTANT: Store the actual items with product IDs for tracking
            items: cartItems.map((item) => ({
              productId: item.productId || item.id,
              name: item.name,
              brand: item.brand,
              quantity: item.quantity,
              price: item.price,
              total: (item.price * item.quantity).toFixed(2),
              imageUrl: item.imageUrl,
            })),
          })
        );

        // Clear the cart after successful order
        await clearCart();

        // Clear localStorage checkout data
        localStorage.removeItem('checkoutCartItems');

        // Redirect to success page
        navigate('/order-success');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          errorData = { message: `Server error: ${response.status}` };
        }
        console.error('Order placement failed:', errorData);
        alert(
          `Failed to place order: ${errorData.message || 'Please try again.'}`
        );
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        alert(
          'Network error: Could not connect to server. Please check if the order service is running on port 8084.'
        );
      } else {
        alert(
          `An error occurred during checkout: ${error.message}. Please try again.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <h2>No items to checkout</h2>
            <p>
              Your cart is empty. Please add items before proceeding to
              checkout.
            </p>
            <button onClick={() => navigate('/cart')} className="btn-primary">
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button onClick={() => navigate('/cart')} className="back-btn">
            ← Back to Cart
          </button>
          <h1>🔒 Secure Checkout</h1>
          <p>Review your order and complete your purchase</p>
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary-section">
            <h2>📦 Order Summary</h2>
            <div className="cart-items-review">
              {cartItems.map((item) => (
                <div key={item.id || item.productId} className="checkout-item">
                  <div className="item-image">
                    <img
                      src={
                        item.imageUrl ||
                        'https://via.placeholder.com/80x80?text=No+Image'
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-brand">{item.brand}</p>
                    <div className="item-pricing">
                      <span className="quantity">Qty: {item.quantity}</span>
                      <span className="price">${item.price} each</span>
                      <span className="total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-line">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="total-line">
                <span>Tax (8%):</span>
                <span>${calculateTax()}</span>
              </div>
              <div className="total-line">
                <span>Shipping:</span>
                <span>
                  {calculateShipping() === 0
                    ? 'FREE'
                    : `$${calculateShipping().toFixed(2)}`}
                </span>
              </div>
              <div className="total-line grand-total">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="checkout-form-section">
            <h2>💳 Payment & Shipping</h2>

            <div className="form-section">
              <h3>📍 Shipping Address</h3>
              <div className="form-group">
                <label htmlFor="address">Delivery *</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your complete delivery address..."
                  value={checkoutData.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  value={checkoutData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>💳 Payment Method</h3>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`payment-option ${
                      checkoutData.paymentMethod === method.id ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={checkoutData.paymentMethod === method.id}
                      onChange={handleInputChange}
                    />
                    <span className="payment-icon">{method.icon}</span>
                    <span className="payment-label">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Payment Status Indicator */}
              {paymentStatus.processing && (
                <div className="payment-status processing">
                  <span>🔄 Processing payment...</span>
                </div>
              )}
              {paymentStatus.completed && (
                <div className="payment-status completed">
                  <span>
                    ✅ Payment completed! Transaction ID:{' '}
                    {paymentStatus.transactionId}
                  </span>
                </div>
              )}
              {paymentStatus.failed && (
                <div className="payment-status failed">
                  <span>❌ Payment failed. Please try again.</span>
                </div>
              )}

              {(checkoutData.paymentMethod === 'credit-card' ||
                checkoutData.paymentMethod === 'debit-card') && (
                <div className="card-details">
                  <div className="form-group">
                    <label htmlFor="cardholderName">Cardholder Name *</label>
                    <input
                      type="text"
                      id="cardholderName"
                      name="cardholderName"
                      placeholder="Name on card"
                      value={checkoutData.cardDetails.cardholderName}
                      onChange={handleCardDetailsChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number *</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={checkoutData.cardDetails.cardNumber}
                      onChange={handleCardDetailsChange}
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date *</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={checkoutData.cardDetails.expiryDate}
                        onChange={handleCardDetailsChange}
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cvv">CVV *</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        value={checkoutData.cardDetails.cvv}
                        onChange={handleCardDetailsChange}
                        maxLength="4"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="security-info">
              <p>🔒 Your payment information is secure and encrypted</p>
              <p>📦 Estimated delivery: 3-5 business days</p>
            </div>

            <div className="checkout-actions">
              <button
                className="place-order-btn"
                onClick={processOrder}
                disabled={loading}
              >
                {loading
                  ? '🔄 Processing...'
                  : `🔒 Place Order - $${calculateTotal()}`}
              </button>
              <button
                className="cancel-btn"
                onClick={() => navigate('/cart')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
