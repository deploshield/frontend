import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Globe, Zap, ChevronDown, ChevronRight, GitBranch, Building2 } from 'lucide-react';
import api from '../api/client';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [githubExpanded, setGithubExpanded] = useState(false);
  const githubConnected = !!user?.externalAccounts?.find(a => a.provider === 'github');

  useEffect(() => {
    api.get('/health').then(() => setApiOnline(true)).catch(() => setApiOnline(false));
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your account and integrations</p>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${apiOnline ? 'bg-emerald-50' : apiOnline === false ? 'bg-rose-50' : 'bg-slate-50'}`}>
            <Globe className={`w-4 h-4 ${apiOnline ? 'text-emerald-600' : apiOnline === false ? 'text-rose-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">API Status</p>
            {apiOnline === null ? (
              <p className="text-sm font-bold text-slate-400">Checking...</p>
            ) : apiOnline ? (
              <p className="text-sm font-bold text-emerald-600">Online</p>
            ) : (
              <p className="text-sm font-bold text-rose-600">Offline</p>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase">Version</p>
            <p className="text-sm font-bold text-slate-900">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Menu Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-soft overflow-hidden">
        {/* GitHub Accordion */}
        <button
          onClick={() => setGithubExpanded(!githubExpanded)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center">
              <GithubIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">GitHub</p>
              <p className="text-xs text-slate-500">
                {githubConnected ? 'Import repos & organizations' : 'Not connected'}
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${githubExpanded ? 'rotate-180' : ''}`} />
        </button>

        {githubExpanded && (
          <div className="border-t border-[#E5E7EB]">
            {githubConnected ? (
              <>
                <button
                  onClick={() => navigate('/github-repos?tab=repos')}
                  className="w-full flex items-center justify-between px-6 py-3.5 pl-16 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <GitBranch className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-800">Repositories</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
                <div className="h-px bg-[#E5E7EB] mx-6" />
                <button
                  onClick={() => navigate('/github-repos?tab=orgs')}
                  className="w-full flex items-center justify-between px-6 py-3.5 pl-16 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-slate-800">Organizations</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </>
            ) : (
              <div className="px-6 py-4 pl-16">
                <p className="text-xs text-slate-500">Sign in with GitHub OAuth to access your repositories and organizations.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl border border-rose-100 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Sign Out</p>
          <p className="text-xs text-slate-500">End your current session</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
