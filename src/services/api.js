import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

const responseTypes = {
    AUTH: {
        accessToken: '',
        refreshToken: '',
        expiresIn: {
            access: 900,
            refresh: 2592000
        }
    }
};

apiClient.interceptors.response.use(
    response => response,
    error => {
        const errorResponse = {
            message: error.response?.data?.message || 'An unknown error occurred',
            status: error.response?.status,
            code: error.response?.data?.code,
        };

        console.error('API Error:', errorResponse);
        return Promise.reject(errorResponse);
    }
);

apiClient.interceptors.request.use(
    async (config) => {
        if (config.url.includes('/auth/refresh')) {
            const refreshToken = config.refreshToken;
            config.headers.Authorization = `Bearer ${refreshToken}`;
            delete config.refreshToken;
        }
        return config;
    },
    error => Promise.reject(error)
);

export const login = (credentials) =>
    apiClient.post('/auth/login', credentials)
        .then(response => {
            console.log('Raw server response:', response.data);  // Let's see what the server actually sends
            return {
                ...response,
                data: {
                    ...responseTypes.AUTH,  // This provides default values
                    ...response.data,       // This should override with actual server data
                    username: credentials.username
                }
            };
        });

export const register = (data) =>
    apiClient.post('/auth', data)
        .then(response => ({
            ...response,
            data: {
                ...responseTypes.AUTH,
                ...response.data,
                username: data.username
            }
        }));

export const refreshTokens = (refreshToken) =>
    apiClient({
        method: 'post',
        url: '/auth/refresh',
        refreshToken: refreshToken
    });

export const getKey = () => apiClient.get('/auth');

export const fetchNotes = () => apiClient.get('/app/notes');
export const fetchBookmarks = () => apiClient.get('/app/bookmarks');
export const createNote = (note) => apiClient.post('/app/notes', note);
export const createBookmark = (bookmark) => apiClient.post('/app/bookmarks', bookmark);
export const updateNote = (id, note) => apiClient.put(`/app/notes/${id}`, note);
export const updateBookmark = (id, bookmark) => apiClient.put(`/app/bookmarks/${id}`, bookmark);
export const deleteNote = (id) => apiClient.delete(`/app/notes/${id}`);
export const deleteBookmark = (id) => apiClient.delete(`/app/bookmarks/${id}`);