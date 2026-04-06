import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaSpinner, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { therapistApi, appointmentApi, getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import { formatDateTime } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const TherapistDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_students: 0,
    pending_requests: 0,
    completed_sessions: 0,
    upcoming_sessions: 0
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: statsData }, { data: appointmentData }] = await Promise.all([
          therapistApi.getStats(),
          appointmentApi.getTherapistAppointments()
        ]);
        setStats(statsData);
        setAppointments(appointmentData);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load therapist dashboard'));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const recentRequests = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'pending').slice(0, 5),
    [appointments]
  );
  const upcomingApproved = useMemo(
    () => appointments.filter((appointment) => appointment.status === 'approved').slice(0, 5),
    [appointments]
  );

  const cards = [
    { icon: FaUsers, title: 'Active Students', value: stats.total_students || 0, color: '#5e72e4', bg: '#eef2ff' },
    { icon: FaSpinner, title: 'Pending Requests', value: stats.pending_requests || 0, color: '#fb6340', bg: '#fff0ed' },
    { icon: FaCheckCircle, title: 'Completed Sessions', value: stats.completed_sessions || 0, color: '#2dce89', bg: '#e8f5e9' },
    { icon: FaCalendarAlt, title: 'Upcoming Sessions', value: stats.upcoming_sessions || 0, color: '#11cdef', bg: '#e3f7fc' }
  ];

  if (loading) {
    return <div className="card"><div className="card-body">Loading dashboard...</div></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name || 'Therapist'}</h1>
          <p style={{ color: '#666' }}>Here is an overview of your therapy practice.</p>
        </div>
        <Link to="/therapist/availability" className="btn btn-primary">
          <FaCalendarAlt /> Manage Availability
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {cards.map((card) => (
          <div key={card.title} className="dashboard-card">
            <div className="dashboard-card-icon" style={{ background: card.bg, color: card.color }}>
              <card.icon />
            </div>
            <div className="dashboard-card-value">{card.value}</div>
            <div className="dashboard-card-title">{card.title}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h4>Upcoming Approved Sessions</h4>
          </div>
          <div className="card-body">
            {upcomingApproved.length > 0 ? (
              upcomingApproved.map((appointment) => (
                <div key={appointment.appointment_id} style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{appointment.student_name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                    </p>
                  </div>
                  <span style={{ background: '#e8f5e9', color: '#2dce89', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' }}>
                    Approved
                  </span>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No approved sessions scheduled yet.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Recent Appointment Requests</h4>
          </div>
          <div className="card-body">
            {recentRequests.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No pending appointment requests.</p>
            ) : (
              recentRequests.map((request) => (
                <div key={request.appointment_id} style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{request.student_name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>{formatDateTime(request.appointment_date, request.appointment_time)}</p>
                  </div>
                  <Link to="/therapist/requests" className="btn btn-sm btn-primary">
                    Review
                  </Link>
                </div>
              ))
            )}
          </div>
          <div className="card-footer">
            <Link to="/therapist/requests" style={{ color: '#5e72e4', textDecoration: 'none' }}>
              View All Requests →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;
