module.exports = (sequelize, DataTypes) => {
  const Hospital = sequelize.define('Hospital', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    registration_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    address: {
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
    hospital_type: {
      type: DataTypes.ENUM('government', 'private', 'charitable', 'military'),
      allowNull: false,
      defaultValue: 'government'
    },
    services: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    blood_bank_services: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        collection: true,
        testing: true,
        storage: true,
        transfusion: true
      }
    },
    operating_hours: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '09:00', close: '14:00' },
        sunday: { open: '09:00', close: '14:00' }
      }
    },
    emergency_contact: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    license_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    accreditation: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bed_capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    blood_bank_capacity: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        'A+': 0,
        'A-': 0,
        'B+': 0,
        'B-': 0,
        'AB+': 0,
        'AB-': 0,
        'O+': 0,
        'O-': 0
      }
    },
    current_blood_stock: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        'A+': 0,
        'A-': 0,
        'B+': 0,
        'B-': 0,
        'AB+': 0,
        'AB-': 0,
        'O+': 0,
        'O-': 0
      }
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    verification_documents: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    contact_person: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    contact_person_phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    contact_person_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: true,
      defaultValue: 0.00,
      validate: {
        min: 0,
        max: 5
      }
    },
    total_donations_received: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    tableName: 'hospitals',
    paranoid: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['registration_number']
      },
      {
        fields: ['city']
      },
      {
        fields: ['state']
      },
      {
        fields: ['is_verified']
      },
      {
        fields: ['is_active']
      },
      {
        fields: ['latitude', 'longitude']
      }
    ]
  });

  // Instance methods
  Hospital.prototype.updateBloodStock = function(bloodType, quantity) {
    const currentStock = this.current_blood_stock || {};
    currentStock[bloodType] = Math.max(0, (currentStock[bloodType] || 0) + quantity);
    this.current_blood_stock = currentStock;
    return this.save();
  };

  Hospital.prototype.hasBloodAvailable = function(bloodType, quantity = 1) {
    const currentStock = this.current_blood_stock || {};
    return (currentStock[bloodType] || 0) >= quantity;
  };

  Hospital.prototype.isOperatingNow = function() {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    const todayHours = this.operating_hours[currentDay];
    if (!todayHours) return false;
    
    return currentTime >= todayHours.open && currentTime <= todayHours.close;
  };

  Hospital.prototype.calculateDistance = function(latitude, longitude) {
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
  Hospital.findByRegistrationNumber = function(registrationNumber) {
    return this.findOne({ where: { registration_number: registrationNumber } });
  };

  Hospital.findNearby = function(latitude, longitude, radius = 10) {
    const { Op } = require('sequelize');
    
    if (!latitude || !longitude) {
      return this.findAll({
        where: {
          is_verified: true,
          is_active: true
        },
        order: [['name', 'ASC']]
      });
    }

    const earthRadius = 6371; // Earth's radius in kilometers
    const radianLatitude = latitude * (Math.PI / 180);
    const radianLongitude = longitude * (Math.PI / 180);
    
    return this.findAll({
      where: {
        is_verified: true,
        is_active: true,
        [Op.and]: sequelize.where(
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
        )
      },
      order: [['name', 'ASC']]
    });
  };

  Hospital.findWithBloodAvailability = function(bloodType, city = null) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      is_verified: true,
      is_active: true
    };

    if (city) {
      whereClause.city = city;
    }

    // Filter hospitals that have the required blood type in stock
    whereClause[Op.and] = sequelize.where(
      sequelize.literal(`JSON_EXTRACT(current_blood_stock, '$.${bloodType}')`),
      '>',
      0
    );

    return this.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
  };

  return Hospital;
};