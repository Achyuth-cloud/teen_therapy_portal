import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaHeart } from 'react-icons/fa';
import NotificationPanel from '../Common/NotificationPanel';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#5e72e4' : '#666',
    fontWeight: isActive ? 600 : 400
  });

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0'
      }}>
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          textDecoration: 'none',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#667eea'
        }}>
          <FaHeart style={{ color: '#f5365c' }} />
          <span>Teen Therapy Portal</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <NavLink to={user?.role === 'student' ? '/student' : '/therapist'} style={navLinkStyle} end>
            Dashboard
          </NavLink>
          {user?.role === 'student' && (
            <>
              <NavLink to="/student/book" style={navLinkStyle}>Book Session</NavLink>
              <NavLink to="/student/appointments" style={navLinkStyle}>Appointments</NavLink>
              <NavLink to="/student/resources" style={navLinkStyle}>Resources</NavLink>
            </>
          )}
          {user?.role === 'therapist' && (
            <>
              <NavLink to="/therapist/requests" style={navLinkStyle}>Appointments</NavLink>
              <NavLink to="/therapist/availability" style={navLinkStyle}>Availability</NavLink>
            </>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink
              to={user?.role === 'student' ? '/student/settings' : '/therapist/settings'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                color: isActive ? '#5e72e4' : '#333',
                fontWeight: isActive ? 600 : 400
              })}
            >
              <FaUserCircle size={24} style={{ color: '#666' }} />
              <span>{user?.name}</span>
            </NavLink>
            <NotificationPanel />
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#f5365c'
              }}
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
