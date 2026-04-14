const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
  login: `${API_BASE_URL}/auth/login`,
  signup: `${API_BASE_URL}/auth/signup`,
};

export default API_BASE_URL;