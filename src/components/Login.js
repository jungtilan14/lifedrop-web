import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertCircle, CheckCircle, Heart } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    userRole: 'donor'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
    color: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRoles = [
    { value: 'donor', label: 'Donor', icon: Heart },
    { value: 'admin', label: 'Admin', icon: Shield }
  ];

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (!password) {
      return { score: 0, feedback: '', color: '' };
    }

    let score = 0;
    let feedback = '';
    let color = '';

    // Length check
    if (password.length >= 8) score += 1;
    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    // Number check
    if (/\d/.test(password)) score += 1;
    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    switch (score) {
      case 0:
      case 1:
        feedback = 'Very Weak';
        color = '#ef4444';
        break;
      case 2:
        feedback = 'Weak';
        color = '#f97316';
        break;
      case 3:
        feedback = 'Fair';
        color = '#eab308';
        break;
      case 4:
        feedback = 'Good';
        color = '#22c55e';
        break;
      case 5:
        feedback = 'Strong';
        color = '#16a34a';
        break;
      default:
        feedback = '';
        color = '';
    }

    return { score, feedback, color };
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update password strength for password field
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // User role validation
    if (!formData.userRole) {
      newErrors.userRole = 'Please select a user role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Handle Remember Me functionality
      if (formData.rememberMe) {
        localStorage.setItem('lifeDropRememberMe', JSON.stringify({
          email: formData.email,
          userRole: formData.userRole,
          rememberMe: true
        }));
      } else {
        localStorage.removeItem('lifeDropRememberMe');
      }

      // Simulate successful login
      localStorage.setItem('lifeDropUser', JSON.stringify({
        email: formData.email,
        userRole: formData.userRole,
        loginTime: new Date().toISOString()
      }));

      toast.success(`Successfully logged in as ${formData.userRole}!`);
      
      // In a real app, you would redirect to the dashboard
      console.log('Login successful:', {
        email: formData.email,
        userRole: formData.userRole,
        rememberMe: formData.rememberMe
      });

    } catch (error) {
      toast.error('Login failed. Please check your credentials and try again.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load remembered credentials on component mount
  useEffect(() => {
    const remembered = localStorage.getItem('lifeDropRememberMe');
    if (remembered) {
      try {
        const data = JSON.parse(remembered);
        setFormData(prev => ({
          ...prev,
          email: data.email || '',
          userRole: data.userRole || 'donor',
          rememberMe: data.rememberMe || false
        }));
      } catch (error) {
        console.error('Error loading remembered credentials:', error);
      }
    }
  }, []);

  const getRoleIcon = (roleValue) => {
    const role = userRoles.find(r => r.value === roleValue);
    return role ? role.icon : User;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <Heart className="logo-icon" size={32} />
            <h1>LifeDrop</h1>
          </div>
          <p className="login-subtitle">Blood Donation Platform</p>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-description">
            Sign in to your account to continue saving lives
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              <Mail className="label-icon" size={18} />
              Email Address
            </label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`form-input ${errors.email ? 'error' : ''}`}
                autoComplete="email"
              />
              <Mail className="input-icon" size={20} />
            </div>
            {errors.email && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <Lock className="label-icon" size={18} />
              Password
            </label>
            <div className="input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.password}
              </span>
            )}
            
            {/* Password Strength Indicator */}
            {formData.password && passwordStrength.feedback && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill"
                    style={{ 
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span 
                  className="strength-text"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.feedback}
                </span>
              </div>
            )}
          </div>

          {/* User Role Dropdown */}
          <div className="form-group">
            <label htmlFor="userRole" className="form-label">
              <User className="label-icon" size={18} />
              User Role
            </label>
            <div className="input-container">
              <select
                id="userRole"
                name="userRole"
                value={formData.userRole}
                onChange={handleInputChange}
                className={`form-select ${errors.userRole ? 'error' : ''}`}
              >
                {userRoles.map(role => {
                  return (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  );
                })}
              </select>
              <div className="select-icon">
                {React.createElement(getRoleIcon(formData.userRole), { size: 20 })}
              </div>
            </div>
            {errors.userRole && (
              <span className="error-message">
                <AlertCircle size={16} />
                {errors.userRole}
              </span>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom">
                {formData.rememberMe && <CheckCircle size={16} />}
              </span>
              <span className="checkbox-text">Remember me</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" />
                Signing In...
              </>
            ) : (
              <>
                <Lock size={20} />
                Sign In
              </>
            )}
          </button>

          {/* Additional Links */}
          <div className="login-links">
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
            <div className="signup-link">
              Don't have an account?{' '}
              <Link to="/registration" className="signup-link-text">
                Sign up here
              </Link>
            </div>
          </div>
        </form>

        {/* Security Notice */}
        <div className="security-notice">
          <Shield size={16} />
          <span>Your information is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;