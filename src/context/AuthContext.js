import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
     checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const user = await SecureStore.getItemAsync('userInfo');
      if (token && user) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
        // Since we don't have the exact response structure from the user request, 
        // I will assume the standard response contains a token and user object.
        // We might need to adjust this based on the actual API response.
        const res = await loginUser(email, password);
        
        // Mocking structure if not clear. Adjust 'res.token' and 'res.user' based on actual API.
        // The user mentioned "simplemente una pantalla con los datos de ese usuario"
        
        // Let's assume the response IS the user object or contains it.
        // If the API returns { token: '...', user: { ... } }
        
        // For now, let's store the whole response as user info if token is separate,
        // or extract them. I'll stick to a common pattern.
        
        if (res && res.authentication && res.authentication.sessionToken) {
             const token = res.authentication.sessionToken;
             // We don't have user object in login response apparently, so we might need to fetch it or use a placeholder
             // For now let's store the token and use a placeholder user until we fetch the profile
             const user = { email }; // minimal user info

             setUserToken(token);
             setUserInfo(user);

             await SecureStore.setItemAsync('userToken', token);
             await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        } else {
            console.log('Invalid response structure:', res);
            throw new Error('Invalid response from server');
        }
    } catch (e) {
        console.log(`Login error details: ${e.message}`);
        if (e.response) {
            console.log('Response status:', e.response.status);
            console.log('Response data:', e.response.data);
            throw new Error(e.response.data.message || 'Login failed');
        } else if (e.request) {
            console.log('No response received (Network Error usually)');
            throw new Error('Network Error: Could not connect to server. Check your internet connection or server URL.');
        } else {
            throw e;
        }
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserInfo(null);
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userInfo');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ login, logout, isLoading, userToken, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};
