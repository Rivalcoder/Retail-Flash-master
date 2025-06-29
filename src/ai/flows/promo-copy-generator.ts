'use server';

/**
 * @fileOverview Promo copy generation flow that automatically generates promotional copy when product details change.
 * 
 * - generatePromoCopy - A function that handles the promo copy generation process.
 * - GeneratePromoCopyInput - The input type for the generatePromoCopy function.
 * - GeneratePromoCopyOutput - The return type for the generatePromoCopy function.
 */

import { groq } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePromoCopyInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  oldPrice: z.number().describe('The previous price of the product.'),
  newPrice: z.number().describe('The new price of the product.'),
  description: z.string().describe('The description of the product.'),
});
export type GeneratePromoCopyInput = z.infer<typeof GeneratePromoCopyInputSchema>;

const GeneratePromoCopyOutputSchema = z.object({
  promoCopy: z.string().describe('The generated promotional copy for the product.'),
});
export type GeneratePromoCopyOutput = z.infer<typeof GeneratePromoCopyOutputSchema>;

export async function generatePromoCopy(input: GeneratePromoCopyInput): Promise<GeneratePromoCopyOutput> {
  // Validate input
  const validatedInput = GeneratePromoCopyInputSchema.parse(input);
  
  console.log('Generating promo copy for:', validatedInput); // Debug logging
  
  try {
    // Calculate discount percentage and savings
    const priceChange = validatedInput.oldPrice - validatedInput.newPrice;
    const discountPercentage = Math.round((priceChange / validatedInput.oldPrice) * 100);
    const isOnSale = priceChange > 0;
    const isPriceIncrease = priceChange < 0;
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert marketing copywriter specializing in creating compelling promotional copy for e-commerce products. Your goal is to write engaging, persuasive copy that drives sales and highlights key product benefits.

Key Guidelines:
- Keep copy concise but compelling (2-4 sentences max)
- Focus on benefits, not just features
- Use action-oriented language
- Create urgency when appropriate
- Highlight price changes effectively
- Match the tone to the product type
- Include emotional triggers that motivate purchase
- End with a clear call-to-action when appropriate

Price Change Context:
- If price decreased: Emphasize the sale/discount prominently
- If price increased: Focus on enhanced value, quality, or new features
- If price unchanged: Focus on product benefits and value proposition`
        },
        {
          role: "user",
          content: `Create promotional copy for this product:

Product: ${validatedInput.productName}
Previous Price: ₹${validatedInput.oldPrice.toLocaleString()}
Current Price: ₹${validatedInput.newPrice.toLocaleString()}
Description: ${validatedInput.description}

${isOnSale ? `🎉 SALE ALERT: Save ₹${priceChange.toLocaleString()} (${discountPercentage}% OFF!)` : ''}
${isPriceIncrease ? `⚠️ Note: Price has increased by ₹${Math.abs(priceChange).toLocaleString()}` : ''}

Generate compelling promotional copy that will make customers want to buy this product immediately.`
        }
      ],
      model: "llama3-70b-8192", 
      temperature: 0.8, 
      max_tokens: 300,
      top_p: 0.9,
    });

    const promoCopy = completion.choices[0]?.message?.content || 
      `${validatedInput.productName} - ${isOnSale ? 'Now on Sale!' : 'Available Now'} Get yours today for ₹${validatedInput.newPrice.toLocaleString()}!`;

    console.log('Generated promo copy:', promoCopy);

    // Validate output
    const result = GeneratePromoCopyOutputSchema.parse({ promoCopy });
    return result;

  } catch (error) {
    console.error('Error generating promo copy with Groq API:', error);
    
    // Return a fallback promotional copy
    const priceChange = validatedInput.oldPrice - validatedInput.newPrice;
    const isOnSale = priceChange > 0;
    const discountPercentage = Math.round((priceChange / validatedInput.oldPrice) * 100);
    
    let fallbackCopy = `${validatedInput.productName} - `;
    
    if (isOnSale) {
      fallbackCopy += `Now on Sale! Save ${discountPercentage}% - Was ₹${validatedInput.oldPrice.toLocaleString()}, now only ₹${validatedInput.newPrice.toLocaleString()}! `;
    } else {
      fallbackCopy += `Available now for ₹${validatedInput.newPrice.toLocaleString()}! `;
    }
    
    fallbackCopy += `${validatedInput.description.slice(0, 100)}... Don't miss out!`;
    
    return { promoCopy: fallbackCopy };
  }
}

// Optional: Helper function to generate multiple promo copy variations
export async function generatePromoCopyVariations(
  input: GeneratePromoCopyInput, 
  variations: number = 3
): Promise<{ variations: string[] }> {
  const validatedInput = GeneratePromoCopyInputSchema.parse(input);
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert marketing copywriter. Generate ${variations} different promotional copy variations for the same product. Each variation should have a different tone and approach (e.g., urgency-focused, benefit-focused, emotional, etc.) but all should be compelling and sales-oriented.`
        },
        {
          role: "user",
          content: `Create ${variations} different promotional copy variations for:

Product: ${validatedInput.productName}
Previous Price: ₹${validatedInput.oldPrice.toLocaleString()}
Current Price: ₹${validatedInput.newPrice.toLocaleString()}
Description: ${validatedInput.description}

Format: Return each variation numbered (1., 2., 3., etc.) on separate lines.`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.9, // Higher temperature for more variety
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    const variationsList = response
      .split(/\d+\.\s+/)
      .filter(v => v.trim())
      .map(v => v.trim())
      .slice(0, variations);

    return { variations: variationsList };

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
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a marketing analytics expert. Analyze promotional copy and provide:
1. A score from 1-10 for effectiveness
2. Brief feedback on strengths and weaknesses
3. 2-3 specific improvement suggestions

Consider: clarity, persuasiveness, urgency, benefits highlighting, call-to-action strength.`
        },
        {
          role: "user",
          content: `Analyze this promotional copy:

"${promoCopy}"

Provide analysis in this format:
Score: [1-10]
Feedback: [brief analysis]
Suggestions:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]`
        }
      ],
      model: "llama3-70b-8192",
      temperature: 0.3, // Lower temperature for analytical tasks
      max_tokens: 400,
    });

    const response = completion.choices[0]?.message?.content || '';
    
    // Parse the response
    const scoreMatch = response.match(/Score:\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
    
    const feedbackMatch = response.match(/Feedback:\s*([^\n]+)/i);
    const feedback = feedbackMatch ? feedbackMatch[1] : 'Copy looks good overall.';
    
    const suggestionsMatch = response.match(/Suggestions:\s*((?:- [^\n]+\n?)+)/i);
    const suggestions = suggestionsMatch 
      ? suggestionsMatch[1].split('\n').filter(s => s.trim()).map(s => s.replace(/^-\s*/, ''))
      : ['Consider adding more urgency', 'Highlight key benefits', 'Include a stronger call-to-action'];

    return { score, feedback, suggestions };

  } catch (error) {
    console.error('Error analyzing promo copy:', error);
    return {
      score: 7,
      feedback: 'Analysis unavailable, but copy appears functional.',
      suggestions: ['Consider A/B testing different versions', 'Add more specific benefits', 'Include urgency elements']
    };
  }
}