// src/ai/flows/generate-recipe.ts
'use server';

/**
 * @fileOverview Recipe generation flow based on available ingredients.
 *
 * - generateRecipe - A function that generates recipes based on the ingredients provided.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The type for a single generated recipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available for the recipe. This can be in any language.'),
});

export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const SingleRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  instructions: z.string().describe('Step-by-step instructions for the recipe, with each step being a complete sentence and separated by a newline character ().'),
  ingredientsUsed: z.string().describe('A comma-separated string of the full names of the ingredients used in this recipe.'),
  nutritionInfo: z.string().describe('Nutritional information for the recipe (e.g., calories, protein, carbs, fats).'),
});

export type GenerateRecipeOutput = z.infer<typeof SingleRecipeOutputSchema>;

// The output of the flow will be an array of recipes
const GenerateRecipesOutputSchema = z.array(SingleRecipeOutputSchema);

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput[]> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipesOutputSchema}, // Expecting an array of recipes
  prompt: `Given the following ingredients: {{{ingredients}}}. 
First, detect the language of the ingredients. 
Then, generate 2 distinct recipes.
For each recipe, provide an estimated nutritional breakdown including calories, protein, carbohydrates, and fats.

The response MUST be in the same language as the input ingredients and structured as a JSON array, where each object in the array follows this structure:
- recipeName: The name of the generated recipe.
- ingredientsUsed: A comma-separated string of the full names of the ingredients used in this recipe.
- instructions: A single string containing step-by-step instructions for the recipe. Each instruction step MUST be a complete sentence, and each step MUST be separated by a newline character (
).
- nutritionInfo: A string containing the estimated nutritional information for the recipe, including calories, protein, carbohydrates, and fats.

Example of the expected JSON array structure:
[
  {
    "recipeName": "Recipe 1 Name",
    "ingredientsUsed": "Ingredient A, Ingredient B",
    "instructions": "Step 1 for Recipe 1.
Step 2 for Recipe 1.",
    "nutritionInfo": "Calories: X, Protein: Y, Carbs: Z, Fats: W"
  },
  {
    "recipeName": "Recipe 2 Name",
    "ingredientsUsed": "Ingredient C, Ingredient D",
    "instructions": "Step 1 for Recipe 2.
Step 2 for Recipe 2.",
    "nutritionInfo": "Calories: A, Protein: B, Carbs: C, Fats: D"
  }
]
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipesOutputSchema, // The flow now outputs an array of recipes
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
