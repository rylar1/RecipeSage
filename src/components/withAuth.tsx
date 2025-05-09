'use client'; // Add this directive

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { ComponentType, useEffect } from 'react';

export default function withAuth<P extends object>(WrappedComponent: ComponentType<P>) {
  const Wrapper = (props: P) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        router.replace('/signin'); // Redirect to sign-in page if not authenticated
      }
    }, [currentUser, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Or a spinner component
    }

    if (!currentUser) {
      return null; // Or a redirecting message, but useEffect handles redirect
    }

    return <WrappedComponent {...props} />;
  };
  Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return Wrapper;
}
