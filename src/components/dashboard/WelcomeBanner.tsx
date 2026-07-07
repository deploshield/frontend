import { Sparkles, Shield, Activity, GitBranch } from 'lucide-react';

export const WelcomeBanner = () => {
  return (
    <div className="bg-hero-blue-gradient text-white card-18 p-8 shadow-xl relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>All Systems Operational</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, Alex Rivera
          </h1>

          <p className="text-sm text-blue-100/90 leading-relaxed max-w-lg">
            Your infrastructure is running smoothly. <strong className="text-white">99.98% uptime</strong> across
            all clusters with zero critical incidents in the last 30 days.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold">
            <Shield className="w-4 h-4 text-emerald-300" />
            <span>0 Vulnerabilities</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold">
            <Activity className="w-4 h-4 text-blue-200" />
            <span>8 Clusters Active</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-semibold">
            <GitBranch className="w-4 h-4 text-amber-200" />
            <span>6 Pipelines Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
