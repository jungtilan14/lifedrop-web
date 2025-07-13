import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Droplets, MapPin, Phone, User, AlertCircle, Calendar } from 'lucide-react';

const BloodRequest = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    unitsRequired: '',
    urgency: '',
    hospital: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    requiredBy: '',
    additionalNotes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'high', label: 'High - Immediate (within 6 hours)' },
    { value: 'medium', label: 'Medium - Within 24 hours' },
    { value: 'low', label: 'Low - Within 48 hours' }
  ];
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

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }

    if (!formData.bloodType) {
      newErrors.bloodType = 'Blood type is required';
    }

    if (!formData.unitsRequired || formData.unitsRequired < 1) {
      newErrors.unitsRequired = 'Units required must be at least 1';
    }

    if (!formData.urgency) {
      newErrors.urgency = 'Urgency level is required';
    }

    if (!formData.hospital.trim()) {
      newErrors.hospital = 'Hospital name is required';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^\d{10}$/.test(formData.contactPhone.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Phone number must be 10 digits';
    }

    if (!formData.requiredBy) {
      newErrors.requiredBy = 'Required by date is required';
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
      
      toast.success('Blood request submitted successfully! Donors will be notified.');
      
      // Reset form
      setFormData({
        patientName: '',
        bloodType: '',
        unitsRequired: '',
        urgency: '',
        hospital: '',
        city: '',
        contactPerson: '',
        contactPhone: '',
        requiredBy: '',
        additionalNotes: ''
      });
      
    } catch (error) {
      toast.error('Failed to submit blood request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="blood-request">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">
            <Droplets className="inline mr-2" size={28} />
            Submit Blood Request
          </h1>
          <p className="text-gray">
            Request blood from our donor community. We'll notify matching donors immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Patient Information */}
          <div className="form-section">
            <h3 className="section-title">Patient Information</h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="patientName">
                  <User className="inline mr-2" size={18} />
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient's full name"
                />
                {errors.patientName && <span className="error">{errors.patientName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bloodType">
                  <Droplets className="inline mr-2" size={18} />
                  Blood Type Required
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.bloodType && <span className="error">{errors.bloodType}</span>}
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="unitsRequired">Units Required</label>
                <input
                  type="number"
                  id="unitsRequired"
                  name="unitsRequired"
                  value={formData.unitsRequired}
                  onChange={handleInputChange}
                  placeholder="Number of units"
                  min="1"
                />
                {errors.unitsRequired && <span className="error">{errors.unitsRequired}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="urgency">
                  <AlertCircle className="inline mr-2" size={18} />
                  Urgency Level
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleInputChange}
                >
                  <option value="">Select urgency level</option>
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.urgency && <span className="error">{errors.urgency}</span>}
              </div>
            </div>
          </div>

          {/* Hospital Information */}
          <div className="form-section">
            <h3 className="section-title">Hospital Information</h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="hospital">Hospital Name</label>
                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  placeholder="Enter hospital name"
                />
                {errors.hospital && <span className="error">{errors.hospital}</span>}
              </div>

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
                  <option value="">Select city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="error">{errors.city}</span>}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3 className="section-title">Contact Information</h3>
            
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="contactPerson">
                  <User className="inline mr-2" size={18} />
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Name of contact person"
                />
                {errors.contactPerson && <span className="error">{errors.contactPerson}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">
                  <Phone className="inline mr-2" size={18} />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="Contact phone number"
                />
                {errors.contactPhone && <span className="error">{errors.contactPhone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requiredBy">
                <Calendar className="inline mr-2" size={18} />
                Required By
              </label>
              <input
                type="datetime-local"
                id="requiredBy"
                name="requiredBy"
                value={formData.requiredBy}
                onChange={handleInputChange}
              />
              {errors.requiredBy && <span className="error">{errors.requiredBy}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleInputChange}
                placeholder="Any additional information (medical conditions, special requirements, etc.)"
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Request...' : 'Submit Blood Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Information Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Important Information</h2>
        </div>
        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon">
              <AlertCircle />
            </div>
            <h3 className="feature-title">Urgent Requests</h3>
            <p className="feature-description">
              High priority requests are immediately sent to all matching donors in your area.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <Phone />
            </div>
            <h3 className="feature-title">Stay Available</h3>
            <p className="feature-description">
              Please ensure your contact person is available to coordinate with donors.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <MapPin />
            </div>
            <h3 className="feature-title">Location Accuracy</h3>
            <p className="feature-description">
              Provide accurate hospital and city information for better donor matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodRequest;