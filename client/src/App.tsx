import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context"; // Updated import path
import { lazy, Suspense, useEffect, useState } from "react";

// Layouts
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">{children}</div>
);

  const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const [, setLocation] = useLocation();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
      if (!isLoading && !isAuthenticated) {
        setLocation("/login");
      }
    }, [isLoading, isAuthenticated, setLocation]);

    if (!isClient || isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null; // Will be immediately replaced by the redirect
    }

    return <div className="min-h-screen bg-background">{children}</div>;
  };

// Lazy-loaded pages with Suspense fallback
const withSuspense = (Component: React.ComponentType) => (props: any) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component {...props} />
  </Suspense>
);

// Lazy load pages
const Landing = lazy(() => import("@/pages/landing"));
const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const SettingsPage = lazy(() => import("@/pages/settings"));
const NotFound = lazy(() => import("@/pages/not-found"));

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Landing />
        </PublicLayout>
      </Route>
      
      <Route path="/login">
        <PublicLayout>
          <LoginPage />
        </PublicLayout>
      </Route>
      
      <Route path="/register">
        <PublicLayout>
          <RegisterPage />
        </PublicLayout>
      </Route>
      
      <Route path="/about">
        <PublicLayout>
          <AboutPage />
        </PublicLayout>
      </Route>
      
      <Route path="/contact">
        <PublicLayout>
          <ContactPage />
        </PublicLayout>
      </Route>

      {/* Protected Routes */}
      <Route path="/profile">
        <ProtectedLayout>
          <ProfilePage />
        </ProtectedLayout>
      </Route>
      
      <Route path="/settings">
        <ProtectedLayout>
          <SettingsPage />
        </ProtectedLayout>
      </Route>

      {/* 404 - Must be last */}
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;