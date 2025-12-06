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
  const [cardProgress, setCardProgress] = useState({});

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
      console.error('Error fetching study data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleDifficulty = (difficulty) => {
    const responseTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    const currentCard = cards[currentCardIndex];

    // Update card progress (expert meter)
    const currentProgress = cardProgress[currentCard.id] || 0;
    let newProgress = currentProgress;

    // Adjust progress based on difficulty
    if (difficulty === 'easy') {
      newProgress = Math.min(100, currentProgress + 20);
    } else if (difficulty === 'medium') {
      newProgress = Math.min(100, currentProgress + 10);
    } else if (difficulty === 'hard') {
      newProgress = Math.max(0, currentProgress - 10);
    }

    setCardProgress({
      ...cardProgress,
      [currentCard.id]: newProgress
    });

    // TODO: Save progress to local storage or Firebase with difficulty rating
    console.log('Card difficulty:', difficulty, 'Progress:', newProgress, 'Response time:', responseTime);

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
  const expertProgress = cardProgress[currentCard.id] || 0;

  return (
    <div className="study-page">
      <div className="study-header">
        <h1>{bundle.title}</h1>
        <div className="study-progress">
          Card {currentCardIndex + 1} of {cards.length}
        </div>
      </div>

      <div className="study-container">
        <div className="flashcard-wrapper">
          {/* Expert Meter */}
          <div className="expert-meter">
            <div className="expert-meter-label">Expert Level</div>
            <div className="expert-meter-bar">
              <div
                className="expert-meter-fill"
                style={{ height: `${expertProgress}%` }}
              >
                {expertProgress > 0 && <span className="expert-meter-text">{expertProgress}%</span>}
              </div>
            </div>
            <div className="expert-meter-levels">
              <span className="level-label">Beginner</span>
              <span className="level-label">Expert</span>
            </div>
          </div>

          {/* Flash Card */}
          <div className="flashcard">
            <div className="card-question">
              <h2>{currentCard.question}</h2>
            </div>

            {!showAnswer ? (
              <div className="card-actions">
                {/* Multiple Choice */}
                {currentCard.questionType === 'multiple_choice' && (
                  <div className="multiple-choice">
                    {currentCard.multipleChoiceOptions?.map((option, index) => (
                      <button
                        key={index}
                        className={`choice-button ${userAnswer === option ? 'selected' : ''}`}
                        onClick={() => setUserAnswer(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Typed Answer */}
                {currentCard.questionType === 'typed' && (
                  <div className="typed-answer">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer..."
                      className="answer-input"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim()) {
                          handleShowAnswer();
                        }
                      }}
                    />
                  </div>
                )}

                <button onClick={handleShowAnswer} className="btn btn-primary btn-large">
                  Show Answer
                </button>
              </div>
            ) : (
              <div className="card-answer">
                <div className="answer-section">
                  <h3>Answer:</h3>
                  <p className="correct-answer">{currentCard.answer}</p>

                  {userAnswer && (
                    <div className="user-answer-display">
                      <strong>Your answer:</strong>
                      <span className={userAnswer.toLowerCase().trim() === currentCard.answer.toLowerCase().trim() ? 'correct' : 'incorrect'}>
                        {userAnswer}
                      </span>
                    </div>
                  )}
                </div>

                <div className="difficulty-buttons">
                  <p className="difficulty-prompt">How difficult was this?</p>
                  <div className="difficulty-options">
                    <button
                      onClick={() => handleDifficulty('easy')}
                      className="btn btn-difficulty btn-easy"
                    >
                      😊 Easy
                    </button>
                    <button
                      onClick={() => handleDifficulty('medium')}
                      className="btn btn-difficulty btn-medium"
                    >
                      🤔 Medium
                    </button>
                    <button
                      onClick={() => handleDifficulty('hard')}
                      className="btn btn-difficulty btn-hard"
                    >
                      😅 Hard
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
