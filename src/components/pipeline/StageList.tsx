import { CheckCircle2, XCircle, AlertTriangle, Sparkles, Clock } from 'lucide-react';

interface Stage {
  name: string;
  status: string;
  log?: string;
  error?: string;
}

interface StageListProps {
  stages: Stage[];
}

export const StageList: React.FC<StageListProps> = ({ stages }) => {
  const getIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />;
      case 'generated':
        return <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />;
      case 'error':
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-1.5">
      {stages.map((stage, i) => (
        <div key={i} className="flex items-start gap-2.5 py-2 px-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
          <div className="mt-0.5">{getIcon(stage.status)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800">{stage.name}</p>
            {stage.log && <p className="text-[11px] text-slate-500 mt-0.5 break-words">{stage.log}</p>}
            {stage.error && <p className="text-[11px] text-rose-600 mt-0.5 break-words">{stage.error}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
