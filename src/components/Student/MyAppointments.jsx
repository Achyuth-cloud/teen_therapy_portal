import React, { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { appointmentApi, getErrorMessage } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const { data } = await appointmentApi.getStudentAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load appointments'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#2dce89';
      case 'pending': return '#fb6340';
      case 'completed': return '#5e72e4';
      case 'cancelled': return '#f5365c';
      case 'rejected': return '#8898aa';
      default: return '#8898aa';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await appointmentApi.cancel(id);
      toast.success('Appointment cancelled successfully');
      loadAppointments();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to cancel appointment'));
    }
  };

  const { upcomingAppointments, pastAppointments } = useMemo(() => ({
    upcomingAppointments: appointments.filter((appointment) => appointment.status !== 'completed'),
    pastAppointments: appointments.filter((appointment) => appointment.status === 'completed')
  }), [appointments]);

  const displayAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  if (loading) {
    return <div className="card"><div className="card-body">Loading appointments...</div></div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>My Appointments</h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #e9ecef' }}>
        <button onClick={() => setActiveTab('upcoming')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'upcoming' ? '#5e72e4' : '#8898aa', borderBottom: activeTab === 'upcoming' ? '2px solid #5e72e4' : 'none', fontWeight: 500 }}>
          Upcoming ({upcomingAppointments.length})
        </button>
        <button onClick={() => setActiveTab('past')} style={{ padding: '0.75rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: activeTab === 'past' ? '#5e72e4' : '#8898aa', borderBottom: activeTab === 'past' ? '2px solid #5e72e4' : 'none', fontWeight: 500 }}>
          Past Sessions ({pastAppointments.length})
        </button>
      </div>

      {displayAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No appointments found</p>
        </div>
      ) : (
        displayAppointments.map((appointment) => (
          <div key={appointment.appointment_id} className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{appointment.therapist_name}</h4>
                  <span style={{ background: getStatusColor(appointment.status), color: 'white', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {getStatusIcon(appointment.status)}
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
                <p style={{ color: '#666', marginBottom: '0.25rem' }}>
                  <FaCalendarAlt style={{ marginRight: '0.5rem' }} />
                  {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                </p>
                {appointment.reason && <p style={{ fontSize: '0.875rem', color: '#8898aa' }}>{appointment.reason}</p>}
              </div>

              {['pending', 'approved'].includes(appointment.status) && (
                <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.appointment_id)}>
                  Cancel Appointment
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
