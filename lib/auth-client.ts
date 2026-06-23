// lib/auth-client.ts
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
authClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user_id: number;
    email: string;
    verification_code: string;
    expires_at: string;
    expires_in_seconds: number;
  };
}

export interface VerifyCodePayload {
  user_id: number;
  verification_code: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
    };
  };
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface SigninResponse {
  success: boolean;
  message: string;
  data: {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    user?: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
    };
    user_id?: number;
    email?: string;
    verification_code?: string;
    expires_in_seconds?: number;
    verification_required?: boolean;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface CurrentUserResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
  };
}

export const authAPI = {
  // Sign up new user
  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const response = await authClient.post<SignupResponse>("/auth/signup", payload);
    return response.data;
  },

  // Verify OTP code
  verifyCode: async (payload: VerifyCodePayload): Promise<VerifyCodeResponse> => {
    const response = await authClient.post<VerifyCodeResponse>("/auth/verify-code", payload);
    if (response.data.success && response.data.data.access_token) {
      localStorage.setItem("auth_token", response.data.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Sign in existing user
  signin: async (payload: SigninPayload): Promise<SigninResponse> => {
    const response = await authClient.post<SigninResponse>("/auth/signin", payload);
    
    // If verification required, just return (user needs to verify OTP)
    if (response.data.data.verification_required) {
      return response.data;
    }

    // If login successful with token, store it
    if (response.data.success && response.data.data.access_token) {
      localStorage.setItem("auth_token", response.data.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Log out
  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await authClient.post<LogoutResponse>("/auth/logout");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      // Even if request fails, clear local storage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<CurrentUserResponse> => {
    const response = await authClient.get<CurrentUserResponse>("/auth/me");
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("auth_token");
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("auth_token");
  },

  // Get stored user
  getUser: () => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
