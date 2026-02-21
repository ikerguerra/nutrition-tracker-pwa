import axios from 'axios';
import authService from './authService';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getCurrentToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors and Network Errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response && (error.code === 'ERR_NETWORK' || error.message === 'Network Error')) {
            const config = error.config;
            if (config.method !== 'get') {
                const queue = JSON.parse(localStorage.getItem('offlineMutationQueue') || '[]');
                queue.push({
                    url: config.url,
                    method: config.method,
                    data: config.data,
                    headers: config.headers
                });
                localStorage.setItem('offlineMutationQueue', JSON.stringify(queue));
                console.log('Request queued for offline sync');
                // Return a fake successful response so the UI doesn't crash, 
                // but the user is informed via the OfflineBanner.
                return Promise.resolve({ data: { offlineQueue: true } });
            }
        }

        if (error.response?.status === 401) {
            // Token expired or invalid, clear auth and redirect to login
            authService.logout();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

if (typeof window !== 'undefined') {
    window.addEventListener('online', async () => {
        const queue = JSON.parse(localStorage.getItem('offlineMutationQueue') || '[]');
        if (queue.length > 0) {
            localStorage.removeItem('offlineMutationQueue');
            console.log(`Syncing ${queue.length} offline mutations...`);
            for (const req of queue) {
                try {
                    await axios({
                        ...req,
                        baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'
                    });
                } catch (e) {
                    console.error('Failed to sync queued request', e);
                }
            }
        }
    });
}

export default apiClient;
