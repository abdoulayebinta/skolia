/**
 * Authentication functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  educator: {
    id: string;
    email: string;
    name: string;
  };
}

interface EducatorData {
  id: string;
  email: string;
  name: string;
}

/**
 * Login an educator
 */
export async function login(credentials: LoginCredentials): Promise<void> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Login failed' }));
    throw new Error(error.detail || 'Login failed');
  }

  const data: AuthResponse = await response.json();

  // Store token and educator data in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('educator_data', JSON.stringify(data.educator));
  }
}

/**
 * Sign up a new educator
 */
export async function signup(signupData: SignupData): Promise<void> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signupData),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Signup failed' }));
    throw new Error(error.detail || 'Signup failed');
  }

  const data: AuthResponse = await response.json();

  // Store token and educator data in localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', data.access_token);
    localStorage.setItem('educator_data', JSON.stringify(data.educator));
  }
}

/**
 * Logout the current educator
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('educator_data');
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
}

/**
 * Get the current educator's data
 */
export function getEducatorData(): EducatorData | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem('educator_data');
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

/**
 * Get the current auth token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}
