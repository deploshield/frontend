import { useState } from 'react';
import { Rocket } from 'lucide-react';
import { StatsGrid } from './StatsGrid';
import { RecentDeployments } from './RecentDeployments';
import { SystemHealth } from './SystemHealth';
import { ActivityFeed } from './ActivityFeed';
import { PipelineModal } from '../pipeline';

interface DashboardViewProps {
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateToTab }) => {
  const [pipelineOpen, setPipelineOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top bar with Run Pipeline button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Overview of your deployments and infrastructure</p>
        </div>
        <button
          onClick={() => setPipelineOpen(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-sm shrink-0"
        >
          <Rocket className="w-4 h-4" />
          <span className="hidden sm:inline">Run Pipeline</span>
          <span className="sm:hidden">Run</span>
        </button>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentDeployments onViewAll={() => onNavigateToTab('history')} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <SystemHealth />
          <ActivityFeed />
        </div>
      </div>

      <PipelineModal isOpen={pipelineOpen} onClose={() => setPipelineOpen(false)} />
    </div>
  );
};
