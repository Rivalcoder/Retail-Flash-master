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

export async function generatePromoCopy(input: GeneratePromoCopyInput): Promise<GeneratePromoCopyOutput> {
  // Validate input
  const validatedInput = GeneratePromoCopyInputSchema.parse(input);
  
  console.log('Generating promo copy for:', validatedInput); // Debug logging
  
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error('Google Generative AI API key is not configured');
    }

    // Calculate discount percentage and savings
    const priceChange = validatedInput.oldPrice - validatedInput.newPrice;
    const discountPercentage = Math.round((priceChange / validatedInput.oldPrice) * 100);
    const isOnSale = priceChange > 0;
    const isPriceIncrease = priceChange < 0;

    console.log('Attempting to generate promotional copy...');
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      schema: GeneratePromoCopyOutputSchema,
      prompt: `You are an expert marketing copywriter specializing in creating compelling promotional copy for e-commerce products. Your goal is to write engaging, persuasive copy that drives sales and highlights key product benefits.

Key Guidelines:
- Keep copy concise but compelling (2-4 sentences max)
- Focus on benefits, not just features
- Use action-oriented language
- Create urgency when appropriate
- Highlight price changes effectively
- Match the tone to the product type
- Include emotional triggers that motivate purchase
- End with a clear call-to-action when appropriate
- Use proper markdown formatting for better presentation
- Always use ₹ symbol for INR amounts
- Format large numbers with commas (e.g., ₹1,00,000)
- Use K for thousands (e.g., ₹50K)

Price Change Context:
- If price decreased: Emphasize the sale/discount prominently
- If price increased: Focus on enhanced value, quality, or new features
- If price unchanged: Focus on product benefits and value proposition

Response Format Guidelines:
1). Heading:
    - Provide a clear, concise heading that reflects the promotional offer
    - Keep it relevant and specific to the product and offer
    - Use emojis for visual appeal
    
2). Description:
    - Create compelling promotional copy with proper formatting
    - Use tables for price comparisons when applicable
    - Use lists for key benefits or features
    - Use blockquotes for important offers or highlights
    - Use bold text for emphasis on prices and savings
    - Use emojis to enhance visual appeal
    - Keep the response concise and relevant
    - Use markdown formatting for better presentation

Response Format Examples:

1. For Sale Offers:
   ### 🎉 Limited Time Sale!
   | Item | Original Price | Sale Price | Savings |
   |:-----|:---------------|:-----------|:--------|
   | ${validatedInput.productName} | ₹${validatedInput.oldPrice.toLocaleString()} | ₹${validatedInput.newPrice.toLocaleString()} | **₹${priceChange.toLocaleString()}** |

   > **🔥 Hot Deal:** Save **${discountPercentage}%** on ${validatedInput.productName}!
   > 
   > *${validatedInput.description}*
   > 
   > **⏰ Limited Time Offer** - Don't miss out on this incredible deal!

2. For Price Increases:
   ### ⬆️ Enhanced Value
   | Feature | Previous | Now |
   |:--------|:---------|:----|
   | Price | ₹${validatedInput.oldPrice.toLocaleString()} | ₹${validatedInput.newPrice.toLocaleString()} |
   | Value | Standard | **Enhanced** |

   > **💎 Premium Quality:** ${validatedInput.productName} now offers enhanced features and superior quality.
   > 
   > *${validatedInput.description}*
   > 
   > **✨ Worth the Investment** - Experience the difference!

3. For Regular Pricing:
   ### 💫 Amazing Value
   | Feature | Details |
   |:--------|:--------|
   | Product | ${validatedInput.productName} |
   | Price | **₹${validatedInput.newPrice.toLocaleString()}** |
   | Value | Exceptional |

   > **🌟 Perfect Choice:** ${validatedInput.productName} delivers outstanding value at ₹${validatedInput.newPrice.toLocaleString()}.
   > 
   > *${validatedInput.description}*
   > 
   > **🚀 Get Yours Today** - Limited stock available!

Markdown Formatting Rules:
1. Headers:
   - Use ### for main sections
   - Keep headers concise and descriptive
   - Add relevant emojis for visual hierarchy

2. Tables:
   - Use for price comparisons and feature lists
   - Include relevant metrics
   - Format numbers with proper separators
   - Add totals when applicable

3. Lists:
   - Use for key benefits and features
   - Keep items concise
   - Add relevant emojis

4. Blockquotes:
   - Use for important offers and highlights
   - Keep them brief and relevant

5. Emphasis:
   - Use **bold** for important prices and savings
   - Use *italic* for emphasis
   - Use \`code\` for technical terms

6. Spacing:
   - Add blank lines between sections
   - Keep paragraphs short
   - Use consistent spacing

7. Emojis:
   - Use for visual hierarchy
   - Common emojis:
     * 🎉 for sales
     * 💰 for pricing
     * ⏰ for urgency
     * 🔥 for hot deals
     * 💎 for premium
     * ✨ for value
     * 🚀 for action
     * ⬆️ for increases
     * 💫 for amazing
     * 🌟 for perfect

Product Information:
Product: ${validatedInput.productName}
Previous Price: ₹${validatedInput.oldPrice.toLocaleString()}
Current Price: ₹${validatedInput.newPrice.toLocaleString()}
Description: ${validatedInput.description}

${isOnSale ? `🎉 SALE ALERT: Save ₹${priceChange.toLocaleString()} (${discountPercentage}% OFF!)` : ''}
${isPriceIncrease ? `⚠️ Note: Price has increased by ₹${Math.abs(priceChange).toLocaleString()}` : ''}

Generate compelling promotional copy that will make customers want to buy this product immediately using the formatting guidelines above.`
    });

    console.log('Successfully generated promotional copy');
    return object;

  } catch (error) {
    console.error('Error generating promo copy with Google AI API:', error);
    
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
    
    return {
      promoCopy: fallbackCopy
    };
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
      model: google('gemini-1.5-flash'),
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