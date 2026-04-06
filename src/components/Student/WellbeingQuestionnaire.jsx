import React, { useEffect, useState } from 'react';
import { FaHeart, FaSmile, FaFrown, FaMeh, FaAngry } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { wellbeingApi, getErrorMessage } from '../../services/api';

const defaultQuestions = [
  { id: 1, text: 'How would you rate your overall mood today?' },
  { id: 2, text: 'Have you been feeling anxious or worried recently?' },
  { id: 3, text: 'How well have you been sleeping?' },
  { id: 4, text: 'How connected do you feel to others?' },
  { id: 5, text: 'How would you rate your stress levels?' }
];

const options = [
  { value: 1, label: 'Very Poor', icon: FaAngry, color: '#f5365c' },
  { value: 2, label: 'Poor', icon: FaFrown, color: '#fb6340' },
  { value: 3, label: 'Fair', icon: FaMeh, color: '#ffd600' },
  { value: 4, label: 'Good', icon: FaSmile, color: '#2dce89' },
  { value: 5, label: 'Excellent', icon: FaHeart, color: '#5e72e4' }
];

const WellbeingQuestionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [averageScore, setAverageScore] = useState(0);
  const [questionnaireId, setQuestionnaireId] = useState(null);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const { data } = await wellbeingApi.getQuestionnaires();
        if (data.length > 0) {
          setQuestionnaireId(data[0].questionnaire_id);
        }
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load questionnaire'));
      }
    };

    loadQuestionnaire();
  }, []);

  const handleAnswer = (questionId, value) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!questionnaireId) {
      toast.error('Questionnaire is not available yet');
      return;
    }

    if (Object.keys(answers).length !== defaultQuestions.length) {
      toast.error('Please answer all questions');
      return;
    }

    const responses = defaultQuestions.map((question) => ({
      questionId: question.id,
      answer: answers[question.id]
    }));

    try {
      const { data } = await wellbeingApi.submit({ questionnaireId, responses });
      setAverageScore(Number(data.averageScore || 0));
      setSubmitted(true);
      toast.success('Questionnaire submitted successfully');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to submit questionnaire'));
    }
  };

  if (submitted) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <FaHeart size={48} style={{ color: '#5e72e4', marginBottom: '1rem' }} />
        <h2>Thank You for Sharing</h2>
        <p style={{ color: '#666', marginTop: '1rem' }}>
          Your wellbeing score: {averageScore.toFixed(1)}/5
        </p>
        <p style={{ color: '#666' }}>
          Your responses have been recorded and are now available for your therapist to review.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>
          Take Another Assessment
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Wellbeing Check-in</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Take a moment to reflect on how you are feeling. Your responses help your therapist better understand and support you.
      </p>

      {defaultQuestions.map((question, index) => (
        <div key={question.id} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body">
            <h4 style={{ marginBottom: '1rem' }}>Q{index + 1}. {question.text}</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(question.id, option.value)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: answers[question.id] === option.value ? option.color : '#f8f9fe',
                    color: answers[question.id] === option.value ? 'white' : '#333',
                    border: '1px solid #e9ecef',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <option.icon size={24} />
                  <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}

      <button className="btn btn-primary btn-block" onClick={handleSubmit} style={{ padding: '1rem', fontSize: '1rem' }}>
        Submit Questionnaire
      </button>
    </div>
  );
};

export default WellbeingQuestionnaire;
