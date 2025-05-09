
'use client';

import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe';
import { generateRecipe } from '@/ai/flows/generate-recipe';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChefHat, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  ingredients: z.string().min(3, {
    message: "Please enter at least one ingredient (minimum 3 characters).",
  }).max(500, {
    message: "Ingredient list cannot exceed 500 characters."
  }),
});

type IngredientsFormValues = z.infer<typeof formSchema>;

// Helper function to detect RTL text
const isRTL = (text: string) => {
  const rtlRegex = /[\u0591-\u07FF\uFB1D-\uFB4F\uFE70-\uFEFC]/;
  return rtlRegex.test(text);
};

export default function RecipeSagePage() {
  const [generatedRecipe, setGeneratedRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipeDirection, setRecipeDirection] = useState<'ltr' | 'rtl'>('ltr');

  const form = useForm<IngredientsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: '',
    },
  });

  async function onSubmit(values: IngredientsFormValues) {
    setIsLoading(true);
    setError(null);
    setGeneratedRecipe(null);

    // Detect text direction
    const direction = isRTL(values.ingredients) ? 'rtl' : 'ltr';
    setRecipeDirection(direction);

    try {
      const result = await generateRecipe({ ingredients: values.ingredients });
      setGeneratedRecipe(result);
    } catch (e) {
      console.error(e);
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-8 md:py-12 flex flex-col items-center min-h-screen">
      <header className="mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ChefHat className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">RecipeSage</h1>
        <p className="text-muted-foreground mt-2 text-lg md:text-xl">Your AI-powered culinary assistant</p>
      </header>
      
      <Image 
        src="https://picsum.photos/1200/400" 
        alt="Culinary ingredients" 
        width={1200} 
        height={400} 
        className="rounded-lg object-cover mb-10 shadow-lg w-full max-w-4xl h-48 md:h-64"
        data-ai-hint="food ingredients"
      />

      <Card className="w-full max-w-2xl shadow-xl rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center text-primary">What's in your kitchen?</CardTitle>
          <CardDescription className="text-center mt-1 bg-primary/20 text-primary-foreground p-3 rounded-lg">
            Enter the ingredients you have, and let AI craft a recipe for you!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="ingredients"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="ingredients" className="text-lg font-semibold">Ingredients</FormLabel>
                    <FormControl>
                      <Textarea
                        id="ingredients"
                        placeholder="e.g., chicken breast, broccoli, soy sauce, rice"
                        className="min-h-[120px] resize-y rounded-md focus:ring-primary focus:border-primary"
                        {...field}
                        aria-label="Ingredients input field"
                      />
                    </FormControl>
                    <FormDescription>
                      Separate ingredients with commas or new lines.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit" className="py-3 text-lg rounded-md" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    "Find Recipe"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8 w-full max-w-2xl rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedRecipe && (
        <Card 
          className="mt-10 w-full max-w-2xl shadow-xl rounded-lg"
          dir={recipeDirection} // Apply text direction here
        >
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-primary">{generatedRecipe.recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground/90">Ingredients Used:</h3>
              <ul className="list-disc list-inside pl-5 space-y-1 text-muted-foreground">
                {generatedRecipe.ingredientsUsed.split(/,|\\n/).map((ing, index) => ing.trim() && (
                  <li key={index}>{ing.trim()}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 text-foreground/90">Instructions:</h3>
              <div 
                className={`prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-line ${recipeDirection === 'rtl' ? 'text-right' : 'text-left'}`}
              >
                {generatedRecipe.instructions.split('\\n').map((line, index) => (
                  <p key={index} className="mb-2">{line}</p>
                ))}
              </div>
            </div>
            {generatedRecipe.nutritionInfo && (
              <div>
                <h3 className="text-xl font-semibold mb-2 text-foreground/90">Nutritional Information (Estimated):</h3>
                <div 
                  className={`prose prose-sm sm:prose-base max-w-none text-muted-foreground whitespace-pre-line ${recipeDirection === 'rtl' ? 'text-right' : 'text-left'}`}
                >
                  {/* Assuming nutritionInfo is a string with newlines for formatting */}
                  {generatedRecipe.nutritionInfo.split('\\n').map((line, index) => (
                    <p key={index} className="mb-1">{line}</p>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Nutritional information is estimated by AI and may not be accurate. Always consult a professional for precise dietary information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && !generatedRecipe && !error && (
         <div className="mt-10 text-center text-muted-foreground w-full max-w-2xl p-8 md:p-12 border-2 border-dashed border-muted rounded-lg bg-card">
            <ChefHat size={56} className="mx-auto mb-6 text-primary/70" />
            <h3 className="text-xl font-semibold mb-2">Ready for a culinary adventure?</h3>
            <p className="text-md">Enter your ingredients above, and we'll whip up a recipe for you!</p>
         </div>
      )}
      
      <footer className="mt-16 mb-8 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} RecipeSage. All rights reserved.</p>
        <p>Powered by AI.</p>
      </footer>
    </div>
  );
}
