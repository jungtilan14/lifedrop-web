import React, { useState, useEffect } from 'react';
import { Bell, Droplets, MapPin, Clock, AlertCircle, User, Phone, Filter } from 'lucide-react';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock blood requests data
  const mockRequests = [
    {
      id: 1,
      patientName: 'Ram Bahadur Shrestha',
      bloodType: 'O+',
      unitsRequired: 2,
      urgency: 'high',
      hospital: 'Tribhuvan University Teaching Hospital',
      city: 'Kathmandu',
      contactPerson: 'Dr. Sushila Sharma',
      contactPhone: '9841234567',
      requiredBy: '2024-03-15T18:00',
      postedAt: '2024-03-15T12:00',
      status: 'active'
    },
    {
      id: 2,
      patientName: 'Sita Kumari Poudel',
      bloodType: 'A+',
      unitsRequired: 1,
      urgency: 'medium',
      hospital: 'Pokhara Academy of Health Sciences',
      city: 'Pokhara',
      contactPerson: 'Nurse Kamala Thapa',
      contactPhone: '9847654321',
      requiredBy: '2024-03-16T14:00',
      postedAt: '2024-03-15T10:30',
      status: 'active'
    },
    {
      id: 3,
      patientName: 'Bikash Thapa',
      bloodType: 'B-',
      unitsRequired: 3,
      urgency: 'high',
      hospital: 'Chitwan Medical College',
      city: 'Chitwan',
      contactPerson: 'Dr. Rajesh Karki',
      contactPhone: '9812345678',
      requiredBy: '2024-03-15T20:00',
      postedAt: '2024-03-15T14:15',
      status: 'urgent'
    },
    {
      id: 4,
      patientName: 'Maya Gurung',
      bloodType: 'AB+',
      unitsRequired: 2,
      urgency: 'low',
      hospital: 'Patan Hospital',
      city: 'Lalitpur',
      contactPerson: 'Dr. Sunita Maharjan',
      contactPhone: '9823456789',
      requiredBy: '2024-03-17T10:00',
      postedAt: '2024-03-15T09:45',
      status: 'active'
    },
    {
      id: 5,
      patientName: 'Arjun Rai',
      bloodType: 'O-',
      unitsRequired: 1,
      urgency: 'medium',
      hospital: 'Bir Hospital',
      city: 'Kathmandu',
      contactPerson: 'Dr. Krishna Pradhan',
      contactPhone: '9834567890',
      requiredBy: '2024-03-16T16:00',
      postedAt: '2024-03-15T11:20',
      status: 'fulfilled'
    }
  ];

  useEffect(() => {
    // Simulate loading requests
    setTimeout(() => {
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setIsLoading(false);
    }, 1000);

    // Simulate real-time updates
    const interval = setInterval(() => {
      // In a real app, this would fetch new requests from the server
      console.log('Checking for new requests...');
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    
    let filtered = requests;
    
    switch (newFilter) {
      case 'urgent':
        filtered = requests.filter(req => req.urgency === 'high');
        break;
      case 'active':
        filtered = requests.filter(req => req.status === 'active' || req.status === 'urgent');
        break;
      case 'fulfilled':
        filtered = requests.filter(req => req.status === 'fulfilled');
        break;
      default:
        filtered = requests;
    }
    
    setFilteredRequests(filtered);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'urgency-high';
      case 'medium':
        return 'urgency-medium';
      case 'low':
        return 'urgency-low';
      default:
        return 'urgency-medium';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const getTimeUntilRequired = (requiredBy) => {
    const now = new Date();
    const required = new Date(requiredBy);
    const diffHours = Math.floor((required - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) {
      return 'Overdue';
    } else if (diffHours < 24) {
      return `${diffHours}h left`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d left`;
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Bell className="inline mr-2" size={28} />
            Blood Request Dashboard
          </h1>
          <p className="text-gray">
            Real-time feed of blood requests from hospitals and individuals
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            onClick={() => handleFilterChange('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All Requests
          </button>
          <button
            onClick={() => handleFilterChange('urgent')}
            className={`btn ${filter === 'urgent' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <AlertCircle className="inline mr-2" size={16} />
            Urgent
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Active
          </button>
          <button
            onClick={() => handleFilterChange('fulfilled')}
            className={`btn ${filter === 'fulfilled' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Fulfilled
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.status === 'active' || r.status === 'urgent').length}</div>
          <div className="stat-label">Active Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.urgency === 'high').length}</div>
          <div className="stat-label">Urgent Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{requests.filter(r => r.status === 'fulfilled').length}</div>
          <div className="stat-label">Fulfilled Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{requests.reduce((sum, r) => sum + r.unitsRequired, 0)}</div>
          <div className="stat-label">Total Units Needed</div>
        </div>
      </div>

      {/* Request Feed */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Filter className="inline mr-2" size={20} />
            Request Feed ({filteredRequests.length} requests)
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center">
            <p className="text-gray">Loading requests...</p>
          </div>
        ) : (
          <div className="request-feed">
            {filteredRequests.length === 0 ? (
              <div className="text-center">
                <p className="text-gray">No requests found matching your filter.</p>
              </div>
            ) : (
              filteredRequests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="request-info">
                      <h3 className="request-patient">{request.patientName}</h3>
                      <div className="request-badges">
                        <span className="blood-type-badge">{request.bloodType}</span>
                        <span className={`urgency-badge ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                        {request.status === 'fulfilled' && (
                          <span className="status-badge">FULFILLED</span>
                        )}
                      </div>
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-primary">
                        <Phone className="inline mr-2" size={16} />
                        Contact
                      </button>
                      <button className="btn btn-secondary">
                        <User className="inline mr-2" size={16} />
                        Respond
                      </button>
                    </div>
                  </div>

                  <div className="request-details">
                    <div className="request-info-grid">
                      <div className="info-item">
                        <Droplets className="inline mr-2" size={16} />
                        <span>{request.unitsRequired} units needed</span>
                      </div>
                      <div className="info-item">
                        <MapPin className="inline mr-2" size={16} />
                        <span>{request.hospital}, {request.city}</span>
                      </div>
                      <div className="info-item">
                        <Clock className="inline mr-2" size={16} />
                        <span>{getTimeUntilRequired(request.requiredBy)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-meta">
                    <span>
                      <User className="inline mr-1" size={14} />
                      Contact: {request.contactPerson}
                    </span>
                    <span>
                      <Phone className="inline mr-1" size={14} />
                      {request.contactPhone}
                    </span>
                    <span>
                      <Clock className="inline mr-1" size={14} />
                      Posted {getTimeAgo(request.postedAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;