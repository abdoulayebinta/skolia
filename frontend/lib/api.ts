/**
 * API utility for communicating with the backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Base fetch wrapper with error handling
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Educator API endpoints
 */
export const educatorAPI = {
  /**
   * Register a new educator
   */
  register: async (data: { email: string; password: string; name: string }) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Login an educator
   */
  login: async (data: { email: string; password: string }) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get educator profile
   */
  getProfile: async (token: string) => {
    return fetchAPI('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * Journey API endpoints
 */
export const journeyAPI = {
  /**
   * Create a new learning journey
   */
  create: async (
    token: string,
    data: {
      title: string;
      description: string;
      subject: string;
      grade_level: string;
      duration_weeks: number;
      learning_objectives: string[];
    },
  ) => {
    return fetchAPI('/journeys/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all journeys for an educator
   */
  getAll: async (token: string) => {
    return fetchAPI('/journeys/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Get a specific journey by ID
   */
  getById: async (token: string, journeyId: string) => {
    return fetchAPI(`/journeys/${journeyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Get a journey by student access code
   */
  getByCode: async (code: string) => {
    return fetchAPI(`/journeys/code/${code}`);
  },

  /**
   * Update journey progress
   */
  updateProgress: async (
    token: string,
    journeyId: string,
    weekNumber: number,
    completed: boolean,
  ) => {
    return fetchAPI(`/journeys/${journeyId}/progress`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        week_number: weekNumber,
        completed,
      }),
    });
  },

  /**
   * Delete a journey
   */
  delete: async (token: string, journeyId: string) => {
    return fetchAPI(`/journeys/${journeyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

/**
 * Resource API endpoints
 */
export const resourceAPI = {
  /**
   * Search resources
   */
  search: async (params: {
    query?: string;
    subject?: string;
    grade_level?: string;
    resource_type?: string;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return fetchAPI(`/resources/search?${queryParams.toString()}`);
  },

  /**
   * Get a specific resource by ID
   */
  getById: async (resourceId: string) => {
    return fetchAPI(`/resources/${resourceId}`);
  },
};

export default {
  educatorAPI,
  journeyAPI,
  resourceAPI,
};
