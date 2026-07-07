import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TargetsPage } from './pages/TargetsPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { GithubReposPage } from './pages/GithubReposPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SSOCallbackPage } from './pages/SSOCallbackPage';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#F8F4EC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/sso-callback" element={<SSOCallbackPage />} />

        {/* Protected routes */}
        <Route element={<AuthGate><MainLayout /></AuthGate>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/targets" element={<TargetsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/github-repos" element={<GithubReposPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
