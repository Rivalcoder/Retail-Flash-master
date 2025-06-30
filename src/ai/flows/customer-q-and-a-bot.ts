'use server';

/**
 * @fileOverview A customer Q&A bot that answers questions about products based on real-time catalog data.
 * 
 * - answerQuestion - A function that answers a customer question about a product.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const AnswerQuestionInputSchema = z.object({
  productId: z.string().describe('The ID of the product the question is about.'),
  question: z.string().describe('The question the customer is asking.'),
  products: z.array(z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    category: z.string(),
    stock: z.number(),
    image: z.string().optional(),
    imageUrl: z.string().optional(),
    isNew: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    specifications: z.record(z.union([z.string(), z.array(z.string())])).optional(),
  })).describe('Complete product catalog data'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The complete formatted answer to the customer question'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

// Use the API key directly
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log('API Key available:', !!apiKey);

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  // Validate input
  const validatedInput = AnswerQuestionInputSchema.parse(input);
  
  console.log('Received input:', { 
    productId: validatedInput.productId, 
    question: validatedInput.question,
    productsCount: validatedInput.products.length 
  });
  
  try {
    // Check if API key is available
    if (!apiKey) {
      throw new Error('Google Generative AI API key is not configured');
    }

    // Find the specific product if productId is provided
    const specificProduct = validatedInput.productId !== 'general' 
      ? validatedInput.products.find(p => p._id === validatedInput.productId)
      : null;

    // Format products data for the prompt
    const productsData = validatedInput.products.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || product.imageUrl,
      isNew: product.isNew,
      features: product.features || [],
      specifications: product.specifications || {}
    }));

    console.log('Attempting to generate AI response...');
    const { object } = await generateObject({
      model: google('gemini-2.0-flash-exp'),
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      schema: AnswerQuestionOutputSchema,
      prompt: `You are a customer service chatbot for an e-commerce website. 
                   You help customers by answering questions about specific products.
                   Be concise, helpful, and professional in your responses.
               
               COMPLETE PRODUCT CATALOG DATA:
               ${JSON.stringify(productsData, null, 2)}
               
               SPECIFIC PRODUCT CONTEXT:
               ${specificProduct ? JSON.stringify(specificProduct, null, 2) : 'User asking general questions about the catalog'}
               
               Product Information Context:
               - You have access to the complete product catalog above
               - If user asks about a specific product, use the exact data from the catalog
               - If user asks about pricing, use the actual prices from the catalog
               - If user asks about availability, use the actual stock numbers
               - If user asks about features, use the actual features from the catalog
               - If user asks about specifications, use the actual specifications
               - Always maintain a friendly and professional tone
               
               # Response Guidelines:
               1). Format your response with proper markdown:
                   - Use ### for headers
                   - Use **bold** for emphasis
                   - Use *italic* for emphasis
                   - Use tables for structured data
                   - Use lists for multiple points
                   - Use blockquotes for important notes
                   - Use emojis for visual appeal
                   
               2). When answering about specific products:
                   - Use the exact product name from the catalog
                   - Use the exact price from the catalog (₹ symbol for INR)
                   - Use the exact stock numbers from the catalog
                   - Use the exact features from the catalog
                   - Use the exact specifications from the catalog
                   
               3). When comparing products:
                   - Use actual data from the catalog
                   - Create comparison tables with real data
                   - Highlight differences based on actual features
                   
               4). When answering general questions:
                   - Provide overview of the catalog
                   - Use actual data from multiple products
                   - Give accurate statistics from the catalog
                   
               Important Notes:
               - ALWAYS use tables for:
                 * Product listings with multiple attributes
                 * Price comparisons
                 * Feature comparisons
                 * Any data that has more than 2 columns
               - Always use ₹ symbol for INR amounts
               - Format large numbers with commas (e.g., ₹1,00,000)
               - Use K for thousands (e.g., ₹50K)
               - Include current date and time in IST timezone when relevant
               - Use bold for important metrics and totals
               - Keep responses concise but informative
               - Use appropriate emojis for visual hierarchy

               Response Format Examples:

               1. For Specific Product Information:
                  ### 📱 ${specificProduct?.name || 'Product'} Details
                  | Attribute | Value |
                  |:----------|:------|
                  | Product ID | ${specificProduct?._id || 'N/A'} |
                  | Price | ₹${specificProduct?.price?.toLocaleString() || 'N/A'} |
                  | Stock | ${specificProduct?.stock || 'N/A'} units |
                  | Category | ${specificProduct?.category || 'N/A'} |

                  > **Current Date & Time (IST):** ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

               2. For Product Comparison:
                  ### 🔍 Product Comparison
                  | Feature | Product A | Product B |
                  |:--------|:----------|:----------|
                  | Price | ₹25,999 | ₹22,999 |
                  | Stock | 15 units | 8 units |
                  | **Recommendation** | **Better Value** | Good Budget Option |

               3. For Catalog Overview:
                  ### 📊 Catalog Summary
                  | Category | Products | Total Value |
                  |:---------|:---------|:------------|
                  | Electronics | 5 | ₹1,25,000 |
                  | Accessories | 3 | ₹15,000 |
                  | **Total** | **8** | **₹1,40,000** |

               User Question: ${validatedInput.question}
               
               Please provide a helpful and detailed answer using the actual product data from the catalog above. If the user is asking about a specific product, use the exact data for that product. If asking for comparisons, use real data from multiple products.`
    });

    console.log('Successfully generated AI response');
    return object;

  } catch (error) {
    console.error('Error calling Google AI API:', error);
    
    // Return a fallback response in case of API error
    return {
      answer: "❌ Technical Difficulty: I'm sorry, I'm experiencing technical difficulties right now. Please try again later or contact our customer support team for assistance."
    };
  }
}

// Optional: Helper function to get available models
export async function getAvailableModels() {
  try {
    console.log('Google AI SDK models available');
    return ['gemini-1.5-flash', 'gemini-1.5-pro'];
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}