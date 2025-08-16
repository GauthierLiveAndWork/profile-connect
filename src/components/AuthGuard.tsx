import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, loading } = useAuth();

  console.log('🔐 AuthGuard: loading =', loading, 'isAuthenticated =', isAuthenticated);

  if (loading) {
    console.log('🔐 AuthGuard: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔐 AuthGuard: Redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('🔐 AuthGuard: Rendering children');
  return <>{children}</>;
};