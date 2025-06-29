'use server';

/**
 * @fileOverview A customer Q&A bot that answers questions about products based on real-time catalog data.
 * 
 * - answerQuestion - A function that answers a customer question about a product.
 * - AnswerQuestionInput - The input type for the answerQuestion function.
 * - AnswerQuestionOutput - The return type for the answerQuestion function.
 */

import { groq } from '@/ai/genkit';
import { z } from 'zod';

const AnswerQuestionInputSchema = z.object({
  productId: z.string().describe('The ID of the product the question is about.'),
  question: z.string().describe('The question the customer is asking.'),
});
export type AnswerQuestionInput = z.infer<typeof AnswerQuestionInputSchema>;

const AnswerQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the customer question.'),
});
export type AnswerQuestionOutput = z.infer<typeof AnswerQuestionOutputSchema>;

export async function answerQuestion(input: AnswerQuestionInput): Promise<AnswerQuestionOutput> {
  // Validate input
  const validatedInput = AnswerQuestionInputSchema.parse(input);
  
  console.log('Received input:', validatedInput); // Debug logging
  
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a customer service chatbot for an e-commerce website. 
                   You help customers by answering questions about specific products.
                   Be concise, helpful, and professional in your responses.
                   If you don't have specific information about a product, be honest about it
                   and suggest how the customer might get more details.
                   
                   Product Information Context:
                   - You are answering about a product with ID: ${validatedInput.productId}
                   - Provide helpful, accurate information based on typical product features
                   - If asked about specifications, dimensions, materials, etc., provide reasonable estimates or suggest contacting support for exact details
                   - If the product is not found, inform the user politely and suggest checking the catalog or contacting support.
                   - Always maintain a friendly and professional tone.
                   -while user asking a question , what is price of the product give me the price of the product in INR currency. and also current date and time in IST timezone. and price should tell in current year which is 2025 price only
                   - If the user asks about the availability of the product, provide a general response about stock availability without specific numbers.
                   - If the user asks about shipping, provide general information about shipping options and times.
                   - If the user asks about returns or exchanges, provide general information about the return policy.
                   - If the user asks about warranty or support, provide general information about warranty options and how
                   -if the user asks about the product's features, provide a general overview of typical features for that type of product.
                   -if the user asks to compare the product with another product, provide a general comparison based on typical features and specifications. and you should reply in a way that the user can understand the difference between the two products. and also you should tell the user that the product is better than the other product and also you must  visualization in like table remember that .
                   - If the user asks about the product's compatibility with other products, provide a general overview
                   - If the user asks about the product's reviews or ratings, provide a general overview of typical customer feedback for that type of product.
                   - If the user asks about the product's usage or care instructions, provide a general overview of typical usage and care instructions for that type of product.
                   - if the user asks to compare use visualization like category total sales between products	Bar Chart / Column Chart	Shows side-by-side comparison easily Compare product performance over time	Line Chart Good for trend over months/days`
        },
        {
          role: "user",
          content: `I have a question about Product ID: ${validatedInput.productId}
                   
                   Question: ${validatedInput.question}
                   
                   Please provide a helpful and detailed answer about this product.`
        }
      ],
      model: "llama3-8b-8192", // You can also use "llama3-70b-8192" or "mixtral-8x7b-32768"
      temperature: 0.7,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content || "I apologize, but I'm unable to provide an answer at this time. Please try again or contact customer support.";

    console.log('AI Response:', answer); // Debug logging

    // Validate output
    const result = AnswerQuestionOutputSchema.parse({ answer });
    return result;

  } catch (error) {
    console.error('Error calling Groq API:', error);
    
    // Return a fallback response in case of API error
    return {
      answer: "I'm sorry, I'm experiencing technical difficulties right now. Please try again later or contact our customer support team for assistance."
    };
  }
}

// Optional: Helper function to get available models
export async function getAvailableModels() {
  try {
    const models = await groq.models.list();
    return models.data;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}