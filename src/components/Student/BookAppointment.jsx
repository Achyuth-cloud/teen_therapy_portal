import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaCalendarAlt, FaUserMd, FaClock, FaInfoCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const therapists = [
    { id: 1, name: 'Dr. Sarah Johnson', specialization: 'Anxiety & Depression', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialization: 'Teen Counseling', available: true },
    { id: 3, name: 'Dr. Emily Rodriguez', specialization: 'Stress Management', available: false }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTherapist || !selectedTime || !reason) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Appointment request sent successfully!');
      setLoading(false);
      // Reset form
      setSelectedTherapist('');
      setSelectedTime('');
      setReason('');
    }, 1500);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Book a Counselling Session</h1>
      
      <div className="grid grid-2">
        <div>
          <div className="card">
            <div className="card-header">
              <h4>Select Date & Time</h4>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Choose a Date</label>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  minDate={new Date()}
                  tileDisabled={({ date }) => date.getDay() === 0 || date.getDay() === 6}
                  style={{ width: '100%', border: 'none' }}
                />
              </div>
              
              <div>
                <label className="form-label">Available Time Slots</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {timeSlots.map(time => (
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
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <FaClock style={{ marginRight: '0.5rem' }} />
                      {time}
                    </button>
                  ))}
                </div>
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
                  <select
                    className="form-control"
                    value={selectedTherapist}
                    onChange={(e) => setSelectedTherapist(e.target.value)}
                    required
                  >
                    <option value="">Choose a therapist</option>
                    {therapists.map(therapist => (
                      <option key={therapist.id} value={therapist.id} disabled={!therapist.available}>
                        {therapist.name} - {therapist.specialization}
                        {!therapist.available && ' (Unavailable)'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Reason for Appointment</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Briefly describe what you'd like to discuss..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </div>
                
                <div style={{
                  background: '#eef2ff',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FaInfoCircle style={{ color: '#5e72e4' }} />
                    <strong>Session Information</strong>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#666' }}>
                    Each session lasts approximately 50 minutes. All sessions are confidential and conducted in a safe, supportive environment.
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