import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { authApi, getErrorMessage, studentApi } from '../../services/api';

const StudentSettings = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    emergencyContact: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await studentApi.getProfile();
        setFormData({
          fullName: data.full_name || user?.name || '',
          email: data.email || user?.email || '',
          age: data.age || '',
          gender: data.gender || '',
          emergencyContact: data.emergency_contact || ''
        });
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load student profile'));
      }
    };

    loadProfile();
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

      await studentApi.updateProfile({
        age: Number(formData.age),
        gender: formData.gender.trim(),
        emergencyContact: formData.emergencyContact.trim()
      });

      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update profile'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Student Settings</h1>
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
                <label className="form-label">Age</label>
                <input className="form-control" type="number" min="13" max="19" name="age" value={formData.age} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <input className="form-control" name="gender" value={formData.gender} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input className="form-control" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
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

export default StudentSettings;
