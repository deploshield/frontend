import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, ArrowLeftRight, Clock, ChevronRight, Loader2, X, Globe, XCircle } from 'lucide-react';
import { deploymentsApi, Deployment } from '../../api/deployments';
import { projectsApi, Project } from '../../api/projects';
import { serversApi, Server } from '../../api/servers';

interface RecentDeploymentsProps {
  onViewAll: () => void;
}

export const RecentDeployments: React.FC<RecentDeploymentsProps> = ({ onViewAll }) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDep, setSelectedDep] = useState<Deployment | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [depsData, projData, srvData] = await Promise.all([
          deploymentsApi.list(1, 6),
          projectsApi.list(),
          serversApi.list(),
        ]);
        setDeployments(Array.isArray(depsData) ? depsData : []);
        setProjects(projData);
        setServers(srvData);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || 'Unknown';
  const getServerName = (id?: string) => (id && servers.find(s => s.id === id)?.name) || '—';

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200/60', Icon: CheckCircle2, label: 'Success' };
      case 'failed':
        return { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200/60', Icon: AlertTriangle, label: 'Failed' };
      case 'rolled_back':
        return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200/60', Icon: ArrowLeftRight, label: 'Rolled Back' };
      case 'running':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200/60', Icon: Loader2, label: 'Running' };
      default:
        return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200/60', Icon: Clock, label: status };
    }
  };

  const formatTime = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  return (
    <div className="bg-white card-18 border border-[#E5E7EB] shadow-soft overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Deployments</h2>
          <p className="text-xs text-slate-500 mt-0.5">Latest pipeline executions across your infrastructure</p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        </div>
      ) : deployments.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="w-6 h-6 text-slate-300 mx-auto mb-2" />
          <p className="text-sm text-slate-500">No deployments yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50">
          {deployments.map((item) => {
            const statusStyle = getStatusStyle(item.status);
            const StatusIcon = statusStyle.Icon;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedDep(item)}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${statusStyle.bg} ${statusStyle.text} flex items-center justify-center shrink-0`}>
                    <StatusIcon className={`w-4 h-4 ${item.status === 'running' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 truncate">{getProjectName(item.project_id)}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      Target: {getServerName(item.server_id)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      {statusStyle.label}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 justify-end">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{formatTime(item.started_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedDep && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={() => setSelectedDep(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-base font-bold text-slate-900">{getProjectName(selectedDep.project_id)}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{getServerName(selectedDep.server_id)} · {formatTime(selectedDep.started_at)}</p>
              </div>
              <button onClick={() => setSelectedDep(null)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${selectedDep.status === 'success' ? 'bg-emerald-500' : selectedDep.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span className={`text-sm font-bold capitalize ${selectedDep.status === 'success' ? 'text-emerald-600' : selectedDep.status === 'failed' ? 'text-rose-600' : 'text-amber-600'}`}>
                  {selectedDep.status}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                  {selectedDep.trigger_type}
                </span>
              </div>

              {selectedDep.result?.url && (
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-[#E5E7EB]">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <a href={selectedDep.result.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-700 hover:underline">
                    {selectedDep.result.url}
                  </a>
                </div>
              )}

              {selectedDep.result?.error && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 rounded-xl border border-rose-200/60">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-700">{selectedDep.result.error}</p>
                </div>
              )}

              {selectedDep.result?.stages && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Pipeline Stages</p>
                  <div className="space-y-1.5">
                    {selectedDep.result.stages.map((stage, i) => (
                      <div key={i} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-slate-50 border border-[#E5E7EB]">
                        {stage.status === 'passed' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : stage.status === 'failed' ? (
                          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span className="text-xs text-slate-700 flex-1">{stage.name}</span>
                        {stage.message && <span className="text-[10px] text-slate-500">{stage.message}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#E5E7EB]">
                <button
                  onClick={() => setSelectedDep(null)}
                  className="w-full py-2.5 bg-white border border-[#E5E7EB] text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
