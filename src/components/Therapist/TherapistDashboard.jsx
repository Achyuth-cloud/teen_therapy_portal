import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaUsers, FaClock, FaChartLine, FaCheckCircle, FaSpinner, FaCalendarAlt } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';

const TherapistDashboard = () => {
  const [stats] = useState({
    totalStudents: 24,
    pendingRequests: 5,
    completedSessions: 48,
    upcomingSessions: 8
  });

  const [recentRequests] = useState([
    { id: 1, student: 'Alex Thompson', date: '2024-03-25', time: '14:00', status: 'pending' },
    { id: 2, student: 'Emma Watson', date: '2024-03-25', time: '15:30', status: 'pending' },
    { id: 3, student: 'James Wilson', date: '2024-03-26', time: '11:00', status: 'pending' }
  ]);

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Sessions Completed',
        data: [6, 8, 10, 12, 9, 11],
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
      }
    }
  };

  const cards = [
    { icon: FaUsers, title: 'Active Students', value: stats.totalStudents, color: '#5e72e4', bg: '#eef2ff' },
    { icon: FaSpinner, title: 'Pending Requests', value: stats.pendingRequests, color: '#fb6340', bg: '#fff0ed' },
    { icon: FaCheckCircle, title: 'Completed Sessions', value: stats.completedSessions, color: '#2dce89', bg: '#e8f5e9' },
    { icon: FaCalendarAlt, title: 'Upcoming Sessions', value: stats.upcomingSessions, color: '#11cdef', bg: '#e3f7fc' }
  ];

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Welcome back, Dr. Sarah! 👩‍⚕️</h1>
          <p style={{ color: '#666' }}>Here's an overview of your therapy practice</p>
        </div>
        <Link to="/therapist/availability" className="btn btn-primary">
          <FaCalendarAlt /> Manage Availability
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
            <h4>Session Analytics</h4>
          </div>
          <div className="card-body">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Recent Appointment Requests</h4>
          </div>
          <div className="card-body">
            {recentRequests.map(request => (
              <div key={request.id} style={{
                padding: '1rem',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{request.student}</p>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    {request.date} at {request.time}
                  </p>
                </div>
                <Link to={`/therapist/requests`} className="btn btn-sm btn-primary">
                  Review
                </Link>
              </div>
            ))}
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