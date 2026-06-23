# Frontend API Client Setup

## Overview
This guide covers setting up the Next.js frontend to communicate with the Laravel backend, including authentication flow, error handling, and state management.

## API Client Setup

### 1. Install Dependencies
```bash
npm install axios zustand js-cookie
# or
pnpm add axios zustand js-cookie
```

### 2. Create API Client Utility

**File**: `lib/api/client.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, try refresh
          await this.refreshToken();
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    try {
      const response = await this.client.post('/auth/refresh');
      const { data } = response.data;
      useAuthStore.setState({ token: data.access_token });
    } catch (error) {
      // Refresh failed, logout user
      useAuthStore.setState({ token: null, user: null });
    }
  }

  async get(url: string, config?: any) {
    return this.client.get(url, config);
  }

  async post(url: string, data?: any, config?: any) {
    return this.client.post(url, data, config);
  }

  async put(url: string, data?: any, config?: any) {
    return this.client.put(url, data, config);
  }

  async delete(url: string, config?: any) {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
```

### 3. Create Zustand Auth Store

**File**: `store/auth.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  email_verified_at?: string;
  profile_completed: boolean;
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
        if (token) {
          Cookies.set('auth_token', token, {
            secure: true,
            sameSite: 'strict',
            expires: 7,
          });
        } else {
          Cookies.remove('auth_token');
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        Cookies.remove('auth_token');
      },

      hydrate: () => {
        const token = Cookies.get('auth_token');
        if (token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-store',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);
```

### 4. Create Auth Service

**File**: `lib/api/auth.service.ts`

```typescript
import { apiClient } from './client';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface VerifyCodeData {
  user_id: number;
  verification_code: string;
}

export const authService = {
  async signup(data: SignUpData) {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  async signin(data: SignInData) {
    const response = await apiClient.post('/auth/signin', data);
    return response.data;
  },

  async verifyCode(data: VerifyCodeData) {
    const response = await apiClient.post('/auth/verify-code', data);
    return response.data;
  },

  async resendCode(userId: number) {
    const response = await apiClient.post('/auth/resend-code', {
      user_id: userId,
    });
    return response.data;
  },

  async logout() {
    await apiClient.post('/auth/logout');
  },

  async refreshToken() {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};
```

### 5. Create User Service

**File**: `lib/api/user.service.ts`

```typescript
import { apiClient } from './client';

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const userService = {
  async getProfile() {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },

  async updateProfile(data: UpdateProfileData) {
    const response = await apiClient.put('/user/profile', data);
    return response.data;
  },

  async changePassword(data: ChangePasswordData) {
    const response = await apiClient.post('/user/change-password', data);
    return response.data;
  },
};
```

## Environment Variables

**File**: `.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**File**: `.env.production`

```
NEXT_PUBLIC_API_URL=https://api.sabat.ir/api/v1
```

## Hook for Authentication

**File**: `hooks/useAuth.ts`

```typescript
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { userService } from '@/lib/api/user.service';

export function useAuth() {
  const { user, token, isLoading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
  };
}
```

## Protected Routes

**File**: `components/ProtectedRoute.tsx`

```typescript
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  fallback = null,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback || <div>Loading...</div>}</>;
  }

  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  return <>{children}</>;
}
```

## Usage Example in Component

```typescript
'use client';

import { useState } from 'react';
import { authService } from '@/lib/api/auth.service';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.signin({ email, password });
      setUserId(response.data.user_id);
      // Show verification code input
    } catch (err: any) {
      setError(err.response?.data?.message || 'Sign in failed');
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.verifyCode({
        user_id: userId!,
        verification_code: verificationCode,
      });
      
      setToken(response.data.access_token);
      setUser(response.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  if (userId) {
    return (
      <form onSubmit={handleVerifyCode}>
        <input
          type="text"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button type="submit">Verify</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    );
  }

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign In</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

## Error Handling

All API errors follow this pattern:

```typescript
try {
  await authService.signin({ email, password });
} catch (error: any) {
  const errorData = error.response?.data;
  
  if (error.response?.status === 422) {
    // Validation error
    console.log('Validation errors:', errorData.errors);
  } else if (error.response?.status === 401) {
    // Unauthorized
    console.log('Invalid credentials');
  } else if (error.response?.status === 429) {
    // Rate limited
    console.log('Too many requests, try again later');
  }
}
```

## Testing with Postman

1. Create Sign Up request:
   - Method: POST
   - URL: `http://localhost:8000/api/v1/auth/signup`
   - Body: 
     ```json
     {
       "name": "Test User",
       "email": "test@example.com",
       "password": "TestPass123!",
       "password_confirmation": "TestPass123!"
     }
     ```

2. Copy verification code from response

3. Create Verify Code request:
   - Method: POST
   - URL: `http://localhost:8000/api/v1/auth/verify-code`
   - Body:
     ```json
     {
       "user_id": 1,
       "verification_code": "123456"
     }
     ```

4. Use returned `access_token` in Authorization header for authenticated requests

## Debugging

Enable API request/response logging:

```typescript
// In development, add to api/client.ts
if (process.env.NODE_ENV === 'development') {
  this.client.interceptors.request.use((config) => {
    console.log('[API] Request:', config.method?.toUpperCase(), config.url);
    return config;
  });

  this.client.interceptors.response.use((response) => {
    console.log('[API] Response:', response.status, response.data);
    return response;
  });
}
```
