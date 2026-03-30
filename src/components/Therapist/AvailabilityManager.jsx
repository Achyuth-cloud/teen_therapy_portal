import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaPlus, FaTrash, FaClock, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, date: '2024-03-25', startTime: '09:00', endTime: '12:00' },
    { id: 2, date: '2024-03-25', startTime: '13:00', endTime: '17:00' },
    { id: 3, date: '2024-03-26', startTime: '10:00', endTime: '14:00' }
  ]);
  
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');

  const addTimeSlot = () => {
    if (!newStartTime || !newEndTime) {
      toast.error('Please select both start and end times');
      return;
    }
    
    const newSlot = {
      id: Date.now(),
      date: selectedDate.toISOString().split('T')[0],
      startTime: newStartTime,
      endTime: newEndTime
    };
    
    setTimeSlots([...timeSlots, newSlot]);
    setNewStartTime('');
    setNewEndTime('');
    toast.success('Time slot added');
  };

  const removeTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
    toast.success('Time slot removed');
  };

  const filteredSlots = timeSlots.filter(slot => 
    slot.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Manage Availability</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h4>Select Date</h4>
          </div>
          <div className="card-body">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              tileDisabled={({ date }) => date.getDay() === 0}
            />
          </div>
        </div>
        
        <div>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-header">
              <h4>Add Time Slot</h4>
            </div>
            <div className="card-body">
              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={addTimeSlot}
                style={{ marginTop: '1rem' }}
              >
                <FaPlus /> Add Time Slot
              </button>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h4>Time Slots for {selectedDate.toLocaleDateString()}</h4>
            </div>
            <div className="card-body">
              {filteredSlots.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No time slots added for this date
                </p>
              ) : (
                filteredSlots.map(slot => (
                  <div key={slot.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid #e9ecef'
                  }}>
                    <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                      <FaClock style={{ color: '#5e72e4' }} />
                      <span>{slot.startTime} - {slot.endTime}</span>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeTimeSlot(slot.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;