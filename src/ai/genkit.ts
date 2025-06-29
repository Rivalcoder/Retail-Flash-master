import { Groq } from 'groq-sdk';

// Get Grok API key from environment variables
const GROK_API_KEY = process.env.GROK_API_KEY;

if (!GROK_API_KEY) {
  console.warn('⚠️ GROK_API_KEY not found in environment variables. AI features may not work properly.');
}

// Create and export Groq client
export const groq = new Groq({
  apiKey: GROK_API_KEY || '',
});

// Export AI configuration for compatibility
export const ai = {
  groq,
  model: 'llama3-70b-8192',
};
