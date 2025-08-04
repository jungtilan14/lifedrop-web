import React, { useState } from 'react';
import { Clock, Heart, MapPin, Calendar, Award, Filter, Download, Eye } from 'lucide-react';

const DonationHistory = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock donation history data
  const donationHistory = [
    {
      id: 1,
      date: '2024-03-10',
      hospital: 'Tribhuvan University Teaching Hospital',
      location: 'Kathmandu',
      bloodType: 'O+',
      units: 1,
      recipientInfo: 'Emergency surgery patient',
      status: 'completed',
      certificateId: 'CERT-2024-001',
      nextEligibleDate: '2024-06-08'
    },
    {
      id: 2,
      date: '2023-12-15',
      hospital: 'Patan Hospital',
      location: 'Lalitpur',
      bloodType: 'O+',
      units: 1,
      recipientInfo: 'Cancer patient treatment',
      status: 'completed',
      certificateId: 'CERT-2023-045',
      nextEligibleDate: '2024-03-15'
    },
    {
      id: 3,
      date: '2023-09-20',
      hospital: 'Bir Hospital',
      location: 'Kathmandu',
      bloodType: 'O+',
      units: 1,
      recipientInfo: 'Accident victim',
      status: 'completed',
      certificateId: 'CERT-2023-032',
      nextEligibleDate: '2023-12-19'
    },
    {
      id: 4,
      date: '2023-06-25',
      hospital: 'Teaching Hospital',
      location: 'Kathmandu',
      bloodType: 'O+',
      units: 1,
      recipientInfo: 'Maternity complication',
      status: 'completed',
      certificateId: 'CERT-2023-018',
      nextEligibleDate: '2023-09-23'
    },
    {
      id: 5,
      date: '2023-03-30',
      hospital: 'Red Cross Blood Bank',
      location: 'Kathmandu',
      bloodType: 'O+',
      units: 1,
      recipientInfo: 'Blood bank stock',
      status: 'completed',
      certificateId: 'CERT-2023-007',
      nextEligibleDate: '2023-06-28'
    }
  ];

  const achievements = [
    { id: 1, title: 'First Time Donor', description: 'Completed your first donation', earned: true, date: '2023-03-30' },
    { id: 2, title: 'Regular Donor', description: 'Made 3 donations', earned: true, date: '2023-09-20' },
    { id: 3, title: 'Life Saver', description: 'Made 5 donations', earned: true, date: '2024-03-10' },
    { id: 4, title: 'Hero Donor', description: 'Made 10 donations', earned: false, date: null },
    { id: 5, title: 'Annual Donor', description: 'Donated every quarter for a year', earned: false, date: null }
  ];

  const stats = [
    { label: 'Total Donations', value: donationHistory.length, icon: Heart },
    { label: 'Total Units', value: donationHistory.reduce((sum, d) => sum + d.units, 0), icon: Heart },
    { label: 'Lives Saved', value: donationHistory.length * 3, icon: Heart },
    { label: 'Hospitals Served', value: new Set(donationHistory.map(d => d.hospital)).size, icon: MapPin }
  ];

  const filteredHistory = donationHistory.filter(donation => {
    if (filter === 'all') return true;
    if (filter === 'recent') {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return new Date(donation.date) > sixMonthsAgo;
    }
    if (filter === 'hospital') return donation.hospital.includes('Hospital');
    return true;
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'hospital') return a.hospital.localeCompare(b.hospital);
    return 0;
  });

  const getNextEligibleDate = () => {
    const lastDonation = donationHistory[0];
    if (!lastDonation) return null;
    
    const lastDate = new Date(lastDonation.date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 90);
    return nextDate;
  };

  const canDonateNow = () => {
    const nextEligible = getNextEligibleDate();
    return nextEligible && new Date() >= nextEligible;
  };

  const downloadCertificate = (certificateId) => {
    console.log(`Downloading certificate: ${certificateId}`);
    // In a real app, this would download the certificate
  };

  return (
    <div className="donation-history">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Clock className="inline mr-2" size={28} />
            Donation History
          </h1>
          <p className="text-gray">
            Track your blood donation journey and achievements
          </p>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <Icon className="text-red-500" size={24} />
                </div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Donation Status */}
        <div className="donation-status-card">
          <div className="status-info">
            <h3 className="status-title">Donation Status</h3>
            {canDonateNow() ? (
              <div className="status-eligible">
                <div className="status-badge eligible">Ready to Donate</div>
                <p>You are eligible to donate blood now!</p>
              </div>
            ) : (
              <div className="status-waiting">
                <div className="status-badge waiting">Waiting Period</div>
                <p>Next eligible date: {getNextEligibleDate()?.toLocaleDateString()}</p>
              </div>
            )}
          </div>
          <div className="status-actions">
            <button className="btn btn-primary" disabled={!canDonateNow()}>
              Schedule Donation
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="card">
        <div className="controls-section">
          <div className="filter-controls">
            <div className="filter-group">
              <label>Filter by:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Donations</option>
                <option value="recent">Recent (6 months)</option>
                <option value="hospital">Hospitals Only</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">Date</option>
                <option value="hospital">Hospital</option>
              </select>
            </div>
          </div>
          
          <div className="action-controls">
            <button className="btn btn-secondary">
              <Download className="inline mr-2" size={16} />
              Export History
            </button>
          </div>
        </div>
      </div>

      {/* Donation Timeline */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Calendar className="inline mr-2" size={20} />
            Donation Timeline
          </h2>
        </div>
        
        <div className="donation-timeline">
          {sortedHistory.map((donation, index) => (
            <div key={donation.id} className="donation-item">
              <div className="donation-date">
                {new Date(donation.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div className="donation-details">
                <h3 className="donation-hospital">{donation.hospital}</h3>
                <div className="donation-info">
                  <span className="blood-type-badge">{donation.bloodType}</span>
                  <span className="units-info">{donation.units} unit(s)</span>
                </div>
                <div className="donation-meta">
                  <span>
                    <MapPin className="inline mr-1" size={14} />
                    {donation.location}
                  </span>
                  <span>For: {donation.recipientInfo}</span>
                </div>
              </div>
              
              <div className="donation-status">
                <span className="donation-status-badge">
                  {donation.status}
                </span>
              </div>
              
              <div className="donation-actions">
                <button
                  onClick={() => downloadCertificate(donation.certificateId)}
                  className="btn btn-secondary"
                >
                  <Download className="inline mr-2" size={14} />
                  Certificate
                </button>
                <button className="btn btn-secondary">
                  <Eye className="inline mr-2" size={14} />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Award className="inline mr-2" size={20} />
            Achievements
          </h2>
        </div>
        
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">
                <Award size={32} />
              </div>
              <div className="achievement-info">
                <h3 className="achievement-title">{achievement.title}</h3>
                <p className="achievement-description">{achievement.description}</p>
                {achievement.earned && (
                  <div className="achievement-date">
                    Earned: {new Date(achievement.date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">What's Next?</h2>
        </div>
        
        <div className="next-steps">
          <div className="step-card">
            <div className="step-icon">
              <Heart className="text-red-500" size={24} />
            </div>
            <div className="step-content">
              <h3>Ready to Donate Again?</h3>
              <p>
                {canDonateNow() 
                  ? "You're eligible to donate now! Schedule your next donation."
                  : `You'll be eligible to donate again on ${getNextEligibleDate()?.toLocaleDateString()}`
                }
              </p>
              <button className="btn btn-primary" disabled={!canDonateNow()}>
                Schedule Donation
              </button>
            </div>
          </div>
          
          <div className="step-card">
            <div className="step-icon">
              <Award className="text-yellow-500" size={24} />
            </div>
            <div className="step-content">
              <h3>Unlock More Achievements</h3>
              <p>Continue your donation journey to unlock more achievements and help save more lives.</p>
              <button className="btn btn-secondary">View All Achievements</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;