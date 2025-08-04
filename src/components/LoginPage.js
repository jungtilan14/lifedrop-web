import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, EyeOff, Eye } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input changes and update formData state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form before submitting
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission and call the API for login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store the JWT token
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        toast.success('Login successful!');

        // Redirect based on user role
        const userRole = data.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else if (userRole === 'hospital_admin') {
          navigate('/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password visibility toggle
  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      toast.error('Please enter your email address first');
      return;
    }

    fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: formData.email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          toast.success('Password reset link sent to your email');
        } else {
          toast.error(data.error || 'Failed to send reset link');
        }
      })
      .catch((error) => {
        console.error('Forgot password error:', error);
        toast.error('Network error. Please try again.');
      });
  };

  // Pre-fill the form if the email and password are saved in localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (storedRememberMe) {
      setFormData((prev) => ({
        ...prev,
        email: storedEmail || '',
        password: storedPassword || '',
      }));
    }
  }, []);

  return (
    <div className="registration">
      <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div className="card-header">
          <h1 className="card-title">
            <LogIn className="inline mr-2" size={28} />
            Welcome Back
          </h1>
          <p className="text-gray">Sign in to your LifeDrop account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email">
                <Mail className="inline mr-2" size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                autoComplete="email"
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock className="inline mr-2" size={18} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#666',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="error">{errors.password}</span>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                Remember me
              </label>
              <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#dc6266', cursor: 'pointer' }}>
                Forgot password?
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginBottom: '1rem' }}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Don't have an account?
          </p>
          <Link to="/registration" className="btn btn-secondary">
            Join LifeDrop
          </Link>
        </div>

        {/* Quick Demo Login */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#374151' }}>
            Demo Accounts:
          </h4>
          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Donor:</strong> donor@lifedrop.com / password123
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Hospital:</strong> hospital@lifedrop.com / password123
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Admin:</strong> admin@lifedrop.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
