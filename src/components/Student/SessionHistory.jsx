import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { wellbeingApi, getErrorMessage } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const { data } = await wellbeingApi.getHistory();
        setSessions(data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load questionnaire history'));
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
        <h1 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Questionnaire History</h1>
        <p>No questionnaire submissions available yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Questionnaire History</h1>

      {sessions.map((session) => (
        <div key={session.response_id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="card-body">
            <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0 }}>{session.questionnaire_title || 'Wellbeing Check-in'}</h4>
                </div>
                <p className="flex" style={{ alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.875rem' }}>
                  <span><FaCalendarAlt /> {formatDate(session.submitted_at)}</span>
                </p>
              </div>
              <span style={{ fontSize: '0.875rem', color: '#5e72e4' }}>
                Average Score: {Number(session.average_score).toFixed(1)}/5
              </span>
            </div>
            <div style={{ background: '#f8f9fe', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
              {session.responses.map((response, index) => (
                <p key={`${session.response_id}-${index}`} style={{ color: '#666', margin: index === 0 ? 0 : '0.5rem 0 0 0' }}>
                  <FaChartLine style={{ marginRight: '0.5rem', color: '#5e72e4' }} />
                  Question {response.questionId}: {response.answer}/5
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionHistory;
