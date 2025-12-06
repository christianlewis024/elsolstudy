import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import './ManageFlashCards.css';

function ManageFlashCards() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();

  const [classData, setClassData] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // Form states
  const [bundleForm, setBundleForm] = useState({
    title: '',
    description: '',
    comments: '',
    youtubeLinks: []
  });

  const [cardForm, setCardForm] = useState({
    question: '',
    answer: '',
    questionType: 'free_answer',
    multipleChoiceOptions: ['', '', '', ''],
    targetTime: 30
  });

  const [youtubeInput, setYoutubeInput] = useState({ title: '', url: '' });

  useEffect(() => {
    fetchClassData();
    fetchBundles();
  }, [classId]);

  useEffect(() => {
    if (selectedBundle) {
      fetchCards(selectedBundle.id);
    }
  }, [selectedBundle]);

  const fetchClassData = async () => {
    try {
      const classRef = doc(db, 'classes', classId);
      const classDoc = await getDoc(classRef);
      if (classDoc.exists()) {
        setClassData({ id: classDoc.id, ...classDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching class:', error);
    }
  };

  const fetchBundles = async () => {
    try {
      console.log('Fetching bundles for classId:', classId);
      const bundlesRef = collection(db, 'flashcardBundles');
      const q = query(bundlesRef, where('classId', '==', classId));
      const snapshot = await getDocs(q);

      const bundlesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by createdAt in JavaScript instead
      bundlesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      console.log('Bundles found:', bundlesData.length, bundlesData);
      setBundles(bundlesData);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCards = async (bundleId) => {
    try {
      const cardsRef = collection(db, 'flashcards');
      const q = query(cardsRef, where('bundleId', '==', bundleId));
      const snapshot = await getDocs(q);

      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by order in JavaScript instead
      cardsData.sort((a, b) => (a.order || 0) - (b.order || 0));

      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const handleCreateBundle = async (e) => {
    e.preventDefault();

    try {
      const bundleData = {
        classId,
        teacherId: currentUser.uid,
        title: bundleForm.title,
        description: bundleForm.description,
        comments: bundleForm.comments,
        youtubeLinks: bundleForm.youtubeLinks,
        cardCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'flashcardBundles'), bundleData);

      setBundleForm({ title: '', description: '', comments: '', youtubeLinks: [] });
      setShowBundleModal(false);
      fetchBundles();
    } catch (error) {
      console.error('Error creating bundle:', error);
      alert('Error creating bundle. Please try again.');
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();

    if (!selectedBundle) {
      alert('Please select a bundle first');
      return;
    }

    try {
      if (editingCard) {
        // Update existing card
        const cardRef = doc(db, 'flashcards', editingCard.id);
        const cardData = {
          question: cardForm.question,
          answer: cardForm.answer,
          questionType: cardForm.questionType,
          multipleChoiceOptions: cardForm.questionType === 'multiple_choice' ? cardForm.multipleChoiceOptions : null,
          targetTime: cardForm.targetTime,
          updatedAt: new Date().toISOString()
        };

        await updateDoc(cardRef, cardData);
      } else {
        // Create new card
        const cardData = {
          bundleId: selectedBundle.id,
          classId,
          teacherId: currentUser.uid,
          question: cardForm.question,
          answer: cardForm.answer,
          questionType: cardForm.questionType,
          multipleChoiceOptions: cardForm.questionType === 'multiple_choice' ? cardForm.multipleChoiceOptions : null,
          targetTime: cardForm.targetTime,
          order: cards.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await addDoc(collection(db, 'flashcards'), cardData);

        // Update bundle card count
        const bundleRef = doc(db, 'flashcardBundles', selectedBundle.id);
        await updateDoc(bundleRef, {
          cardCount: cards.length + 1,
          updatedAt: new Date().toISOString()
        });
      }

      setCardForm({
        question: '',
        answer: '',
        questionType: 'free_answer',
        multipleChoiceOptions: ['', '', '', ''],
        targetTime: 30
      });
      setEditingCard(null);
      setShowCardModal(false);
      fetchCards(selectedBundle.id);
      fetchBundles();
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Error saving card. Please try again.');
    }
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardForm({
      question: card.question,
      answer: card.answer,
      questionType: card.questionType,
      multipleChoiceOptions: card.multipleChoiceOptions || ['', '', '', ''],
      targetTime: card.targetTime
    });
    setShowCardModal(true);
  };

  const handleDeleteBundle = async (bundleId) => {
    if (!window.confirm('Are you sure? This will delete all cards in this bundle.')) return;

    try {
      // Delete all cards in the bundle
      const cardsRef = collection(db, 'flashcards');
      const q = query(cardsRef, where('bundleId', '==', bundleId));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map(cardDoc => deleteDoc(doc(db, 'flashcards', cardDoc.id)));
      await Promise.all(deletePromises);

      // Delete the bundle
      await deleteDoc(doc(db, 'flashcardBundles', bundleId));

      if (selectedBundle?.id === bundleId) {
        setSelectedBundle(null);
        setCards([]);
      }

      fetchBundles();
    } catch (error) {
      console.error('Error deleting bundle:', error);
      alert('Error deleting bundle. Please try again.');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Are you sure you want to delete this card?')) return;

    try {
      await deleteDoc(doc(db, 'flashcards', cardId));

      // Update bundle card count
      const bundleRef = doc(db, 'flashcardBundles', selectedBundle.id);
      await updateDoc(bundleRef, {
        cardCount: cards.length - 1,
        updatedAt: new Date().toISOString()
      });

      fetchCards(selectedBundle.id);
      fetchBundles();
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('Error deleting card. Please try again.');
    }
  };

  const addYoutubeLink = () => {
    if (youtubeInput.url) {
      setBundleForm({
        ...bundleForm,
        youtubeLinks: [...bundleForm.youtubeLinks, { ...youtubeInput }]
      });
      setYoutubeInput({ title: '', url: '' });
    }
  };

  const removeYoutubeLink = (index) => {
    setBundleForm({
      ...bundleForm,
      youtubeLinks: bundleForm.youtubeLinks.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return <div className="manage-page loading">Loading...</div>;
  }

  if (!classData) {
    return <div className="manage-page">Class not found</div>;
  }

  // Check if user is the teacher of this class
  if (!isAdmin || !currentUser || classData.teacherId !== currentUser.uid) {
    return (
      <div className="manage-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You do not have permission to manage this class.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <div className="manage-header">
        <div>
          <h1>Manage Flash Cards</h1>
          <p className="class-name">{classData.grade} {classData.subject}</p>
        </div>
        <button onClick={() => navigate(`/class/${classId}`)} className="btn btn-secondary">
          Back to Class
        </button>
      </div>

      <div className="manage-content">
        <div className="bundles-section">
          <div className="section-header">
            <h2>Flash Card Bundles</h2>
            <button onClick={() => setShowBundleModal(true)} className="btn btn-primary">
              Create Bundle
            </button>
          </div>

          {bundles.length === 0 ? (
            <div className="empty-state">
              <p>No bundles yet. Create your first bundle!</p>
            </div>
          ) : (
            <div className="bundles-list">
              {bundles.map(bundle => (
                <div
                  key={bundle.id}
                  className={`bundle-item ${selectedBundle?.id === bundle.id ? 'active' : ''}`}
                  onClick={() => setSelectedBundle(bundle)}
                >
                  <div className="bundle-item-info">
                    <h3>{bundle.title}</h3>
                    <span className="card-count">{bundle.cardCount} cards</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBundle(bundle.id);
                    }}
                    className="btn-icon btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cards-section">
          {selectedBundle ? (
            <>
              <div className="section-header">
                <h2>{selectedBundle.title}</h2>
                <button onClick={() => setShowCardModal(true)} className="btn btn-primary">
                  Add Card
                </button>
              </div>

              <div className="bundle-details">
                {selectedBundle.description && <p><strong>Description:</strong> {selectedBundle.description}</p>}
                {selectedBundle.comments && <p><strong>Comments:</strong> {selectedBundle.comments}</p>}
              </div>

              {cards.length === 0 ? (
                <div className="empty-state">
                  <p>No cards yet. Add your first card!</p>
                </div>
              ) : (
                <div className="cards-list">
                  {cards.map((card, index) => (
                    <div key={card.id} className="card-item">
                      <div className="card-number">#{index + 1}</div>
                      <div className="card-content">
                        <div className="card-question">
                          <strong>Q:</strong> {card.question}
                        </div>
                        <div className="card-answer">
                          <strong>A:</strong> {card.answer}
                        </div>
                        <div className="card-meta">
                          <span className="card-type">{card.questionType.replace('_', ' ')}</span>
                          <span className="card-time">⏱️ {card.targetTime}s</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => handleEditCard(card)}
                          className="btn-icon btn-edit"
                          title="Edit card"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="btn-icon btn-danger"
                          title="Delete card"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>Select a bundle to view and manage its cards</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Bundle Modal */}
      {showBundleModal && (
        <div className="modal-overlay" onClick={() => setShowBundleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Flash Card Bundle</h2>
            <form onSubmit={handleCreateBundle}>
              <div className="form-group">
                <label>Bundle Title *</label>
                <input
                  type="text"
                  value={bundleForm.title}
                  onChange={(e) => setBundleForm({ ...bundleForm, title: e.target.value })}
                  placeholder="e.g., Chapter 5: Photosynthesis"
                  required
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                  placeholder="Brief description of this bundle..."
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Teacher's Notes/Comments</label>
                <textarea
                  value={bundleForm.comments}
                  onChange={(e) => setBundleForm({ ...bundleForm, comments: e.target.value })}
                  placeholder="Additional notes for students..."
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>YouTube Videos (Optional)</label>
                <div className="youtube-input-group">
                  <input
                    type="text"
                    value={youtubeInput.title}
                    onChange={(e) => setYoutubeInput({ ...youtubeInput, title: e.target.value })}
                    placeholder="Video title"
                    className="input-field"
                  />
                  <input
                    type="url"
                    value={youtubeInput.url}
                    onChange={(e) => setYoutubeInput({ ...youtubeInput, url: e.target.value })}
                    placeholder="YouTube URL"
                    className="input-field"
                  />
                  <button type="button" onClick={addYoutubeLink} className="btn btn-small">
                    Add
                  </button>
                </div>
                {bundleForm.youtubeLinks.length > 0 && (
                  <div className="youtube-links-list">
                    {bundleForm.youtubeLinks.map((link, index) => (
                      <div key={index} className="youtube-link-item">
                        <span>{link.title || link.url}</span>
                        <button type="button" onClick={() => removeYoutubeLink(index)} className="btn-remove">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">Create Bundle</button>
                <button type="button" onClick={() => setShowBundleModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Card Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => {
          setShowCardModal(false);
          setEditingCard(null);
        }}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCard ? 'Edit Flash Card' : `Add Flash Card to "${selectedBundle?.title}"`}</h2>
            <form onSubmit={handleSaveCard}>
              <div className="form-group">
                <label>Question *</label>
                <textarea
                  value={cardForm.question}
                  onChange={(e) => setCardForm({ ...cardForm, question: e.target.value })}
                  placeholder="Enter the question..."
                  required
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Answer *</label>
                <textarea
                  value={cardForm.answer}
                  onChange={(e) => setCardForm({ ...cardForm, answer: e.target.value })}
                  placeholder="Enter the correct answer..."
                  required
                  className="input-field"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Question Type *</label>
                <select
                  value={cardForm.questionType}
                  onChange={(e) => setCardForm({ ...cardForm, questionType: e.target.value })}
                  className="input-field"
                >
                  <option value="free_answer">Free Answer (Self-check)</option>
                  <option value="typed">Typed Answer (Must spell correctly)</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>

              {cardForm.questionType === 'multiple_choice' && (
                <div className="form-group">
                  <label>Multiple Choice Options *</label>
                  {cardForm.multipleChoiceOptions.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...cardForm.multipleChoiceOptions];
                        newOptions[index] = e.target.value;
                        setCardForm({ ...cardForm, multipleChoiceOptions: newOptions });
                      }}
                      placeholder={`Option ${index + 1}${index === 0 ? ' (Correct answer should be here too)' : ''}`}
                      required
                      className="input-field"
                      style={{ marginBottom: '0.5rem' }}
                    />
                  ))}
                  <small style={{ color: '#7f8c8d' }}>
                    Make sure the correct answer appears in one of these options
                  </small>
                </div>
              )}

              <div className="form-group">
                <label>Target Time (seconds)</label>
                <input
                  type="number"
                  value={cardForm.targetTime}
                  onChange={(e) => setCardForm({ ...cardForm, targetTime: parseInt(e.target.value) })}
                  min="5"
                  max="300"
                  className="input-field"
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCard ? 'Save Changes' : 'Add Card'}
                </button>
                <button type="button" onClick={() => {
                  setShowCardModal(false);
                  setEditingCard(null);
                }} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageFlashCards;
