import React, { useState } from 'react';
import { Shield, Users, FileText, Activity, Settings, Eye, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const users = [
    {
      id: 1,
      name: 'Raj Kumar Sharma',
      email: 'raj.sharma@email.com',
      type: 'donor',
      status: 'active',
      joinDate: '2024-01-15',
      lastActivity: '2024-03-10',
      donations: 8
    },
    {
      id: 2,
      name: 'Sita Poudel',
      email: 'sita.poudel@email.com',
      type: 'recipient',
      status: 'active',
      joinDate: '2024-02-20',
      lastActivity: '2024-03-12',
      requests: 2
    },
    {
      id: 3,
      name: 'Maya Gurung',
      email: 'maya.gurung@email.com',
      type: 'donor',
      status: 'inactive',
      joinDate: '2024-01-08',
      lastActivity: '2024-02-15',
      donations: 3
    }
  ];

  const bloodRequests = [
    {
      id: 1,
      patientName: 'Ram Bahadur',
      bloodType: 'O+',
      hospital: 'Teaching Hospital',
      status: 'pending',
      urgency: 'high',
      submittedDate: '2024-03-15'
    },
    {
      id: 2,
      patientName: 'Sita Kumari',
      bloodType: 'A+',
      hospital: 'Patan Hospital',
      status: 'approved',
      urgency: 'medium',
      submittedDate: '2024-03-14'
    }
  ];

  const donations = [
    {
      id: 1,
      donorName: 'Raj Kumar Sharma',
      bloodType: 'O+',
      hospital: 'Teaching Hospital',
      status: 'completed',
      date: '2024-03-10',
      units: 1
    },
    {
      id: 2,
      donorName: 'Arjun Rai',
      bloodType: 'A+',
      hospital: 'Bir Hospital',
      status: 'verified',
      date: '2024-03-12',
      units: 1
    }
  ];

  const stats = [
    { title: 'Total Users', value: '2,847', change: '+12%', color: 'text-blue-500' },
    { title: 'Active Donors', value: '1,623', change: '+8%', color: 'text-green-500' },
    { title: 'Blood Requests', value: '156', change: '+23%', color: 'text-red-500' },
    { title: 'Donations This Month', value: '89', change: '+15%', color: 'text-purple-500' }
  ];

  const handleUserAction = (userId, action) => {
    console.log(`Performing ${action} on user ${userId}`);
    // In a real app, this would make an API call
  };

  const handleRequestAction = (requestId, action) => {
    console.log(`Performing ${action} on request ${requestId}`);
    // In a real app, this would make an API call
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-gray-500 text-white',
      pending: 'bg-yellow-500 text-white',
      approved: 'bg-green-500 text-white',
      rejected: 'bg-red-500 text-white',
      completed: 'bg-blue-500 text-white',
      verified: 'bg-green-500 text-white'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'bg-gray-500 text-white'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="admin-panel">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Shield className="inline mr-2" size={28} />
            Admin Panel
          </h1>
          <p className="text-gray">
            Manage users, blood requests, and platform content
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            onClick={() => setActiveTab('overview')}
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Activity className="inline mr-2" size={16} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          >
            <Users className="inline mr-2" size={16} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          >
            <FileText className="inline mr-2" size={16} />
            Blood Requests
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
          >
            <Activity className="inline mr-2" size={16} />
            Donations
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="admin-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Platform Statistics</h2>
            </div>
            
            <div className="admin-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.value}</div>
                  <div className="stat-label">{stat.title}</div>
                  <div className={`stat-change ${stat.color}`}>{stat.change}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
            </div>
            
            <div className="activity-feed">
              <div className="activity-item">
                <div className="activity-icon">
                  <Users className="text-blue-500" size={20} />
                </div>
                <div className="activity-content">
                  <p>New user registered: Raj Kumar Sharma</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <FileText className="text-red-500" size={20} />
                </div>
                <div className="activity-content">
                  <p>Blood request submitted for O+ blood type</p>
                  <span className="activity-time">4 hours ago</span>
                </div>
              </div>
              
              <div className="activity-item">
                <div className="activity-icon">
                  <Activity className="text-green-500" size={20} />
                </div>
                <div className="activity-content">
                  <p>Blood donation completed at Teaching Hospital</p>
                  <span className="activity-time">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">User Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Activity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.type}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>{user.joinDate}</td>
                      <td>
                        {user.type === 'donor' ? `${user.donations} donations` : `${user.requests || 0} requests`}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleUserAction(user.id, 'view')}
                            className="btn-icon"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'edit')}
                            className="btn-icon"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleUserAction(user.id, 'delete')}
                            className="btn-icon text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Blood Requests Tab */}
      {activeTab === 'requests' && (
        <div className="admin-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Blood Request Management</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Urgency</th>
                    <th>Status</th>
                    <th>Submitted Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bloodRequests.map(request => (
                    <tr key={request.id}>
                      <td>{request.patientName}</td>
                      <td>
                        <span className="blood-type-badge">{request.bloodType}</span>
                      </td>
                      <td>{request.hospital}</td>
                      <td>
                        <span className={`urgency-badge urgency-${request.urgency}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>{request.submittedDate}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            className="btn-icon text-green-500"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            className="btn-icon text-red-500"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleRequestAction(request.id, 'view')}
                            className="btn-icon"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Donations Tab */}
      {activeTab === 'donations' && (
        <div className="admin-section">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Donation Verification</h2>
            </div>
            
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Units</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map(donation => (
                    <tr key={donation.id}>
                      <td>{donation.donorName}</td>
                      <td>
                        <span className="blood-type-badge">{donation.bloodType}</span>
                      </td>
                      <td>{donation.hospital}</td>
                      <td>{donation.units}</td>
                      <td>{donation.date}</td>
                      <td>{getStatusBadge(donation.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleRequestAction(donation.id, 'verify')}
                            className="btn-icon text-green-500"
                            title="Verify"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleRequestAction(donation.id, 'view')}
                            className="btn-icon"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* System Settings */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Settings className="inline mr-2" size={20} />
            System Settings
          </h2>
        </div>
        
        <div className="settings-grid">
          <div className="setting-card">
            <h3 className="setting-title">Notification Settings</h3>
            <p className="setting-description">Configure system notifications and alerts</p>
            <button className="btn btn-secondary">Configure</button>
          </div>
          
          <div className="setting-card">
            <h3 className="setting-title">User Verification</h3>
            <p className="setting-description">Manage user verification process</p>
            <button className="btn btn-secondary">Manage</button>
          </div>
          
          <div className="setting-card">
            <h3 className="setting-title">Blood Bank Integration</h3>
            <p className="setting-description">Configure blood bank API connections</p>
            <button className="btn btn-secondary">Setup</button>
          </div>
          
          <div className="setting-card">
            <h3 className="setting-title">Platform Analytics</h3>
            <p className="setting-description">View detailed platform analytics</p>
            <button className="btn btn-secondary">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;