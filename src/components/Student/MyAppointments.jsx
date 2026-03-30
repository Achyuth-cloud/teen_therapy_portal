import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyAppointments = () => {
  const [appointments] = useState([
    {
      id: 1,
      date: '2024-03-25',
      time: '14:00',
      therapist: 'Dr. Sarah Johnson',
      status: 'approved',
      type: 'Online Session'
    },
    {
      id: 2,
      date: '2024-03-28',
      time: '15:30',
      therapist: 'Dr. Michael Chen',
      status: 'pending',
      type: 'In-person'
    },
    {
      id: 3,
      date: '2024-03-20',
      time: '11:00',
      therapist: 'Dr. Sarah Johnson',
      status: 'completed',
      type: 'Online Session'
    }
  ]);

  const [activeTab, setActiveTab] = useState('upcoming');

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#2dce89';
      case 'pending': return '#fb6340';
      case 'completed': return '#5e72e4';
      case 'cancelled': return '#f5365c';
      default: return '#8898aa';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  const cancelAppointment = (id) => {
    toast.success('Appointment cancelled successfully');
    // In real app, update state
  };

  const upcomingAppointments = appointments.filter(a => a.status !== 'completed');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>My Appointments</h1>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #e9ecef' }}>
        <button
          onClick={() => setActiveTab('upcoming')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'upcoming' ? '#5e72e4' : '#8898aa',
            borderBottom: activeTab === 'upcoming' ? '2px solid #5e72e4' : 'none',
            fontWeight: 500
          }}
        >
          Upcoming ({upcomingAppointments.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'past' ? '#5e72e4' : '#8898aa',
            borderBottom: activeTab === 'past' ? '2px solid #5e72e4' : 'none',
            fontWeight: 500
          }}
        >
          Past Sessions ({pastAppointments.length})
        </button>
      </div>
      
      {displayAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No appointments found</p>
        </div>
      ) : (
        displayAppointments.map(appointment => (
          <div key={appointment.id} className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{appointment.therapist}</h4>
                  <span style={{
                    background: getStatusColor(appointment.status),
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  {appointment.date} at {appointment.time}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#8898aa' }}>{appointment.type}</p>
              </div>
              
              {appointment.status === 'pending' && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  Cancel Request
                </button>
              )}
              
              {appointment.status === 'approved' && (
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => cancelAppointment(appointment.id)}
                >
                  Reschedule
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;