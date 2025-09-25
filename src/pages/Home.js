import React, { useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
const Home = () => {
  const [cartCount, setCartCount] = useState(0);
  const [email, setEmail] = useState('');

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 199.99,
      originalPrice: 249.99,
      image:
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      discount: 20,
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 299.99,
      originalPrice: 399.99,
      image:
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      discount: 25,
    },
    {
      id: 3,
      name: 'Laptop Backpack',
      price: 79.99,
      originalPrice: 99.99,
      image:
        'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      discount: 20,
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 149.99,
      originalPrice: 199.99,
      image:
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      discount: 25,
    },
  ];

  const categories = [
    {
      name: 'Electronics',
      image:
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      count: '500+ Products',
    },
    {
      name: 'Fashion',
      image:
        'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400',
      count: '800+ Products',
    },
    {
      name: 'Home & Garden',
      image:
        'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400',
      count: '300+ Products',
    },
    {
      name: 'Sports',
      image:
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      count: '200+ Products',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      text: 'Amazing quality and fast shipping! Will definitely shop here again.',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      name: 'Mike Chen',
      text: 'Great customer service and competitive prices. Highly recommended!',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    {
      name: 'Emily Davis',
      text: 'Love the variety of products and the user-friendly website design.',
      rating: 5,
      avatar:
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
  ];

  const handleAddToCart = (productId) => {
    setCartCount(cartCount + 1);
  };

  /*const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Add search functionality here
  };*/

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

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
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Discover Amazing Products</h1>
            <p>
              Shop the latest trends with unbeatable prices and free shipping on
              orders over $50
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Shop Now</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Hero"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="section-content">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.discount && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-overlay">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="rating">
                    {renderStars(product.rating)}
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="price">
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
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="section-content">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                  <div className="category-overlay">
                    <h3>{category.name}</h3>
                    <p>{category.count}</p>
                    <button className="category-btn">Browse</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offer */}
      <section className="special-offer">
        <div className="offer-content">
          <div className="offer-text">
            <h2>Special Weekend Sale</h2>
            <p>Get up to 50% off on selected items. Limited time offer!</p>
            <button className="btn-primary">Shop Sale</button>
          </div>
          <div className="offer-timer">
            <div className="timer-box">
              <div className="time">24</div>
              <div className="label">Hours</div>
            </div>
            <div className="timer-box">
              <div className="time">30</div>
              <div className="label">Minutes</div>
            </div>
            <div className="timer-box">
              <div className="time">45</div>
              <div className="label">Seconds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-content">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {renderStars(testimonial.rating)}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                  <span>{testimonial.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest deals and updates</p>
          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>ShopHub</h3>
            <p>
              Your one-stop destination for quality products at unbeatable
              prices.
            </p>
            <div className="social-links">
              <Link to="#" aria-label="Facebook">
                📘
              </Link>
              <Link to="#" aria-label="Twitter">
                🐦
              </Link>
              <Link to="#" aria-label="Instagram">
                📷
              </Link>
              <Link to="#" aria-label="LinkedIn">
                💼
              </Link>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="#">About Us</Link>
              </li>
              <li>
                <Link to="#">Contact</Link>
              </li>
              <li>
                <Link to="#">FAQ</Link>
              </li>
              <li>
                <Link to="#">Shipping Info</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li>
                <Link to="#">Electronics</Link>
              </li>
              <li>
                <Link to="#">Fashion</Link>
              </li>
              <li>
                <Link to="#">Home & Garden</Link>
              </li>
              <li>
                <Link to="#">Sports</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li>
                <Link to="#">Return Policy</Link>
              </li>
              <li>
                <Link to="#">Privacy Policy</Link>
              </li>
              <li>
                <Link to="#">Terms of Service</Link>
              </li>
              <li>
                <Link to="#">Support</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
