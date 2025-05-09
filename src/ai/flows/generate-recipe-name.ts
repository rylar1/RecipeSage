// use server'
'use server';

/**
 * @fileOverview A recipe name generation AI agent.
 *
 * - generateRecipeName - A function that handles the recipe name generation process.
 * - GenerateRecipeNameInput - The input type for the generateRecipeName function.
 * - GenerateRecipeNameOutput - The return type for the generateRecipeName function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeNameInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A list of ingredients available for the recipe.'),
});
export type GenerateRecipeNameInput = z.infer<typeof GenerateRecipeNameInputSchema>;

const GenerateRecipeNameOutputSchema = z.object({
  recipeName: z.string().describe('The generated name of the recipe.'),
});
export type GenerateRecipeNameOutput = z.infer<typeof GenerateRecipeNameOutputSchema>;

export async function generateRecipeName(input: GenerateRecipeNameInput): Promise<GenerateRecipeNameOutput> {
  return generateRecipeNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeNamePrompt',
  input: {schema: GenerateRecipeNameInputSchema},
  output: {schema: GenerateRecipeNameOutputSchema},
  prompt: `You are a creative recipe name generator. Based on the ingredients provided, generate a creative and appealing name for the recipe.

Ingredients: {{{ingredients}}}`,
});

const generateRecipeNameFlow = ai.defineFlow(
  {
    name: 'generateRecipeNameFlow',
    inputSchema: GenerateRecipeNameInputSchema,
    outputSchema: GenerateRecipeNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
