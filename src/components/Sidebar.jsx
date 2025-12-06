import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import './Sidebar.css';

function Sidebar() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedGrades, setExpandedGrades] = useState({});
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const classesRef = collection(db, 'classes');
      const q = query(classesRef, orderBy('grade'), orderBy('subject'));
      const snapshot = await getDocs(q);

      const classesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Organize classes by grade -> subject -> teacher
  const organizedClasses = classes.reduce((acc, classItem) => {
    const { grade, subject } = classItem;

    if (!acc[grade]) {
      acc[grade] = {};
    }

    if (!acc[grade][subject]) {
      acc[grade][subject] = [];
    }

    acc[grade][subject].push(classItem);

    return acc;
  }, {});

  const toggleGrade = (grade) => {
    setExpandedGrades(prev => ({
      ...prev,
      [grade]: !prev[grade]
    }));
  };

  const toggleSubject = (grade, subject) => {
    const key = `${grade}-${subject}`;
    setExpandedSubjects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Browse Classes</h2>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <div className="sidebar-loading">Loading...</div>
      </aside>
    );
  }

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Browse Classes</h2>
        <button onClick={toggleSidebar} className="sidebar-toggle">
          {isSidebarOpen ? '◀' : '▶'}
        </button>
      </div>

      {isSidebarOpen && (
        <div className="sidebar-content">
          {Object.keys(organizedClasses).length === 0 ? (
            <div className="sidebar-empty">
              <p>No classes available yet.</p>
              <p>Check back soon!</p>
            </div>
          ) : (
            <div className="grade-list">
              {Object.keys(organizedClasses).sort().map(grade => (
                <div key={grade} className="grade-item">
                  <button
                    className="grade-header"
                    onClick={() => toggleGrade(grade)}
                  >
                    <span className="expand-icon">
                      {expandedGrades[grade] ? '▼' : '▶'}
                    </span>
                    <span className="grade-name">{grade} Grade</span>
                  </button>

                  {expandedGrades[grade] && (
                    <div className="subject-list">
                      {Object.keys(organizedClasses[grade]).sort().map(subject => (
                        <div key={subject} className="subject-item">
                          <button
                            className="subject-header"
                            onClick={() => toggleSubject(grade, subject)}
                          >
                            <span className="expand-icon">
                              {expandedSubjects[`${grade}-${subject}`] ? '▼' : '▶'}
                            </span>
                            <span className="subject-name">{subject}</span>
                          </button>

                          {expandedSubjects[`${grade}-${subject}`] && (
                            <div className="teacher-list">
                              {organizedClasses[grade][subject].map(classItem => (
                                <Link
                                  key={classItem.id}
                                  to={`/class/${classItem.id}`}
                                  className="teacher-link"
                                >
                                  {classItem.teacherName}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
