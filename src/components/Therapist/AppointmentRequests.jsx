import React, { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaComment, FaBrain } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { appointmentApi, getErrorMessage } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';
import { wellbeingQuestionLabels } from '../../utils/wellbeingQuestions';

const AppointmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [expandedQuestionsAppointmentId, setExpandedQuestionsAppointmentId] = useState(null);
  const [expandedNotesAppointmentId, setExpandedNotesAppointmentId] = useState(null);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [sessionNotes, setSessionNotes] = useState({});
  const [savingNotesId, setSavingNotesId] = useState(null);

  const loadRequests = async () => {
    try {
      const { data } = await appointmentApi.getTherapistAppointments();
      setRequests(data);
      setSessionNotes((current) => {
        const next = { ...current };
        data.forEach((appointment) => {
          if (next[appointment.appointment_id] === undefined) {
            next[appointment.appointment_id] = appointment.therapist_notes || '';
          }
        });
        return next;
      });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load appointment requests'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatusChange = async (id, status) => {
    const meetingLink = (meetingLinks[id] || '').trim();

    if (status === 'approved' && !meetingLink) {
      toast.error('Add a meeting link before approving the appointment');
      return;
    }

    if (status === 'approved') {
      try {
        const parsedUrl = new URL(meetingLink);
        if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
          throw new Error('invalid');
        }
      } catch (error) {
        toast.error('Enter a valid meeting link');
        return;
      }
    }

    try {
      await appointmentApi.updateStatus(id, {
        status,
        meetingLink: status === 'approved' ? meetingLink : undefined
      });
      toast.success(`Appointment ${status}`);
      setMeetingLinks((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      loadRequests();
    } catch (error) {
      toast.error(getErrorMessage(error, `Failed to mark appointment as ${status}`));
    }
  };

  const filteredRequests = useMemo(() => {
    if (filter === 'all') {
      return requests;
    }

    return requests.filter((request) => request.status === filter);
  }, [filter, requests]);

  const toggleExpandedQuestions = (appointmentId) => {
    setExpandedQuestionsAppointmentId((currentId) => (currentId === appointmentId ? null : appointmentId));
  };

  const toggleExpandedNotes = (appointmentId) => {
    setExpandedNotesAppointmentId((currentId) => (currentId === appointmentId ? null : appointmentId));
  };

  const handleSaveNotes = async (appointmentId) => {
    const therapistNotes = (sessionNotes[appointmentId] || '').trim();

    if (!therapistNotes) {
      toast.error('Enter session notes before saving');
      return;
    }

    setSavingNotesId(appointmentId);
    try {
      await appointmentApi.saveNotes(appointmentId, { therapistNotes });
      toast.success('Session notes saved');
      loadRequests();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save session notes'));
    } finally {
      setSavingNotesId(null);
    }
  };

  if (loading) {
    return <div className="card"><div className="card-body">Loading appointment requests...</div></div>;
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.875rem' }}>Appointment Requests</h1>
        <div className="flex" style={{ gap: '0.5rem' }}>
          {['all', 'pending', 'approved', 'completed'].map((value) => (
            <button key={value} onClick={() => setFilter(value)} className={`btn ${filter === value ? 'btn-primary' : 'btn-outline'}`}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No appointment requests found</p>
        </div>
      ) : (
        filteredRequests.map((request) => (
          <div key={request.appointment_id} className="card" style={{ marginBottom: '1rem' }}>
            <div className="card-body">
              <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div className="flex" style={{ alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0 }}>{request.student_name}</h4>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', background: request.status === 'approved' ? '#e8f5e9' : request.status === 'rejected' ? '#ffebee' : request.status === 'completed' ? '#eef2ff' : '#fff0ed', color: request.status === 'approved' ? '#2dce89' : request.status === 'rejected' ? '#f5365c' : request.status === 'completed' ? '#5e72e4' : '#fb6340' }}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="flex" style={{ alignItems: 'center', gap: '1rem', color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span><FaCalendarAlt /> {formatDateTime(request.appointment_date, request.appointment_time)}</span>
                    <span><FaUser /> Age {request.age || 'N/A'}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ background: '#eef2ff', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', color: '#5e72e4' }}>
                    Wellbeing Score: {request.wellbeing_score ? Number(request.wellbeing_score).toFixed(1) : 'N/A'}/5
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8f9fe', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <FaComment style={{ marginTop: '0.25rem', color: '#5e72e4' }} />
                  <span><strong>Reason for appointment:</strong> {request.reason || 'No reason provided.'}</span>
                </p>
              </div>

              {Array.isArray(request.wellbeing_responses) && request.wellbeing_responses.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleExpandedQuestions(request.appointment_id)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <FaBrain />
                    {expandedQuestionsAppointmentId === request.appointment_id ? 'Hide Questions' : 'View Questions'}
                  </button>

                  {expandedQuestionsAppointmentId === request.appointment_id && (
                    <div style={{ background: '#eef2ff', padding: '1rem', borderRadius: '8px', marginTop: '0.75rem' }}>
                      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#3047a0' }}>
                        <FaBrain />
                        Latest Questionnaire Answers
                      </p>
                      <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
                        {request.wellbeing_responses.map((response, index) => (
                          <p key={`${request.appointment_id}-${index}`} style={{ margin: 0, color: '#4b5563' }}>
                            <strong>{wellbeingQuestionLabels[response.questionId] || `Question ${response.questionId}`}</strong>: {response.answer}/5
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {request.status === 'pending' && (
                <>
                  {request.meeting_link && (
                    <p style={{ marginBottom: '1rem', color: '#5e72e4' }}>
                      Current meeting link: <a href={request.meeting_link} target="_blank" rel="noreferrer">{request.meeting_link}</a>
                    </p>
                  )}
                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Meeting Link</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="Paste Zoom, Google Meet, Skype, or other meeting link"
                      value={meetingLinks[request.appointment_id] || ''}
                      onChange={(event) =>
                        setMeetingLinks((current) => ({
                          ...current,
                          [request.appointment_id]: event.target.value
                        }))
                      }
                    />
                  </div>

                  <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(request.appointment_id, 'rejected')}>
                      <FaTimes /> Decline
                    </button>
                    <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(request.appointment_id, 'approved')}>
                      <FaCheck /> Approve With Link
                    </button>
                  </div>
                </>
              )}

              {request.status === 'approved' && (
                <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(request.appointment_id, 'completed')}>
                    <FaCheck /> Mark Completed
                  </button>
                </div>
              )}

              {request.status === 'completed' && (
                <div style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleExpandedNotes(request.appointment_id)}
                  >
                    {expandedNotesAppointmentId === request.appointment_id ? 'Hide Session Notes' : 'View Session Notes'}
                  </button>

                  {expandedNotesAppointmentId === request.appointment_id && (
                    <div style={{ marginTop: '0.75rem' }}>
                      <label className="form-label">Session Notes</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Add notes about the completed session"
                        value={sessionNotes[request.appointment_id] || ''}
                        onChange={(event) =>
                          setSessionNotes((current) => ({
                            ...current,
                            [request.appointment_id]: event.target.value
                          }))
                        }
                      />
                      <div className="flex" style={{ justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveNotes(request.appointment_id)}
                          disabled={savingNotesId === request.appointment_id}
                        >
                          {savingNotesId === request.appointment_id ? 'Saving...' : 'Save Notes'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AppointmentRequests;
