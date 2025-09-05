import { AuthResponse } from '@/services/api';

export const TOKEN_KEY = 'authToken';
export const USER_KEY = 'authUser';

export interface StoredUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

export const authStorage = {
  setAuth: (authResponse: AuthResponse) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, authResponse.token);
      localStorage.setItem(USER_KEY, JSON.stringify({
        id: authResponse.id,
        username: authResponse.username,
        email: authResponse.email,
        role: authResponse.role,
      }));
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  getUser: (): StoredUser | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  isAuthenticated: (): boolean => {
    return !!authStorage.getToken();
  },
};

// JWT token utilities
export const tokenUtils = {
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  getTokenPayload: (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};
