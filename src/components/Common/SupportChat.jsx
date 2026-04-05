import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBot from 'react-chatbotify';
import { useAuth } from '../../context/AuthContext';

const getFirstName = (name) => {
  if (!name) {
    return 'there';
  }

  return name.trim().split(/\s+/)[0];
};

const SupportChat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isStudent = user.role === 'student';
  const firstName = getFirstName(user.name);

  const settings = {
    general: {
      primaryColor: '#5e72e4',
      secondaryColor: '#fb6340',
      fontFamily: 'Inter, sans-serif'
    },
    tooltip: {
      mode: 'START',
      text: 'Need help?'
    },
    header: {
      title: isStudent ? 'Wellness Support Chat' : 'Portal Support Chat',
      showAvatar: false
    },
    footer: {
      text: (
        <span className="support-chat__footer">
          This chat offers guidance and shortcuts. It is not monitored for emergencies.
        </span>
      )
    },
    notification: {
      disabled: true
    },
    chatHistory: {
      storageKey: `support-chat-${user.role}`
    },
    chatInput: {
      enabledPlaceholderText: 'Type your question or choose an option',
      botDelay: 300,
      blockSpam: true
    },
    chatWindow: {
      defaultOpen: false,
      showTypingIndicator: true
    },
    botBubble: {
      simulateStream: true,
      streamSpeed: 24
    }
  };

  const flow = {
    start: {
      message: `Hi ${firstName}, I can help you move around the portal and answer common questions.`,
      options: isStudent
        ? ['Book a session', 'View resources', 'See my appointments', 'Need urgent support']
        : ['View appointment requests', 'Manage availability', 'Review student responses', 'Need urgent support'],
      path: ({ userInput }) => {
        if (userInput === 'Need urgent support') {
          return 'urgentSupport';
        }

        if (isStudent) {
          if (userInput === 'Book a session') {
            return 'studentBook';
          }

          if (userInput === 'View resources') {
            return 'studentResources';
          }

          return 'studentAppointments';
        }

        if (userInput === 'View appointment requests') {
          return 'therapistRequests';
        }

        if (userInput === 'Manage availability') {
          return 'therapistAvailability';
        }

        return 'therapistResponses';
      }
    },
    studentBook: {
      message: 'I can take you to the booking page. You can choose a therapist, date, and time there.',
      function: () => navigate('/student/book'),
      path: 'followUp'
    },
    studentResources: {
      message: 'Opening the resources library. It includes articles, videos, and practical self-help tools.',
      function: () => navigate('/student/resources'),
      path: 'followUp'
    },
    studentAppointments: {
      message: 'Opening your appointments so you can review upcoming and past sessions.',
      function: () => navigate('/student/appointments'),
      path: 'followUp'
    },
    therapistRequests: {
      message: 'Opening appointment requests so you can approve or reject pending bookings.',
      function: () => navigate('/therapist/requests'),
      path: 'followUp'
    },
    therapistAvailability: {
      message: 'Opening availability management so you can update your schedule.',
      function: () => navigate('/therapist/availability'),
      path: 'followUp'
    },
    therapistResponses: {
      message: 'Opening student responses so you can review submitted wellbeing information.',
      function: () => navigate('/therapist/responses'),
      path: 'followUp'
    },
    urgentSupport: {
      message:
        'If someone may be in immediate danger, call your local emergency number now. If you are in the U.S. or Canada, call or text 988 for the Suicide & Crisis Lifeline.',
      options: ['Show wellness resources', 'Back to menu'],
      path: ({ userInput }) => (userInput === 'Show wellness resources' && isStudent ? 'studentResources' : 'start')
    },
    followUp: {
      message: isStudent
        ? 'Anything else? I can help with bookings, resources, appointments, or urgent support.'
        : 'Anything else? I can help with requests, availability, student responses, or urgent support.',
      options: isStudent
        ? ['Book a session', 'View resources', 'See my appointments', 'Need urgent support']
        : ['View appointment requests', 'Manage availability', 'Review student responses', 'Need urgent support'],
      path: 'start'
    }
  };

  return <ChatBot id={`support-chat-${user.role}`} settings={settings} flow={flow} />;
};

export default SupportChat;
