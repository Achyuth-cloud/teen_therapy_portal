import React, { useEffect, useState } from 'react';
import { FaSearch, FaChartLine, FaBrain, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { wellbeingApi, getErrorMessage } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { wellbeingQuestionLabels } from '../../utils/wellbeingQuestions';

const StudentResponses = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentResponses, setStudentResponses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data } = await wellbeingApi.getLatestStudents();
        setStudents(data);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load student wellbeing responses'));
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    try {
      const { data } = await wellbeingApi.getStudentWellbeing(student.student_id);
      setStudentResponses(data);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load student response history'));
    }
  };

  const filteredStudents = students.filter((student) =>
    student.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const latestResponse = studentResponses[0];

  if (loading) {
    return <div className="card"><div className="card-body">Loading student responses...</div></div>;
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.875rem', marginBottom: '2rem' }}>Student Wellbeing Responses</h1>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div className="flex" style={{ gap: '1rem' }}>
              <h4>Students</h4>
              <div style={{ position: 'relative', flex: 1 }}>
                <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                <input type="text" placeholder="Search students..." className="form-control" style={{ paddingLeft: '2rem' }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {filteredStudents.map((student) => (
              <div
                key={student.student_id}
                onClick={() => handleSelectStudent(student)}
                style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', cursor: 'pointer', background: selectedStudent?.student_id === student.student_id ? '#eef2ff' : 'transparent' }}
              >
                <div className="flex-between">
                  <div>
                    <p style={{ fontWeight: 500 }}>{student.student_name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#666' }}>
                      <FaCalendarAlt style={{ marginRight: '0.25rem' }} />
                      Last response: {formatDate(student.last_response_date)}
                    </p>
                  </div>
                  <div style={{ background: Number(student.average_score) >= 3.5 ? '#e8f5e9' : Number(student.average_score) >= 2.5 ? '#fff0ed' : '#ffebee', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', color: Number(student.average_score) >= 3.5 ? '#2dce89' : Number(student.average_score) >= 2.5 ? '#fb6340' : '#f5365c' }}>
                    Score: {Number(student.average_score).toFixed(1)}/5
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
            {selectedStudent && latestResponse ? (
              <>
                <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedStudent.student_name}</h3>
                    <p style={{ color: '#666', fontSize: '0.875rem' }}>Student ID: {selectedStudent.student_id}</p>
                  </div>
                  <div style={{ background: '#eef2ff', padding: '0.5rem 1rem', borderRadius: '8px', textAlign: 'center' }}>
                    <FaBrain size={24} style={{ color: '#5e72e4' }} />
                    <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                      {Number(latestResponse.average_score).toFixed(1)}/5
                    </p>
                  </div>
                </div>

                <h4>Recent Responses</h4>
                {latestResponse.responses.map((response, index) => (
                  <div key={`${response.questionId}-${index}`} style={{ padding: '0.75rem', background: '#f8f9fe', borderRadius: '8px', marginBottom: '0.75rem' }}>
                    <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                      <strong>{wellbeingQuestionLabels[response.questionId] || `Question ${response.questionId}`}</strong>
                    </div>
                    <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
                      <div style={{ flex: 1, height: '8px', background: '#e9ecef', borderRadius: '4px' }}>
                        <div style={{ width: `${(response.answer / 5) * 100}%`, height: '100%', background: '#5e72e4', borderRadius: '4px' }} />
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
