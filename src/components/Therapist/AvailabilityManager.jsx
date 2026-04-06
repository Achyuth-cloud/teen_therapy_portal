import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FaPlus, FaTrash, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { therapistApi, getErrorMessage } from '../../services/api';
import { toLocalDateInputValue } from '../../utils/helpers';

const AvailabilityManager = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [loading, setLoading] = useState(true);

  const selectedDateString = useMemo(() => toLocalDateInputValue(selectedDate), [selectedDate]);

  const loadAvailability = async () => {
    try {
      const { data } = await therapistApi.getAvailability();
      setTimeSlots(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load availability'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, []);

  const addTimeSlot = async () => {
    if (!newStartTime || !newEndTime) {
      toast.error('Please select both start and end times');
      return;
    }

    try {
      await therapistApi.addAvailability({
        availableDate: selectedDateString,
        startTime: newStartTime,
        endTime: newEndTime
      });
      toast.success('Time slot added');
      setNewStartTime('');
      setNewEndTime('');
      loadAvailability();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to add time slot'));
    }
  };

  const removeTimeSlot = async (id) => {
    try {
      await therapistApi.deleteAvailability(id);
      toast.success('Time slot removed');
      loadAvailability();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove time slot'));
    }
  };

  const filteredSlots = timeSlots.filter((slot) => toLocalDateInputValue(slot.available_date) === selectedDateString);

  if (loading) {
    return <div className="card"><div className="card-body">Loading availability...</div></div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Manage Availability</h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h4>Select Date</h4>
          </div>
          <div className="card-body">
            <Calendar onChange={setSelectedDate} value={selectedDate} minDate={new Date()} tileDisabled={({ date }) => date.getDay() === 0} />
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
                  <input type="time" className="form-control" value={newStartTime} onChange={(e) => setNewStartTime(e.target.value)} />
                </div>
                <div>
                  <label className="form-label">End Time</label>
                  <input type="time" className="form-control" value={newEndTime} onChange={(e) => setNewEndTime(e.target.value)} />
                </div>
              </div>
              <button className="btn btn-primary btn-block" onClick={addTimeSlot} style={{ marginTop: '1rem' }}>
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
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No time slots added for this date</p>
              ) : (
                filteredSlots.map((slot) => (
                  <div key={slot.availability_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', borderBottom: '1px solid #e9ecef' }}>
                    <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                      <FaClock style={{ color: '#5e72e4' }} />
                      <span>{String(slot.start_time).slice(0, 5)} - {String(slot.end_time).slice(0, 5)}</span>
                    </div>
                    <button className="btn btn-danger btn-sm" onClick={() => removeTimeSlot(slot.availability_id)}>
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
