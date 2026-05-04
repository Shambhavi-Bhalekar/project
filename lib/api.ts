import axios, { AxiosInstance, AxiosError } from 'axios';

// ✅ Use ONE base URL for both (via ingress)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// ─── Shared interceptor factory ───────────────────────────────────────────────
function attachInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use((config) => {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (token) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete (config.headers as any)['Content-Type'];
    }

    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError<any>) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_email');
          localStorage.removeItem('user_id');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
}

// ✅ Posts API
export const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/posts`,
});

// ✅ Auth API
export const authApi: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/auth`,
});

attachInterceptors(api);
attachInterceptors(authApi);

export default api;
