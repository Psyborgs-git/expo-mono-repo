// AI stub for generating profile bios
import { BioTone } from './types';
import { api } from './api';

/**
 * Generate AI-powered bio suggestions based on profile traits
 * 
 * @param profileTraits - Array of personality traits
 * @param tone - Tone of the bio (witty, sincere, short)
 * @returns Array of bio suggestions
 */
export async function generateBio(
  profileTraits: string[],
  tone: BioTone = 'sincere'
): Promise<string[]> {
  const response = await api.generateBio(profileTraits, tone);
  return response.suggestions;
}

/**
 * In the future, this will be replaced with a real AI provider
 * based on the AI_PROVIDER environment variable:
 * 
 * const AI_PROVIDER = process.env.EXPO_PUBLIC_AI_PROVIDER || 'mock';
 * 
 * switch (AI_PROVIDER) {
 *   case 'openai':
 *     return await openAIGenerateBio(profileTraits, tone);
 *   case 'anthropic':
 *     return await anthropicGenerateBio(profileTraits, tone);
 *   default:
 *     return await mockGenerateBio(profileTraits, tone);
 * }
 */
