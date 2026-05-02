import axios, { AxiosInstance, AxiosError } from 'axios';

// Posts Service → port 8002 locally, /api/posts in production (via Ingress)
const POSTS_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002';

// Auth Service → port 8001 locally, /api/auth in production (via Ingress)
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001';

// ─── Shared interceptor factory ───────────────────────────────────────────────
function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Let axios set multipart boundary automatically
    if (config.data instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<any>) => {
      if (error.response) {
        if (error.response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_id');
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

// ─── Posts API client ─────────────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: POSTS_URL,
  withCredentials: false,
});
attachInterceptors(api);

// ─── Auth API client ──────────────────────────────────────────────────────────
export const authApi: AxiosInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: false,
});
attachInterceptors(authApi);

export default api;