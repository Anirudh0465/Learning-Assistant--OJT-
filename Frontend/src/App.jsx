import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import LoginPages from './pages/Auth/LoginPages';
import RegisterPages from './pages/Auth/RegisterPages';

const App = () => {
  const isAuthenticated = true;
  const loading = false;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace />: <Navigate to="/login" replace />}
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