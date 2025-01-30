import { createContext, useState, useContext, useEffect } from 'react';
import {login, register, getKey, apiClient, refreshTokens} from '../services/api';
import { tokenStorage } from '../localStorage/tokenStorage';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

const encryptPassword = (password, base64Key) => {
    const key = CryptoJS.enc.Base64.parse(base64Key);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    const ivAndEncrypted = CryptoJS.lib.WordArray.create()
        .concat(iv)
        .concat(encrypted.ciphertext);

    return CryptoJS.enc.Base64.stringify(ivAndEncrypted);
};

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [, setEncryptionKey] = useState(null);

    // Настройка перехватчика axios для обработки токенов
    useEffect(() => {
        if (!user?.username) return;

        const requestInterceptor = apiClient.interceptors.request.use(
            (config) => {
                const accessToken = tokenStorage.getToken(user.username, 'access_token');
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry && user?.username) {
                    originalRequest._retry = true;

                    try {
                        const refreshToken = tokenStorage.getToken(user.username, 'refresh_token');
                        if (!refreshToken) {
                            throw new Error('No refresh token available');
                        }

                        const response = await refreshTokens(refreshToken);
                        const { accessToken, refreshToken: newRefreshToken, expiresIn } = response.data;

                        tokenStorage.setToken(user.username, 'access_token', accessToken, expiresIn.access);
                        if (newRefreshToken) {
                            tokenStorage.setToken(user.username, 'refresh_token', newRefreshToken, expiresIn.refresh);
                        }

                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return apiClient(originalRequest);
                    } catch (refreshError) {
                        logoutUser();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(requestInterceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, [user?.username]);

    const getEncryptionKey = async () => {
        try {
            const response = await getKey();
            const key = response.data.key;
            setEncryptionKey(key);
            return key;
        } catch (error) {
            console.error('Failed to get key:', error);
            throw error;
        }
    };

    const registerUser = async (credentials) => {
        try {
            const key = await getEncryptionKey();
            const encryptedPassword = encryptPassword(credentials.password, key);

            const response = await register({
                username: credentials.username,
                password: encryptedPassword,
                key: key
            });

            const { username, accessToken, refreshToken, expiresIn } = response.data;

            tokenStorage.setToken(username, 'access_token', accessToken, expiresIn.access);
            tokenStorage.setToken(username, 'refresh_token', refreshToken, expiresIn.refresh);

            setUser({username: username});
            return response.data;
        } catch (error) {
            console.error('Registration error:', error);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const loginUser = async (credentials) => {
        try {
            const key = await getEncryptionKey();
            const encryptedPassword = encryptPassword(credentials.password, key);

            const response = await login({
                username: credentials.username,
                password: encryptedPassword,
                key: key
            });

            const { access_token, refresh_token, expiresIn } = response.data;
            const username = credentials.username;

            if (!access_token || !refresh_token) {
                console.error('Missing tokens in server response');
                throw new Error('Invalid server response - missing authentication tokens');
            }

            // Store tokens
            tokenStorage.setToken(username, 'access_token', access_token, expiresIn.access);
            tokenStorage.setToken(username, 'refresh_token', refresh_token, expiresIn.refresh);

            // Verify storage
            const storedAccessToken = tokenStorage.getToken(username, 'access_token');
            console.log('Token storage verification:', {
                accessTokenStored: !!storedAccessToken,
                username
            });

            // Update user state
            setUser({username: username});

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logoutUser = () => {
        if (user?.username) {
            tokenStorage.clearUserTokens(user.username);
        }
        setUser(null);
    };

    const value = {
        user,
        registerUser,
        loginUser,
        logoutUser,
        getEncryptionKey,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};