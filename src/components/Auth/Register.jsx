import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaArrowRight, 
  FaHeart, 
  FaUserGraduate,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    agreeTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const validateForm = () => {
    const newErrors = {};
    
    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Age validation
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 13 || formData.age > 19) {
      newErrors.age = 'Age must be between 13 and 19 years';
    }
    
    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      age: Number(formData.age),
      gender: formData.gender
    });
    
    if (result.success) {
      navigate('/student');
    }
    
    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return '#f5365c';
      case 2: return '#fb6340';
      case 3: return '#ffd600';
      case 4: return '#2dce89';
      default: return '#e9ecef';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return 'No password';
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <FaHeart size={48} style={{ color: 'white', marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', margin: 0 }}>Student Registration</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', marginTop: '0.5rem' }}>
            Create a student account to access counselling support and wellbeing tools
          </p>
        </div>
        
        {/* Form */}
        <div style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FaUser style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa',
                  fontSize: '14px'
                }} />
                <input
                  type="text"
                  name="fullName"
                  className={`form-control ${errors.fullName ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullName && (
                <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <FaExclamationCircle style={{ marginRight: '0.25rem', fontSize: '10px' }} />
                  {errors.fullName}
                </div>
              )}
            </div>
            
            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@example.com"
                />
              </div>
              {errors.email && (
                <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <FaExclamationCircle style={{ marginRight: '0.25rem', fontSize: '10px' }} />
                  {errors.email}
                </div>
              )}
            </div>
            
            {/* Age and Gender Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  className={`form-control ${errors.age ? 'error' : ''}`}
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="13-19"
                  min="13"
                  max="19"
                />
                {errors.age && (
                  <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.age}
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className={`form-control ${errors.gender ? 'error' : ''}`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.gender}
                  </div>
                )}
              </div>
            </div>
            
            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder="Create a strong password"
                />
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    height: '4px',
                    background: '#e9ecef',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    marginBottom: '0.25rem'
                  }}>
                    <div style={{
                      width: `${(passwordStrength / 4) * 100}%`,
                      height: '100%',
                      background: getPasswordStrengthColor(),
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: '#666'
                  }}>
                    <span>Password strength:</span>
                    <span style={{ color: getPasswordStrengthColor(), fontWeight: 500 }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <FaExclamationCircle style={{ marginRight: '0.25rem', fontSize: '10px' }} />
                  {errors.password}
                </div>
              )}
            </div>
            
            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <FaExclamationCircle style={{ marginRight: '0.25rem', fontSize: '10px' }} />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
            
            {/* Terms and Conditions */}
            <div className="form-group">
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ marginTop: '0.2rem' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#666' }}>
                  I agree to the <a href="#" style={{ color: '#5e72e4' }}>Terms of Service</a> and{' '}
                  <a href="#" style={{ color: '#5e72e4' }}>Privacy Policy</a>. I understand that my information will be kept confidential.
                </span>
              </label>
              {errors.agreeTerms && (
                <div style={{ color: '#f5365c', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  <FaExclamationCircle style={{ marginRight: '0.25rem', fontSize: '10px' }} />
                  {errors.agreeTerms}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
              style={{
                padding: '0.875rem',
                fontSize: '1rem',
                marginTop: '1rem'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
              <FaArrowRight />
            </button>
          </form>
          
          {/* Login Link */}
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e9ecef'
          }}>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              Already have an account?
            </p>
            <Link to="/login" style={{
              color: '#5e72e4',
              textDecoration: 'none',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Sign in here
              <FaArrowRight size={12} />
            </Link>
          </div>
          
          {/* Safety Notice */}
          <div style={{
            marginTop: '1.5rem',
            background: '#f8f9fe',
            padding: '1rem',
            borderRadius: '8px',
            borderLeft: '3px solid #5e72e4'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <FaCheckCircle style={{ color: '#2dce89', fontSize: '14px' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#5e72e4' }}>
                Your Safety Matters
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
              All information is kept strictly confidential. Our platform is designed to provide a safe, 
              supportive space for teens to access mental health resources and support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
