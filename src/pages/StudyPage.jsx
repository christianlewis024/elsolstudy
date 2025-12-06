import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import './StudyPage.css';

function StudyPage() {
  const { bundleId } = useParams();
  const [bundle, setBundle] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchBundleAndCards();
  }, [bundleId]);

  useEffect(() => {
    if (!showAnswer) {
      setStartTime(Date.now());
    }
  }, [currentCardIndex, showAnswer]);

  const fetchBundleAndCards = async () => {
    try {
      // Fetch bundle
      const bundleRef = doc(db, 'flashcardBundles', bundleId);
      const bundleDoc = await getDoc(bundleRef);

      if (bundleDoc.exists()) {
        setBundle({ id: bundleDoc.id, ...bundleDoc.data() });
      }

      // Fetch cards
      const cardsRef = collection(db, 'flashcards');
      const q = query(
        cardsRef,
        where('bundleId', '==', bundleId),
        orderBy('order')
      );
      const snapshot = await getDocs(q);

      const cardsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCards(cardsData);
    } catch (error) {
      console.error('Error fetching study data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextCard = (correct, skipped = false) => {
    const responseTime = startTime ? (Date.now() - startTime) / 1000 : 0;

    // TODO: Save progress to local storage or Firebase
    // TODO: Update spaced repetition algorithm

    setShowAnswer(false);
    setUserAnswer('');

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Completed all cards
      alert('Great job! You have completed all cards in this set!');
      setCurrentCardIndex(0);
    }
  };

  const handleSkip = () => {
    handleNextCard(false, true);
  };

  if (loading) {
    return <div className="study-page loading">Loading study session...</div>;
  }

  if (!bundle || cards.length === 0) {
    return (
      <div className="study-page">
        <div className="no-cards">
          <h2>No cards available</h2>
          <p>This bundle doesn't have any flash cards yet.</p>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <div className="study-page">
      <div className="study-header">
        <h1>{bundle.title}</h1>
        <div className="study-progress">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
      </div>

      <div className="study-container">
        <div className="flashcard">
          <div className="card-question">
            <h2>{currentCard.question}</h2>
          </div>

          {!showAnswer ? (
            <div className="card-actions">
              {currentCard.questionType === 'typed' && (
                <div className="typed-answer">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer..."
                    className="answer-input"
                  />
                </div>
              )}

              {currentCard.questionType === 'multiple_choice' && (
                <div className="multiple-choice">
                  {currentCard.multipleChoiceOptions?.map((option, index) => (
                    <button
                      key={index}
                      className="choice-button"
                      onClick={() => {
                        setUserAnswer(option);
                        setShowAnswer(true);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              <div className="action-buttons">
                <button onClick={handleShowAnswer} className="btn btn-primary">
                  Show Answer
                </button>
                <button onClick={handleSkip} className="btn btn-secondary">
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="card-answer">
              <div className="answer-section">
                <h3>Answer:</h3>
                <p className="correct-answer">{currentCard.answer}</p>

                {userAnswer && currentCard.questionType === 'typed' && (
                  <div className="user-answer">
                    <strong>Your answer:</strong> {userAnswer}
                  </div>
                )}
              </div>

              <div className="feedback-buttons">
                <p>Did you get it right?</p>
                <button
                  onClick={() => handleNextCard(true)}
                  className="btn btn-success"
                >
                  Correct
                </button>
                <button
                  onClick={() => handleNextCard(false)}
                  className="btn btn-error"
                >
                  Incorrect
                </button>
              </div>
            </div>
          )}
        </div>

        {currentCard.targetTime && (
          <div className="target-time">
            Target time: {currentCard.targetTime} seconds
          </div>
        )}
      </div>
    </div>
  );
}

export default StudyPage;
