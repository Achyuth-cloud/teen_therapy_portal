import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaStethoscope, FaCalendarAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SessionNotes = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [nextSessionDate, setNextSessionDate] = useState('');

  const handleSave = () => {
    if (!notes.trim()) {
      toast.error('Please add session notes');
      return;
    }
    
    toast.success('Session notes saved successfully');
    navigate('/therapist/requests');
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <FaArrowLeft /> Back
      </button>
      
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Session Notes</h1>
      
      <div className="card">
        <div className="card-header">
          <h4>Session Details</h4>
        </div>
        <div className="card-body">
          <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
            <div>
              <p className="flex" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <FaUser style={{ color: '#5e72e4' }} />
                <strong>Student:</strong> Alex Thompson
              </p>
              <p className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                <FaCalendarAlt style={{ color: '#5e72e4' }} />
                <strong>Date:</strong> March 25, 2024 at 2:00 PM
              </p>
            </div>
            <div>
              <p><strong>Wellbeing Score:</strong> 3.2/5</p>
              <p><strong>Session Type:</strong> Online Session</p>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Session Notes</label>
            <textarea
              className="form-control"
              rows="6"
              placeholder="Document key points discussed, observations, interventions used, and student's response..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Recommendations / Follow-up Plan</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Suggestions for the student, homework, or next steps..."
              value={recommendations}
              onChange={(e) => setRecommendations(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Next Session Date (Optional)</label>
            <input
              type="date"
              className="form-control"
              value={nextSessionDate}
              onChange={(e) => setNextSessionDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <FaSave /> Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionNotes;