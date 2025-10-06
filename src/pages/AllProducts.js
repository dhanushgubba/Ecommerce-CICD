import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/AllProducts.css';
const AllProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState('');
  const [reviewCount, setReviewCount] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8083/api/products/all');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again.');
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (
      !name.trim() ||
      !description.trim() ||
      !price.toString().trim() ||
      !quantity.toString().trim() ||
      !category.trim() ||
      !brand.trim() ||
      !sku.trim() ||
      !imageUrl.trim() ||
      !rating.toString().trim() ||
      !reviewCount.toString().trim()
    ) {
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setCategory('');
    setBrand('');
    setSku('');
    setImageUrl('');
    setRating('');
    setReviewCount('');
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('All fields are required');
      return;
    }
    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      quantity,
      category,
      brand,
      sku,
      imageUrl,
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount, 10),
    };
    try {
      const response = await fetch('http://localhost:8083/api/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error('Failed to add product');
      const data = await response.json();
      setProducts((prevProducts) => [...prevProducts, data]);
      resetForm();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategory(product.category);
    setBrand(product.brand);
    setSku(product.sku);
    setImageUrl(product.imageUrl);
    setRating(product.rating);
    setReviewCount(product.reviewCount);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('All fields are required');
      return;
    }
    const updatedProduct = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category,
      brand,
      sku,
      imageUrl,
      rating: parseFloat(rating),
      reviewCount: parseInt(reviewCount, 10),
    };
    try {
      const response = await fetch(
        `http://localhost:8083/api/products/${editProductId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) throw new Error('Failed to update product');
      const data = await response.json();
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editProductId ? data : product
        )
      );
      resetForm();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      const response = await fetch(
        `http://localhost:8083/api/products/${productId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  };

  const cancelEdit = () => {
    setEditProductId(null);
    resetForm();
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);
  if (loading) {
    return (
      <div className="allproducts-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="allproducts-container">
      {/* Header Section */}
      <div className="products-header">
        <h1>🛍️ Product Management System</h1>
        <p>Manage your product inventory</p>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchProducts}>
            🔄 Refresh Products
          </button>
          <button
            className="add-product-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            ➕ Add New Product
          </button>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={fetchProducts} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Product Form Section */}
      <div className="product-form-section">
        <h2>{editProductId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
        <form
          onSubmit={editProductId ? handleUpdateProduct : handleAddProduct}
          className="product-form"
        >
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Beauty">Beauty</option>
                <option value="Automotive">Automotive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                type="text"
                id="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Enter SKU"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rating">Rating (1-5) *</label>
              <input
                type="number"
                id="rating"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="4.5"
                min="1"
                max="5"
                step="0.1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="reviewCount">Review Count *</label>
              <input
                type="number"
                id="reviewCount"
                value={reviewCount}
                onChange={(e) => setReviewCount(e.target.value)}
                placeholder="Enter review count"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="imageUrl">Image URL *</label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
            {imageUrl && (
              <div className="image-preview">
                <img src={imageUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editProductId ? '✅ Update Product' : '➕ Add Product'}
            </button>
            {editProductId && (
              <button type="button" className="cancel-btn" onClick={cancelEdit}>
                ❌ Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Products Statistics */}
      <div className="products-stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <span className="stat-number">{products.length}</span>
        </div>
        <div className="stat-card">
          <h3>Categories</h3>
          <span className="stat-number">
            {[...new Set(products.map((p) => p.category))].length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <span className="stat-number">
            $
            {products
              .reduce((sum, p) => sum + p.price * p.quantity, 0)
              .toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <h3>Out of Stock</h3>
          <span className="stat-number">
            {products.filter((p) => p.quantity === 0).length}
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table-section">
        <h2>📊 All Products ({products.length})</h2>

        {products.length === 0 ? (
          <div className="no-products">
            <h3>No Products Found</h3>
            <p>Start by adding your first product using the form above.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Info</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-image-container">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="table-product-image"
                          onClick={() => handleQuickView(product)}
                        />
                      </div>
                    </td>

                    <td>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p className="product-brand">{product.brand}</p>
                        <p className="product-sku">SKU: {product.sku}</p>
                      </div>
                    </td>

                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>

                    <td>
                      <span className="price">${product.price}</span>
                    </td>

                    <td>
                      <span
                        className={`stock ${
                          product.quantity === 0
                            ? 'out-of-stock'
                            : product.quantity < 10
                            ? 'low-stock'
                            : 'in-stock'
                        }`}
                      >
                        {product.quantity} units
                      </span>
                    </td>

                    <td>
                      <div className="rating">
                        <span className="rating-stars">
                          {'★'.repeat(Math.floor(product.rating))}
                          {'☆'.repeat(5 - Math.floor(product.rating))}
                        </span>
                        <span className="rating-text">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          product.quantity > 0 ? 'active' : 'inactive'
                        }`}
                      >
                        {product.quantity > 0 ? 'Active' : 'Out of Stock'}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => handleQuickView(product)}
                          title="Quick View"
                        >
                          👁️
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete Product"
                        >
                          🗑️
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

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <div className="modal-overlay" onClick={closeQuickView}>
          <div
            className="quick-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={closeQuickView}>
              ✖️
            </button>

            <div className="modal-content">
              <div className="modal-image">
                <img
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.name}
                />
              </div>

              <div className="modal-info">
                <h2>{quickViewProduct.name}</h2>
                <p className="modal-brand">Brand: {quickViewProduct.brand}</p>
                <p className="modal-category">
                  Category: {quickViewProduct.category}
                </p>
                <p className="modal-sku">SKU: {quickViewProduct.sku}</p>

                <div className="modal-price-rating">
                  <span className="modal-price">${quickViewProduct.price}</span>
                  <div className="modal-rating">
                    <span className="rating-stars">
                      {'★'.repeat(Math.floor(quickViewProduct.rating))}
                      {'☆'.repeat(5 - Math.floor(quickViewProduct.rating))}
                    </span>
                    <span>
                      {quickViewProduct.rating} ({quickViewProduct.reviewCount}{' '}
                      reviews)
                    </span>
                  </div>
                </div>

                <div className="modal-stock">
                  <span
                    className={`stock-status ${
                      quickViewProduct.quantity > 0
                        ? 'in-stock'
                        : 'out-of-stock'
                    }`}
                  >
                    {quickViewProduct.quantity > 0
                      ? `${quickViewProduct.quantity} in stock`
                      : 'Out of stock'}
                  </span>
                </div>

                <div className="modal-description">
                  <h3>Description</h3>
                  <p>{quickViewProduct.description}</p>
                </div>

                <div className="modal-actions">
                  <button
                    className="modal-edit-btn"
                    onClick={() => {
                      handleEditProduct(quickViewProduct);
                      closeQuickView();
                    }}
                  >
                    ✏️ Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AllProducts;
