// Debug helper - Add this temporarily to your CartPage.js to test data flow

const debugCartData = () => {
  console.log('=== CART DEBUG INFO ===');
  console.log('User ID:', localStorage.getItem('userId'));
  console.log(
    'Cart Service URL:',
    `http://localhost:8085/api/cart/${localStorage.getItem('userId')}`
  );
  console.log('Product Service URL:', 'http://localhost:8083/api/products/');

  // Test cart API
  fetch(`http://localhost:8085/api/cart/${localStorage.getItem('userId')}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Raw cart data from API:', data);
    })
    .catch((error) => {
      console.error('Cart API Error:', error);
    });
};

// Call this function in browser console to debug
window.debugCartData = debugCartData;
