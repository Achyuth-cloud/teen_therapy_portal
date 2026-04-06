import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AppointmentRequests from './AppointmentRequests';
import { appointmentApi } from '../../services/api';

jest.mock('../../services/api', () => ({
  appointmentApi: {
    getTherapistAppointments: jest.fn(),
    updateStatus: jest.fn()
  },
  getErrorMessage: (error, fallback) => error?.message || fallback
}));

jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

describe('AppointmentRequests', () => {
  beforeEach(() => {
    appointmentApi.getTherapistAppointments.mockResolvedValue({
      data: [
        {
          appointment_id: 1,
          student_name: 'Alex Johnson',
          status: 'pending',
          appointment_date: '2026-04-10',
          appointment_time: '10:00:00',
          age: 15,
          reason: 'Need support',
          wellbeing_score: '4.20',
          wellbeing_responses: [{ questionId: 1, answer: 4 }]
        }
      ]
    });
    appointmentApi.updateStatus.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('keeps questionnaire answers collapsed until requested', async () => {
    render(<AppointmentRequests />);

    await screen.findByText('Alex Johnson');
    expect(screen.queryByText('Latest Questionnaire Answers')).toBeNull();

    fireEvent.click(screen.getByText('View Questions'));
    expect(await screen.findByText('Latest Questionnaire Answers')).toBeTruthy();
  });

  it('requires a meeting link before approval', async () => {
    const toast = require('react-hot-toast');
    render(<AppointmentRequests />);

    await screen.findByText('Alex Johnson');
    fireEvent.click(screen.getByText('Approve With Link'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Add a meeting link before approving the appointment');
    });
    expect(appointmentApi.updateStatus).not.toHaveBeenCalled();
  });
});
