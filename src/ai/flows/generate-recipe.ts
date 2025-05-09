// src/ai/flows/generate-recipe.ts
'use server';

/**
 * @fileOverview Recipe generation flow based on available ingredients.
 *
 * - generateRecipe - A function that generates a recipe based on the ingredients provided.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available for the recipe. This can be in any language.'),
});

export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  instructions: z.string().describe('Step-by-step instructions for the recipe, with each step being a complete sentence and separated by a newline character ().'),
  ingredientsUsed: z.string().describe('A comma-separated string of the full names of the ingredients used in this recipe.'),
  nutritionInfo: z.string().describe('Nutritional information for the recipe (e.g., calories, protein, carbs, fats).'),
});

export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `Given the following ingredients: {{{ingredients}}}. 
First, detect the language of the ingredients. 
Then, generate a recipe.
Also, provide an estimated nutritional breakdown including calories, protein, carbohydrates, and fats.

The response MUST be in the same language as the input ingredients and structured as follows:
- recipeName: The name of the generated recipe.
- ingredientsUsed: A comma-separated string of the full names of the ingredients used in this recipe.
- instructions: A single string containing step-by-step instructions for the recipe. Each instruction step MUST be a complete sentence, and each step MUST be separated by a newline character (
).
- nutritionInfo: A string containing the estimated nutritional information for the recipe, including calories, protein, carbohydrates, and fats.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
