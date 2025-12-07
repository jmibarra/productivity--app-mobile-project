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

export const getTasks = async (page = 1, limit = 10, sortBy = 'createdAt', sortDirection = 'desc') => {
    try {
        const response = await api.get(`/tasks?page=${page}&limit=${limit}&sortBy=${sortBy}&sortDirection=${sortDirection}`);
        // Backend returns { tasks: [...], count: N }
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const getNotes = async () => {
    try {
        const response = await api.get('/notes');
        return response.data; 
    } catch (error) {
        throw error;
    }
}

export const getHabits = async () => {
    try {
        const response = await api.get('/habits');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createTask = async (taskData) => {
    try {
        const response = await api.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateTask = async (id, updates) => {
    try {
        const response = await api.patch(`/tasks/${id}`, updates);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export default api;
