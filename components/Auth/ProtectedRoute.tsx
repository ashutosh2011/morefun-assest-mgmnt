import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Replace this with your actual authentication check
    const isAuthenticated = localStorage.getItem('token');
    
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
} 