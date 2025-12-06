import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, userProfile, isAdmin, loginWithGoogle, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <h1>ElSol Study</h1>
          </Link>
        </div>

        <div className="navbar-right">
          {isAdmin && (
            <Link to="/teacher/dashboard" className="navbar-link teacher-link">
              My Classes
            </Link>
          )}

          <Link to="/settings" className="navbar-link">
            Settings
          </Link>

          {currentUser ? (
            <div className="user-menu">
              <div className="user-info">
                {userProfile?.selectedAvatar ? (
                  <div className="user-avatar-emoji">
                    {userProfile.selectedAvatar}
                  </div>
                ) : (
                  <div className="user-avatar-placeholder">
                    {(userProfile?.customDisplayName || userProfile?.displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="user-name">
                  {userProfile?.customDisplayName || userProfile?.displayName || 'User'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="btn btn-primary">
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
