/**
 * Journey management functions
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  audience: string;
  duration: string;
  subject: string;
  grade: number;
  tags: string[];
  thumbnail?: string;
  content_url: string;
  alignment_score?: number;
  cultural_relevance?: boolean;
}

export interface JourneyStep {
  step_type: string;
  resource: Resource;
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  duration_weeks: number;
  learning_objectives: string[];
  steps: JourneyStep[];
  class_code?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Generate a new learning journey
 */
export async function generateJourney(prompt: string): Promise<Journey> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/journeys/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      prompt,
      title: prompt.substring(0, 100),
      description: prompt,
      subject: 'General',
      grade_level: '5',
      duration_weeks: 1,
      learning_objectives: ['Learn key concepts'],
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Failed to generate journey' }));
    throw new Error(error.detail || 'Failed to generate journey');
  }

  return await response.json();
}

/**
 * Get a specific journey by ID
 */
export async function getJourney(journeyId: string): Promise<Journey> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/journeys/${journeyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Failed to fetch journey' }));
    throw new Error(error.detail || 'Failed to fetch journey');
  }

  return await response.json();
}

/**
 * Get a journey by student access code (no auth required)
 */
export async function getJourneyByCode(code: string): Promise<Journey> {
  const response = await fetch(`${API_URL}/journeys/code/${code}`);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Invalid class code' }));
    throw new Error(error.detail || 'Invalid class code');
  }

  return await response.json();
}

/**
 * Update a journey
 */
export async function updateJourney(
  journeyId: string,
  updates: {
    title?: string;
    description?: string;
    steps?: Array<{ step_type: string; resource_id: string }>;
  },
): Promise<Journey> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/journeys/${journeyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Failed to update journey' }));
    throw new Error(error.detail || 'Failed to update journey');
  }

  return await response.json();
}

/**
 * Deploy a journey and get a class code
 */
export async function deployJourney(journeyId: string): Promise<string> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/journeys/${journeyId}/deploy`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Failed to deploy journey' }));
    throw new Error(error.detail || 'Failed to deploy journey');
  }

  const data = await response.json();
  return data.class_code;
}

/**
 * Delete a journey
 */
export async function deleteJourney(journeyId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_URL}/journeys/${journeyId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'Failed to delete journey' }));
    throw new Error(error.detail || 'Failed to delete journey');
  }
}
