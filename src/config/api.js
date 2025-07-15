// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  
  // Users
  USER_PROFILE: `${API_BASE_URL}/api/users/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/users/profile`,
  DONATION_HISTORY: `${API_BASE_URL}/api/users/donation-history`,
  
  // Hospitals
  HOSPITALS: `${API_BASE_URL}/api/hospitals`,
  HOSPITAL_REGISTER: `${API_BASE_URL}/api/hospitals/register`,
  NEARBY_HOSPITALS: `${API_BASE_URL}/api/hospitals/nearby`,
  
  // Blood Requests
  BLOOD_REQUESTS: `${API_BASE_URL}/api/blood-requests`,
  SEARCH_BLOOD_REQUESTS: `${API_BASE_URL}/api/blood-requests/search`,
  
  // Donations
  DONATIONS: `${API_BASE_URL}/api/donations`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  MARK_NOTIFICATION_READ: `${API_BASE_URL}/api/notifications`,
  
  // Admin
  ADMIN_STATS: `${API_BASE_URL}/api/admin/stats`,
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  VERIFY_HOSPITAL: `${API_BASE_URL}/api/admin/hospitals`,
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Helper function to create API URLs with parameters
export const createApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.keys(params).forEach(key => {
    url.searchParams.append(key, params[key]);
  });
  return url.toString();
};

export default API_ENDPOINTS;