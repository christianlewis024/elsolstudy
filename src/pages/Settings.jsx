import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Settings.css';

const AVATAR_OPTIONS = [
  '🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦊', '🐱',
  '🐶', '🐰', '🦝', '🦉', '🐧', '🦜', '🦋', '🐙'
];

function Settings() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const [customDisplayName, setCustomDisplayName] = useState(
    userProfile?.customDisplayName || ''
  );
  const [selectedAvatar, setSelectedAvatar] = useState(
    userProfile?.selectedAvatar || null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveProfile = async () => {
    if (!currentUser) {
      setMessage('Please login to save your profile');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      await updateUserProfile({
        customDisplayName,
        selectedAvatar
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetProgress = () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all your progress? This action cannot be undone.'
    );

    if (confirmed) {
      localStorage.removeItem('elsolstudy_progress');
      setMessage('Progress reset successfully!');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>

        {currentUser ? (
          <div className="settings-section">
            <h2>Profile Settings</h2>

            <div className="form-group">
              <label>Email</label>
              <input
                type="text"
                value={userProfile?.email || ''}
                disabled
                className="input-disabled"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={customDisplayName}
                onChange={(e) => setCustomDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Choose an Avatar</label>
              <div className="avatar-grid">
                {AVATAR_OPTIONS.map((avatar) => (
                  <button
                    key={avatar}
                    className={`avatar-option ${
                      selectedAvatar === avatar ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>

            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>
        ) : (
          <div className="settings-section">
            <p className="login-prompt">
              Please login to customize your profile and sync your progress across devices.
            </p>
          </div>
        )}

        <div className="settings-section">
          <h2>Study Settings</h2>

          <div className="danger-zone">
            <h3>Reset Progress</h3>
            <p>
              This will delete all your local study progress. If you're logged in,
              your synced progress will remain in the cloud.
            </p>
            <button
              onClick={handleResetProgress}
              className="btn btn-danger"
            >
              Reset Local Progress
            </button>
          </div>
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <p>ElSol Study - Your adaptive flash card learning platform</p>
          <p className="version">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
