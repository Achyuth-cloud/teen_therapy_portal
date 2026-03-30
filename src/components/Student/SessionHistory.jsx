import React, { useState } from 'react';
import { FaCalendarAlt, FaUserMd, FaStethoscope, FaDownload } from 'react-icons/fa';

const SessionHistory = () => {
  const [sessions] = useState([
    {
      id: 1,
      date: '2024-03-20',
      therapist: 'Dr. Sarah Johnson',
      topic: 'Managing Academic Stress',
      notes: 'Discussed coping strategies for exam pressure',
      rating: 5
    },
    {
      id: 2,
      date: '2024-03-13',
      therapist: 'Dr. Sarah Johnson',
      topic: 'Building Self-Confidence',
      notes: 'Explored self-esteem building techniques',
      rating: 4
    },
    {
      id: 3,
      date: '2024-03-06',
      therapist: 'Dr. Michael Chen',
      topic: 'Anxiety Management',
      notes: 'Practiced breathing exercises and mindfulness',
      rating: 5
    }
  ]);

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Session History</h1>
      
      {sessions.map(session => (
        <div key={session.id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{session.topic}</h4>
                  <div className="flex" style={{ gap: '0.25rem' }}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < session.rating ? '#ffd600' : '#e9ecef', fontSize: '1rem' }}>★</span>
                    ))}
                  </div>
                </div>
                <p className="flex" style={{ alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  <span><FaCalendarAlt /> {session.date}</span>
                  <span><FaUserMd /> {session.therapist}</span>
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                <FaDownload /> Download Notes
              </button>
            </div>
            <div style={{
              background: '#f8f9fe',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '0.5rem'
            }}>
              <p style={{ color: '#666', margin: 0 }}>
                <FaStethoscope style={{ marginRight: '0.5rem', color: '#5e72e4' }} />
                {session.notes}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionHistory;