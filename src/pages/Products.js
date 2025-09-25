import React, { useState } from 'react';
import './CSSFiles/Products.css'; // Assuming you have a CSS file for styling
const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 199.99,
      originalPrice: 249.99,
      image:
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'electronics',
      rating: 4.8,
      reviews: 124,
      discount: 20,
      inStock: true,
      features: ['Noise Cancelling', '30hr Battery', 'Quick Charge'],
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 299.99,
      originalPrice: 399.99,
      image:
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'electronics',
      rating: 4.6,
      reviews: 89,
      discount: 25,
      inStock: true,
      features: ['Heart Rate Monitor', 'GPS', 'Waterproof'],
    },
    {
      id: 3,
      name: 'Premium Laptop Backpack',
      price: 79.99,
      originalPrice: 99.99,
      image:
        'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'accessories',
      rating: 4.9,
      reviews: 156,
      discount: 20,
      inStock: true,
      features: ['Water Resistant', 'USB Port', 'Anti-theft'],
    },
    {
      id: 4,
      name: 'Portable Bluetooth Speaker',
      price: 149.99,
      originalPrice: 199.99,
      image:
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'electronics',
      rating: 4.7,
      reviews: 203,
      discount: 25,
      inStock: true,
      features: ['360° Sound', '12hr Battery', 'Waterproof'],
    },
    {
      id: 5,
      name: 'Casual Cotton T-Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image:
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'fashion',
      rating: 4.4,
      reviews: 67,
      discount: 25,
      inStock: true,
      features: ['100% Cotton', 'Machine Washable', 'Comfortable Fit'],
    },
    {
      id: 6,
      name: 'Yoga Exercise Mat',
      price: 49.99,
      originalPrice: 69.99,
      image:
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'sports',
      rating: 4.5,
      reviews: 91,
      discount: 29,
      inStock: true,
      features: ['Non-slip', 'Eco-friendly', 'Extra Thick'],
    },
    {
      id: 7,
      name: 'LED Desk Lamp',
      price: 89.99,
      originalPrice: 119.99,
      image:
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'home',
      rating: 4.6,
      reviews: 78,
      discount: 25,
      inStock: false,
      features: ['Adjustable Brightness', 'USB Charging', 'Touch Control'],
    },
    {
      id: 8,
      name: 'Wireless Gaming Mouse',
      price: 69.99,
      originalPrice: 89.99,
      image:
        'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: 'electronics',
      rating: 4.7,
      reviews: 134,
      discount: 22,
      inStock: true,
      features: ['RGB Lighting', 'Ergonomic', 'High DPI'],
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    {
      id: 'electronics',
      name: 'Electronics',
      count: products.filter((p) => p.category === 'electronics').length,
    },
    {
      id: 'fashion',
      name: 'Fashion',
      count: products.filter((p) => p.category === 'fashion').length,
    },
    {
      id: 'home',
      name: 'Home & Garden',
      count: products.filter((p) => p.category === 'home').length,
    },
    {
      id: 'sports',
      name: 'Sports',
      count: products.filter((p) => p.category === 'sports').length,
    },
    {
      id: 'accessories',
      name: 'Accessories',
      count: products.filter((p) => p.category === 'accessories').length,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const categoryMatch =
      selectedCategory === 'all' || product.category === selectedCategory;
    const priceMatch =
      product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="products-page">
      {/* Header */}
      <div className="products-header">
        <div className="products-header-content">
          <h1>Our Products</h1>
          <p>
            Discover our wide range of quality products at unbeatable prices
          </p>
        </div>
      </div>

      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className="products-sidebar">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${
                    selectedCategory === category.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-filter">
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([
                      parseInt(e.target.value) || 0,
                      priceRange[1],
                    ])
                  }
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([
                      priceRange[0],
                      parseInt(e.target.value) || 1000,
                    ])
                  }
                />
              </div>
              <div className="price-range-display">
                ${priceRange[0]} - ${priceRange[1]}
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h3>Features</h3>
            <div className="feature-filters">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Free Shipping</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>On Sale</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>In Stock</span>
              </label>
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>High Rated</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <div className="results-info">
              Showing {currentProducts.length} of {sortedProducts.length}{' '}
              products
            </div>
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="products-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.discount && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
                {!product.inStock && (
                  <div className="stock-badge">Out of Stock</div>
                )}

                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button className="quick-view-btn">Quick View</button>
                    <button
                      className="add-to-cart-btn"
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    {renderStars(product.rating)}
                    <span className="rating-text">
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  <div className="product-features">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.originalPrice && (
                      <span className="original-price">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`page-btn ${
                      currentPage === page ? 'active' : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                className="page-btn"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;
