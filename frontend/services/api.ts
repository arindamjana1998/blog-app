import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
API.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle token expiration
API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
    } else {
        const message = error.response?.data?.message || 'Something went wrong';
        toast.error(message);
    }
    return Promise.reject(error);
});

export default API;
