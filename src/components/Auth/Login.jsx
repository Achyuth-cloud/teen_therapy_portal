import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaArrowRight,
  FaEnvelope,
  FaHeart,
  FaLock,
  FaRegCalendarCheck,
  FaUserMd
} from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      const role = result.user?.role;
      navigate(role === 'student' ? '/student' : '/therapist');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-page__glow auth-page__glow--left" />
      <div className="auth-page__glow auth-page__glow--right" />

      <div className="auth-shell">
        <section className="auth-hero">
          <div className="auth-brand">
            <span className="auth-brand__badge">
              <FaHeart />
              Teen Therapy Portal
            </span>
            <h1>Support that feels private, calm, and easy to access.</h1>
            <p>
              Book sessions, track wellbeing check-ins, and connect students with
              the right therapist without friction.
            </p>
          </div>

          <div className="auth-feature-list">
            <div className="auth-feature-card">
              <FaRegCalendarCheck />
              <div>
                <strong>Simple scheduling</strong>
                <span>Students can request sessions in a few steps.</span>
              </div>
            </div>
            <div className="auth-feature-card">
              <FaUserMd />
              <div>
                <strong>Therapist-ready workflow</strong>
                <span>Responses, availability, and notes stay in one place.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel__header">
            <p className="auth-eyebrow">Welcome back</p>
            <h2>Sign in to continue</h2>
            <p className="auth-panel__copy">
              Sign in with the account created in the backend system.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="auth-input-wrap">
                <FaEnvelope className="auth-input-icon" />
                <input
                  type="email"
                  className="form-control auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-input-wrap">
                <FaLock className="auth-input-icon" />
                <input
                  type="password"
                  className="form-control auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
              <FaArrowRight />
            </button>
          </form>

          <div className="auth-panel__footer">
            <span>Need an account?</span>
            <Link to="/register">Create one</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
