
import { LearningJourney, generateJourneyFromPrompt, saveJourney, getJourneyByCode } from './mockData';

// Re-export types from mockData for consistency
export type { LearningJourney as Journey };

// Mock API functions that wrap the mockData utilities
// In a real app, these would make fetch requests to the backend

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateJourney = async (prompt: string): Promise<LearningJourney> => {
  // Simulate API call to AI service
  return await generateJourneyFromPrompt(prompt);
};

export const createJourney = async (journeyData: any): Promise<LearningJourney> => {
  await delay(800); // Simulate network
  
  // In the mock implementation, we just return the data as is, 
  // maybe adding an ID if it wasn't there (though generateJourneyFromPrompt adds one)
  return {
    ...journeyData,
    id: journeyData.id || `journey-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
};

export const getJourney = async (id: string): Promise<LearningJourney> => {
  await delay(500);
  
  // Try to find in localStorage first (for the prototype)
  if (typeof window !== 'undefined') {
    // We need to search through all keys or use a specific convention
    // For this prototype, we'll try to find it in the draft storage
    const draft = localStorage.getItem(`journey_draft_${id}`);
    if (draft) return JSON.parse(draft);
    
    // Or try to find by ID if we saved it differently
    // This is a simplification for the prototype
  }
  
  // Fallback to generating a mock one if not found (for demo purposes)
  // In a real app this would throw 404
  return await generateJourneyFromPrompt("Demo Journey");
};

export const updateJourney = async (id: string, updates: any): Promise<LearningJourney> => {
  await delay(500);
  
  // In a real app, this would PATCH /journeys/:id
  // For prototype, we just return the updated mock
  const current = await getJourney(id);
  return { ...current, ...updates };
};

export const deployJourney = async (id: string): Promise<string> => {
  await delay(1000);
  
  // Use the mockData helper to generate a code and save to localStorage
  const journey = await getJourney(id);
  return saveJourney(journey);
};

