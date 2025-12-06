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
        
        if (res) {
             // Assuming res contains the token (or we use the user data itself if no separate token)
             // The user said: "Un login para poder obtener mi usuario como en el front end" 
             
             // If the backend is simple, maybe it just returns the user.
             // But usually there's a token.
             // I'll assume res.token and res.user exist for now.
             
             const token = res.token || 'dummy-token'; 
             const user = res.user || res;

             setUserToken(token);
             setUserInfo(user);

             await SecureStore.setItemAsync('userToken', token);
             await SecureStore.setItemAsync('userInfo', JSON.stringify(user));
        }
    } catch (e) {
        console.log(`Login error ${e}`);
        throw e;
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
