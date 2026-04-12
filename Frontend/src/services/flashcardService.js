import axiosInstance from '../utiles/axiosInstance';

export const flashcardService = {
  getFlashcards: async () => {
    try {
      const response = await axiosInstance.get('/flashcards');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  generateFlashcards: async (documentId) => {
    try {
      const response = await axiosInstance.post(`/flashcards/generate/${documentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getFlashcardById: async (id) => {
    try {
      const response = await axiosInstance.get(`/flashcards/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateFlashcardProgress: async (id, progress) => {
    try {
      const response = await axiosInstance.put(`/flashcards/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};