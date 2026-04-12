import axiosInstance from '../utiles/axiosInstance';

export const quizService = {
  getQuizzes: async () => {
    try {
      const response = await axiosInstance.get('/quizzes');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateQuiz: async (documentId) => {
    try {
      const response = await axiosInstance.post(`/quizzes/generate/document/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getQuizById: async (id) => {
    try {
      const response = await axiosInstance.get(`/quizzes/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  submitQuiz: async (id, answers) => {
    try {
      const response = await axiosInstance.post(`/quizzes/${id}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};