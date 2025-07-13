const { Server } = require('socket.io');
const { Notification, User } = require('../models');
const admin = require('firebase-admin');
const emailService = require('./emailService');
const { Op } = require('sequelize');

class NotificationService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
    this.initializeFirebase();
  }

  // Initialize Firebase Admin SDK
  initializeFirebase() {
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        const firebaseConfig = {
          type: 'service_account',
          project_id: process.env.FIREBASE_PROJECT_ID,
          private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
          private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          client_email: process.env.FIREBASE_CLIENT_EMAIL,
          client_id: process.env.FIREBASE_CLIENT_ID,
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
          auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
        };

        admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
          databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
        });

        console.log('✅ Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
    }
  }

  // Initialize Socket.IO
  initializeSocket(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (data) => {
        if (data.userId) {
          this.connectedUsers.set(data.userId, socket.id);
          socket.userId = data.userId;
          socket.join(`user_${data.userId}`);
          console.log(`User ${data.userId} authenticated`);
        }
      });

      // Handle joining blood type rooms
      socket.on('join_blood_type', (bloodType) => {
        socket.join(`blood_type_${bloodType}`);
        console.log(`User joined blood type room: ${bloodType}`);
      });

      // Handle joining location rooms
      socket.on('join_location', (city) => {
        socket.join(`location_${city}`);
        console.log(`User joined location room: ${city}`);
      });

      // Handle notification acknowledgment
      socket.on('notification_read', async (notificationId) => {
        try {
          await Notification.findByIdAndUpdate(notificationId, { is_read: true });
          console.log(`Notification ${notificationId} marked as read`);
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.userId) {
          this.connectedUsers.delete(socket.userId);
          console.log(`User ${socket.userId} disconnected`);
        }
      });
    });

    console.log('✅ Socket.IO initialized successfully');
  }

  // Send notification to specific user
  async sendNotificationToUser(userId, notification) {
    try {
      // Save notification to database
      const savedNotification = await Notification.create({
        user_id: userId,
        ...notification
      });

      // Send via WebSocket if user is connected
      if (this.io && this.connectedUsers.has(userId)) {
        this.io.to(`user_${userId}`).emit('notification', savedNotification);
      }

      // Send push notification
      if (notification.delivery_method?.push) {
        await this.sendPushNotification(userId, notification);
      }

      // Send email notification
      if (notification.delivery_method?.email) {
        const user = await User.findByPk(userId);
        if (user) {
          await this.sendEmailNotification(user, notification);
        }
      }

      return savedNotification;
    } catch (error) {
      console.error('Error sending notification to user:', error);
      throw error;
    }
  }

  // Send notification to multiple users
  async sendNotificationToUsers(userIds, notification) {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        ...notification
      }));

      // Save notifications to database
      const savedNotifications = await Notification.bulkCreate(notifications);

      // Send via WebSocket to connected users
      if (this.io) {
        userIds.forEach(userId => {
          if (this.connectedUsers.has(userId)) {
            const userNotification = savedNotifications.find(n => n.user_id === userId);
            this.io.to(`user_${userId}`).emit('notification', userNotification);
          }
        });
      }

      // Send push notifications
      if (notification.delivery_method?.push) {
        await this.sendPushNotificationToUsers(userIds, notification);
      }

      // Send email notifications
      if (notification.delivery_method?.email) {
        const users = await User.findAll({ where: { id: userIds } });
        await Promise.all(users.map(user => this.sendEmailNotification(user, notification)));
      }

      return savedNotifications;
    } catch (error) {
      console.error('Error sending notifications to users:', error);
      throw error;
    }
  }

  // Send notification to blood type group
  async sendNotificationToBloodType(bloodType, notification) {
    try {
      // Find users with matching blood type
      const users = await User.findAll({
        where: {
          blood_type: bloodType,
          role: 'donor',
          is_available: true,
          is_verified: true
        }
      });

      const userIds = users.map(user => user.id);

      // Send to WebSocket room
      if (this.io) {
        this.io.to(`blood_type_${bloodType}`).emit('notification', notification);
      }

      // Send individual notifications
      return await this.sendNotificationToUsers(userIds, notification);
    } catch (error) {
      console.error('Error sending notification to blood type group:', error);
      throw error;
    }
  }

  // Send notification to location group
  async sendNotificationToLocation(city, notification) {
    try {
      // Find users in the same city
      const users = await User.findAll({
        where: {
          city: city,
          role: 'donor',
          is_available: true,
          is_verified: true
        }
      });

      const userIds = users.map(user => user.id);

      // Send to WebSocket room
      if (this.io) {
        this.io.to(`location_${city}`).emit('notification', notification);
      }

      // Send individual notifications
      return await this.sendNotificationToUsers(userIds, notification);
    } catch (error) {
      console.error('Error sending notification to location group:', error);
      throw error;
    }
  }

  // Send push notification
  async sendPushNotification(userId, notification) {
    try {
      const user = await User.findByPk(userId);
      if (!user || !user.fcm_token) {
        return;
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          category: notification.category,
          priority: notification.priority,
          ...notification.data
        },
        token: user.fcm_token
      };

      const response = await admin.messaging().send(message);
      console.log('Push notification sent successfully:', response);

      // Update notification with push ID
      await Notification.findByIdAndUpdate(notification.id, {
        push_notification_id: response
      });

      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  // Send push notification to multiple users
  async sendPushNotificationToUsers(userIds, notification) {
    try {
      const users = await User.findAll({
        where: { id: userIds },
        attributes: ['id', 'fcm_token']
      });

      const tokens = users.filter(user => user.fcm_token).map(user => user.fcm_token);

      if (tokens.length === 0) {
        return;
      }

      const message = {
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          category: notification.category,
          priority: notification.priority,
          ...notification.data
        },
        tokens: tokens
      };

      const response = await admin.messaging().sendMulticast(message);
      console.log('Push notifications sent successfully:', response);

      return response;
    } catch (error) {
      console.error('Error sending push notifications to users:', error);
      throw error;
    }
  }

  // Send email notification
  async sendEmailNotification(user, notification) {
    try {
      // Check user's email preferences
      const preferences = user.notification_preferences || {};
      if (!preferences.email) {
        return;
      }

      switch (notification.type) {
        case 'blood_request_created':
          const bloodRequest = notification.data;
          await emailService.sendBloodRequestNotification(user, bloodRequest);
          break;
        case 'donation_completed':
          const donationHistory = notification.data;
          await emailService.sendDonationConfirmation(user, donationHistory);
          break;
        case 'donation_reminder':
          await emailService.sendDonationReminder(user);
          break;
        case 'hospital_verified':
          const hospital = notification.data;
          await emailService.sendHospitalVerificationEmail(user, hospital);
          break;
        case 'urgent_blood_needed':
        case 'emergency_alert':
          const emergencyRequest = notification.data;
          await emailService.sendEmergencyBloodRequest([user], emergencyRequest);
          break;
        default:
          console.log(`No email template for notification type: ${notification.type}`);
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Create blood request notification
  async createBloodRequestNotification(bloodRequest) {
    try {
      const notification = {
        blood_request_id: bloodRequest.id,
        title: `Urgent: ${bloodRequest.blood_type} Blood Needed`,
        message: `${bloodRequest.blood_type} blood is urgently needed for ${bloodRequest.patient_name} at ${bloodRequest.location}`,
        type: 'blood_request_created',
        priority: bloodRequest.urgency_level === 'critical' ? 'critical' : 'high',
        category: 'blood_request',
        data: {
          blood_type: bloodRequest.blood_type,
          location: bloodRequest.city,
          urgency: bloodRequest.urgency_level,
          patient_name: bloodRequest.patient_name,
          hospital_id: bloodRequest.hospital_id
        },
        action_required: true,
        action_type: 'respond',
        action_url: `/blood-requests/${bloodRequest.id}`,
        delivery_method: {
          push: true,
          email: true,
          in_app: true
        }
      };

      // Send to matching blood type donors
      await this.sendNotificationToBloodType(bloodRequest.blood_type, notification);

      return notification;
    } catch (error) {
      console.error('Error creating blood request notification:', error);
      throw error;
    }
  }

  // Create donation reminder notifications
  async createDonationReminderNotifications() {
    try {
      // Find eligible donors (last donated 8+ weeks ago)
      const eightWeeksAgo = new Date();
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

      const eligibleDonors = await User.findAll({
        where: {
          role: 'donor',
          is_available: true,
          is_verified: true,
          last_donation_date: {
            [Op.lte]: eightWeeksAgo
          }
        }
      });

      const notification = {
        title: 'Time to Donate Blood Again',
        message: 'You are eligible to donate blood again. Your donation can save lives!',
        type: 'donation_reminder',
        priority: 'medium',
        category: 'donation',
        data: {
          last_donation_date: null // Will be set per user
        },
        delivery_method: {
          push: true,
          email: true,
          in_app: true
        }
      };

      // Send individual notifications
      for (const donor of eligibleDonors) {
        const personalizedNotification = {
          ...notification,
          data: {
            ...notification.data,
            last_donation_date: donor.last_donation_date
          }
        };

        await this.sendNotificationToUser(donor.id, personalizedNotification);
      }

      console.log(`Sent donation reminders to ${eligibleDonors.length} donors`);
      return eligibleDonors.length;
    } catch (error) {
      console.error('Error creating donation reminder notifications:', error);
      throw error;
    }
  }

  // Create emergency blood request
  async createEmergencyBloodRequest(bloodRequest) {
    try {
      const notification = {
        blood_request_id: bloodRequest.id,
        title: `EMERGENCY: ${bloodRequest.blood_type} Blood Needed Immediately`,
        message: `CRITICAL: ${bloodRequest.blood_type} blood needed immediately for ${bloodRequest.patient_name}`,
        type: 'emergency_alert',
        priority: 'critical',
        category: 'emergency',
        data: {
          blood_type: bloodRequest.blood_type,
          location: bloodRequest.city,
          patient_name: bloodRequest.patient_name,
          hospital_id: bloodRequest.hospital_id
        },
        action_required: true,
        action_type: 'respond',
        action_url: `/blood-requests/${bloodRequest.id}`,
        delivery_method: {
          push: true,
          email: true,
          in_app: true
        }
      };

      // Send to all donors in the same city with matching blood type
      const donors = await User.findAll({
        where: {
          blood_type: bloodRequest.blood_type,
          city: bloodRequest.city,
          role: 'donor',
          is_available: true,
          is_verified: true
        }
      });

      const userIds = donors.map(donor => donor.id);
      await this.sendNotificationToUsers(userIds, notification);

      return notification;
    } catch (error) {
      console.error('Error creating emergency blood request:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, options = {}) {
    try {
      const { page = 1, limit = 20, unread_only = false } = options;
      const offset = (page - 1) * limit;

      let whereClause = { user_id: userId };
      if (unread_only) {
        whereClause.is_read = false;
      }

      const notifications = await Notification.findAndCountAll({
        where: whereClause,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return {
        notifications: notifications.rows,
        total: notifications.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(notifications.count / limit)
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOne({
        where: { id: notificationId, user_id: userId }
      });

      if (!notification) {
        throw new Error('Notification not found');
      }

      await notification.update({ is_read: true, read_at: new Date() });
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead(userId) {
    try {
      await Notification.update(
        { is_read: true, read_at: new Date() },
        { where: { user_id: userId, is_read: false } }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(userId) {
    try {
      const { sequelize } = require('../models');
      
      const stats = await Notification.findAll({
        where: { user_id: userId },
        attributes: [
          'category',
          'priority',
          [sequelize.fn('COUNT', '*'), 'count']
        ],
        group: ['category', 'priority']
      });

      const unreadCount = await Notification.count({
        where: { user_id: userId, is_read: false }
      });

      return {
        unread_count: unreadCount,
        by_category: stats
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();