import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSSFiles/AdminProducts.css';

const AdminProducts = () => {
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

    fetchProducts();
  }, [navigate]);

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
    setEditProductId(null);
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
    } catch (error) {
      console.error('Error deleting product:', error);
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

  // Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} className="star full">
            ★
          </span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} className="star empty">
            ☆
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-products">
      <div className="admin-header">
        <h1>Product Management</h1>
        <p>Add, edit, and manage your product inventory</p>
      </div>

      <div className="admin-content">
        <div className="product-form-section">
          <div className="form-header">
            <h2>{editProductId ? 'Edit Product' : 'Add New Product'}</h2>
            {editProductId && (
              <button className="btn-cancel" onClick={resetForm} type="button">
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={editProductId ? handleUpdateProduct : handleAddProduct}
            className="product-form"
          >
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
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
                <label htmlFor="sku">SKU</label>
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
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Rating</label>
                <input
                  type="number"
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  max="5"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reviewCount">Review Count</label>
                <input
                  type="number"
                  id="reviewCount"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(e.target.value)}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows="3"
                  required
                ></textarea>
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
                {imageUrl && (
                  <div className="image-preview" style={{ marginTop: '8px' }}>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px',
                      }}
                    >
                      Preview:
                    </p>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div
                      style={{
                        display: 'none',
                        color: 'red',
                        fontSize: '12px',
                        padding: '8px',
                        border: '1px solid #ff6b6b',
                        borderRadius: '4px',
                        backgroundColor: '#ffe0e0',
                      }}
                    >
                      ❌ Invalid image URL
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editProductId ? 'Update Product' : 'Add Product'}
              </button>
              {editProductId && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="products-list-section">
          <div className="section-header">
            <h2>Product List</h2>
            <span className="product-count">{products.length} products</span>
          </div>

          {error && (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Error Loading Products</h3>
              <p>{error}</p>
              <button onClick={fetchProducts} className="retry-btn">
                Retry
              </button>
            </div>
          )}

          {loading && products.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 && !error ? (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>No products found</h3>
              <p>Start by adding your first product above</p>
            </div>
          ) : !error ? (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card amazon-style">
                  <div className="product-image-container">
                    <div className="product-badge">
                      {product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                    </div>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        console.log('Image failed to load:', product.imageUrl);
                        e.target.src =
                          'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                    <div className="image-overlay">
                      <button
                        className="quick-view-btn"
                        onClick={() => handleQuickView(product)}
                      >
                        <span>👁</span> Quick View
                      </button>
                    </div>
                  </div>

                  <div className="product-content">
                    <div className="product-header">
                      <span className="product-brand">{product.brand}</span>
                      <span className="product-category">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="product-title">{product.name}</h3>

                    <div className="product-rating">
                      {renderStars(product.rating)}
                      <span className="rating-text">
                        {product.rating} ({product.reviewCount} reviews)
                      </span>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="product-pricing">
                      <span className="price-main">${product.price}</span>
                      <span className="sku-info">SKU: {product.sku}</span>
                    </div>

                    <div className="stock-info">
                      <span
                        className={`stock-badge ${
                          product.quantity < 10 ? 'low' : 'good'
                        }`}
                      >
                        {product.quantity} in stock
                      </span>
                    </div>

                    <div className="product-actions">
                      <button
                        className="btn-primary btn-edit"
                        onClick={() => handleEditProduct(product)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-secondary btn-view"
                        onClick={() => handleQuickView(product)}
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn-danger btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && (
        <div className="quick-view-modal" onClick={closeQuickView}>
          <div
            className="quick-view-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeQuickView}>
              ✕
            </button>

            <div className="quick-view-body">
              <div className="quick-view-image">
                <img
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.name}
                  onError={(e) => {
                    e.target.src =
                      'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              </div>

              <div className="quick-view-details">
                <div className="brand-category">
                  <span className="brand">{quickViewProduct.brand}</span>
                  <span className="category">{quickViewProduct.category}</span>
                </div>

                <h2 className="product-name">{quickViewProduct.name}</h2>

                <div className="rating-section">
                  {renderStars(quickViewProduct.rating)}
                  <span className="rating-info">
                    {quickViewProduct.rating} out of 5 stars (
                    {quickViewProduct.reviewCount} reviews)
                  </span>
                </div>

                <div className="price-section">
                  <span className="price">${quickViewProduct.price}</span>
                  <span className="stock-status">
                    {quickViewProduct.quantity < 10
                      ? `Only ${quickViewProduct.quantity} left in stock`
                      : `${quickViewProduct.quantity} in stock`}
                  </span>
                </div>

                <div className="description-section">
                  <h4>Product Description</h4>
                  <p>{quickViewProduct.description}</p>
                </div>

                <div className="product-specs">
                  <div className="spec-item">
                    <strong>SKU:</strong> {quickViewProduct.sku}
                  </div>
                  <div className="spec-item">
                    <strong>Brand:</strong> {quickViewProduct.brand}
                  </div>
                  <div className="spec-item">
                    <strong>Category:</strong> {quickViewProduct.category}
                  </div>
                  <div className="spec-item">
                    <strong>Stock:</strong> {quickViewProduct.quantity} units
                  </div>
                </div>

                <div className="quick-view-actions">
                  <button
                    className="btn-edit-modal"
                    onClick={() => {
                      handleEditProduct(quickViewProduct);
                      closeQuickView();
                    }}
                  >
                    Edit Product
                  </button>
                  <button
                    className="btn-delete-modal"
                    onClick={() => {
                      handleDeleteProduct(quickViewProduct.id);
                      closeQuickView();
                    }}
                  >
                    Delete Product
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

export default AdminProducts;
