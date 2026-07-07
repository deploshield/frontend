import React, { useState } from 'react';
import { Settings, HardDrive, Cloud, Bell, Key, Moon, Sun, ShieldCheck, Check, Copy } from 'lucide-react';

interface SettingsViewProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const SettingsView: React.FC<SettingsViewProps> = ({ isDarkMode, setIsDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'docker' | 'cloud' | 'notifications' | 'apikeys' | 'appearance'>('github');
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('ds_live_sec_8912938129381293812938');

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleRegenerateApiKey = () => {
    const newKey = `ds_live_sec_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Navigation Tabs */}
      <div className="bg-white card-18 p-4 border border-slate-200/80 shadow-soft flex items-center gap-2 overflow-x-auto scrollbar-none">
        
        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'github'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GithubIcon className="w-4 h-4" />
          <span>GitHub Integration</span>
        </button>

        <button
          onClick={() => setActiveTab('docker')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'docker'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          <span>Docker Registry</span>
        </button>

        <button
          onClick={() => setActiveTab('cloud')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'cloud'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloud Providers</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('apikeys')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'apikeys'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>API Keys</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'appearance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Appearance & Dark Mode</span>
        </button>

      </div>

      {/* Tab Panels */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft space-y-6">
        
        {activeTab === 'github' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GithubIcon className="w-5 h-5 text-blue-600" />
              <span>GitHub OAuth App Connection</span>
            </h3>
            <p className="text-xs text-slate-500">
              Deploy Shield is authorized to read repositories, process commit webhooks, and publish status checks.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  GH
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">@acme-corp Organization</h4>
                  <p className="text-xs text-slate-500">Connected with Full Repository Admin Scope</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">
                Active Sync
              </span>
            </div>
          </div>
        )}

        {activeTab === 'docker' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span>Container Registries Configuration</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">GHCR Registry Host</label>
                <input type="text" defaultValue="ghcr.io/acme-corp" className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg" />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">AWS ECR Registry URI</label>
                <input type="text" defaultValue="123456789012.dkr.ecr.us-east-1.amazonaws.com" className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cloud' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              <span>Cloud Provider API Credentials</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs text-slate-900">AWS Access Key ID</span>
                <input type="password" value="AKIAIOSFODNN7EXAMPLE" readOnly className="w-full px-3 py-1.5 text-xs font-mono bg-white border rounded-lg" />
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-xs text-slate-900">Google Cloud Service Account JSON</span>
                <input type="password" value="gcp-service-account-key-secure" readOnly className="w-full px-3 py-1.5 text-xs font-mono bg-white border rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <span>Webhook & Alert Channels</span>
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Slack Webhook URL</label>
              <input type="text" defaultValue="https://hooks.slack.com/services/T00/B00/XXXX" className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg" />
            </div>
          </div>
        )}

        {activeTab === 'apikeys' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <span>Deploy Shield API Authentication Key</span>
            </h3>
            <p className="text-xs text-slate-500">
              Use this key to trigger deployments programmatically via CI/CD pipelines or CLI.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
              <button
                onClick={handleCopyApiKey}
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
              >
                {copiedApiKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedApiKey ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleRegenerateApiKey}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              <span>Theme & Interface Settings</span>
            </h3>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Dark Mode Theme</h4>
                <p className="text-xs text-slate-500">Enable sleek high-contrast navy dark palette</p>
              </div>

              <button
                onClick={() => setIsDarkMode(prev => !prev)}
                className={`p-3 rounded-2xl flex items-center gap-2 font-bold text-xs transition-all ${
                  isDarkMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-white'
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{isDarkMode ? 'Switch to Light' : 'Switch to Dark'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
