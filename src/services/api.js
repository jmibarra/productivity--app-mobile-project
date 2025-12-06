import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Adjust if backend expects different format
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/login', { email, password }); // Assuming /login endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks'); // Assuming /tasks endpoint
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default api;
