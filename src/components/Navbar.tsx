import React from 'react';
import { 
  Shield, 
  GitBranch, 
  Layers, 
  Server, 
  History, 
  Activity, 
  Terminal, 
  Settings, 
  Bell, 
  Moon, 
  Sun, 
  Smartphone, 
  Monitor,
  CheckCircle2,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  activeTab: TabType | 'dashboard';
  setActiveTab: (tab: TabType | 'dashboard') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (val: boolean | ((prev: boolean) => boolean)) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  isMobilePreview,
  setIsMobilePreview,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenProfile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Pipeline', icon: GitBranch },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'targets', label: 'Targets', icon: Server },
    { id: 'history', label: 'History', icon: History },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-2.5 group focus:outline-none text-left"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">
                    Deploy<span className="text-blue-600">Shield</span>
                  </span>
                  <span className="text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                    Enterprise
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 -mt-0.5 hidden sm:block">
                  DevOps Automation & Security
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType | 'dashboard')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Toggle: Web Desktop vs Mobile UI Preview */}
            <div className="hidden md:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setIsMobilePreview(false)}
                title="Desktop View"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  !isMobilePreview
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Web UI</span>
              </button>
              <button
                onClick={() => setIsMobilePreview(true)}
                title="Mobile UI Preview Mode"
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  isMobilePreview
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile App</span>
              </button>
            </div>

            {/* GitHub Connect Button */}
            <button className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs transition-colors">
              <GithubIcon className="w-4 h-4 text-slate-800" />
              <span>@acme-corp</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Connected
              </span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(prev => !prev)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Profile Button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                AR
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                Alex Rivera
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Sub-Nav Bar for small screens (Web view) */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType | 'dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
