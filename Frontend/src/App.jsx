import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import NotFoundPage from './pages/NotFoundPage';
import LoginPages from './pages/Auth/LoginPages';
import RegisterPages from './pages/Auth/RegisterPages';
import ProtectedRoute from './components/ProtectedRoute';

// Stub imports for nested routes if they don't exist yet, to prevent app crash
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
const DocumentDetailPage = () => <div>Document Detail</div>;
import FlashcardsListPage from './pages/Flashcards/FlashcardListPage';
import FlashcardStudyPage from './pages/Flashcards/FlashcardStudyPage';
import { QuizTakePage } from './pages/Quizes/QuizTakePage';
import { QuizResultpage as QuizResultPage } from './pages/Quizes/QuizResultpage';
import QuizListPage from './pages/Quizes/QuizListPage';
import ProfilePage from './pages/Profile/ProfilePage';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="/login" element={<LoginPages />} />
          <Route path="/register" element={<RegisterPages />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/flashcards/:documentId" element={<FlashcardStudyPage />} />
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>




        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;