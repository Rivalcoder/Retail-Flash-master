'use server';

/**
 * @fileOverview Promo copy generation flow that automatically generates promotional copy when product details change.
 *
 * - generatePromoCopy - A function that handles the promo copy generation process.
 * - GeneratePromoCopyInput - The input type for the generatePromoCopy function.
 * - GeneratePromoCopyOutput - The return type for the generatePromoCopy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  return generatePromoCopyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromoCopyPrompt',
  input: {schema: GeneratePromoCopyInputSchema},
  output: {schema: GeneratePromoCopyOutputSchema},
  prompt: `You are a marketing expert tasked with creating compelling promotional copy for products.

  Based on the product details provided, generate promotional copy that highlights the key features and benefits, especially focusing on any price changes.

  If the price has decreased, include a "Now on sale!" message. Tailor the copy to be concise and attractive to customers.

  Product Name: {{{productName}}}
  Old Price: {{{oldPrice}}}
  New Price: {{{newPrice}}}
  Description: {{{description}}}

  Here is the promotional copy:`,
});

const generatePromoCopyFlow = ai.defineFlow(
  {
    name: 'generatePromoCopyFlow',
    inputSchema: GeneratePromoCopyInputSchema,
    outputSchema: GeneratePromoCopyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
