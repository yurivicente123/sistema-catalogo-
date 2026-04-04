import axios from 'axios';

// Em produção, a API roda na mesma URL que o site. 
// Em desenvolvimento, usamos localhost:3001.
const API_BASE_URL = import.meta.env.MODE === 'production'
    ? '/api'
    : 'http://localhost:3001';

const API_FILE_URL = import.meta.env.MODE === 'production'
    ? ''
    : 'http://localhost:3001';

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const getProducts = () => api.get('/products');
export const addProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.post('/settings', data);

export { API_FILE_URL };
export default api;
