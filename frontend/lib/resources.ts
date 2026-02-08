import { Resource } from './mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FetchResourcesParams {
  subject?: string;
  grade?: number;
  audience?: string;
  type?: string;
  limit?: number;
  skip?: number;
}

export interface FetchResourcesResponse {
  resources: Resource[];
  total: number;
}

export async function fetchResources(
  params: FetchResourcesParams,
): Promise<FetchResourcesResponse> {
  const queryParams = new URLSearchParams();

  if (params.subject) queryParams.append('subject', params.subject);
  if (params.grade) queryParams.append('grade', params.grade.toString());
  if (params.audience) queryParams.append('audience', params.audience);
  if (params.type) queryParams.append('type', params.type);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.skip) queryParams.append('skip', params.skip.toString());

  const response = await fetch(
    `${API_BASE_URL}/api/v1/resources?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch resources');
  }

  const data = await response.json();

  // Convert API format to frontend format
  const resources: Resource[] = data.resources.map(
    (r: Record<string, unknown>) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      type: r.type,
      audience: r.audience,
      duration: r.duration,
      subject: r.subject,
      grade: r.grade,
      tags: r.tags || [],
      thumbnail: r.thumbnail,
      contentUrl: r.content_url,
      alignmentScore: r.alignment_score,
      culturalRelevance: r.cultural_relevance || false,
    }),
  );

  return {
    resources,
    total: data.total,
  };
}
