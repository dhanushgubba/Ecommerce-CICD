import React from 'react';
import './CSSFiles/About.css'; // Assuming you have a CSS file for styling
import { Link } from 'react-router-dom';
const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image:
        'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'With over 15 years in e-commerce, Sarah founded ShopHub to revolutionize online shopping.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO',
      image:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Tech visionary who leads our innovation in creating seamless shopping experiences.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Head of Customer Experience',
      image:
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Passionate about ensuring every customer has an exceptional shopping journey.',
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Head of Operations',
      image:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Ensures smooth operations and timely delivery of products worldwide.',
    },
  ];

  const milestones = [
    {
      year: '2018',
      event: 'ShopHub Founded',
      description: 'Started with a vision to transform online shopping',
    },
    {
      year: '2019',
      event: '1M+ Products',
      description: 'Reached our first million products milestone',
    },
    {
      year: '2020',
      event: 'Global Expansion',
      description: 'Expanded to serve customers in 50+ countries',
    },
    {
      year: '2021',
      event: '10M+ Customers',
      description: 'Celebrated serving over 10 million happy customers',
    },
    {
      year: '2022',
      event: 'Sustainability Initiative',
      description: 'Launched our eco-friendly packaging program',
    },
    {
      year: '2023',
      event: 'AI Integration',
      description: 'Introduced AI-powered personalized recommendations',
    },
    {
      year: '2024',
      event: 'Mobile App Launch',
      description: 'Released our award-winning mobile application',
    },
    {
      year: '2025',
      event: 'Innovation Hub',
      description: 'Opening our new technology and innovation center',
    },
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Customer First',
      description:
        'Every decision we make is centered around providing the best possible experience for our customers.',
    },
    {
      icon: '🌟',
      title: 'Quality Excellence',
      description:
        'We partner only with trusted brands and suppliers to ensure the highest quality products.',
    },
    {
      icon: '🚀',
      title: 'Innovation',
      description:
        'We continuously innovate to stay ahead of trends and provide cutting-edge shopping solutions.',
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description:
        'We build lasting relationships through honest communication and transparent business practices.',
    },
    {
      icon: '🌍',
      title: 'Sustainability',
      description:
        "We're committed to reducing our environmental impact and promoting sustainable practices.",
    },
    {
      icon: '💡',
      title: 'Continuous Learning',
      description:
        'We embrace change and continuously learn to improve our services and customer experience.',
    },
  ];

  const stats = [
    { number: '10M+', label: 'Happy Customers' },
    { number: '2M+', label: 'Products Available' },
    { number: '50+', label: 'Countries Served' },
    { number: '99.9%', label: 'Uptime Guarantee' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About ShopHub</h1>
          <p>Transforming the way people shop online since 2018</p>
          <div className="hero-image">
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="About Us"
            />
          </div>
        </div>
      </section>

      <div className="about-container">
        {/* Our Story */}
        <section className="our-story">
          <div className="story-content">
            <div className="story-text">
              <h2>Our Story</h2>
              <p>
                ShopHub was born from a simple idea: online shopping should be
                easy, enjoyable, and accessible to everyone. Founded in 2018 by
                a team of passionate entrepreneurs, we set out to create more
                than just another e-commerce platform.
              </p>
              <p>
                We envisioned a place where customers could discover amazing
                products, enjoy competitive prices, and experience exceptional
                service. Today, we're proud to serve millions of customers
                worldwide, offering over 2 million products from trusted brands
                and sellers.
              </p>
              <p>
                Our journey has been driven by our commitment to innovation,
                quality, and customer satisfaction. Every day, we work to make
                shopping more convenient, more personal, and more rewarding for
                our customers.
              </p>
            </div>
            <div className="story-image">
              <img
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Our Story"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2>ShopHub by the Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="values-section">
          <h2>Our Values</h2>
          <p className="values-intro">
            These core values guide everything we do and shape the way we serve
            our customers and community.
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="timeline-section">
          <h2>Our Journey</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`timeline-item ${
                  index % 2 === 0 ? 'left' : 'right'
                }`}
              >
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.event}</h3>
                  <p>{milestone.description}</p>
                </div>
                <div className="timeline-dot"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p className="team-intro">
            Behind ShopHub is a dedicated team of professionals who are
            passionate about creating exceptional shopping experiences.
          </p>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <div className="team-role">{member.role}</div>
                  <p>{member.bio}</p>
                  <div className="team-social">
                    <a href="/" aria-label="LinkedIn">
                      💼
                    </a>
                    <a href="/" aria-label="Twitter">
                      🐦
                    </a>
                    <a href="/" aria-label="Email">
                      ✉️
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mission-vision">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="card-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To make online shopping accessible, enjoyable, and rewarding for
                everyone by providing quality products, exceptional service, and
                innovative solutions that exceed customer expectations.
              </p>
            </div>
            <div className="vision-card">
              <div className="card-icon">🔮</div>
              <h3>Our Vision</h3>
              <p>
                To be the world's most trusted and innovative e-commerce
                platform, connecting people with the products they love while
                building a sustainable future for online commerce.
              </p>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="sustainability-section">
          <div className="sustainability-content">
            <div className="sustainability-text">
              <h2>Our Commitment to Sustainability</h2>
              <p>
                We believe in doing business responsibly. That's why we've
                implemented various initiatives to reduce our environmental
                impact and promote sustainable practices throughout our
                operations.
              </p>
              <div className="sustainability-features">
                <div className="feature">
                  <div className="feature-icon">📦</div>
                  <div className="feature-text">
                    <h4>Eco-Friendly Packaging</h4>
                    <p>100% recyclable and biodegradable packaging materials</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🌱</div>
                  <div className="feature-text">
                    <h4>Carbon Neutral Shipping</h4>
                    <p>Offsetting carbon emissions from all our deliveries</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="feature-icon">♻️</div>
                  <div className="feature-text">
                    <h4>Sustainable Products</h4>
                    <p>Promoting eco-friendly and ethically sourced products</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sustainability-image">
              <img
                src="https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Sustainability"
              />
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="contact-cta">
          <div className="cta-content">
            <h2>Get in Touch</h2>
            <p>
              Have questions about ShopHub or want to learn more about our
              services?
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary">
                <Link to="/contact">Contact Us</Link>
              </button>
              <button className="cta-btn secondary">Join Our Team</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
