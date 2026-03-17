import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import LoginPages from './pages/Auth/LoginPages';
import RegisterPages from './pages/Auth/RegisterPages';
import ProtectedRoute from './components/ProtectedRoute';

// Stub imports for nested routes if they don't exist yet, to prevent app crash
import DashboardPage from './pages/Dashboard/DashboardPage';
const DocumentListPage = () => <div>Documents List</div>;
const DocumentDetailPage = () => <div>Document Detail</div>;
const FlashcardsListPage = () => <div>Flashcards List</div>;
const FlashcardPage = () => <div>Flashcard</div>;
const QuizTakePage = () => <div>Quiz Take</div>;
const QuizResultPage = () => <div>Quiz Result</div>;
const ProfilePage = () => <div>Profile</div>;

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPages />} />
        <Route path="/register" element={<RegisterPages />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardsListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>




        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;