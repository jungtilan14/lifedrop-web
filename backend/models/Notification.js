module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM(
        'blood_request_created',
        'blood_request_accepted',
        'blood_request_rejected',
        'blood_request_completed',
        'blood_request_cancelled',
        'blood_request_expired',
        'donation_reminder',
        'urgent_blood_needed',
        'donation_scheduled',
        'donation_completed',
        'donor_found',
        'hospital_verified',
        'profile_updated',
        'system_notification',
        'emergency_alert',
        'blood_stock_low',
        'donation_camp_announcement'
      ),
      allowNull: false
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
      allowNull: false,
      defaultValue: 'medium'
    },
    category: {
      type: DataTypes.ENUM('blood_request', 'donation', 'system', 'emergency', 'general'),
      allowNull: false,
      defaultValue: 'general'
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_sent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    delivery_method: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        push: true,
        email: false,
        sms: false,
        in_app: true
      }
    },
    push_notification_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sms_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    action_required: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    action_type: {
      type: DataTypes.ENUM('accept', 'reject', 'respond', 'update', 'confirm', 'none'),
      allowNull: false,
      defaultValue: 'none'
    },
    action_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    action_data: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sender_type: {
      type: DataTypes.ENUM('user', 'hospital', 'system'),
      allowNull: false,
      defaultValue: 'system'
    },
    hospital_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'hospitals',
        key: 'id'
      }
    },
    location: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
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
    tableName: 'notifications',
    paranoid: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['blood_request_id']
      },
      {
        fields: ['type']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['category']
      },
      {
        fields: ['is_read']
      },
      {
        fields: ['is_sent']
      },
      {
        fields: ['sender_id']
      },
      {
        fields: ['hospital_id']
      },
      {
        fields: ['expires_at']
      },
      {
        fields: ['action_required']
      },
      {
        fields: ['created_at']
      }
    ],
    hooks: {
      beforeCreate: (notification) => {
        // Set default expiration for certain types
        if (!notification.expires_at) {
          const expirationHours = {
            'blood_request_created': 168, // 7 days
            'urgent_blood_needed': 24,    // 1 day
            'emergency_alert': 6,         // 6 hours
            'donation_reminder': 72,      // 3 days
            'blood_stock_low': 48         // 2 days
          };
          
          const hours = expirationHours[notification.type];
          if (hours) {
            notification.expires_at = new Date(Date.now() + (hours * 60 * 60 * 1000));
          }
        }
      },
      afterUpdate: (notification) => {
        if (notification.changed('is_read') && notification.is_read) {
          notification.read_at = new Date();
        }
      }
    }
  });

  // Instance methods
  Notification.prototype.markAsRead = function() {
    this.is_read = true;
    this.read_at = new Date();
    return this.save();
  };

  Notification.prototype.markAsSent = function() {
    this.is_sent = true;
    this.sent_at = new Date();
    return this.save();
  };

  Notification.prototype.isExpired = function() {
    return this.expires_at && new Date() > new Date(this.expires_at);
  };

  Notification.prototype.isUrgent = function() {
    return this.priority === 'critical' || this.priority === 'high';
  };

  Notification.prototype.requiresAction = function() {
    return this.action_required && this.action_type !== 'none';
  };

  Notification.prototype.canBeActioned = function() {
    return this.requiresAction() && !this.isExpired();
  };

  Notification.prototype.getTimeRemaining = function() {
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

  // Class methods
  Notification.findUnreadByUser = function(userId) {
    return this.findAll({
      where: {
        user_id: userId,
        is_read: false
      },
      order: [['created_at', 'DESC']]
    });
  };

  Notification.findByUserAndType = function(userId, type) {
    return this.findAll({
      where: {
        user_id: userId,
        type: type
      },
      order: [['created_at', 'DESC']]
    });
  };

  Notification.findUrgentNotifications = function(userId = null) {
    const { Op } = require('sequelize');
    
    let whereClause = {
      priority: { [Op.in]: ['critical', 'high'] },
      is_read: false
    };

    if (userId) {
      whereClause.user_id = userId;
    }

    return this.findAll({
      where: whereClause,
      order: [['priority', 'DESC'], ['created_at', 'DESC']]
    });
  };

  Notification.findActionableNotifications = function(userId) {
    const { Op } = require('sequelize');
    
    return this.findAll({
      where: {
        user_id: userId,
        action_required: true,
        action_type: { [Op.ne]: 'none' },
        is_read: false,
        expires_at: { [Op.or]: [null, { [Op.gt]: new Date() }] }
      },
      order: [['priority', 'DESC'], ['created_at', 'DESC']]
    });
  };

  Notification.findExpiredNotifications = function() {
    const { Op } = require('sequelize');
    
    return this.findAll({
      where: {
        expires_at: { [Op.lt]: new Date() },
        is_read: false
      }
    });
  };

  Notification.createBloodRequestNotification = function(bloodRequest, recipientIds, type) {
    const notifications = recipientIds.map(userId => ({
      user_id: userId,
      blood_request_id: bloodRequest.id,
      title: this.getNotificationTitle(type, bloodRequest),
      message: this.getNotificationMessage(type, bloodRequest),
      type: type,
      priority: bloodRequest.urgency_level === 'critical' ? 'critical' : 'high',
      category: 'blood_request',
      data: {
        blood_type: bloodRequest.blood_type,
        location: bloodRequest.city,
        urgency: bloodRequest.urgency_level,
        patient_name: bloodRequest.patient_name
      },
      action_required: type === 'blood_request_created',
      action_type: type === 'blood_request_created' ? 'respond' : 'none',
      hospital_id: bloodRequest.hospital_id,
      sender_type: 'hospital'
    }));

    return this.bulkCreate(notifications);
  };

  Notification.getNotificationTitle = function(type, data) {
    const titles = {
      'blood_request_created': `Urgent: ${data.blood_type} Blood Needed`,
      'blood_request_accepted': 'Blood Request Accepted',
      'blood_request_rejected': 'Blood Request Declined',
      'blood_request_completed': 'Blood Donation Completed',
      'blood_request_cancelled': 'Blood Request Cancelled',
      'donation_reminder': 'Blood Donation Reminder',
      'urgent_blood_needed': 'Emergency Blood Request',
      'donation_scheduled': 'Donation Appointment Scheduled',
      'donation_completed': 'Thank You for Donating Blood',
      'donor_found': 'Donor Found for Blood Request',
      'hospital_verified': 'Hospital Account Verified',
      'blood_stock_low': 'Low Blood Stock Alert',
      'donation_camp_announcement': 'Blood Donation Camp'
    };

    return titles[type] || 'Notification';
  };

  Notification.getNotificationMessage = function(type, data) {
    const messages = {
      'blood_request_created': `${data.blood_type} blood is urgently needed for ${data.patient_name} at ${data.location}. Please respond if you can help.`,
      'blood_request_accepted': `Your blood donation request has been accepted. Please contact the hospital for next steps.`,
      'blood_request_rejected': `Your blood donation request has been declined. Please try contacting other nearby hospitals.`,
      'blood_request_completed': `Blood donation for ${data.patient_name} has been completed successfully. Thank you for your contribution.`,
      'blood_request_cancelled': `The blood request for ${data.patient_name} has been cancelled.`,
      'donation_reminder': `You are eligible to donate blood again. Your last donation was on ${data.last_donation_date}.`,
      'urgent_blood_needed': `Critical shortage of ${data.blood_type} blood in your area. Immediate donors needed.`,
      'donation_scheduled': `Your blood donation appointment has been scheduled for ${data.appointment_date}.`,
      'donation_completed': `Thank you for your blood donation. Your contribution will help save lives.`,
      'donor_found': `A donor has been found for your blood request. They will be contacted shortly.`,
      'hospital_verified': `Your hospital account has been verified and is now active.`,
      'blood_stock_low': `${data.blood_type} blood stock is running low. Please encourage donors to donate.`,
      'donation_camp_announcement': `Blood donation camp at ${data.location} on ${data.date}. Join us to save lives.`
    };

    return messages[type] || 'You have a new notification.';
  };

  return Notification;
};