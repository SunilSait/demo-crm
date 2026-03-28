import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import designImg from '../assets/images/design.svg';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: '', email: '', mobile_number: '', password: '', confirm_password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const errs = {};
    if (!form.full_name.trim()) errs.full_name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format.';
    if (!form.mobile_number.trim()) errs.mobile_number = 'Mobile number is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (!form.confirm_password) errs.confirm_password = 'Please confirm your password.';
    else if (form.password !== form.confirm_password) errs.confirm_password = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" className="toggle-password" onClick={toggle}>
      {show ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4 8 11 8 11-8 11-8"/>
          <line x1="3" y1="12" x2="5" y2="15"/>
          <line x1="8" y1="14.5" x2="8.5" y2="17.5"/>
          <line x1="12" y1="15.5" x2="12" y2="18.5"/>
          <line x1="15.5" y1="14.5" x2="16" y2="17.5"/>
          <line x1="20" y1="12.5" x2="19" y2="15.5"/>
        </svg>
      )}
    </button>
  );

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Alphagnito CRM today</p>

          {apiError && <div className="alert alert-error">{apiError}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="floating-group">
              <div className={`float-input-box ${form.full_name ? 'has-value' : ''} ${errors.full_name ? 'error' : ''}`}>
                <label className="float-label">Full Name</label>
                <input type="text" name="full_name" className="float-input"
                  value={form.full_name} onChange={handleChange} placeholder="" />
              </div>
              {errors.full_name && <span className="field-error">{errors.full_name}</span>}
            </div>

            <div className="floating-group">
              <div className={`float-input-box ${form.email ? 'has-value' : ''} ${errors.email ? 'error' : ''}`}>
                <label className="float-label">Email Address</label>
                <input type="email" name="email" className="float-input"
                  value={form.email} onChange={handleChange} placeholder="" />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="floating-group">
              <div className={`float-input-box ${form.mobile_number ? 'has-value' : ''} ${errors.mobile_number ? 'error' : ''}`}>
                <label className="float-label">Mobile Number</label>
                <input type="tel" name="mobile_number" className="float-input"
                  value={form.mobile_number} onChange={handleChange} placeholder="" />
              </div>
              {errors.mobile_number && <span className="field-error">{errors.mobile_number}</span>}
            </div>

            <div className="floating-group">
              <div className={`float-input-box ${form.password ? 'has-value' : ''} ${errors.password ? 'error' : ''}`}>
                <label className="float-label">Password</label>
                <input type={showPass ? 'text' : 'password'} name="password"
                  className="float-input float-input-padded"
                  value={form.password} onChange={handleChange} placeholder="" />
                <EyeIcon show={showPass} toggle={() => setShowPass(p => !p)} />
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="floating-group">
              <div className={`float-input-box ${form.confirm_password ? 'has-value' : ''} ${errors.confirm_password ? 'error' : ''}`}>
                <label className="float-label">Confirm Password</label>
                <input type={showConfirm ? 'text' : 'password'} name="confirm_password"
                  className="float-input float-input-padded"
                  value={form.confirm_password} onChange={handleChange} placeholder="" />
                <EyeIcon show={showConfirm} toggle={() => setShowConfirm(p => !p)} />
              </div>
              {errors.confirm_password && <span className="field-error">{errors.confirm_password}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>

      <div className="auth-brand-side">
        <div className="brand-content">
          <div className="brand-logo-large">
            <img src={logoImg} alt="Alphagnito" className="brand-logo-img" />
          </div>
        </div>
        <div className="brand-overlay">
          <img src={designImg} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Register;
