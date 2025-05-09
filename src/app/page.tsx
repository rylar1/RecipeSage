
'use client';

import { Button } from '@/components/ui/button';
import { ChefHat, Zap, LogIn, LogOut } from 'lucide-react'; // Added LogIn, LogOut
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context'; // Import useAuth
import SignOutButton from '@/components/signout-button';

export default function LandingPage() {
  const { currentUser, loading } = useAuth(); // Get auth state

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 text-white">
      {/* Header */}
      <header className="py-6 px-4 md:px-8 shadow-md bg-white/10 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ChefHat size={36} className="text-white" />
            <h1 className="text-3xl font-bold">RecipeSage</h1>
          </div>
          <nav className="space-x-4 flex items-center">
            <Link href="/generate" passHref>
              <Button variant="ghost" className="text-lg hover:bg-white/20">
                Generate Recipes
              </Button>
            </Link>
            {!loading && currentUser ? (
              <SignOutButton />
            ) : !loading ? (
              <Link href="/signin" passHref>
                <Button variant="outline" className="text-lg bg-transparent hover:bg-white/20">
                  <LogIn className="mr-2 h-5 w-5" /> Sign In
                </Button>
              </Link>
            ) : (
              <div className="h-10 w-24 rounded-md bg-white/20 animate-pulse"></div> // Loading Skeleton
            )}
          </nav>
        </div>
      </header>

      {/* Body - Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-8 shadow-lg">
          <Zap size={64} className="text-yellow-300" />
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Unlock Culinary Creativity with AI
        </h2>
        <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl">
          Got a handful of ingredients? Don't know what to cook? RecipeSage instantly crafts delicious recipes tailored to what you have in your kitchen. Say goodbye to food waste and hello to new culinary adventures!
        </p>
        {!loading && currentUser && (
          <p className="text-2xl mb-6">Welcome back, {currentUser.email}!</p>
        )}
        <Link href="/generate" passHref>
          <Button 
            size="lg" 
            className="text-xl py-8 px-10 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Start Cooking Now
          </Button>
        </Link>
      </main>

      {/* Body - Features Section (Optional) */}
      <section className="py-16 md:py-24 bg-white/5">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
          <div className="p-6 bg-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Image src="https://picsum.photos/seed/feature1/300/200" alt="Diverse Ingredients" width={300} height={200} className="rounded-lg mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Use What You Have</h3>
            <p className="text-white/80">
              Simply list your available ingredients, and our AI chef will whip up creative recipe suggestions.
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Image src="https://picsum.photos/seed/feature2/300/200" alt="Multiple Recipe Options" width={300} height={200} className="rounded-lg mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Multiple Options</h3>
            <p className="text-white/80">
              Get multiple recipe ideas from a single set of ingredients. Explore different culinary styles!
            </p>
          </div>
          <div className="p-6 bg-white/10 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <Image src="https://picsum.photos/seed/feature3/300/200" alt="Nutritional Information" width={300} height={200} className="rounded-lg mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Nutritional Insights</h3>
            <p className="text-white/80">
              Understand your meals better with estimated nutritional information for each generated recipe.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center bg-gray-900/50">
        <div className="container mx-auto">
          <p className="text-white/70">&copy; {new Date().getFullYear()} RecipeSage. All rights reserved.</p>
          <p className="text-sm text-white/60 mt-1">
            Powered by Genkit and Google AI. Explore the future of cooking.
          </p>
        </div>
      </footer>
    </div>
  );
}
