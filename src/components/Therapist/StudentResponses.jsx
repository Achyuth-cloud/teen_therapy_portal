import React, { useState } from 'react';
import { FaSearch, FaChartLine, FaBrain, FaCalendarAlt } from 'react-icons/fa';

const StudentResponses = () => {
  const [students] = useState([
    {
      id: 101,
      name: 'Alex Thompson',
      wellbeingScore: 3.2,
      lastResponse: '2024-03-20',
      responses: [
        { question: 'Overall mood', answer: 3, trend: 'improving' },
        { question: 'Anxiety level', answer: 4, trend: 'stable' },
        { question: 'Sleep quality', answer: 2, trend: 'declining' }
      ]
    },
    {
      id: 102,
      name: 'Emma Watson',
      wellbeingScore: 2.8,
      lastResponse: '2024-03-19',
      responses: [
        { question: 'Overall mood', answer: 3, trend: 'stable' },
        { question: 'Anxiety level', answer: 4, trend: 'improving' },
        { question: 'Sleep quality', answer: 3, trend: 'improving' }
      ]
    },
    {
      id: 103,
      name: 'James Wilson',
      wellbeingScore: 3.5,
      lastResponse: '2024-03-21',
      responses: [
        { question: 'Overall mood', answer: 4, trend: 'improving' },
        { question: 'Anxiety level', answer: 3, trend: 'improving' },
        { question: 'Sleep quality', answer: 4, trend: 'stable' }
      ]
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Student Wellbeing Responses</h1>
      
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div className="flex" style={{ gap: '1rem' }}>
              <h4>Students</h4>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#aaa'
                }} />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="form-control"
                  style={{ paddingLeft: '2rem' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {filteredStudents.map(student => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e9ecef',
                  cursor: 'pointer',
                  background: selectedStudent?.id === student.id ? '#eef2ff' : 'transparent',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedStudent?.id !== student.id) {
                    e.currentTarget.style.background = '#f8f9fe';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedStudent?.id !== student.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div className="flex-between">
                  <div>
                    <p style={{ fontWeight: 500 }}>{student.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      <FaCalendarAlt style={{ marginRight: '0.25rem' }} />
                      Last response: {student.lastResponse}
                    </p>
                  </div>
                  <div style={{
                    background: student.wellbeingScore >= 3.5 ? '#e8f5e9' : student.wellbeingScore >= 2.5 ? '#fff0ed' : '#ffebee',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.875rem',
                    color: student.wellbeingScore >= 3.5 ? '#2dce89' : student.wellbeingScore >= 2.5 ? '#fb6340' : '#f5365c'
                  }}>
                    Score: {student.wellbeingScore}/5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h4>Wellbeing Details</h4>
          </div>
          <div className="card-body">
            {selectedStudent ? (
              <>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedStudent.name}</h3>
                    <p style={{ color: '#666', fontSize: '0.875rem' }}>Student ID: {selectedStudent.id}</p>
                  </div>
                  <div style={{
                    background: '#eef2ff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <FaBrain size={24} style={{ color: '#5e72e4' }} />
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {selectedStudent.wellbeingScore}/5
                    </p>
                  </div>
                </div>
                
                <h4>Recent Responses</h4>
                {selectedStudent.responses.map((response, index) => (
                  <div key={index} style={{
                    padding: '0.75rem',
                    background: '#f8f9fe',
                    borderRadius: '8px',
                    marginBottom: '0.75rem'
                  }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <strong>{response.question}</strong>
                      <span style={{
                        color: response.trend === 'improving' ? '#2dce89' : response.trend === 'declining' ? '#f5365c' : '#ffd600'
                      }}>
                        {response.trend === 'improving' ? '↑' : response.trend === 'declining' ? '↓' : '→'}
                      </span>
                    </div>
                    <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                        <div style={{
                          width: `${(response.answer / 5) * 100}%`,
                          height: '100%',
                          background: '#5e72e4',
                          borderRadius: '4px'
                        }} />
                      </div>
                      <span>{response.answer}/5</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <FaChartLine size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>Select a student to view their wellbeing responses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResponses;