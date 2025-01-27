import { createContext, useState, useContext, useEffect } from 'react';
import { login, register, getKey, apiClient } from '../services/api';
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
  const [encryptionKey, setEncryptionKey] = useState(null);
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('tokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });

  // Set up axios interceptor for token handling
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
        (config) => {
          if (tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
    );

    const responseInterceptor = apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // If error is 401 and we haven't tried to refresh token yet
          if (error.response?.status === 401 && !originalRequest._retry && tokens?.refreshToken) {
            originalRequest._retry = true;

            try {
              // Request new access token using refresh token
              const response = await apiClient.post('/auth/refresh', {
                refreshToken: tokens.refreshToken
              });

              const newTokens = {
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
              };

              // Update tokens in state and localStorage
              setTokens(newTokens);
              localStorage.setItem('tokens', JSON.stringify(newTokens));

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return apiClient(originalRequest);
            } catch (refreshError) {
              // If refresh token is invalid, log out user
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
  }, [tokens]);

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

      const { user: userData, accessToken, refreshToken } = response.data;

      setUser(userData);
      setTokens({ accessToken, refreshToken });
      localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));

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

      const { user: userData, accessToken, refreshToken } = response.data;

      setUser(userData);
      setTokens({ accessToken, refreshToken });
      localStorage.setItem('tokens', JSON.stringify({ accessToken, refreshToken }));

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('tokens');
  };

  const value = {
    user,
    tokens,
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