import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authApi, getErrorMessage, therapistApi } from '../../services/api';

const TherapistSettings = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    specialization: '',
    experienceYears: '',
    bio: '',
    consultationFee: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const roleData = user?.roleData || {};
    setFormData({
      fullName: user?.name || '',
      email: user?.email || '',
      specialization: roleData.specialization || '',
      experienceYears: roleData.experience_years || '',
      bio: roleData.bio || '',
      consultationFee: roleData.consultation_fee || ''
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await authApi.updateProfile({
        fullName: formData.fullName.trim(),
        email: formData.email.trim()
      });

      await therapistApi.updateProfile({
        specialization: formData.specialization.trim(),
        experience_years: Number(formData.experienceYears || 0),
        bio: formData.bio.trim(),
        consultation_fee: formData.consultationFee === '' ? 0 : Number(formData.consultationFee)
      });

      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update therapist profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Therapist Settings</h1>
      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input className="form-control" name="specialization" value={formData.specialization} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Experience Years</label>
                <input className="form-control" type="number" min="0" name="experienceYears" value={formData.experienceYears} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-control" rows="4" name="bio" value={formData.bio} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee</label>
              <input className="form-control" type="number" min="0" step="0.01" name="consultationFee" value={formData.consultationFee} onChange={handleChange} />
            </div>

            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TherapistSettings;
