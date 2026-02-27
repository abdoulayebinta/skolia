
// Mock authentication service for frontend-only prototype
// In a real app, this would connect to a backend API

export interface Educator {
  id: string;
  email: string;
  name: string;
  school?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface SignupData {
  email: string;
  password?: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  educator: Educator;
}

// Mock user data
const MOCK_EDUCATOR: Educator = {
  id: 'edu-123456',
  email: 'teacher@example.com',
  name: 'Sarah Jenkins',
  school: 'Westwood Elementary'
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (data: LoginData): Promise<AuthResponse> => {
  await delay(1000); // Simulate network request
  
  // For prototype, accept any email/password
  if (!data.email) {
    throw new Error('Email is required');
  }

  const educator = {
    ...MOCK_EDUCATOR,
    email: data.email,
    // If it's a new user (not the mock one), use the email prefix as name
    name: data.email === MOCK_EDUCATOR.email ? MOCK_EDUCATOR.name : data.email.split('@')[0]
  };

  const response = {
    token: 'mock-jwt-token-' + Date.now(),
    educator
  };

  // Store in localStorage for persistence in the prototype
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('educator_data', JSON.stringify(response.educator));
  }

  return response;
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  await delay(1500); // Simulate network request
  
  if (!data.email || !data.name) {
    throw new Error('Email and name are required');
  }

  const educator: Educator = {
    id: 'edu-' + Date.now(),
    email: data.email,
    name: data.name
  };

  const response = {
    token: 'mock-jwt-token-' + Date.now(),
    educator
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('educator_data', JSON.stringify(response.educator));
  }

  return response;
};

export const logout = async (): Promise<void> => {
  await delay(500);
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('educator_data');
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('auth_token');
};

export const getEducatorData = (): Educator | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('educator_data');
  return data ? JSON.parse(data) : null;
};

