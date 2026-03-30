import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaCalendarAlt,
  FaBook,
  FaHeart,
  FaChartLine,
  FaUserMd,
  FaClock,
  FaClipboardList,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBrain,
  FaStethoscope
} from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const studentLinks = [
    { path: '/student', icon: FaHome, label: 'Dashboard' },
    { path: '/student/book', icon: FaCalendarAlt, label: 'Book Session' },
    { path: '/student/appointments', icon: FaClock, label: 'My Appointments' },
    { path: '/student/questionnaire', icon: FaBrain, label: 'Wellbeing Check-in' },
    { path: '/student/resources', icon: FaBook, label: 'Resources' },
    { path: '/student/history', icon: FaChartLine, label: 'Session History' }
  ];

  const therapistLinks = [
    { path: '/therapist', icon: FaHome, label: 'Dashboard' },
    { path: '/therapist/requests', icon: FaClipboardList, label: 'Appointment Requests' },
    { path: '/therapist/availability', icon: FaClock, label: 'Manage Availability' },
    { path: '/therapist/responses', icon: FaHeart, label: 'Student Responses' },
    { path: '/therapist/students', icon: FaUsers, label: 'My Students' }
  ];

  const links = user?.role === 'student' ? studentLinks : therapistLinks;

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        style={{
          position: 'fixed',
          top: '80px',
          left: '20px',
          zIndex: 1000,
          background: '#5e72e4',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem',
          color: 'white',
          cursor: 'pointer',
          display: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '@media (max-width: 768px)': {
            display: 'block'
          }
        }}
        className="mobile-toggle"
      >
        {isMobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isMobileOpen && (
        <div
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            display: 'none',
            '@media (max-width: 768px)': {
              display: 'block'
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: sidebarWidth,
          background: 'linear-gradient(180deg, #172b4d 0%, #1a3456 100%)',
          color: '#fff',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          overflowY: 'auto',
          overflowX: 'hidden',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          '@media (max-width: 768px)': {
            transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
            width: '280px'
          }
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            padding: isCollapsed ? '1.5rem 0' : '1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '1.5rem'
          }}
        >
          {!isCollapsed ? (
            <>
              <FaHeart size={32} style={{ color: '#f5365c', marginBottom: '0.5rem' }} />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Teen Therapy</h3>
              <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7 }}>Support Portal</p>
            </>
          ) : (
            <FaHeart size={32} style={{ color: '#f5365c' }} />
          )}
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div
            style={{
              padding: '0 1rem 1rem 1rem',
              marginBottom: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 0.75rem',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {user.name?.charAt(0) || 'U'}
            </div>
            <p style={{ margin: 0, fontWeight: 500 }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.7, textTransform: 'capitalize' }}>
              {user.role}
            </p>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ flex: 1 }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  padding: isCollapsed ? '0.875rem' : '0.875rem 1.5rem',
                  margin: '0.25rem 0',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  background: isActive ? 'rgba(94, 114, 228, 0.2)' : 'transparent',
                  borderLeft: isActive ? '3px solid #5e72e4' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>
                    {link.label}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#5e72e4'
                    }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div style={{ marginTop: 'auto', padding: '1rem 0' }}>
          {/* Collapse Toggle Button */}
          <button
            onClick={toggleCollapse}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              width: '100%',
              padding: isCollapsed ? '0.875rem' : '0.875rem 1.5rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <FaBars size={20} />
            {!isCollapsed && <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>Collapse Menu</span>}
          </button>

          {/* Settings Link */}
          <NavLink
            to="/settings"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              padding: isCollapsed ? '0.875rem' : '0.875rem 1.5rem',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <FaCog size={20} />
            {!isCollapsed && <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>Settings</span>}
          </NavLink>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              width: '100%',
              padding: isCollapsed ? '0.875rem' : '0.875rem 1.5rem',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = '#f5365c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <FaSignOutAlt size={20} />
            {!isCollapsed && <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>Logout</span>}
          </button>
        </div>
      </aside>

      <style>
        {`
          @media (max-width: 768px) {
            .mobile-toggle {
              display: block !important;
            }
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;