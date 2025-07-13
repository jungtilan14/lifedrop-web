module.exports = (sequelize, DataTypes) => {
  const BloodRequest = sequelize.define('BloodRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    donor_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    hospital_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'hospitals',
        key: 'id'
      }
    },
    requester_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    blood_type: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      }
    },
    urgency_level: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium'
    },
    patient_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    patient_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 120
      }
    },
    patient_gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: false
    },
    medical_condition: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    contact_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    contact_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    required_by: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date().toISOString()
      }
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled', 'expired'),
      allowNull: false,
      defaultValue: 'pending'
    },
    status_reason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    donation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    donation_time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    special_instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    compatibility_notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hospital_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    donor_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_emergency: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    replacement_donors: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    medical_report: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    doctor_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    doctor_contact: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'blood_requests',
    paranoid: true,
    indexes: [
      {
        fields: ['donor_id']
      },
      {
        fields: ['hospital_id']
      },
      {
        fields: ['requester_id']
      },
      {
        fields: ['blood_type']
      },
      {
        fields: ['urgency_level']
      },
      {
        fields: ['status']
      },
      {
        fields: ['city']
      },
      {
        fields: ['required_by']
      },
      {
        fields: ['is_emergency']
      },
      {
        fields: ['latitude', 'longitude']
      }
    ],
    hooks: {
      beforeCreate: (bloodRequest) => {
        // Set expiration date based on urgency level
        const now = new Date();
        const expirationHours = {
          'critical': 6,
          'high': 24,
          'medium': 72,
          'low': 168
        };
        
        const hours = expirationHours[bloodRequest.urgency_level] || 72;
        bloodRequest.expires_at = new Date(now.getTime() + (hours * 60 * 60 * 1000));
      },
      beforeUpdate: (bloodRequest) => {
        // Update timestamps based on status changes
        if (bloodRequest.changed('status')) {
          const now = new Date();
          
          switch (bloodRequest.status) {
            case 'accepted':
            case 'rejected':
              bloodRequest.responded_at = now;
              break;
            case 'completed':
              bloodRequest.completed_at = now;
              break;
            case 'cancelled':
              bloodRequest.cancelled_at = now;
              break;
          }
        }
      }
    }
  });

  // Instance methods
  BloodRequest.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  BloodRequest.prototype.isUrgent = function() {
    return this.urgency_level === 'critical' || this.urgency_level === 'high' || this.is_emergency;
  };

  BloodRequest.prototype.canBeAccepted = function() {
    return this.status === 'pending' && !this.isExpired();
  };

  BloodRequest.prototype.canBeCompleted = function() {
    return this.status === 'accepted';
  };

  BloodRequest.prototype.canBeCancelled = function() {
    return ['pending', 'accepted'].includes(this.status);
  };

  BloodRequest.prototype.getTimeRemaining = function() {
    if (!this.expires_at) return null;
    
    const now = new Date();
    const expiresAt = new Date(this.expires_at);
    const timeDiff = expiresAt - now;
    
    if (timeDiff <= 0) return 'Expired';
    
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  BloodRequest.prototype.calculateDistance = function(latitude, longitude) {
    if (!this.latitude || !this.longitude) return null;
    
    const earthRadius = 6371; // Earth's radius in kilometers
    const dLat = (latitude - this.latitude) * (Math.PI / 180);
    const dLon = (longitude - this.longitude) * (Math.PI / 180);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.latitude * (Math.PI / 180)) * Math.cos(latitude * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c;
  };

  // Class methods
  BloodRequest.findByStatus = function(status) {
    return this.findAll({
      where: { status },
      order: [['created_at', 'DESC']]
    });
  };

  BloodRequest.findUrgentRequests = function(city = null) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      status: 'pending',
      expires_at: { [Op.gt]: new Date() },
      [Op.or]: [
        { urgency_level: 'critical' },
        { urgency_level: 'high' },
        { is_emergency: true }
      ]
    };

    if (city) {
      whereClause.city = city;
    }

    return this.findAll({
      where: whereClause,
      order: [
        ['urgency_level', 'DESC'],
        ['required_by', 'ASC']
      ]
    });
  };

  BloodRequest.findByBloodType = function(bloodType, city = null, radius = 10, latitude = null, longitude = null) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      blood_type: bloodType,
      status: 'pending',
      expires_at: { [Op.gt]: new Date() }
    };

    if (city) {
      whereClause.city = city;
    }

    // If coordinates are provided, add distance-based filtering
    if (latitude && longitude) {
      const earthRadius = 6371; // Earth's radius in kilometers
      const radianLatitude = latitude * (Math.PI / 180);
      const radianLongitude = longitude * (Math.PI / 180);
      
      whereClause[Op.and] = sequelize.where(
        sequelize.literal(`(
          ${earthRadius} * acos(
            cos(${radianLatitude}) * 
            cos(latitude * PI() / 180) * 
            cos((longitude * PI() / 180) - ${radianLongitude}) + 
            sin(${radianLatitude}) * 
            sin(latitude * PI() / 180)
          )
        )`),
        '<=',
        radius
      );
    }

    return this.findAll({
      where: whereClause,
      order: [
        ['urgency_level', 'DESC'],
        ['required_by', 'ASC']
      ]
    });
  };

  BloodRequest.findExpiredRequests = function() {
    const { Op } = require('sequelize');
    
    return this.findAll({
      where: {
        status: 'pending',
        expires_at: { [Op.lt]: new Date() }
      }
    });
  };

  return BloodRequest;
};