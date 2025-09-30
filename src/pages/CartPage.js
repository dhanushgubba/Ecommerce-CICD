import React, { useState, useEffect, useCallback } from 'react';
import './CSSFiles/CartPage.css';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cart, setCart] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  // Fetch product details by ID
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8083/api/products/${productId}`
      );
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error(`Error fetching product ${productId}:`, error);
      return null;
    }
  };

  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch cart items from cart service
      const response = await fetch(`http://localhost:8085/api/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const cartData = await response.json();
      console.log('Cart data received:', cartData);

      let cartItems = [];
      if (cartData && cartData.items) {
        cartItems = cartData.items;
      } else if (Array.isArray(cartData)) {
        cartItems = cartData;
      }

      // If cart items exist, fetch product details for each item
      if (cartItems.length > 0) {
        const enrichedCartItems = await Promise.all(
          cartItems.map(async (cartItem) => {
            // Fetch product details from product service
            const productDetails = await fetchProductDetails(
              cartItem.productId || cartItem.id
            );

            if (productDetails) {
              // Merge cart item data with product details
              return {
                ...cartItem,
                id: cartItem.productId || cartItem.id,
                productId: cartItem.productId || cartItem.id,
                name: productDetails.name,
                price: productDetails.price,
                imageUrl: productDetails.imageUrl,
                brand: productDetails.brand,
                description: productDetails.description,
                sku: productDetails.sku,
                category: productDetails.category,
                quantity: cartItem.quantity || 1,
              };
            } else {
              // Fallback if product details can't be fetched
              return {
                ...cartItem,
                id: cartItem.productId || cartItem.id,
                productId: cartItem.productId || cartItem.id,
                name: 'Product Name Not Available',
                price: 0,
                imageUrl: null,
                brand: 'Unknown',
                description: 'Product details not available',
                sku: 'N/A',
                category: 'Unknown',
                quantity: cartItem.quantity || 1,
              };
            }
          })
        );

        console.log('Enriched cart items:', enrichedCartItems);
        setCart(enrichedCartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    const loadCartItems = async () => {
      if (userId) {
        await fetchCartItems();
      } else {
        setError('User not found. Please login.');
        setLoading(false);
      }
    };

    loadCartItems();
  }, [userId, fetchCartItems]); // Include fetchCartItems in dependencies

  const removeCartItem = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/cart/${userId}/remove?productId=${productId}`,
        {
          method: 'DELETE', // Use DELETE method as per your backend
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Successfully removed item, refresh cart data
        fetchCartItems();
      } else {
        console.error('Failed to remove item from cart');
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeCartItem(productId);
      return;
    }

    try {
      // Since your backend doesn't have update quantity endpoint,
      // we'll simulate by removing and adding back with new quantity
      await removeCartItem(productId);

      // Add back with new quantity
      const response = await fetch(
        `http://localhost:8085/api/cart/${userId}/add?productId=${productId}&quantity=${newQuantity}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8085/api/cart/${userId}/clear`,
        {
          method: 'DELETE', // Use DELETE method as per your backend
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        // Successfully cleared cart, refresh cart data
        fetchCartItems();
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Calculate cart totals
  const calculateSubtotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotal = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    return (subtotal + tax + shipping).toFixed(2);
  };

  if (loading) {
    return <div>Loading Cart....</div>;
  }

  if (error) {
    return (
      <div className="cart-page">
        <h1>Your Shopping Cart</h1>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchCartItems}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>🛒 Your Shopping Cart</h1>
          <p>
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Start shopping to add items to your cart!</p>
            <button
              className="continue-shopping-btn"
              onClick={() => window.history.back()}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id || item.productId} className="cart-item">
                  <div className="item-image">
                    <img
                      src={
                        item.imageUrl ||
                        item.image ||
                        'https://via.placeholder.com/120x120?text=No+Image'
                      }
                      alt={item.name || item.productName}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/120x120?text=No+Image';
                      }}
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-name">
                      {item.name || item.productName}
                    </h3>
                    <p className="item-brand">{item.brand}</p>
                    <p className="item-description">{item.description}</p>
                    <div className="item-meta">
                      <span className="item-sku">SKU: {item.sku}</span>
                      <span className="item-category">{item.category}</span>
                    </div>
                  </div>

                  <div className="item-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn minus"
                        onClick={() =>
                          updateQuantity(
                            item.productId || item.id,
                            item.quantity - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="quantity-btn plus"
                        onClick={() =>
                          updateQuantity(
                            item.productId || item.id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-price">
                    <div className="unit-price">${item.price}</div>
                    <div className="total-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  <div className="item-actions">
                    <button
                      className="remove-btn"
                      onClick={() => removeCartItem(item.productId || item.id)}
                      title="Remove from cart"
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>

                <div className="summary-line">
                  <span>Subtotal ({cart.length} items):</span>
                  <span>${calculateSubtotal()}</span>
                </div>

                <div className="summary-line">
                  <span>Tax (8%):</span>
                  <span>
                    ${(parseFloat(calculateSubtotal()) * 0.08).toFixed(2)}
                  </span>
                </div>

                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>
                    {parseFloat(calculateSubtotal()) > 50 ? 'FREE' : '$9.99'}
                  </span>
                </div>

                <hr className="summary-divider" />

                <div className="summary-line total">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>

                <div className="cart-actions">
                  <button className="checkout-btn">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </button>
                  <button
                    className="continue-shopping-btn"
                    onClick={() => window.history.back()}
                  >
                    Continue Shopping
                  </button>
                  <button className="clear-cart-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>

                <div className="shipping-info">
                  <p>💚 Free shipping on orders over $50</p>
                  <p>📦 Estimated delivery: 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default CartPage;
