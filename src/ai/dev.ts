import { config } from 'dotenv';
config();

// Load environment variables from .env.local
import { groq } from './genkit';

// Initialize AI flows
import '@/ai/flows/promo-copy-generator';
import '@/ai/flows/customer-q-and-a-bot';

// Verify API key is loaded
if (!process.env.GROK_API_KEY) {
  console.warn('⚠️ GROK_API_KEY not found in environment variables');
} else {
  console.log('✅ Grok API key loaded successfully');
}