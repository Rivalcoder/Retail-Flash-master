import { google } from '@ai-sdk/google';

// Get Google AI API key from environment variables
const GOOGLE_AI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!GOOGLE_AI_API_KEY) {
  console.warn('⚠️ GOOGLE_GENERATIVE_AI_API_KEY not found in environment variables. AI features may not work properly.');
}

// Create and export Google AI client
export const googleAI = google('gemini-1.5-flash');

// Export AI configuration for compatibility
export const ai = {
  google: googleAI,
  model: 'gemini-1.5-flash',
};

// Legacy export for backward compatibility
export const groq = {
  chat: {
    completions: {
      create: async (params: any) => {
        console.warn('⚠️ Groq API is deprecated. Please use Google AI SDK instead.');
        throw new Error('Groq API is deprecated. Please use Google AI SDK instead.');
      }
    }
  }
};
