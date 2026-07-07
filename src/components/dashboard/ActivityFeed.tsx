import { GitCommit, Shield, Zap, RefreshCw } from 'lucide-react';

const activities = [
  {
    id: 1,
    icon: GitCommit,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Pipeline triggered',
    detail: 'acme-api-gateway • main',
    time: '2m ago',
  },
  {
    id: 2,
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'SSL certificate renewed',
    detail: 'api.acme.com • 90 days valid',
    time: '14m ago',
  },
  {
    id: 3,
    icon: Zap,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Build cache refreshed',
    detail: 'Docker layer sha256:e3b0 cached',
    time: '1h ago',
  },
  {
    id: 4,
    icon: RefreshCw,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    title: 'Auto-scaling triggered',
    detail: 'K8s cluster scaled to 4 replicas',
    time: '3h ago',
  },
];

export const ActivityFeed = () => {
  return (
    <div className="bg-white card-18 border border-[#E5E7EB] shadow-soft p-6">
      <h2 className="text-base font-bold text-slate-900 mb-4">Activity Feed</h2>

      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${activity.iconBg} ${activity.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900">{activity.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{activity.detail}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-medium shrink-0">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
