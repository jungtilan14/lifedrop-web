// Authentication utility functions

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Redirect to login page
  window.location.href = '/login';
};

export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const isHospitalAdmin = () => {
  return getUserRole() === 'hospital_admin';
};

export const isDonor = () => {
  return getUserRole() === 'donor';
};

// Create an axios interceptor for API calls
export const createAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Check if token is expired (basic check)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};