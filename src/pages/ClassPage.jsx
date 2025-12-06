import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import './ClassPage.css';

function ClassPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  const [classData, setClassData] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassData();
    fetchBundles();
  }, [classId]);

  const fetchClassData = async () => {
    try {
      const classRef = doc(db, 'classes', classId);
      const classDoc = await getDoc(classRef);

      if (classDoc.exists()) {
        setClassData({ id: classDoc.id, ...classDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };

  const fetchBundles = async () => {
    try {
      const bundlesRef = collection(db, 'flashcardBundles');
      const q = query(bundlesRef, where('classId', '==', classId));
      const snapshot = await getDocs(q);

      const bundlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by createdAt in JavaScript instead
      bundlesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBundles(bundlesData);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="class-page loading">Loading class...</div>;
  }

  if (!classData) {
    return (
      <div className="class-page">
        <div className="class-not-found">
          <h2>Class not found</h2>
          <Link to="/">Return to home</Link>
        </div>
      </div>
    );
  }

  const gradientStyle = classData.gradientColors
    ? {
        background: `linear-gradient(${classData.gradientColors.angle}deg, ${classData.gradientColors.color1}, ${classData.gradientColors.color2})`
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };

  return (
    <div className="class-page">
      <div className="class-header" style={gradientStyle}>
        <div className="class-header-content">
          <h1>{classData.teacherName}'s Class</h1>
          <div className="class-info">
            <span className="class-grade">{classData.grade} Grade</span>
            <span className="class-subject">{classData.subject}</span>
          </div>
        </div>
      </div>

      <div className="class-content">
        <div className="content-header">
          <h2>Study Materials</h2>
          {isAdmin && currentUser && classData.teacherId === currentUser.uid && (
            <button
              onClick={() => navigate(`/teacher/class/${classId}/manage`)}
              className="btn btn-primary"
            >
              Manage Flash Cards
            </button>
          )}
        </div>

        {bundles.length === 0 ? (
          <div className="no-bundles">
            <p>No study materials available yet.</p>
            {isAdmin && currentUser && classData.teacherId === currentUser.uid ? (
              <p>Click "Manage Flash Cards" to create your first bundle!</p>
            ) : (
              <p>Check back later for flash card sets!</p>
            )}
          </div>
        ) : (
          <div className="bundles-grid">
            {bundles.map(bundle => (
              <div key={bundle.id} className="bundle-card">
                <div className="bundle-header">
                  <h3>{bundle.title}</h3>
                  <span className="bundle-card-count">
                    {bundle.cardCount} {bundle.cardCount === 1 ? 'card' : 'cards'}
                  </span>
                </div>

                {bundle.description && (
                  <p className="bundle-description">{bundle.description}</p>
                )}

                {bundle.comments && (
                  <div className="bundle-comments">
                    <strong>Teacher's Notes:</strong>
                    <p>{bundle.comments}</p>
                  </div>
                )}

                {bundle.youtubeLinks && bundle.youtubeLinks.length > 0 && (
                  <div className="bundle-videos">
                    <strong>Helpful Videos:</strong>
                    <ul>
                      {bundle.youtubeLinks.map((video, index) => (
                        <li key={index}>
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {video.title || video.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link to={`/study/${bundle.id}`} className="study-button">
                  Start Studying
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassPage;
