const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize connection
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Hospital = require('./Hospital')(sequelize, Sequelize.DataTypes);
const BloodRequest = require('./BloodRequest')(sequelize, Sequelize.DataTypes);
const DonationHistory = require('./DonationHistory')(sequelize, Sequelize.DataTypes);
const Notification = require('./Notification')(sequelize, Sequelize.DataTypes);

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(BloodRequest, { foreignKey: 'donor_id', as: 'donorRequests' });
  User.hasMany(DonationHistory, { foreignKey: 'donor_id', as: 'donations' });
  User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
  User.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });

  // Hospital associations
  Hospital.hasMany(User, { foreignKey: 'hospital_id', as: 'staff' });
  Hospital.hasMany(BloodRequest, { foreignKey: 'hospital_id', as: 'requests' });
  Hospital.hasMany(DonationHistory, { foreignKey: 'hospital_id', as: 'donationHistory' });

  // BloodRequest associations
  BloodRequest.belongsTo(User, { foreignKey: 'donor_id', as: 'donor' });
  BloodRequest.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
  BloodRequest.belongsTo(User, { foreignKey: 'requester_id', as: 'requester' });
  BloodRequest.hasMany(Notification, { foreignKey: 'blood_request_id', as: 'notifications' });

  // DonationHistory associations
  DonationHistory.belongsTo(User, { foreignKey: 'donor_id', as: 'donor' });
  DonationHistory.belongsTo(Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
  DonationHistory.belongsTo(BloodRequest, { foreignKey: 'blood_request_id', as: 'bloodRequest' });

  // Notification associations
  Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Notification.belongsTo(BloodRequest, { foreignKey: 'blood_request_id', as: 'bloodRequest' });
};

// Call associations
defineAssociations();

// Database sync
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized successfully.');
  } catch (error) {
    console.error('❌ Database synchronization failed:', error);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Hospital,
  BloodRequest,
  DonationHistory,
  Notification,
  testConnection,
  syncDatabase
};