import React, { useEffect, useMemo, useState } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaComment } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { appointmentApi, getErrorMessage } from '../../services/api';
import { formatDateTime } from '../../utils/helpers';

const AppointmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      const { data } = await appointmentApi.getTherapistAppointments();
      setRequests(data);
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
    try {
      await appointmentApi.updateStatus(id, { status });
      toast.success(`Appointment ${status}`);
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

              {request.status === 'pending' && (
                <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(request.appointment_id, 'rejected')}>
                    <FaTimes /> Decline
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(request.appointment_id, 'approved')}>
                    <FaCheck /> Approve
                  </button>
                </div>
              )}

              {['approved', 'completed'].includes(request.status) && (
                <div className="flex" style={{ gap: '1rem', justifyContent: 'flex-end' }}>
                  <Link className="btn btn-primary btn-sm" to={`/therapist/notes/${request.appointment_id}`}>
                    Add Session Notes
                  </Link>
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
