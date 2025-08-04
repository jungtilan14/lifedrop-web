import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, User, Droplets, Filter, Heart, AlertCircle } from 'lucide-react';

const DonorSearch = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    bloodType: '',
    city: '',
    availability: 'all'
  });
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Dharan', 'Hetauda'];

  // Mock donor data
  const mockDonors = [
    {
      id: 1,
      name: 'Raj Kumar Sharma',
      bloodType: 'O+',
      city: 'Kathmandu',
      lastDonation: '2024-01-15',
      phone: '9841234567',
      availability: 'available',
      donations: 8,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Sita Kumari Poudel',
      bloodType: 'A+',
      city: 'Pokhara',
      lastDonation: '2024-02-20',
      phone: '9847654321',
      availability: 'available',
      donations: 12,
      rating: 5.0
    },
    {
      id: 3,
      name: 'Bikash Thapa',
      bloodType: 'B-',
      city: 'Chitwan',
      lastDonation: '2024-03-10',
      phone: '9812345678',
      availability: 'unavailable',
      donations: 5,
      rating: 4.5
    },
    {
      id: 4,
      name: 'Maya Gurung',
      bloodType: 'AB+',
      city: 'Lalitpur',
      lastDonation: '2024-01-25',
      phone: '9823456789',
      availability: 'available',
      donations: 15,
      rating: 4.9
    },
    {
      id: 5,
      name: 'Arjun Rai',
      bloodType: 'O-',
      city: 'Kathmandu',
      lastDonation: '2024-02-05',
      phone: '9834567890',
      availability: 'available',
      donations: 20,
      rating: 5.0
    }
  ];

  useEffect(() => {
    // Load donors on component mount
    setIsLoading(true);
    setTimeout(() => {
      setDonors(mockDonors);
      setFilteredDonors(mockDonors);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = donors;

      if (searchCriteria.bloodType) {
        filtered = filtered.filter(donor => donor.bloodType === searchCriteria.bloodType);
      }

      if (searchCriteria.city) {
        filtered = filtered.filter(donor => donor.city === searchCriteria.city);
      }

      if (searchCriteria.availability !== 'all') {
        filtered = filtered.filter(donor => donor.availability === searchCriteria.availability);
      }

      setFilteredDonors(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setSearchCriteria({
      bloodType: '',
      city: '',
      availability: 'all'
    });
    setFilteredDonors(donors);
  };

  const canDonate = (lastDonation) => {
    const lastDate = new Date(lastDonation);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90; // 90 days between donations
  };

  return (
    <div className="donor-search">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Search className="inline mr-2" size={28} />
            Find Blood Donors
          </h1>
          <p className="text-gray">
            Search for available donors by blood type and location
          </p>
        </div>

        {/* Search Filters */}
        <div className="filter-section">
          <h3 className="section-title">
            <Filter className="inline mr-2" size={20} />
            Search Filters
          </h3>
          
          <div className="filter-grid">
            <div className="form-group">
              <label htmlFor="bloodType">
                <Droplets className="inline mr-2" size={18} />
                Blood Type
              </label>
              <select
                id="bloodType"
                name="bloodType"
                value={searchCriteria.bloodType}
                onChange={handleSearchChange}
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="city">
                <MapPin className="inline mr-2" size={18} />
                City
              </label>
              <select
                id="city"
                name="city"
                value={searchCriteria.city}
                onChange={handleSearchChange}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <select
                id="availability"
                name="availability"
                value={searchCriteria.availability}
                onChange={handleSearchChange}
              >
                <option value="all">All Donors</option>
                <option value="available">Available Only</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleSearch} className="btn btn-primary">
              <Search className="inline mr-2" size={18} />
              Search Donors
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Search Results ({filteredDonors.length} donors found)
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-gray">Searching for donors...</p>
          </div>
        ) : (
          <div className="donors-grid">
            {filteredDonors.length === 0 ? (
              <div className="text-center">
                <p className="text-gray">No donors found matching your criteria. Try adjusting your search filters.</p>
              </div>
            ) : (
              filteredDonors.map(donor => (
                <div key={donor.id} className="donor-card">
                  <div className="donor-header">
                    <div className="donor-info">
                      <h3 className="donor-name">{donor.name}</h3>
                      <div className="donor-meta">
                        <span className="blood-type-badge">{donor.bloodType}</span>
                        <span className={`availability-badge ${donor.availability}`}>
                          {donor.availability === 'available' ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                    </div>
                    <div className="donor-rating">
                      <span className="rating-stars">★ {donor.rating}</span>
                    </div>
                  </div>

                  <div className="donor-details">
                    <div className="donor-location">
                      <MapPin className="inline mr-2" size={16} />
                      {donor.city}
                    </div>
                    <div className="donor-stats">
                      <span>
                        <Heart className="inline mr-1" size={14} />
                        {donor.donations} donations
                      </span>
                      <span>
                        Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="donor-actions">
                    <button className="btn btn-primary">
                      <Phone className="inline mr-2" size={16} />
                      Contact
                    </button>
                    <button className="btn btn-secondary">
                      <User className="inline mr-2" size={16} />
                      View Profile
                    </button>
                  </div>

                  {!canDonate(donor.lastDonation) && (
                    <div className="donor-warning">
                      <p className="text-red">
                        <AlertCircle className="inline mr-2" size={16} />
                        Cannot donate yet (90-day waiting period)
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Donor Statistics</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{donors.length}</div>
            <div className="stat-label">Total Donors</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{donors.filter(d => d.availability === 'available').length}</div>
            <div className="stat-label">Available Now</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{donors.reduce((sum, d) => sum + d.donations, 0)}</div>
            <div className="stat-label">Total Donations</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{(donors.reduce((sum, d) => sum + d.rating, 0) / donors.length).toFixed(1)}</div>
            <div className="stat-label">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorSearch;