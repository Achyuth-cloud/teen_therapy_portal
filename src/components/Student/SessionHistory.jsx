import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaUserMd, FaStethoscope } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { sessionNoteApi, getErrorMessage } from '../../services/api';
import { formatDateTime, formatDate } from '../../utils/helpers';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { data } = await sessionNoteApi.getStudentNotes();
        setSessions(data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load session history'));
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, []);

  if (loading) {
    return <div className="card"><div className="card-body">Loading session history...</div></div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Session History</h1>
        <p>No session notes available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Session History</h1>

      {sessions.map((session) => (
        <div key={session.note_id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>Session Summary</h4>
                </div>
                <p className="flex" style={{ alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  <span><FaCalendarAlt /> {formatDateTime(session.appointment_date, session.appointment_time)}</span>
                  <span><FaUserMd /> {session.therapist_name}</span>
                </p>
              </div>
              {session.next_session_date && (
                <span style={{ fontSize: '0.875rem', color: '#5e72e4' }}>
                  Next suggested session: {formatDate(session.next_session_date)}
                </span>
              )}
            </div>
            <div style={{ background: '#f8f9fe', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
              <p style={{ color: '#666', margin: 0 }}>
                <FaStethoscope style={{ marginRight: '0.5rem', color: '#5e72e4' }} />
                {session.notes}
              </p>
              {session.recommendations && (
                <p style={{ color: '#666', marginTop: '0.75rem' }}>
                  <strong>Recommendations:</strong> {session.recommendations}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionHistory;
