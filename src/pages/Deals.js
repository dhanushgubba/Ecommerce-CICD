import React, { useState, useEffect } from 'react';
import './CSSFiles/Deals.css'; // Assuming you have a CSS file for styling
const Deals = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 30,
    seconds: 45,
  });

  const [selectedDeal, setSelectedDeal] = useState('flash');

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashDeals = [
    {
      id: 1,
      name: 'Wireless Gaming Headset',
      price: 79.99,
      originalPrice: 159.99,
      image:
        'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 50,
      rating: 4.8,
      reviews: 234,
      timeLeft: '2h 30m',
      sold: 45,
      available: 100,
    },
    {
      id: 2,
      name: 'Smart Fitness Tracker',
      price: 149.99,
      originalPrice: 249.99,
      image:
        'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 40,
      rating: 4.6,
      reviews: 189,
      timeLeft: '1h 45m',
      sold: 78,
      available: 150,
    },
    {
      id: 3,
      name: 'Bluetooth Speaker Pro',
      price: 99.99,
      originalPrice: 179.99,
      image:
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 44,
      rating: 4.7,
      reviews: 156,
      timeLeft: '3h 15m',
      sold: 32,
      available: 80,
    },
  ];

  const dailyDeals = [
    {
      id: 4,
      name: 'Premium Coffee Maker',
      price: 199.99,
      originalPrice: 299.99,
      image:
        'https://images.pexels.com/photos/324028/pexels-photo-324028.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 33,
      rating: 4.9,
      reviews: 267,
      category: 'Kitchen',
    },
    {
      id: 5,
      name: 'Ergonomic Office Chair',
      price: 299.99,
      originalPrice: 449.99,
      image:
        'https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 33,
      rating: 4.5,
      reviews: 123,
      category: 'Furniture',
    },
    {
      id: 6,
      name: '4K Action Camera',
      price: 249.99,
      originalPrice: 399.99,
      image:
        'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 38,
      rating: 4.8,
      reviews: 198,
      category: 'Electronics',
    },
  ];

  const weeklyDeals = [
    {
      id: 7,
      name: 'Designer Sunglasses',
      price: 89.99,
      originalPrice: 149.99,
      image:
        'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 40,
      rating: 4.4,
      reviews: 89,
      category: 'Fashion',
    },
    {
      id: 8,
      name: 'Organic Skincare Set',
      price: 79.99,
      originalPrice: 129.99,
      image:
        'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 38,
      rating: 4.7,
      reviews: 145,
      category: 'Beauty',
    },
    {
      id: 9,
      name: 'Yoga Mat Premium',
      price: 59.99,
      originalPrice: 89.99,
      image:
        'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      discount: 33,
      rating: 4.6,
      reviews: 167,
      category: 'Sports',
    },
  ];

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

  const renderProgressBar = (sold, available) => {
    const percentage = (sold / available) * 100;
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="progress-text">
          {sold} sold / {available} available
        </span>
      </div>
    );
  };

  return (
    <div className="deals-page">
      {/* Header */}
      <div className="deals-header">
        <div className="deals-header-content">
          <h1>🔥 Hot Deals & Offers</h1>
          <p>Don't miss out on these incredible limited-time offers!</p>

          {/* Countdown Timer */}
          <div className="countdown-timer">
            <div className="timer-label">Flash Sale Ends In:</div>
            <div className="timer-display">
              <div className="timer-unit">
                <div className="timer-number">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="timer-text">Days</div>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <div className="timer-number">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="timer-text">Hours</div>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <div className="timer-number">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="timer-text">Minutes</div>
              </div>
              <div className="timer-separator">:</div>
              <div className="timer-unit">
                <div className="timer-number">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="timer-text">Seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="deals-container">
        {/* Deal Categories Navigation */}
        <div className="deals-nav">
          <button
            className={`deal-nav-btn ${
              selectedDeal === 'flash' ? 'active' : ''
            }`}
            onClick={() => setSelectedDeal('flash')}
          >
            ⚡ Flash Deals
          </button>
          <button
            className={`deal-nav-btn ${
              selectedDeal === 'daily' ? 'active' : ''
            }`}
            onClick={() => setSelectedDeal('daily')}
          >
            📅 Daily Deals
          </button>
          <button
            className={`deal-nav-btn ${
              selectedDeal === 'weekly' ? 'active' : ''
            }`}
            onClick={() => setSelectedDeal('weekly')}
          >
            📆 Weekly Deals
          </button>
        </div>

        {/* Flash Deals */}
        {selectedDeal === 'flash' && (
          <section className="flash-deals-section">
            <div className="section-header">
              <h2>⚡ Flash Deals - Limited Time!</h2>
              <p>Hurry up! These deals won't last long</p>
            </div>
            <div className="flash-deals-grid">
              {flashDeals.map((deal) => (
                <div key={deal.id} className="flash-deal-card">
                  <div className="deal-badge">-{deal.discount}%</div>
                  <div className="time-badge">{deal.timeLeft} left</div>

                  <div className="deal-image">
                    <img src={deal.image} alt={deal.name} />
                    <div className="deal-overlay">
                      <button className="quick-buy-btn">Quick Buy</button>
                    </div>
                  </div>

                  <div className="deal-info">
                    <h3>{deal.name}</h3>
                    <div className="deal-rating">
                      {renderStars(deal.rating)}
                      <span className="rating-text">({deal.reviews})</span>
                    </div>

                    <div className="deal-price">
                      <span className="current-price">${deal.price}</span>
                      <span className="original-price">
                        ${deal.originalPrice}
                      </span>
                    </div>

                    {renderProgressBar(deal.sold, deal.available)}

                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Daily Deals */}
        {selectedDeal === 'daily' && (
          <section className="daily-deals-section">
            <div className="section-header">
              <h2>📅 Today's Special Deals</h2>
              <p>New deals every day - Check back tomorrow for more!</p>
            </div>
            <div className="daily-deals-grid">
              {dailyDeals.map((deal) => (
                <div key={deal.id} className="daily-deal-card">
                  <div className="deal-badge">-{deal.discount}%</div>
                  <div className="category-badge">{deal.category}</div>

                  <div className="deal-image">
                    <img src={deal.image} alt={deal.name} />
                    <div className="deal-overlay">
                      <button className="view-details-btn">View Details</button>
                      <button className="add-to-wishlist-btn">♡</button>
                    </div>
                  </div>

                  <div className="deal-info">
                    <h3>{deal.name}</h3>
                    <div className="deal-rating">
                      {renderStars(deal.rating)}
                      <span className="rating-text">({deal.reviews})</span>
                    </div>

                    <div className="deal-price">
                      <span className="current-price">${deal.price}</span>
                      <span className="original-price">
                        ${deal.originalPrice}
                      </span>
                    </div>

                    <div className="deal-actions">
                      <button className="add-to-cart-btn">Add to Cart</button>
                      <button className="buy-now-btn">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Deals */}
        {selectedDeal === 'weekly' && (
          <section className="weekly-deals-section">
            <div className="section-header">
              <h2>📆 This Week's Best Deals</h2>
              <p>Curated weekly selections with amazing discounts</p>
            </div>
            <div className="weekly-deals-grid">
              {weeklyDeals.map((deal) => (
                <div key={deal.id} className="weekly-deal-card">
                  <div className="deal-badge">-{deal.discount}%</div>
                  <div className="category-badge">{deal.category}</div>

                  <div className="deal-image">
                    <img src={deal.image} alt={deal.name} />
                    <div className="deal-overlay">
                      <button className="compare-btn">Compare</button>
                      <button className="share-btn">Share</button>
                    </div>
                  </div>

                  <div className="deal-info">
                    <h3>{deal.name}</h3>
                    <div className="deal-rating">
                      {renderStars(deal.rating)}
                      <span className="rating-text">({deal.reviews})</span>
                    </div>

                    <div className="deal-price">
                      <span className="current-price">${deal.price}</span>
                      <span className="original-price">
                        ${deal.originalPrice}
                      </span>
                    </div>

                    <div className="savings-info">
                      You save: ${(deal.originalPrice - deal.price).toFixed(2)}
                    </div>

                    <button className="add-to-cart-btn">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Deal Categories */}
        <section className="deal-categories">
          <h2>Shop Deals by Category</h2>
          <div className="categories-grid">
            <div className="category-deal-card">
              <div className="category-icon">📱</div>
              <h3>Electronics</h3>
              <p>Up to 60% off</p>
              <button className="category-btn">Shop Now</button>
            </div>
            <div className="category-deal-card">
              <div className="category-icon">👕</div>
              <h3>Fashion</h3>
              <p>Up to 45% off</p>
              <button className="category-btn">Shop Now</button>
            </div>
            <div className="category-deal-card">
              <div className="category-icon">🏠</div>
              <h3>Home & Garden</h3>
              <p>Up to 35% off</p>
              <button className="category-btn">Shop Now</button>
            </div>
            <div className="category-deal-card">
              <div className="category-icon">⚽</div>
              <h3>Sports</h3>
              <p>Up to 40% off</p>
              <button className="category-btn">Shop Now</button>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="deals-newsletter">
          <div className="newsletter-content">
            <h2>🔔 Never Miss a Deal!</h2>
            <p>
              Subscribe to get notified about flash sales and exclusive offers
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </div>
            <div className="newsletter-benefits">
              <div className="benefit">✅ Exclusive early access</div>
              <div className="benefit">✅ Flash sale notifications</div>
              <div className="benefit">✅ Weekly deal roundups</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Deals;
