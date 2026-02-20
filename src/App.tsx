/**
 * CaT4G - Application Root Component
 *
 * Provides the authentication, chord preferences, and app data context layers.
 * Routes are rendered via AppRoutes inside a Layout wrapper.
 */

import { AuthProvider, useAuth, LoginPage } from '@/components/Auth';
import { ChordPreferencesProvider } from '@/contexts/ChordPreferencesContext';
import { AppDataProvider } from '@/contexts/AppDataContext';
import { AppRoutes } from '@/routes';
import { Layout } from '@/components/Layout';

/**
 * Application root component
 * Wraps with AuthProvider for authentication state management
 */
function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

/**
 * Switches content based on authentication state
 */
function AuthenticatedApp() {
  const { isAuthenticated, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050507]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Authenticated - show main application
  return (
    <ChordPreferencesProvider>
      <AppDataProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AppDataProvider>
    </ChordPreferencesProvider>
  );
}

export default App;
