import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <Link to={user?.role === 'student' ? '/student' : '/therapist'} style={{ textDecoration: 'none', color: '#666' }}>
            Dashboard
          </Link>
          {user?.role === 'student' && (
            <>
              <Link to="/student/book" style={{ textDecoration: 'none', color: '#666' }}>Book Session</Link>
              <Link to="/student/resources" style={{ textDecoration: 'none', color: '#666' }}>Resources</Link>
            </>
          )}
          {user?.role === 'therapist' && (
            <>
              <Link to="/therapist/requests" style={{ textDecoration: 'none', color: '#666' }}>Requests</Link>
              <Link to="/therapist/availability" style={{ textDecoration: 'none', color: '#666' }}>Availability</Link>
            </>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaUserCircle size={24} style={{ color: '#666' }} />
            <span style={{ color: '#333' }}>{user?.name}</span>
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