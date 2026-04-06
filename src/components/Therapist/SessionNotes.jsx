import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { appointmentApi, sessionNoteApi, getErrorMessage } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

const SessionNotes = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [existingNoteId, setExistingNoteId] = useState(null);
  const [notes, setNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [nextSessionDate, setNextSessionDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: appointments } = await appointmentApi.getTherapistAppointments();
        const matchedAppointment = appointments.find((item) => String(item.appointment_id) === String(appointmentId));
        setAppointment(matchedAppointment || null);

        try {
          const { data: note } = await sessionNoteApi.getByAppointment(appointmentId);
          setExistingNoteId(note.note_id);
          setNotes(note.notes || '');
          setRecommendations(note.recommendations || '');
          setNextSessionDate(note.next_session_date ? String(note.next_session_date).split('T')[0] : '');
        } catch (error) {
          if (error.response?.status !== 404) {
            toast.error(getErrorMessage(error, 'Failed to load session note'));
          }
        }
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load appointment details'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appointmentId]);

  const handleSave = async () => {
    if (!notes.trim()) {
      toast.error('Please add session notes');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        appointmentId: Number(appointmentId),
        notes,
        recommendations,
        nextSessionDate: nextSessionDate || null
      };

      if (existingNoteId) {
        await sessionNoteApi.update(existingNoteId, payload);
      } else {
        await sessionNoteApi.create(payload);
      }

      toast.success('Session notes saved successfully');
      navigate('/therapist/requests');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save session notes'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card"><div className="card-body">Loading session details...</div></div>;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn btn-outline btn-sm" style={{ marginBottom: '1.5rem' }}>
        <FaArrowLeft /> Back
      </button>

      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Session Notes</h1>

      <div className="card">
        <div className="card-header">
          <h4>Session Details</h4>
        </div>
        <div className="card-body">
          {appointment ? (
            <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
              <div>
                <p className="flex" style={{ alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <FaUser style={{ color: '#5e72e4' }} />
                  <strong>Student:</strong> {appointment.student_name}
                </p>
                <p className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
                  <FaCalendarAlt style={{ color: '#5e72e4' }} />
                  <strong>Date:</strong> {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                </p>
              </div>
              <div>
                <p><strong>Wellbeing Score:</strong> {appointment.wellbeing_score ? Number(appointment.wellbeing_score).toFixed(1) : 'N/A'}/5</p>
                <p><strong>Status:</strong> {appointment.status}</p>
              </div>
            </div>
          ) : (
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Appointment details could not be loaded, but you can still save notes for this appointment.</p>
          )}

          <div className="form-group">
            <label className="form-label">Session Notes</label>
            <textarea className="form-control" rows="6" placeholder="Document key points discussed, observations, interventions used, and the student's response..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Recommendations / Follow-up Plan</label>
            <textarea className="form-control" rows="4" placeholder="Suggestions for the student, homework, or next steps..." value={recommendations} onChange={(e) => setRecommendations(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Next Session Date (Optional)</label>
            <input type="date" className="form-control" value={nextSessionDate} onChange={(e) => setNextSessionDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              <FaSave /> {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionNotes;
