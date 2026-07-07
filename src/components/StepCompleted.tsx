import React, { useEffect } from 'react';
import { CheckCircle2, Globe, ExternalLink, RefreshCw, Activity, ShieldCheck, Share2, Rocket } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, Target } from '../types';

interface StepCompletedProps {
  project: Project;
  target: Target;
  branch: string;
  onRestartPipeline: () => void;
  onGoToMonitoring: () => void;
}

export const StepCompleted: React.FC<StepCompletedProps> = ({
  project,
  target,
  branch,
  onRestartPipeline,
  onGoToMonitoring,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  const liveUrl = `https://${project.name.toLowerCase()}.deployshield.app`;

  return (
    <div className="space-y-6">
      
      {/* Success Celebration Banner */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white card-18 p-8 shadow-xl relative overflow-hidden">
        
        {/* Background decorative glows */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold border border-white/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Deployment Live & Healthy</span>
            </div>
            
            <h2 className="text-3xl font-black tracking-tight text-white">
              Successfully Deployed to Production!
            </h2>
            
            <p className="text-blue-100 text-sm max-w-xl">
              Project <strong className="text-white font-semibold">{project.name}</strong> (branch <strong className="font-mono text-blue-200">{branch}</strong>) is live on <strong className="text-white">{target.name}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95"
            >
              <span>Visit Live Web App</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onGoToMonitoring}
              className="flex items-center gap-2 px-4 py-3 bg-blue-900/60 hover:bg-blue-900 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all"
            >
              <Activity className="w-4 h-4" />
              <span>Live Health Monitor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics & Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Public Endpoint</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 font-mono text-xs text-blue-600 font-bold truncate flex items-center justify-between">
            <span className="truncate">{liveUrl}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Deployment Health</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-slate-900">100% OK</span>
              <p className="text-[11px] text-slate-500">Latency: 14ms (p99)</p>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Rocket className="w-4 h-4 text-purple-500" />
            <span>Build & Rollout Time</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-slate-900 font-mono">1m 24s</span>
              <p className="text-[11px] text-slate-500">Zero downtime cutover</p>
            </div>
            <div className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs">
              Fast Track
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onRestartPipeline}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Trigger New Pipeline</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Deploy Shield Release', url: liveUrl });
              } else {
                navigator.clipboard.writeText(liveUrl);
                alert('Copied deployment URL to clipboard!');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Release Link</span>
          </button>
        </div>
      </div>

    </div>
  );
};
