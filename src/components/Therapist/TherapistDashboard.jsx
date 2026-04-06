import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaSpinner, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
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

  const chartGroups = useMemo(() => {
    const groups = new Map();
    appointments
      .filter((appointment) => appointment.status === 'completed')
      .forEach((appointment) => {
        const key = appointment.appointment_date;
        groups.set(key, (groups.get(key) || 0) + 1);
      });

    return Array.from(groups.entries()).slice(-6);
  }, [appointments]);

  const chartData = {
    labels: chartGroups.map(([label]) => label),
    datasets: [
      {
        label: 'Completed Sessions',
        data: chartGroups.map(([, count]) => count),
        borderColor: '#5e72e4',
        backgroundColor: 'rgba(94, 114, 228, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

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
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'Therapist'}</h1>
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
            <h4>Session Analytics</h4>
          </div>
          <div className="card-body">
            {chartGroups.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Analytics will appear after sessions are completed.</p>
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
