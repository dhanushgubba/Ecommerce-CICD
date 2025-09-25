import React, { useState } from 'react';
import './CSSFiles/Categories.css';
const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Latest gadgets and electronic devices',
      image:
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 245,
      subcategories: [
        'Smartphones',
        'Laptops',
        'Headphones',
        'Cameras',
        'Gaming',
      ],
      featured: true,
      trending: true,
    },
    {
      id: 2,
      name: 'Fashion & Clothing',
      description: 'Trendy apparel for men, women, and kids',
      image:
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 432,
      subcategories: [
        "Men's Wear",
        "Women's Wear",
        'Kids',
        'Shoes',
        'Accessories',
      ],
      featured: true,
      trending: false,
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Everything for your home and garden needs',
      image:
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 189,
      subcategories: [
        'Furniture',
        'Decor',
        'Kitchen',
        'Garden Tools',
        'Lighting',
      ],
      featured: false,
      trending: true,
    },
    {
      id: 4,
      name: 'Sports & Fitness',
      description: 'Gear up for your active lifestyle',
      image:
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 156,
      subcategories: [
        'Fitness Equipment',
        'Sports Gear',
        'Outdoor',
        'Yoga',
        'Running',
      ],
      featured: true,
      trending: false,
    },
    {
      id: 5,
      name: 'Books & Media',
      description: 'Expand your knowledge and entertainment',
      image:
        'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 298,
      subcategories: [
        'Fiction',
        'Non-Fiction',
        'Educational',
        'Comics',
        'Audiobooks',
      ],
      featured: false,
      trending: false,
    },
    {
      id: 6,
      name: 'Beauty & Health',
      description: 'Look and feel your best',
      image:
        'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 167,
      subcategories: [
        'Skincare',
        'Makeup',
        'Hair Care',
        'Supplements',
        'Personal Care',
      ],
      featured: false,
      trending: true,
    },
    {
      id: 7,
      name: 'Toys & Games',
      description: 'Fun for all ages',
      image:
        'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 134,
      subcategories: [
        'Educational Toys',
        'Board Games',
        'Action Figures',
        'Puzzles',
        'Outdoor Toys',
      ],
      featured: false,
      trending: false,
    },
    {
      id: 8,
      name: 'Automotive',
      description: 'Parts and accessories for your vehicle',
      image:
        'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=600',
      productCount: 89,
      subcategories: [
        'Car Parts',
        'Tools',
        'Accessories',
        'Maintenance',
        'Electronics',
      ],
      featured: false,
      trending: false,
    },
  ];

  const featuredCategories = categories.filter((cat) => cat.featured);
  const trendingCategories = categories.filter((cat) => cat.trending);

  return (
    <div className="categories-page">
      {/* Header */}
      <div className="categories-header">
        <div className="categories-header-content">
          <h1>Shop by Categories</h1>
          <p>
            Explore our wide range of product categories and find exactly what
            you're looking for
          </p>
        </div>
      </div>

      <div className="categories-container">
        {/* Featured Categories */}
        <section className="featured-section">
          <h2 className="section-title">Featured Categories</h2>
          <div className="featured-grid">
            {featuredCategories.map((category) => (
              <div key={category.id} className="featured-category-card">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay">
                    <div className="category-info">
                      <h3>{category.name}</h3>
                      <p>{category.description}</p>
                      <div className="category-stats">
                        <span className="product-count">
                          {category.productCount} Products
                        </span>
                      </div>
                      <button className="explore-btn">Explore Category</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Categories */}
        <section className="trending-section">
          <h2 className="section-title">Trending Now</h2>
          <div className="trending-grid">
            {trendingCategories.map((category) => (
              <div key={category.id} className="trending-category-card">
                <div className="trending-badge">🔥 Trending</div>
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="subcategories">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <span key={index} className="subcategory-tag">
                        {sub}
                      </span>
                    ))}
                  </div>
                  <div className="category-footer">
                    <span className="product-count">
                      {category.productCount} Products
                    </span>
                    <button className="shop-now-btn">Shop Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section className="all-categories-section">
          <h2 className="section-title">All Categories</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${
                  selectedCategory === category.id ? 'selected' : ''
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="category-header">
                  <div className="category-icon">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <div className="category-title">
                    <h3>{category.name}</h3>
                    <span className="product-count">
                      {category.productCount} products
                    </span>
                  </div>
                  <div className="expand-icon">
                    {selectedCategory === category.id ? '−' : '+'}
                  </div>
                </div>

                {selectedCategory === category.id && (
                  <div className="category-details">
                    <p className="category-description">
                      {category.description}
                    </p>
                    <div className="subcategories-list">
                      <h4>Subcategories:</h4>
                      <div className="subcategories-grid">
                        {category.subcategories.map((sub, index) => (
                          <button key={index} className="subcategory-btn">
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="category-actions">
                      <button className="view-all-btn">
                        View All Products
                      </button>
                      <button className="browse-btn">
                        Browse Subcategories
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Category Stats */}
        <section className="category-stats">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </div>
              <div className="stat-label">Total Products</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{featuredCategories.length}</div>
              <div className="stat-label">Featured</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{trendingCategories.length}</div>
              <div className="stat-label">Trending</div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="newsletter-section">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get notified about new categories and featured products</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Categories;
