import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import ClassPage from './pages/ClassPage';
import StudyPage from './pages/StudyPage';
import TeacherDashboard from './pages/TeacherDashboard';
import ManageFlashCards from './pages/ManageFlashCards';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/class/:classId" element={<ClassPage />} />
                <Route path="/study/:bundleId" element={<StudyPage />} />
                <Route path="/settings" element={<Settings />} />

                {/* Protected teacher routes */}
                <Route
                  path="/teacher/dashboard"
                  element={
                    <ProtectedRoute requireAdmin>
                      <TeacherDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teacher/class/:classId/manage"
                  element={
                    <ProtectedRoute requireAdmin>
                      <ManageFlashCards />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
