import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <h1>Welcome to ElSol Study</h1>
        <p className="home-subtitle">
          Your personalized flash card learning platform
        </p>
        <div className="home-description">
          <p>
            Browse classes by grade and subject, study with adaptive flash cards,
            and track your progress as you learn.
          </p>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <h3>Adaptive Learning</h3>
          <p>
            Our spaced repetition algorithm adapts to your performance,
            showing you cards when you need them most.
          </p>
        </div>

        <div className="feature-card">
          <h3>Multiple Question Types</h3>
          <p>
            Practice with multiple choice, typed answers, or free recall
            to reinforce your learning in different ways.
          </p>
        </div>

        <div className="feature-card">
          <h3>Track Your Progress</h3>
          <p>
            Optional login lets you save your progress and continue
            learning across devices.
          </p>
        </div>
      </div>

      <div className="home-cta">
        <h2>Get Started</h2>
        <p>Browse classes from the sidebar to begin studying!</p>
      </div>
    </div>
  );
}

export default Home;
