// api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    withCredentials: true, // ✅ envia cookies automaticamente
});

// ✅ Interceptor para enviar o header X-XSRF-TOKEN a partir do cookie
api.interceptors.request.use((config) => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(match[1]);
    }
    return config;
});

export default api;
