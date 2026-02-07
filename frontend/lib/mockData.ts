// Backend API URL from environment variable (Next.js automatically injects NEXT_PUBLIC_ vars)
const API_URL =
  typeof window !== 'undefined'
    ? (window as any).NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
    : 'http://localhost:8000/api/v1';

export type ResourceType =
  | 'video'
  | 'article'
  | 'game'
  | 'book'
  | 'podcast'
  | 'worksheet'
  | 'guide'
  | 'sequence'
  | 'thematic_file';
export type Audience = 'Student' | 'Teacher';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  audience: Audience;
  duration: string; // e.g., "5 min", "10 pages"
  subject: 'Science' | 'English' | 'French' | 'Math' | 'History';
  grade: number;
  tags: string[];
  thumbnail?: string;
  contentUrl?: string; // Placeholder for where the content would be
  alignmentScore?: number; // Mock score for curriculum alignment
  culturalRelevance?: boolean;
}

export interface JourneyStep {
  stepType: 'Preparation' | 'Hook' | 'Instruction' | 'Application';
  resource: Resource;
}

export interface LearningJourney {
  id: string;
  title: string;
  grade: number;
  subject: string;
  steps: JourneyStep[];
  createdAt: string;
  classCode?: string;
}

// Mock Database of Resources
export const resourceLibrary: Resource[] = [
  // TEACHER TOOLS
  {
    id: 'tch-001',
    title: 'Thematic File: Ecosystems & Interactions',
    description:
      'A comprehensive guide for teaching ecosystems, including misconceptions, key vocabulary, and assessment rubrics.',
    type: 'thematic_file',
    audience: 'Teacher',
    duration: '15 pages',
    subject: 'Science',
    grade: 5,
    tags: ['guide', 'pedagogy', 'ecosystems'],
    alignmentScore: 100,
    culturalRelevance: false,
  },
  {
    id: 'tch-002',
    title: 'Sequence Guide: Indigenous Storytelling',
    description:
      'Pedagogical framework for introducing oral traditions respectfully in the classroom.',
    type: 'sequence',
    audience: 'Teacher',
    duration: '8 pages',
    subject: 'English',
    grade: 5,
    tags: ['guide', 'indigenous', 'storytelling'],
    alignmentScore: 100,
    culturalRelevance: true,
  },
  {
    id: 'tch-003',
    title: 'Guide Pédagogique: La Francophonie',
    description:
      'Strategies for teaching French culture and dialects to immersion students.',
    type: 'guide',
    audience: 'Teacher',
    duration: '12 pages',
    subject: 'French',
    grade: 5,
    tags: ['guide', 'francophonie', 'culture'],
    alignmentScore: 100,
    culturalRelevance: true,
  },

  // SCIENCE - PHOTOSYNTHESIS / PLANTS
  {
    id: 'sci-001',
    title: 'The Magic of Photosynthesis',
    description:
      'An animated video explaining how plants convert sunlight into energy.',
    type: 'video',
    audience: 'Student',
    duration: '4:30',
    subject: 'Science',
    grade: 5,
    tags: ['plants', 'biology', 'energy', 'sun'],
    contentUrl: 'https://www.youtube.com/embed/UPBMG5EYydo',
    alignmentScore: 98,
    culturalRelevance: false,
  },
  {
    id: 'sci-002',
    title: 'Plant Cell Structures',
    description: 'Interactive diagram showing the parts of a plant cell.',
    type: 'article',
    audience: 'Student',
    duration: '10 min',
    subject: 'Science',
    grade: 5,
    tags: ['cells', 'biology', 'plants'],
    alignmentScore: 95,
    culturalRelevance: false,
  },
  {
    id: 'sci-003',
    title: 'Grow Your Own Garden',
    description:
      'A simulation game where students manage water and sunlight for plants.',
    type: 'game',
    audience: 'Student',
    duration: '15 min',
    subject: 'Science',
    grade: 5,
    tags: ['plants', 'simulation', 'ecology'],
    contentUrl: 'https://www.abcya.com/games/plant_life_cycle',
    alignmentScore: 92,
    culturalRelevance: true,
  },
  {
    id: 'sci-004',
    title: 'Indigenous Plant Medicine',
    description:
      'Exploring how local indigenous communities use plants for healing.',
    type: 'video',
    audience: 'Student',
    duration: '8:00',
    subject: 'Science',
    grade: 5,
    tags: ['plants', 'culture', 'indigenous', 'health'],
    contentUrl: 'https://www.youtube.com/embed/gH4mXEDAQkE',
    alignmentScore: 99,
    culturalRelevance: true,
  },

  // SCIENCE - SPACE
  {
    id: 'sci-005',
    title: 'Journey to Mars',
    description: 'A documentary clip about the Mars rover missions.',
    type: 'video',
    audience: 'Student',
    duration: '6:15',
    subject: 'Science',
    grade: 5,
    tags: ['space', 'planets', 'mars', 'technology'],
    alignmentScore: 94,
    culturalRelevance: false,
  },
  {
    id: 'sci-006',
    title: 'Solar System Builder',
    description: 'Drag and drop planets to create a solar system.',
    type: 'game',
    audience: 'Student',
    duration: '20 min',
    subject: 'Science',
    grade: 5,
    tags: ['space', 'planets', 'gravity'],
    alignmentScore: 90,
    culturalRelevance: false,
  },

  // ENGLISH - STORYTELLING / GRAMMAR
  {
    id: 'eng-001',
    title: "The Hero's Journey",
    description: 'Understanding the structure of epic myths and stories.',
    type: 'video',
    audience: 'Student',
    duration: '5:00',
    subject: 'English',
    grade: 5,
    tags: ['writing', 'story', 'mythology'],
    alignmentScore: 96,
    culturalRelevance: false,
  },
  {
    id: 'eng-002',
    title: 'Creative Writing Prompts',
    description: 'A collection of image-based prompts to spark story ideas.',
    type: 'worksheet',
    audience: 'Student',
    duration: '30 min',
    subject: 'English',
    grade: 5,
    tags: ['writing', 'creativity'],
    alignmentScore: 88,
    culturalRelevance: false,
  },
  {
    id: 'eng-003',
    title: 'Voices of the Land',
    description: 'Short stories from diverse Canadian authors about nature.',
    type: 'book',
    audience: 'Student',
    duration: '15 pages',
    subject: 'English',
    grade: 5,
    tags: ['reading', 'culture', 'nature'],
    alignmentScore: 97,
    culturalRelevance: true,
  },

  // FRENCH - VOCABULARY / CULTURE
  {
    id: 'fr-001',
    title: 'Les Saisons (The Seasons)',
    description: 'Learn vocabulary related to the four seasons in French.',
    type: 'video',
    audience: 'Student',
    duration: '3:45',
    subject: 'French',
    grade: 5,
    tags: ['vocabulary', 'seasons', 'nature'],
    alignmentScore: 93,
    culturalRelevance: false,
  },
  {
    id: 'fr-002',
    title: 'Cuisine Française',
    description: 'Read about traditional French dishes and ingredients.',
    type: 'article',
    audience: 'Student',
    duration: '8 min',
    subject: 'French',
    grade: 5,
    tags: ['culture', 'food', 'reading'],
    alignmentScore: 91,
    culturalRelevance: true,
  },
  {
    id: 'fr-003',
    title: 'Verb Conjugation Challenge',
    description: 'A fast-paced game to practice -ER verbs.',
    type: 'game',
    audience: 'Student',
    duration: '10 min',
    subject: 'French',
    grade: 5,
    tags: ['grammar', 'verbs', 'practice'],
    alignmentScore: 89,
    culturalRelevance: false,
  },
  {
    id: 'fr-004',
    title: 'Contes Acadiens',
    description: 'Traditional Acadian folktales told by a local storyteller.',
    type: 'podcast',
    audience: 'Student',
    duration: '12:00',
    subject: 'French',
    grade: 5,
    tags: ['culture', 'storytelling', 'acadian', 'listening'],
    alignmentScore: 98,
    culturalRelevance: true,
  },
];

// Backend health check function
export const checkBackendHealth = async (): Promise<{
  status: string;
  database: string;
  timestamp: string;
} | null> => {
  try {
    const response = await fetch('http://localhost:8000/healthz');
    if (!response.ok) {
      console.error('Backend health check failed:', response.statusText);
      return null;
    }
    const data = await response.json();
    console.log('Backend health check successful:', data);
    return data;
  } catch (error) {
    console.error('Backend health check error:', error);
    return null;
  }
};

// Helper to simulate AI generation
export const generateJourneyFromPrompt = async (
  prompt: string,
): Promise<LearningJourney> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();

  // Determine Subject
  let subject = 'Science'; // Default
  if (lowerPrompt.includes('french') || lowerPrompt.includes('francais'))
    subject = 'French';
  else if (
    lowerPrompt.includes('english') ||
    lowerPrompt.includes('writing') ||
    lowerPrompt.includes('reading')
  )
    subject = 'English';

  // Filter resources by subject and audience
  let subjectResources = resourceLibrary.filter(
    (r) => r.subject === subject && r.audience === 'Student',
  );
  let teacherResources = resourceLibrary.filter(
    (r) => r.subject === subject && r.audience === 'Teacher',
  );

  // Simple keyword matching for relevance
  const keywords = lowerPrompt.split(' ').filter((w) => w.length > 3);

  const scoredResources = subjectResources.map((r) => {
    let score = 0;
    keywords.forEach((k) => {
      if (r.title.toLowerCase().includes(k)) score += 2;
      if (r.description.toLowerCase().includes(k)) score += 1;
      if (r.tags.some((t) => t.includes(k))) score += 1;
    });
    // Boost cultural relevance as per PRD
    if (r.culturalRelevance) score *= 1.5;

    return { resource: r, score };
  });

  // Sort by score
  scoredResources.sort((a, b) => b.score - a.score);

  // Select Hook, Instruction, Application
  const topResources = scoredResources.map((sr) => sr.resource);
  const pool = topResources.length >= 3 ? topResources : subjectResources;

  const hook =
    pool.find((r) => r.type === 'video' || r.type === 'game') || pool[0];
  const instruction =
    pool.find(
      (r) =>
        r.id !== hook.id &&
        (r.type === 'article' || r.type === 'book' || r.type === 'video'),
    ) || pool[1];
  const application =
    pool.find(
      (r) =>
        r.id !== hook.id &&
        r.id !== instruction.id &&
        (r.type === 'game' || r.type === 'worksheet' || r.type === 'podcast'),
    ) || pool[2];

  // Select a teacher tool
  const teacherTool =
    teacherResources.length > 0 ? teacherResources[0] : undefined;

  const steps: JourneyStep[] = [];

  // Add Preparation step if teacher tool exists
  if (teacherTool) {
    steps.push({ stepType: 'Preparation', resource: teacherTool });
  }

  // Add Student steps
  steps.push({ stepType: 'Hook', resource: hook });
  steps.push({ stepType: 'Instruction', resource: instruction });
  steps.push({ stepType: 'Application', resource: application });

  return {
    id: `journey-${Date.now()}`,
    title: `Learning Journey: ${prompt.substring(0, 30)}${prompt.length > 30 ? '...' : ''}`,
    grade: 5,
    subject: subject,
    createdAt: new Date().toISOString(),
    steps: steps,
  };
};

export const getJourneyByCode = (code: string): LearningJourney | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(`journey_${code}`);
  return stored ? JSON.parse(stored) : null;
};

export const saveJourney = (journey: LearningJourney): string => {
  // Generate a 6-character code
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const journeyWithCode = { ...journey, classCode: code };

  if (typeof window !== 'undefined') {
    localStorage.setItem(`journey_${code}`, JSON.stringify(journeyWithCode));
  }

  return code;
};
