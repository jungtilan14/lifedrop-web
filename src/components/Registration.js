import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Droplets, Heart, UserPlus } from 'lucide-react';

const Registration = () => {
  const [userType, setUserType] = useState('donor');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    city: '',
    address: '',
    age: '',
    weight: '',
    medicalConditions: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const cities = ['Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Dharan', 'Hetauda'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!formData.bloodType) {
      newErrors.bloodType = 'Blood type is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (userType === 'donor') {
      if (!formData.age || formData.age < 18 || formData.age > 65) {
        newErrors.age = 'Age must be between 18 and 65';
      }

      if (!formData.weight || formData.weight < 50) {
        newErrors.weight = 'Weight must be at least 50kg';
      }

      if (!formData.emergencyContact.trim()) {
        newErrors.emergencyContact = 'Emergency contact is required';
      }

      if (!formData.emergencyPhone.trim()) {
        newErrors.emergencyPhone = 'Emergency phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Successfully registered as ${userType}!`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        bloodType: '',
        city: '',
        address: '',
        age: '',
        weight: '',
        medicalConditions: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <UserPlus className="inline mr-2" size={28} />
            Join LifeDrop
          </h1>
          <p className="text-gray">
            Register as a donor or recipient to start saving lives
          </p>
        </div>

        {/* User Type Selection */}
        <div className="user-type-selection mb-4">
          <div className="grid grid-2">
            <button
              type="button"
              className={`btn ${userType === 'donor' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUserType('donor')}
            >
              <Heart className="inline mr-2" size={20} />
              Become a Donor
            </button>
            <button
              type="button"
              className={`btn ${userType === 'recipient' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUserType('recipient')}
            >
              <Droplets className="inline mr-2" size={20} />
              Need Blood
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">Basic Information</h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="name">
                  <User className="inline mr-2" size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </div>

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
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone className="inline mr-2" size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bloodType">
                  <Droplets className="inline mr-2" size={18} />
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                >
                  <option value="">Select your blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.bloodType && <span className="error">{errors.bloodType}</span>}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="form-section">
            <h3 className="section-title">Location Information</h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="city">
                  <MapPin className="inline mr-2" size={18} />
                  City
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Select your city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="error">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>
            </div>
          </div>

          {/* Donor-specific fields */}
          {userType === 'donor' && (
            <div className="form-section">
              <h3 className="section-title">Donor Information</h3>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="Enter your age"
                    min="18"
                    max="65"
                  />
                  {errors.age && <span className="error">{errors.age}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight (kg)</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="Enter your weight"
                    min="50"
                  />
                  {errors.weight && <span className="error">{errors.weight}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="medicalConditions">Medical Conditions (if any)</label>
                <textarea
                  id="medicalConditions"
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  placeholder="List any medical conditions or medications"
                  rows="3"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="emergencyContact">Emergency Contact Name</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact && <span className="error">{errors.emergencyContact}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="emergencyPhone">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    id="emergencyPhone"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && <span className="error">{errors.emergencyPhone}</span>}
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : `Register as ${userType}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;