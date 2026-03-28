import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/images/logo.png';
import designImg from '../assets/images/design.svg';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-form-side">
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome to Alphagnito</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email field — floating label on border */}
            <div className="floating-group">
              <div className={`float-input-box ${form.email ? 'has-value' : ''}`}>
                <label className="float-label">Email address</label>
                <input
                  type="email"
                  name="email"
                  className="float-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="floating-group">
              <div className={`float-input-box ${form.password ? 'has-value' : ''}`}>
                <label className="float-label">Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="float-input float-input-padded"
                  value={form.password}
                  onChange={handleChange}
                  placeholder=""
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? (
                    /* Eye open icon */
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    /* Eye closed icon — lashes pointing down */
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
              </div>
            </div>

            <div className="auth-options">
              <label className="checkbox-label">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
                <span>Remember me</span>
              </label>
              <a href="#forgot" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
