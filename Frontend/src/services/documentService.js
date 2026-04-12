import axiosInstance from '../utiles/axiosInstance';

export const documentService = {
  getDocuments: async () => {
    try {
      const response = await axiosInstance.get('/documents');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  uploadDocument: async (formData) => {
    try {
      const response = await axiosInstance.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDocumentById: async (id) => {
    try {
      const response = await axiosInstance.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDocument: async (id) => {
    try {
      const response = await axiosInstance.delete(`/documents/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};