const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
      }
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50]
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255]
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('donor', 'hospital_admin', 'admin'),
      allowNull: false,
      defaultValue: 'donor'
    },
    blood_type: {
      type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
      allowNull: true
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    pincode: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    last_donation_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    medical_conditions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    phone_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    notification_preferences: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        email: true,
        sms: true,
        push: true
      }
    },
    hospital_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Hospitals',
        key: 'id'
      }
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    locked_until: {
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
    tableName: 'users',
    paranoid: true,
    indexes: [
      {
        fields: ['email']
      },
      {
        fields: ['blood_type']
      },
      {
        fields: ['city']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_available']
      },
      {
        fields: ['latitude', 'longitude']
      }
    ],
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    }
  });

  // Instance methods
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    delete values.reset_password_token;
    delete values.reset_password_expires;
    delete values.email_verification_token;
    delete values.login_attempts;
    delete values.locked_until;
    return values;
  };

  User.prototype.canDonate = function() {
    if (!this.last_donation_date) return true;
    
    const daysSinceLastDonation = Math.floor(
      (new Date() - new Date(this.last_donation_date)) / (1000 * 60 * 60 * 24)
    );
    
    return daysSinceLastDonation >= 56; // 8 weeks minimum gap
  };

  User.prototype.isAccountLocked = function() {
    return this.locked_until && this.locked_until > new Date();
  };

  // Class methods
  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.findAvailableDonors = function(bloodType, city, latitude, longitude, radius = 10) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      role: 'donor',
      is_available: true,
      is_verified: true,
      blood_type: bloodType
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
      order: [['last_donation_date', 'ASC']]
    });
  };

  return User;
};