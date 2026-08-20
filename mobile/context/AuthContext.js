import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { API_URL } from '../config';

const AUTH_API_URL = `${API_URL}/auth`;

export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserFromStorage = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const { data } = await axios.get(`${AUTH_API_URL}/profile`);
                    setUser(data);
                }
            } catch (error) {
                console.log('Failed to load user from storage', error);

                await SecureStore.deleteItemAsync('userToken');
            } finally {
                setIsLoading(false);
            }
        };

        loadUserFromStorage();
    }, []);

    const signIn = async (email, password) => {
        // Hna fin kanhdero m3a l backend
        const { data } = await axios.post(`${AUTH_API_URL}/login`, { email, password });
        setUser(data.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        await SecureStore.setItemAsync('userToken', data.token);
    };

    const signUp = async (userData) => {
        try {
            const { data } = await axios.post(`${AUTH_API_URL}/register`, userData);

            console.log("Response from backend (/register):", JSON.stringify(data, null, 2));

            console.log("Type of data.token is:", typeof data.token);

         
            setUser(data.user);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            await SecureStore.setItemAsync('userToken', data.token);

        } catch (error) {
          
            console.error("Sign Up Error:", error.message);
            throw error; 
        }
    };

    const signOut = async () => {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
        await SecureStore.deleteItemAsync('userToken');
    };
    const updateUserProfile = (newUserData) => {
        setUser(newUserData);
    };

     const refetchUser = async () => {
        // console.log("--> [AuthContext] Refetching user data...");
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const { data } = await axios.get(`${AUTH_API_URL}/profile`);
                
                setUser({ ...data }); 
                // console.log("--> [AuthContext] User data refetched. 2FA enabled:", data.two_factor_enabled);
            }
        
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUserProfile,refetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};