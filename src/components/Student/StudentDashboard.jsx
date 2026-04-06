import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBook, FaHeart, FaChartLine, FaSmile } from 'react-icons/fa';
import { appointmentApi, wellbeingApi } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [latestCheckIn, setLatestCheckIn] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: appointments }, { data: history }] = await Promise.all([
          appointmentApi.getStudentAppointments(),
          wellbeingApi.getHistory()
        ]);

        const now = new Date();
        const upcoming = appointments
          .filter((appointment) => ['approved', 'pending'].includes(appointment.status) && new Date(`${appointment.appointment_date}T${appointment.appointment_time}`) >= now)
          .sort((a, b) => new Date(`${a.appointment_date}T${a.appointment_time}`) - new Date(`${b.appointment_date}T${b.appointment_time}`));

        const completed = appointments.filter((appointment) => appointment.status === 'completed');
        const latestHistory = history[0];

        setStats({
          totalSessions: appointments.length,
          upcomingSessions: upcoming.length,
          completedSessions: completed.length
        });
        setRecentAppointments(upcoming.slice(0, 3));
        setLatestCheckIn(history[0] || null);
      } catch (error) {
        setStats({
          totalSessions: 0,
          upcomingSessions: 0,
          completedSessions: 0
        });
        setLatestCheckIn(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    { icon: FaCalendarAlt, title: 'Total Sessions', value: stats.totalSessions, color: '#5e72e4', bg: '#eef2ff' },
    { icon: FaBook, title: 'Upcoming', value: stats.upcomingSessions, color: '#fb6340', bg: '#fff0ed' },
    { icon: FaSmile, title: 'Completed', value: stats.completedSessions, color: '#2dce89', bg: '#e8f5e9' }
  ];

  if (loading) {
    return <div className="card"><div className="card-body">Loading dashboard...</div></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p style={{ color: '#666' }}>Your mental wellness journey matters. Here is your latest overview.</p>
        </div>
        <Link to="/student/book" className="btn btn-primary">
          <FaCalendarAlt /> Book New Session
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
            <h4>Latest Check-in</h4>
          </div>
          <div className="card-body">
            {latestCheckIn ? (
              <div>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                  Most recent questionnaire submitted successfully
                </p>
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  Average score: {Number(latestCheckIn.average_score || 0).toFixed(1)}/5
                </p>
                <p style={{ color: '#666' }}>
                  Use Questionnaire History to review your earlier submissions.
                </p>
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Complete a wellbeing check-in to see your latest submission summary here.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Upcoming Sessions</h4>
          </div>
          <div className="card-body">
            {recentAppointments.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No upcoming sessions</p>
            ) : (
              recentAppointments.map((appointment) => (
                <div key={appointment.appointment_id} style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{appointment.therapist_name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>{formatDateTime(appointment.appointment_date, appointment.appointment_time)}</p>
                  </div>
                  <span style={{ background: appointment.status === 'approved' ? '#e8f5e9' : '#fff0ed', color: appointment.status === 'approved' ? '#2dce89' : '#fb6340', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' }}>
                    {appointment.status}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="card-footer">
            <Link to="/student/appointments" style={{ color: '#5e72e4', textDecoration: 'none' }}>
              View All Appointments →
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <Link to="/student/questionnaire" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <FaHeart size={32} style={{ color: '#fb6340', marginBottom: '1rem' }} />
              <h4>Wellbeing Check-in</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Complete the 10-question check-in before booking a session.</p>
            </div>
          </div>
        </Link>

        <Link to="/student/resources" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <FaBook size={32} style={{ color: '#5e72e4', marginBottom: '1rem' }} />
              <h4>Resources Library</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Articles, videos, and support links for mental wellness.</p>
            </div>
          </div>
        </Link>

        <Link to="/student/history" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <FaChartLine size={32} style={{ color: '#2dce89', marginBottom: '1rem' }} />
              <h4>Questionnaire History</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Review your previous wellbeing questionnaire submissions.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
