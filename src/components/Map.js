import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Clock, Search, Filter, Building } from 'lucide-react';  // Removed Hospital icon

const Map = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Mock location data
  const locations = [
    {
      id: 1,
      name: 'Tribhuvan University Teaching Hospital',
      type: 'hospital',
      address: 'Maharajgunj, Kathmandu',
      city: 'Kathmandu',
      phone: '+977-1-4412404',
      hours: '24/7',
      bloodBank: true,
      services: ['Blood Bank', 'Emergency', 'Surgery'],
      coordinates: { lat: 27.7358, lng: 85.3297 }
    },
    {
      id: 2,
      name: 'Patan Hospital',
      type: 'hospital',
      address: 'Lagankhel, Lalitpur',
      city: 'Lalitpur',
      phone: '+977-1-5522266',
      hours: '24/7',
      bloodBank: true,
      services: ['Blood Bank', 'Emergency', 'ICU'],
      coordinates: { lat: 27.6648, lng: 85.3242 }
    },
    {
      id: 3,
      name: 'National Blood Transfusion Service',
      type: 'blood_bank',
      address: 'Thapathali, Kathmandu',
      city: 'Kathmandu',
      phone: '+977-1-4266554',
      hours: '9:00 AM - 5:00 PM',
      bloodBank: true,
      services: ['Blood Collection', 'Blood Testing', 'Blood Storage'],
      coordinates: { lat: 27.6914, lng: 85.3206 }
    },
    {
      id: 4,
      name: 'Bir Hospital',
      type: 'hospital',
      address: 'Tundikhel, Kathmandu',
      city: 'Kathmandu',
      phone: '+977-1-4221119',
      hours: '24/7',
      bloodBank: true,
      services: ['Blood Bank', 'Emergency', 'General Medicine'],
      coordinates: { lat: 27.7036, lng: 85.3142 }
    },
    {
      id: 5,
      name: 'Pokhara Academy of Health Sciences',
      type: 'hospital',
      address: 'Pokhara, Kaski',
      city: 'Pokhara',
      phone: '+977-61-504048',
      hours: '24/7',
      bloodBank: true,
      services: ['Blood Bank', 'Emergency', 'Trauma Care'],
      coordinates: { lat: 28.2096, lng: 83.9856 }
    },
    {
      id: 6,
      name: 'Red Cross Blood Bank',
      type: 'blood_bank',
      address: 'Kalimati, Kathmandu',
      city: 'Kathmandu',
      phone: '+977-1-4270650',
      hours: '9:00 AM - 4:00 PM',
      bloodBank: true,
      services: ['Blood Donation', 'Blood Testing', 'Mobile Blood Units'],
      coordinates: { lat: 27.6966, lng: 85.2977 }
    }
  ];

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || location.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getLocationIcon = (type) => {
    switch (type) {
      case 'hospital':
        return <Building className="text-red-500" size={24} />;  // Replaced Hospital with Building
      case 'blood_bank':
        return <Building className="text-blue-500" size={24} />;
      default:
        return <MapPin className="text-gray-500" size={24} />;
    }
  };

  const getLocationTypeLabel = (type) => {
    switch (type) {
      case 'hospital':
        return 'Hospital';
      case 'blood_bank':
        return 'Blood Bank';
      default:
        return 'Location';
    }
  };

  return (
    <div className="map-page">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <MapPin className="inline mr-2" size={28} />
            Find Blood Banks & Hospitals
          </h1>
          <p className="text-gray">
            Locate nearby blood banks, hospitals, and donation centers in Nepal
          </p>
        </div>

        {/* Search and Filter */}
        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`btn ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Locations
            </button>
            <button
              onClick={() => setSelectedFilter('hospital')}
              className={`btn ${selectedFilter === 'hospital' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Building className="inline mr-2" size={16} />
              Hospitals
            </button>
            <button
              onClick={() => setSelectedFilter('blood_bank')}
              className={`btn ${selectedFilter === 'blood_bank' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Building className="inline mr-2" size={16} />
              Blood Banks
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Interactive Map</h2>
        </div>
        
        <div className="map-container">
          <div className="map-placeholder">
            <MapPin size={48} />
            <p>Interactive map will be integrated here using Google Maps API</p>
            <p className="text-gray">
              This will show real-time locations of blood banks and hospitals
            </p>
          </div>
        </div>
      </div>

      {/* Locations List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Filter className="inline mr-2" size={20} />
            Locations ({filteredLocations.length} found)
          </h2>
        </div>
        
        <div className="locations-list">
          {filteredLocations.length === 0 ? (
            <div className="text-center">
              <p className="text-gray">No locations found matching your search criteria.</p>
            </div>
          ) : (
            filteredLocations.map(location => (
              <div 
                key={location.id} 
                className={`location-card ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="location-header">
                  <div className="location-icon">
                    {getLocationIcon(location.type)}
                  </div>
                  <div className="location-info">
                    <h3 className="location-name">{location.name}</h3>
                    <span className="location-type">{getLocationTypeLabel(location.type)}</span>
                  </div>
                  <div className="location-status">
                    {location.bloodBank && (
                      <span className="blood-bank-badge">Blood Bank Available</span>
                    )}
                  </div>
                </div>
                
                <div className="location-details">
                  <div className="location-address">
                    <MapPin className="inline mr-2" size={16} />
                    {location.address}
                  </div>
                  <div className="location-phone">
                    <Phone className="inline mr-2" size={16} />
                    {location.phone}
                  </div>
                  <div className="location-hours">
                    <Clock className="inline mr-2" size={16} />
                    {location.hours}
                  </div>
                </div>
                
                <div className="location-services">
                  <h4>Services:</h4>
                  <div className="services-list">
                    {location.services.map((service, index) => (
                      <span key={index} className="service-badge">{service}</span>
                    ))}
                  </div>
                </div>
                
                <div className="location-actions">
                  <button className="btn btn-primary">
                    <Navigation className="inline mr-2" size={16} />
                    Get Directions
                  </button>
                  <button className="btn btn-secondary">
                    <Phone className="inline mr-2" size={16} />
                    Call
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Quick Statistics</h2>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{locations.length}</div>
            <div className="stat-label">Total Locations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{locations.filter(l => l.type === 'hospital').length}</div>
            <div className="stat-label">Hospitals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{locations.filter(l => l.type === 'blood_bank').length}</div>
            <div className="stat-label">Blood Banks</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{locations.filter(l => l.hours === '24/7').length}</div>
            <div className="stat-label">24/7 Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
