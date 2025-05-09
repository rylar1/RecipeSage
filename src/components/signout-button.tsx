'use client'
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function SignOutButton() {
  const { currentUser } = useAuth();
  const router = useRouter(); // Initialize router

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Signed out successfully!');
      router.push('/'); // Redirect to home page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Button onClick={handleSignOut} variant="outline" className="text-lg bg-transparent hover:bg-white/20 text-white">
      Sign Out
    </Button>
  );
}
