'use server';

/**
 * @fileOverview Promo copy generation flow that automatically generates promotional copy when product details change.
 * 
 * - generatePromoCopy - A function that handles the promo copy generation process.
 * - GeneratePromoCopyInput - The input type for the generatePromoCopy function.
 * - GeneratePromoCopyOutput - The return type for the generatePromoCopy function.
 */

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GeneratePromoCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  oldPrice: z.number().describe('The previous price of the product.'),
  newPrice: z.number().describe('The new price of the product.'),
  description: z.string().describe('The description of the product.'),
});
export type GeneratePromoCopyInput = z.infer<typeof GeneratePromoCopyInputSchema>;

const GeneratePromoCopyOutputSchema = z.object({
  promoCopy: z.string().describe('The generated promotional copy with proper formatting'),
});
export type GeneratePromoCopyOutput = z.infer<typeof GeneratePromoCopyOutputSchema>;

// Use the API key directly
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log('API Key available:', !!apiKey);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generatePromoCopy(productData: any) {
  console.log('generatePromoCopy called with:', productData);
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Generate ONE compelling promotional tagline for this product.

Product: ${productData.name}
Price: $${productData.price}
Original Price: ${productData.oldPrice ? `$${productData.oldPrice}` : 'N/A'}
Description: ${productData.description}

Create a single catchy tagline (max 12 words) that:
- Highlights value or savings
- Uses action words
- Is memorable and impactful
- Emphasizes benefits or urgency

Example: "Smart lighting that saves you 40% - Transform your home today!"

Tagline:`;

  console.log('Sending prompt to AI:', prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();
    console.log('AI generated text:', generatedText);
    return generatedText;
  } catch (error) {
    console.error('Error generating promo copy:', error);
    return 'Discover amazing deals on premium products!';
  }
}

// Optional: Helper function to generate multiple promo copy variations
export async function generatePromoCopyVariations(
  input: GeneratePromoCopyInput, 
  variations: number = 3
): Promise<{ variations: string[] }> {
  const validatedInput = GeneratePromoCopyInputSchema.parse(input);
  
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error('Google Generative AI API key is not configured');
    }

    console.log('Attempting to generate promotional copy variations...');
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      schema: z.object({
        variations: z.array(z.string()).describe('Array of promotional copy variations')
      }),
      prompt: `You are an expert marketing copywriter. Generate ${variations} different promotional copy variations for the same product. Each variation should have a different tone and approach (e.g., urgency-focused, benefit-focused, emotional, etc.) but all should be compelling and sales-oriented.

Product Information:
Product: ${validatedInput.productName}
Previous Price: ₹${validatedInput.oldPrice.toLocaleString()}
Current Price: ₹${validatedInput.newPrice.toLocaleString()}
Description: ${validatedInput.description}

Generate ${variations} different promotional copy variations, each with a unique approach and tone.`
    });

    return { variations: object.variations.slice(0, variations) };

  } catch (error) {
    console.error('Error generating promo copy variations:', error);
    
    // Return fallback variations
    const isOnSale = validatedInput.oldPrice > validatedInput.newPrice;
    const fallbackVariations = [
      `${validatedInput.productName} - ${isOnSale ? 'Special Offer!' : 'Now Available!'} ₹${validatedInput.newPrice.toLocaleString()}`,
      `Don't miss out on ${validatedInput.productName}! ${isOnSale ? 'Limited time price!' : 'Great value at'} ₹${validatedInput.newPrice.toLocaleString()}`,
      `${validatedInput.productName} - Perfect for you! ${isOnSale ? 'Sale price:' : 'Only'} ₹${validatedInput.newPrice.toLocaleString()}`
    ];
    
    return { variations: fallbackVariations.slice(0, variations) };
  }
}

// Optional: Helper function to analyze promo copy effectiveness
export async function analyzePromoCopy(promoCopy: string): Promise<{ 
  score: number; 
  feedback: string; 
  suggestions: string[] 
}> {
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error('Google Generative AI API key is not configured');
    }

    console.log('Attempting to analyze promotional copy...');
    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      schema: z.object({
        score: z.number().describe('Effectiveness score from 1-10'),
        feedback: z.string().describe('Brief feedback on strengths and weaknesses'),
        suggestions: z.array(z.string()).describe('Array of improvement suggestions')
      }),
      prompt: `You are a marketing analytics expert. Analyze promotional copy and provide:
1. A score from 1-10 for effectiveness
2. Brief feedback on strengths and weaknesses
3. 2-3 specific improvement suggestions

Consider: clarity, persuasiveness, urgency, benefits highlighting, call-to-action strength.

Promotional Copy to Analyze:
"${promoCopy}"

Provide analysis with a score, feedback, and suggestions.`
    });

    return object;

  } catch (error) {
    console.error('Error analyzing promo copy:', error);
    return {
      score: 7,
      feedback: 'Analysis unavailable, but copy appears functional.',
      suggestions: ['Consider A/B testing different versions', 'Add more specific benefits', 'Include urgency elements']
    };
  }
}