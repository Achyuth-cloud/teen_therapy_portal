import React, { useState } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaComment } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AppointmentRequests = () => {
  const [requests, setRequests] = useState([
    {
      id: 1,
      student: 'Alex Thompson',
      studentId: 101,
      date: '2024-03-25',
      time: '14:00',
      reason: 'Feeling overwhelmed with academic pressure and anxiety',
      wellbeingScore: 3.2,
      status: 'pending'
    },
    {
      id: 2,
      student: 'Emma Watson',
      studentId: 102,
      date: '2024-03-25',
      time: '15:30',
      reason: 'Difficulty sleeping and constant worry',
      wellbeingScore: 2.8,
      status: 'pending'
    },
    {
      id: 3,
      student: 'James Wilson',
      studentId: 103,
      date: '2024-03-26',
      time: '11:00',
      reason: 'Social anxiety affecting daily life',
      wellbeingScore: 3.5,
      status: 'pending'
    },
    {
      id: 4,
      student: 'Sophia Martinez',
      studentId: 104,
      date: '2024-03-26',
      time: '13:30',
      reason: 'Family conflict and emotional distress',
      wellbeingScore: 2.5,
      status: 'pending'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const handleApprove = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
    toast.success('Appointment approved');
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
    toast.success('Appointment rejected');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem' }}>Appointment Requests</h1>
        <div className="flex" style={{ gap: '0.5rem' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
          >
            Approved
          </button>
        </div>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No appointment requests found</p>
        </div>
      ) : (
        filteredRequests.map(request => (
          <div key={request.id} className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{request.student}</h4>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      background: request.status === 'approved' ? '#e8f5e9' : request.status === 'rejected' ? '#ffebee' : '#fff0ed',
                      color: request.status === 'approved' ? '#2dce89' : request.status === 'rejected' ? '#f5365c' : '#fb6340'
                    }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="flex" style={{ alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span><FaCalendarAlt /> {request.date} at {request.time}</span>
                    <span><FaUser /> Student ID: {request.studentId}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: '#eef2ff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: '#5e72e4'
                  }}>
                    Wellbeing Score: {request.wellbeingScore}/5
                  </span>
                </div>
              </div>
              
              <div style={{
                background: '#f8f9fe',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FaComment style={{ marginTop: '0.25rem', color: '#5e72e4' }} />
                  <span><strong>Reason for appointment:</strong> {request.reason}</span>
                </p>
              </div>
              
              {request.status === 'pending' && (
                <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(request.id)}
                  >
                    <FaTimes /> Decline
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(request.id)}
                  >
                    <FaCheck /> Approve
                  </button>
                </div>
              )}
              
              {request.status === 'approved' && (
                <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => window.location.href = `/therapist/notes/${request.id}`}
                  >
                    Add Session Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentRequests;