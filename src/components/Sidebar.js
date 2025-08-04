import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  UserPlus, 
  Droplets, 
  Search, 
  BarChart3, 
  Bell, 
  BookOpen, 
  MapPin, 
  Shield, 
  Clock,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/registration', label: 'Registration', icon: UserPlus },
    { path: '/blood-request', label: 'Blood Request', icon: Droplets },
    { path: '/donor-search', label: 'Donor Search', icon: Search },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/awareness', label: 'Awareness', icon: BookOpen },
    { path: '/map', label: 'Map', icon: MapPin },
    { path: '/admin', label: 'Admin Panel', icon: Shield },
    { path: '/donation-history', label: 'Donation History', icon: Clock },
    { path: '/login', label: 'Login', icon: Clock }, // Added Login Page
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle" 
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">LifeDrop</h1>
          <p className="sidebar-subtitle">Blood Donation Platform</p>
        </div>

        <nav>
          <ul className="sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path} 
                    className={location.pathname === item.path ? 'active' : ''} // Highlight active link
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1500,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}
    </>
  );
};

export default Sidebar;
