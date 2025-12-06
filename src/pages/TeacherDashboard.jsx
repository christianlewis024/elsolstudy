import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { GRADE_LEVELS, SUBJECTS, ELEMENTARY_GRADES, ELEMENTARY_SUBJECT } from '../constants/options';
import './TeacherDashboard.css';

function TeacherDashboard() {
  const { currentUser, userProfile } = useAuth();
  const [myClasses, setMyClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateClass, setShowCreateClass] = useState(false);
  const [newClass, setNewClass] = useState({
    grade: '',
    subject: '',
    color1: '#667eea',
    color2: '#764ba2',
    angle: 135
  });
  const [gradeSearch, setGradeSearch] = useState('');
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchMyClasses();
    }
  }, [currentUser]);

  const fetchMyClasses = async () => {
    try {
      const classesRef = collection(db, 'classes');
      const q = query(classesRef, where('teacherId', '==', currentUser.uid));
      const snapshot = await getDocs(q);

      const classesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setMyClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSelect = (grade) => {
    setNewClass({ ...newClass, grade: grade.value });
    setGradeSearch(grade.label);
    setShowGradeDropdown(false);

    // Auto-set subject for elementary grades
    if (ELEMENTARY_GRADES.includes(grade.value)) {
      setNewClass({ ...newClass, grade: grade.value, subject: ELEMENTARY_SUBJECT });
      setSubjectSearch(ELEMENTARY_SUBJECT);
    } else {
      setNewClass({ ...newClass, grade: grade.value, subject: '' });
      setSubjectSearch('');
    }
  };

  const handleSubjectSelect = (subject) => {
    setNewClass({ ...newClass, subject: subject.value });
    setSubjectSearch(subject.label);
    setShowSubjectDropdown(false);
  };

  const filteredGrades = GRADE_LEVELS.filter(grade =>
    grade.label.toLowerCase().includes(gradeSearch.toLowerCase())
  );

  const filteredSubjects = SUBJECTS.filter(subject =>
    subject.label.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  const isElementaryGrade = ELEMENTARY_GRADES.includes(newClass.grade);

  const handleCreateClass = async (e) => {
    e.preventDefault();

    if (!newClass.grade) {
      alert('Please select a grade level');
      return;
    }

    if (!newClass.subject) {
      alert('Please select a subject');
      return;
    }

    try {
      const classData = {
        teacherId: currentUser.uid,
        teacherName: userProfile?.customDisplayName || userProfile?.displayName || 'Teacher',
        grade: newClass.grade,
        subject: newClass.subject,
        gradientColors: {
          color1: newClass.color1,
          color2: newClass.color2,
          angle: newClass.angle
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'classes'), classData);

      setNewClass({
        grade: '',
        subject: '',
        color1: '#667eea',
        color2: '#764ba2',
        angle: 135
      });
      setGradeSearch('');
      setSubjectSearch('');
      setShowCreateClass(false);
      fetchMyClasses();
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Error creating class. Please try again.');
    }
  };

  const handleDeleteClass = async (classId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this class? This will also delete all associated flash card bundles and cards.'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'classes', classId));
      fetchMyClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error deleting class. Please try again.');
    }
  };

  if (loading) {
    return <div className="teacher-dashboard loading">Loading dashboard...</div>;
  }

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>My Classes</h1>
        <button
          onClick={() => setShowCreateClass(true)}
          className="btn btn-primary"
        >
          Create New Class
        </button>
      </div>

      {showCreateClass && (
        <div className="modal-overlay" onClick={() => setShowCreateClass(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Class</h2>
            <form onSubmit={handleCreateClass}>
              <div className="form-group">
                <label>Grade Level</label>
                <div className="searchable-dropdown">
                  <input
                    type="text"
                    value={gradeSearch}
                    onChange={(e) => {
                      setGradeSearch(e.target.value);
                      setShowGradeDropdown(true);
                    }}
                    onFocus={() => setShowGradeDropdown(true)}
                    placeholder="Search or select grade..."
                    className="input-field"
                  />
                  {showGradeDropdown && (
                    <div className="dropdown-menu">
                      {filteredGrades.map((grade) => (
                        <div
                          key={grade.value}
                          className="dropdown-item"
                          onClick={() => handleGradeSelect(grade)}
                        >
                          {grade.label}
                        </div>
                      ))}
                      {filteredGrades.length === 0 && (
                        <div className="dropdown-item disabled">No grades found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Subject {isElementaryGrade && <span className="label-note">(Auto-set for K-5th)</span>}</label>
                <div className="searchable-dropdown">
                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => {
                      setSubjectSearch(e.target.value);
                      setShowSubjectDropdown(true);
                    }}
                    onFocus={() => setShowSubjectDropdown(true)}
                    placeholder={isElementaryGrade ? "General Education (auto-set)" : "Search or select subject..."}
                    className="input-field"
                    disabled={isElementaryGrade}
                  />
                  {showSubjectDropdown && !isElementaryGrade && (
                    <div className="dropdown-menu">
                      {filteredSubjects.map((subject) => (
                        <div
                          key={subject.value}
                          className="dropdown-item"
                          onClick={() => handleSubjectSelect(subject)}
                        >
                          <div className="dropdown-item-label">{subject.label}</div>
                          <div className="dropdown-item-category">{subject.category}</div>
                        </div>
                      ))}
                      {filteredSubjects.length === 0 && (
                        <div className="dropdown-item disabled">No subjects found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Gradient Colors</label>
                <div className="color-picker-group">
                  <div className="color-input">
                    <label>Color 1</label>
                    <input
                      type="color"
                      value={newClass.color1}
                      onChange={(e) => setNewClass({ ...newClass, color1: e.target.value })}
                    />
                  </div>
                  <div className="color-input">
                    <label>Color 2</label>
                    <input
                      type="color"
                      value={newClass.color2}
                      onChange={(e) => setNewClass({ ...newClass, color2: e.target.value })}
                    />
                  </div>
                  <div className="color-input">
                    <label>Angle: {newClass.angle}°</label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={newClass.angle}
                      onChange={(e) => setNewClass({ ...newClass, angle: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div
                  className="gradient-preview"
                  style={{
                    background: `linear-gradient(${newClass.angle}deg, ${newClass.color1}, ${newClass.color2})`
                  }}
                >
                  Preview
                </div>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Create Class
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateClass(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="classes-grid">
        {myClasses.length === 0 ? (
          <div className="no-classes">
            <p>You haven't created any classes yet.</p>
            <p>Click "Create New Class" to get started!</p>
          </div>
        ) : (
          myClasses.map((classItem) => (
            <div key={classItem.id} className="class-card">
              <div
                className="class-card-header"
                style={{
                  background: `linear-gradient(${classItem.gradientColors.angle}deg, ${classItem.gradientColors.color1}, ${classItem.gradientColors.color2})`
                }}
              >
                <h3>{classItem.grade} Grade</h3>
                <h2>{classItem.subject}</h2>
              </div>
              <div className="class-card-body">
                <p className="class-teacher">{classItem.teacherName}</p>
                <div className="class-card-actions">
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => window.location.href = `/class/${classItem.id}`}
                  >
                    View Class
                  </button>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() => handleDeleteClass(classItem.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
