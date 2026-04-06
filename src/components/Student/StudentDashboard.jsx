import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBook, FaHeart, FaChartLine, FaSmile, FaBrain } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { appointmentApi, wellbeingApi } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingSessions: 0,
    completedSessions: 0,
    wellbeingScore: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [trendLabels, setTrendLabels] = useState([]);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: appointments }, { data: trends }, { data: history }] = await Promise.all([
          appointmentApi.getStudentAppointments(),
          wellbeingApi.getTrends(),
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
          completedSessions: completed.length,
          wellbeingScore: latestHistory ? Number(latestHistory.average_score || 0) * 20 : 0
        });
        setRecentAppointments(upcoming.slice(0, 3));
        setTrendLabels(trends.map((item) => item.period));
        setTrendData(trends.map((item) => Number(item.avg_score || 0) * 20));
      } catch (error) {
        setStats({
          totalSessions: 0,
          upcomingSessions: 0,
          completedSessions: 0,
          wellbeingScore: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const chartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Wellbeing Score',
        data: trendData,
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
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: '#e9ecef' }
      }
    }
  };

  const cards = [
    { icon: FaCalendarAlt, title: 'Total Sessions', value: stats.totalSessions, color: '#5e72e4', bg: '#eef2ff' },
    { icon: FaBook, title: 'Upcoming', value: stats.upcomingSessions, color: '#fb6340', bg: '#fff0ed' },
    { icon: FaSmile, title: 'Completed', value: stats.completedSessions, color: '#2dce89', bg: '#e8f5e9' },
    { icon: FaBrain, title: 'Wellbeing Score', value: `${Math.round(stats.wellbeingScore)}%`, color: '#11cdef', bg: '#e3f7fc' }
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
            <h4>Wellbeing Progress</h4>
          </div>
          <div className="card-body">
            {trendData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Complete a wellbeing check-in to see your progress here.</p>
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
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Share how you have been feeling lately.</p>
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
              <h4>Session History</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Review therapist notes from completed sessions.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
