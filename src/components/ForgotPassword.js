import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, ArrowLeft, Shield, Heart } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      toast.success('Password reset email sent successfully!');
      
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          
          {!isEmailSent ? (
            <>
              <h2 className="login-title">Forgot Password?</h2>
              <p className="login-description">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </>
          ) : (
            <>
              <h2 className="login-title">Check Your Email</h2>
              <p className="login-description">
                We've sent a password reset link to {email}
              </p>
            </>
          )}
        </div>

        {!isEmailSent ? (
          <form onSubmit={handleSubmit} className="login-form">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="form-input"
                  autoComplete="email"
                />
                <Mail className="input-icon" size={20} />
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Send Reset Link
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="reset-success">
            <div className="success-message">
              <Mail size={48} />
              <p>Password reset email sent!</p>
              <p>Please check your inbox and follow the instructions to reset your password.</p>
            </div>
          </div>
        )}

        <div className="login-links">
          <Link to="/login" className="forgot-link">
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>

        <div className="security-notice">
          <Shield size={16} />
          <span>Your information is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;