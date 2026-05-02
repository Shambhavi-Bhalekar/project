import { authApi as api } from './api';

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export const authService = {

  // ✅ SIGNUP
  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signup', data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Signup error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ LOGIN (🔥 FIXED)
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', data);

      const { access_token, user } = response.data;

      // 🔥 CRITICAL FIX (store everything)
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_id', user.id);

      console.log("✅ Login success");
      console.log("Stored user_id:", user.id);

      return response.data;

    } catch (error: any) {
      console.error("❌ Login error:", error.response?.data || error.message);
      throw error;
    }
  },

  // ✅ LOGOUT
  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore backend logout errors
    } finally {
      authService.clearAuth();
      window.location.href = '/login';
    }
  },

  // ✅ STORE TOKEN (optional manual use)
  setToken: (token: string, email: string, userId: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_email', email);
    localStorage.setItem('user_id', userId);
  },

  // ✅ GETTERS
  getToken: (): string | null => {
    return typeof window !== 'undefined'
      ? localStorage.getItem('auth_token')
      : null;
  },

  getUserEmail: (): string | null => {
    return typeof window !== 'undefined'
      ? localStorage.getItem('user_email')
      : null;
  },

  getUserId: (): string | null => {
    return typeof window !== 'undefined'
      ? localStorage.getItem('user_id')
      : null;
  },

  // ✅ CHECK AUTH
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  // ✅ CLEAR AUTH
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_id');
    }
  },
};