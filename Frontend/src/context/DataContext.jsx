import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utiles/axiosInstance';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  const [documents, setDocuments] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetched, setIsFetched] = useState(false);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const [docsRes, flashRes, quizRes] = await Promise.all([
        axiosInstance.get('/documents').catch(() => ({ data: [] })),
        axiosInstance.get('/flashcards').catch(() => ({ data: [] })),
        axiosInstance.get('/quizzes').catch(() => ({ data: [] }))
      ]);
      
      setDocuments(docsRes.data || []);
      setFlashcards(flashRes.data || []);
      setQuizzes(quizRes.data || []);
      setIsFetched(true);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isFetched) {
      fetchData();
    } else if (!isAuthenticated) {
      // Clear data on logout
      setDocuments([]);
      setFlashcards([]);
      setQuizzes([]);
      setIsFetched(false);
    }
  }, [isAuthenticated, isFetched]);

  // Methods to update state after mutations (so we don't have to refetch everything)
  const addDocument = (doc) => setDocuments(prev => [doc, ...prev]);
  const removeDocument = (id) => setDocuments(prev => prev.filter(d => d._id !== id));
  
  const addFlashcards = (newCards) => setFlashcards(prev => [...newCards, ...prev]);
  const removeFlashcardsByDocument = (docId) => setFlashcards(prev => prev.filter(f => f.document !== docId));
  
  const addQuiz = (quiz) => setQuizzes(prev => [quiz, ...prev]);
  const removeQuizzesByDocument = (docId) => setQuizzes(prev => prev.filter(q => q.document !== docId));
  
  const refreshData = () => {
    setIsFetched(false);
  };

  const value = {
    documents,
    setDocuments,
    flashcards,
    setFlashcards,
    quizzes,
    setQuizzes,
    isLoading,
    isFetched,
    addDocument,
    removeDocument,
    addFlashcards,
    removeFlashcardsByDocument,
    addQuiz,
    removeQuizzesByDocument,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
