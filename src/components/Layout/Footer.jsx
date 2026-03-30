import React from 'react';
import { FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{
      background: '#172b4d',
      color: '#8898aa',
      padding: '2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          Made with <FaHeart style={{ color: '#f5365c' }} /> for teen mental wellness
        </p>
        <p style={{ fontSize: '0.875rem', marginTop: '1rem' }}>
          © 2024 Teen Therapy Support Portal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;