import React from 'react';
import { render, screen } from '@testing-library/react';
import MyAppointments from './MyAppointments';
import { appointmentApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  appointmentApi: {
    getStudentAppointments: jest.fn(),
    cancel: jest.fn(),
    reschedule: jest.fn(),
    getAvailableSlots: jest.fn()
  },
  getErrorMessage: (error, fallback) => error?.message || fallback
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

describe('MyAppointments', () => {
  beforeEach(() => {
    appointmentApi.getStudentAppointments.mockResolvedValue({
      data: [
        {
          appointment_id: 1,
          therapist_id: 1,
          therapist_name: 'Dr. Sarah Johnson',
          status: 'approved',
          appointment_date: '2026-04-10',
          appointment_time: '10:00:00',
          reason: 'Discuss stress',
          meeting_link: 'https://meet.google.com/example-link'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows a join meeting link for approved appointments with a meeting URL', async () => {
    render(<MyAppointments />);

    const joinLink = await screen.findByText('Join Meeting');
    expect(joinLink).toBeTruthy();
    expect(joinLink.closest('a')?.getAttribute('href')).toBe('https://meet.google.com/example-link');
  });
});
