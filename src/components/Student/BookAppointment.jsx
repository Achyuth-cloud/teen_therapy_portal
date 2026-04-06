import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { appointmentApi, therapistApi, wellbeingApi, getErrorMessage } from '../../services/api';
import { toLocalDateInputValue } from '../../utils/helpers';

const BookAppointment = () => {
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [therapists, setTherapists] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [questionnaireComplete, setQuestionnaireComplete] = useState(false);
  const [questionnaireLoading, setQuestionnaireLoading] = useState(true);

  const formattedDate = useMemo(() => toLocalDateInputValue(selectedDate), [selectedDate]);

  useEffect(() => {
    const loadTherapists = async () => {
      try {
        const { data } = await therapistApi.getAll();
        setTherapists(data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load therapists'));
      }
    };

    loadTherapists();
  }, []);

  useEffect(() => {
    if (location.state?.questionnaireSubmitted) {
      toast.success('Questionnaire submitted. You can now book or re-submit the questionnaire.');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    const loadQuestionnaireStatus = async () => {
      try {
        const { data } = await wellbeingApi.getHistory();
        const hasCompletedQuestionnaire = data.some((entry) => {
          const responses = Array.isArray(entry?.responses)
            ? entry.responses
            : typeof entry?.responses === 'string'
              ? JSON.parse(entry.responses)
              : [];

          return Array.isArray(responses) && responses.length >= 10;
        });

        setQuestionnaireComplete(hasCompletedQuestionnaire);
      } catch (error) {
        setQuestionnaireComplete(false);
      } finally {
        setQuestionnaireLoading(false);
      }
    };

    loadQuestionnaireStatus();
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedTherapist) {
      setTimeSlots([]);
      setSelectedTime('');
      return;
    }

    if (!questionnaireComplete) {
      setTimeSlots([]);
      setSelectedTime('');
      return;
    }

      setSlotsLoading(true);
      try {
        const { data } = await appointmentApi.getAvailableSlots({
          therapistId: selectedTherapist,
          date: formattedDate
        });
        setTimeSlots(data);
        setSelectedTime('');
      } catch (error) {
        setTimeSlots([]);
        toast.error(getErrorMessage(error, 'Failed to load time slots'));
      } finally {
        setSlotsLoading(false);
      }
    };

    loadSlots();
  }, [formattedDate, selectedTherapist]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTherapist || !selectedTime || !reason.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!questionnaireComplete) {
      toast.error('Complete the 10-question wellbeing questionnaire before booking');
      return;
    }

    setLoading(true);
    try {
      await appointmentApi.book({
        therapistId: Number(selectedTherapist),
        appointmentDate: formattedDate,
        appointmentTime: selectedTime,
        reason
      });
      toast.success('Appointment request sent successfully');
      setSelectedTherapist('');
      setSelectedTime('');
      setReason('');
      setTimeSlots([]);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to book appointment'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Book a Counselling Session</h1>

      {!questionnaireLoading && !questionnaireComplete && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #fb6340' }}>
          <div className="card-body">
            <h4 style={{ marginBottom: '0.5rem' }}>Questionnaire Required</h4>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              You must complete the 10-question wellbeing check-in before booking an appointment.
            </p>
            <Link to="/student/questionnaire" className="btn btn-primary">
              Complete Questionnaire
            </Link>
          </div>
        </div>
      )}

      {!questionnaireLoading && questionnaireComplete && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #5e72e4' }}>
          <div className="card-body">
            <h4 style={{ marginBottom: '0.5rem' }}>Questionnaire Completed</h4>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Your latest questionnaire is on file. You can book now, or re-submit the questionnaire if your situation has changed.
            </p>
            <Link to="/student/questionnaire" className="btn btn-outline">
              Re-submit Questionnaire
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-2">
        <div>
          <div className="card">
            <div className="card-header">
              <h4>Select Date & Time</h4>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Choose a Date</label>
                <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6} style={{ width: '100%', border: 'none' }} />
              </div>

              <div>
                <label className="form-label">Available Time Slots</label>
                {questionnaireLoading ? (
                  <p style={{ color: '#666', marginTop: '0.75rem' }}>Checking questionnaire status...</p>
                ) : !questionnaireComplete ? (
                  <p style={{ color: '#666', marginTop: '0.75rem' }}>Complete the questionnaire to unlock booking slots.</p>
                ) : slotsLoading ? (
                  <p style={{ color: '#666', marginTop: '0.75rem' }}>Loading slots...</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {timeSlots.length > 0 ? (
                      timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          style={{
                            padding: '0.5rem',
                            background: selectedTime === time ? '#5e72e4' : '#f8f9fe',
                            color: selectedTime === time ? 'white' : '#333',
                            border: '1px solid #e9ecef',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaClock style={{ marginRight: '0.5rem' }} />
                          {time}
                        </button>
                      ))
                    ) : (
                      <p style={{ color: '#666', gridColumn: '1 / -1' }}>
                        {selectedTherapist ? 'No available slots for this date.' : 'Select a therapist to view available slots.'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h4>Session Details</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Select Therapist</label>
                  <select className="form-control" value={selectedTherapist} onChange={(e) => setSelectedTherapist(e.target.value)} required>
                    <option value="">Choose a therapist</option>
                    {therapists.map((therapist) => (
                      <option key={therapist.therapist_id} value={therapist.therapist_id}>
                        {therapist.full_name} - {therapist.specialization || 'General support'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Reason for Appointment</label>
                  <textarea className="form-control" rows="4" placeholder="Briefly describe what you'd like to discuss..." value={reason} onChange={(e) => setReason(e.target.value)} required />
                </div>

                <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaInfoCircle style={{ color: '#5e72e4' }} />
                    <strong>Session Information</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    Sessions are booked in 30-minute slots based on therapist availability. Your therapist will review and approve the request.
                  </p>
                </div>

                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                  {loading ? 'Booking...' : 'Book Appointment'}
                  <FaCalendarAlt />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
