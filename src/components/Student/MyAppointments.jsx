import React, { useEffect, useMemo, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaVideo } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { appointmentApi, getErrorMessage } from '../../services/api';
import { formatDateTime, toLocalDateInputValue } from '../../utils/helpers';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

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

  const openReschedule = (appointment) => {
    setRescheduleAppointmentId(appointment.appointment_id);
    setRescheduleDate(toLocalDateInputValue(appointment.appointment_date));
    setRescheduleTime('');
    setAvailableSlots([]);
  };

  const closeReschedule = () => {
    setRescheduleAppointmentId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setAvailableSlots([]);
  };

  useEffect(() => {
    const loadSlots = async () => {
      if (!rescheduleAppointmentId || !rescheduleDate) {
        return;
      }

      const appointment = appointments.find((item) => item.appointment_id === rescheduleAppointmentId);
      if (!appointment) {
        return;
      }

      setSlotsLoading(true);
      try {
        const { data } = await appointmentApi.getAvailableSlots({
          therapistId: appointment.therapist_id,
          date: rescheduleDate
        });
        const currentTime = String(appointment.appointment_time).slice(0, 5);
        const mergedSlots = Array.from(new Set([...data, currentTime])).sort();
        setAvailableSlots(mergedSlots);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load time slots'));
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [appointments, rescheduleAppointmentId, rescheduleDate]);

  const submitReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Select a new date and time');
      return;
    }

    const appointment = appointments.find((item) => item.appointment_id === rescheduleAppointmentId);
    if (!appointment) {
      toast.error('Appointment not found');
      return;
    }

    if (
      toLocalDateInputValue(appointment.appointment_date) === rescheduleDate &&
      String(appointment.appointment_time).slice(0, 5) === rescheduleTime
    ) {
      toast.error('Select a different date or time to reschedule');
      return;
    }

    setRescheduling(true);
    try {
      await appointmentApi.reschedule(rescheduleAppointmentId, {
        appointmentDate: rescheduleDate,
        appointmentTime: rescheduleTime
      });
      toast.success('Appointment rescheduled and sent for approval');
      closeReschedule();
      loadAppointments();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to reschedule appointment'));
    } finally {
      setRescheduling(false);
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
                {appointment.status === 'approved' && appointment.meeting_link && (
                  <p style={{ marginTop: '0.5rem' }}>
                    <a
                      href={appointment.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#5e72e4', fontWeight: 500 }}
                    >
                      <FaVideo />
                      Join Meeting
                    </a>
                  </p>
                )}
                {appointment.status === 'completed' && appointment.therapist_notes && (
                  <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: '#f8f9fe', borderRadius: '8px', maxWidth: '700px' }}>
                    <p style={{ margin: 0, fontWeight: 600, color: '#172b4d' }}>Session Notes</p>
                    <p style={{ margin: '0.35rem 0 0', color: '#666', whiteSpace: 'pre-wrap' }}>{appointment.therapist_notes}</p>
                  </div>
                )}
              </div>

              {['pending', 'approved'].includes(appointment.status) && (
                <div className="flex" style={{ gap: '0.75rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openReschedule(appointment)}>
                    Reschedule
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => cancelAppointment(appointment.appointment_id)}>
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>

            {rescheduleAppointmentId === appointment.appointment_id && (
              <div className="card-body" style={{ borderTop: '1px solid #e9ecef', marginTop: '1rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Reschedule Appointment</h4>
                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div>
                    <label className="form-label">New Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={rescheduleDate}
                      min={toLocalDateInputValue(new Date())}
                      onChange={(e) => {
                        setRescheduleDate(e.target.value);
                        setRescheduleTime('');
                      }}
                    />
                  </div>
                  <div>
                    <label className="form-label">Available Time Slots</label>
                    {slotsLoading ? (
                      <p style={{ color: '#666' }}>Loading slots...</p>
                    ) : availableSlots.length > 0 ? (
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={`btn ${rescheduleTime === slot ? 'btn-primary' : 'btn-outline'} btn-sm`}
                            onClick={() => setRescheduleTime(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#666' }}>No slots available for this date.</p>
                    )}
                  </div>
                </div>
                <div className="flex" style={{ gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={closeReschedule}>
                    Cancel
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={submitReschedule} disabled={rescheduling}>
                    {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyAppointments;
