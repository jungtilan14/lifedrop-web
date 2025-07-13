import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  MapPin, 
  Shield, 
  Clock, 
  Bell,
  Droplets,
  Search,
  BarChart3
} from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '5,000+', label: 'Lives Saved' },
    { number: '2,500+', label: 'Active Donors' },
    { number: '150+', label: 'Hospitals Connected' },
    { number: '24/7', label: 'Support Available' }
  ];

  const features = [
    {
      icon: Heart,
      title: 'Save Lives',
      description: 'Connect with recipients in need and make a life-saving difference in Nepal.'
    },
    {
      icon: Users,
      title: 'Join Community',
      description: 'Become part of a caring community dedicated to helping others through blood donation.'
    },
    {
      icon: MapPin,
      title: 'Find Nearby',
      description: 'Locate blood banks, hospitals, and donation camps near your location.'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your personal information and health data are protected with top-level security.'
    },
    {
      icon: Clock,
      title: 'Quick Response',
      description: 'Get instant notifications for urgent blood requests in your area.'
    },
    {
      icon: Bell,
      title: 'Real-time Updates',
      description: 'Stay informed with real-time updates on blood requests and donation opportunities.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Save Lives with <span className="text-red">LifeDrop</span>
        </h1>
        <p className="hero-subtitle">
          Nepal's premier blood donation platform connecting donors with recipients
        </p>
        <div className="hero-actions">
          <Link to="/registration" className="btn btn-primary">
            <Heart className="inline mr-2" size={20} />
            Become a Donor
          </Link>
          <Link to="/blood-request" className="btn btn-secondary">
            <Droplets className="inline mr-2" size={20} />
            Request Blood
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="text-center mb-4">
          <h2 className="card-title">Why Choose LifeDrop?</h2>
          <p className="text-gray">
            Our platform makes blood donation accessible, safe, and efficient for everyone in Nepal
          </p>
        </div>
        
        <div className="feature-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="card text-center">
          <h2 className="card-title">Ready to Make a Difference?</h2>
          <p className="text-gray mb-4">
            Join thousands of donors who are already saving lives across Nepal
          </p>
          <div className="hero-actions">
            <Link to="/registration" className="btn btn-primary">
              Register Now
            </Link>
            <Link to="/donor-search" className="btn btn-secondary">
              <Search className="inline mr-2" size={20} />
              Find Donors
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access">
        <div className="card">
          <h2 className="card-title">Quick Access</h2>
          <div className="grid grid-3">
            <Link to="/dashboard" className="feature-card">
              <div className="feature-icon">
                <BarChart3 />
              </div>
              <h3 className="feature-title">Dashboard</h3>
              <p className="feature-description">View your donation activity and requests</p>
            </Link>
            <Link to="/map" className="feature-card">
              <div className="feature-icon">
                <MapPin />
              </div>
              <h3 className="feature-title">Find Locations</h3>
              <p className="feature-description">Locate nearby blood banks and hospitals</p>
            </Link>
            <Link to="/awareness" className="feature-card">
              <div className="feature-icon">
                <Heart />
              </div>
              <h3 className="feature-title">Learn More</h3>
              <p className="feature-description">Educational resources about blood donation</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;