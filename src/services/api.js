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
      config.headers.Cookie = `PROD-APP-AUTH=${token}`; // Backend expects this cookie
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getTasks = async () => {
    try {
        const response = await api.get('/tasks');
        return response.data.tasks || []; 
    } catch (error) {
        throw error;
    }
}

export const getNotes = async () => {
    try {
        const response = await api.get('/notes');
        return response.data; // Adjust if backend wraps notes in object like tasks
    } catch (error) {
        throw error;
    }
}

export const getHabits = async () => {
    try {
        const response = await api.get('/habits');
        return response.data; // Adjust if backend wraps habits in object like tasks
    } catch (error) {
        throw error;
    }
}

export default api;
