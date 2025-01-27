import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error.response);
        return Promise.reject(error);
    }
);

export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (data) => apiClient.post('/auth', data);
export const getKey = () => apiClient.get('/auth');

export const fetchNotes = () => apiClient.get('/app/notes');
export const fetchBookmarks = () => apiClient.get('/app/bookmarks');
export const createNote = (note) => apiClient.post('/app/notes', note);
export const createBookmark = (bookmark) => apiClient.post('/app/bookmarks', bookmark);
export const updateNote = (id, note) => apiClient.put(`/app/notes/${id}`, note);
export const updateBookmark = (id, bookmark) => apiClient.put(`/app/bookmarks/${id}`, bookmark);
export const deleteNote = (id) => apiClient.delete(`/app/notes/${id}`);
export const deleteBookmark = (id) => apiClient.delete(`/app/bookmarks/${id}`);