import React, { useState, useEffect } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 12,
    upcomingSessions: 2,
    completedSessions: 10,
    wellbeingScore: 72
  });

  const [recentAppointments] = useState([
    { id: 1, date: '2024-03-25', time: '14:00', therapist: 'Dr. Sarah Johnson', status: 'upcoming' },
    { id: 2, date: '2024-03-28', time: '15:30', therapist: 'Dr. Michael Chen', status: 'upcoming' },
    { id: 3, date: '2024-03-20', time: '11:00', therapist: 'Dr. Sarah Johnson', status: 'completed' }
  ]);

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Wellbeing Score',
        data: [65, 68, 70, 72, 75, 78],
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
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: '#e9ecef'
        }
      }
    }
  };

  const cards = [
    { icon: FaCalendarAlt, title: 'Total Sessions', value: stats.totalSessions, color: '#5e72e4', bg: '#eef2ff' },
    { icon: FaBook, title: 'Upcoming', value: stats.upcomingSessions, color: '#fb6340', bg: '#fff0ed' },
    { icon: FaSmile, title: 'Completed', value: stats.completedSessions, color: '#2dce89', bg: '#e8f5e9' },
    { icon: FaBrain, title: 'Wellbeing Score', value: `${stats.wellbeingScore}%`, color: '#11cdef', bg: '#e3f7fc' }
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, Alex! 👋</h1>
          <p style={{ color: '#666' }}>Your mental wellness journey matters. Let's continue growing together.</p>
        </div>
        <Link to="/student/book" className="btn btn-primary">
          <FaCalendarAlt /> Book New Session
        </Link>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card">
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
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Upcoming Sessions</h4>
          </div>
          <div className="card-body">
            {recentAppointments.filter(a => a.status === 'upcoming').length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No upcoming sessions</p>
            ) : (
              recentAppointments.filter(a => a.status === 'upcoming').map(appointment => (
                <div key={appointment.id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{appointment.therapist}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      {appointment.date} at {appointment.time}
                    </p>
                  </div>
                  <span style={{
                    background: '#e8f5e9',
                    color: '#2dce89',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem'
                  }}>
                    Confirmed
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
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Take a moment to reflect on how you're feeling</p>
            </div>
          </div>
        </Link>

        <Link to="/student/resources" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <FaBook size={32} style={{ color: '#5e72e4', marginBottom: '1rem' }} />
              <h4>Resources Library</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Articles, videos, and tools for mental wellness</p>
            </div>
          </div>
        </Link>

        <Link to="/student/history" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ height: '100%' }}>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <FaChartLine size={32} style={{ color: '#2dce89', marginBottom: '1rem' }} />
              <h4>Session History</h4>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>Review your past sessions and progress</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;