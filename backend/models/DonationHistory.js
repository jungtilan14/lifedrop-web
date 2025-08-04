module.exports = (sequelize, DataTypes) => {
  const DonationHistory = sequelize.define('DonationHistory', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    donor_id: {
      type: DataTypes.UUID,
      allowNull: false,
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
    blood_request_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'blood_requests',
        key: 'id'
      }
    },
    donation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    donation_time: {
      type: DataTypes.TIME,
      allowNull: false
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
    volume_ml: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 450,
      validate: {
        min: 100,
        max: 500
      }
    },
    hemoglobin_level: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
      validate: {
        min: 8.0,
        max: 20.0
      }
    },
    blood_pressure: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    pulse_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 40,
        max: 200
      }
    },
    weight_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 30.0,
        max: 200.0
      }
    },
    temperature: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: 95.0,
        max: 110.0
      }
    },
    donation_type: {
      type: DataTypes.ENUM('whole_blood', 'plasma', 'platelets', 'red_cells', 'granulocytes'),
      allowNull: false,
      defaultValue: 'whole_blood'
    },
    donation_method: {
      type: DataTypes.ENUM('voluntary', 'replacement', 'emergency', 'autologous'),
      allowNull: false,
      defaultValue: 'voluntary'
    },
    collection_method: {
      type: DataTypes.ENUM('manual', 'automated'),
      allowNull: false,
      defaultValue: 'manual'
    },
    screening_results: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        hiv: null,
        hepatitis_b: null,
        hepatitis_c: null,
        syphilis: null,
        malaria: null
      }
    },
    adverse_reactions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    medical_officer_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    medical_officer_license: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    technician_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    bag_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    storage_conditions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        temperature: '2-6°C',
        storage_type: 'refrigerated',
        preservation_solution: 'CPDA-1'
      }
    },
    quality_control: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        visual_inspection: 'passed',
        volume_check: 'passed',
        seal_integrity: 'passed'
      }
    },
    usage_status: {
      type: DataTypes.ENUM('available', 'used', 'discarded', 'expired'),
      allowNull: false,
      defaultValue: 'available'
    },
    usage_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usage_purpose: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    recipient_hospital: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    compatibility_testing: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        crossmatch: null,
        antibody_screen: null,
        direct_coombs: null
      }
    },
    donation_camp_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    donation_camp_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_first_time_donor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    next_eligible_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    donor_feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    staff_feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    donation_certificate: {
      type: DataTypes.STRING(255),
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
    tableName: 'donation_history',
    paranoid: true,
    indexes: [
      {
        fields: ['donor_id']
      },
      {
        fields: ['hospital_id']
      },
      {
        fields: ['blood_request_id']
      },
      {
        fields: ['donation_date']
      },
      {
        fields: ['blood_type']
      },
      {
        fields: ['donation_type']
      },
      {
        fields: ['usage_status']
      },
      {
        fields: ['bag_number']
      },
      {
        fields: ['expiry_date']
      },
      {
        fields: ['next_eligible_date']
      }
    ],
    hooks: {
      beforeCreate: (donation) => {
        // Calculate expiry date based on donation type
        const expiryDays = {
          'whole_blood': 35,
          'plasma': 365,
          'platelets': 5,
          'red_cells': 42,
          'granulocytes': 1
        };
        
        const days = expiryDays[donation.donation_type] || 35;
        donation.expiry_date = new Date(donation.donation_date.getTime() + (days * 24 * 60 * 60 * 1000));
        
        // Calculate next eligible donation date (8 weeks for whole blood)
        const eligibleDays = donation.donation_type === 'whole_blood' ? 56 : 14;
        donation.next_eligible_date = new Date(donation.donation_date.getTime() + (eligibleDays * 24 * 60 * 60 * 1000));
      },
      afterCreate: async (donation) => {
        // Update donor's last donation date
        const { User } = require('./index');
        await User.update(
          { last_donation_date: donation.donation_date },
          { where: { id: donation.donor_id } }
        );
        
        // Update hospital's donation count
        const { Hospital } = require('./index');
        await Hospital.increment('total_donations_received', { 
          where: { id: donation.hospital_id } 
        });
      }
    }
  });

  // Instance methods
  DonationHistory.prototype.isExpired = function() {
    return this.expiry_date && new Date() > new Date(this.expiry_date);
  };

  DonationHistory.prototype.isAvailable = function() {
    return this.usage_status === 'available' && !this.isExpired();
  };

  DonationHistory.prototype.getDaysUntilExpiry = function() {
    if (!this.expiry_date) return null;
    
    const now = new Date();
    const expiryDate = new Date(this.expiry_date);
    const timeDiff = expiryDate - now;
    
    if (timeDiff <= 0) return 0;
    
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  DonationHistory.prototype.canBeUsed = function() {
    return this.usage_status === 'available' && !this.isExpired();
  };

  DonationHistory.prototype.markAsUsed = function(purpose, recipientHospital) {
    this.usage_status = 'used';
    this.usage_date = new Date();
    this.usage_purpose = purpose;
    this.recipient_hospital = recipientHospital;
    return this.save();
  };

  DonationHistory.prototype.markAsDiscarded = function(reason) {
    this.usage_status = 'discarded';
    this.usage_date = new Date();
    this.usage_purpose = reason;
    return this.save();
  };

  // Class methods
  DonationHistory.findByDonor = function(donorId) {
    return this.findAll({
      where: { donor_id: donorId },
      order: [['donation_date', 'DESC']]
    });
  };

  DonationHistory.findByHospital = function(hospitalId) {
    return this.findAll({
      where: { hospital_id: hospitalId },
      order: [['donation_date', 'DESC']]
    });
  };

  DonationHistory.findAvailableBlood = function(bloodType, hospitalId = null) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      blood_type: bloodType,
      usage_status: 'available',
      expiry_date: { [Op.gt]: new Date() }
    };

    if (hospitalId) {
      whereClause.hospital_id = hospitalId;
    }

    return this.findAll({
      where: whereClause,
      order: [['donation_date', 'ASC']] // FIFO - First In, First Out
    });
  };

  DonationHistory.findExpiredUnits = function() {
    const { Op } = require('sequelize');
    
    return this.findAll({
      where: {
        usage_status: 'available',
        expiry_date: { [Op.lt]: new Date() }
      }
    });
  };

  DonationHistory.getStatistics = function(startDate, endDate) {
    const { Op } = require('sequelize');
    
    let whereClause = {};
    
    if (startDate && endDate) {
      whereClause.donation_date = {
        [Op.between]: [startDate, endDate]
      };
    }

    return this.findAll({
      where: whereClause,
      attributes: [
        'blood_type',
        'donation_type',
        'usage_status',
        [sequelize.fn('COUNT', '*'), 'count'],
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('AVG', sequelize.col('hemoglobin_level')), 'avg_hemoglobin']
      ],
      group: ['blood_type', 'donation_type', 'usage_status']
    });
  };

  return DonationHistory;
};