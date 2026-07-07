import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, XCircle, Clock, Globe, AlertTriangle, X, Loader2 } from 'lucide-react';
import { deploymentsApi, type Deployment } from '../api/deployments';
import { projectsApi, type Project } from '../api/projects';
import { serversApi, type Server } from '../api/servers';

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}

export function HistoryPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [projects, setProjects] = useState<Record<string, Project>>({});
  const [servers, setServers] = useState<Record<string, Server>>({});
  const [loading, setLoading] = useState(true);
  const [selectedDep, setSelectedDep] = useState<Deployment | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [deps, projs, srvs] = await Promise.all([
          deploymentsApi.list(),
          projectsApi.list(),
          serversApi.list(),
        ]);
        setDeployments(deps);
        setProjects(Object.fromEntries(projs.map(p => [p.id, p])));
        setServers(Object.fromEntries(srvs.map(s => [s.id, s])));
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getProjectName = (id: string) => projects[id]?.name || id;
  const getServerName = (id?: string) => id ? (servers[id]?.name || id) : '—';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-900">History</h1>
        <p className="text-xs text-slate-500 mt-0.5">{deployments.length} deployment{deployments.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </div>
      ) : deployments.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-sm font-bold text-slate-900">No deployments yet</p>
          <p className="text-xs text-slate-500 mt-1">Run a validation from the Pipeline tab</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deployments.map((dep) => {
            const statusBg = dep.status === 'success' ? 'bg-emerald-500' : dep.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500';
            const statusColor = dep.status === 'success' ? 'text-emerald-600' : dep.status === 'failed' ? 'text-rose-600' : 'text-amber-600';

            return (
              <div
                key={dep.id}
                onClick={() => setSelectedDep(dep)}
                className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col shadow-soft shadow-soft-hover cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusBg}`} />
                  <span className={`text-xs font-semibold capitalize ${statusColor}`}>{dep.status}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">{formatDate(dep.started_at)}</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{getProjectName(dep.project_id)}</p>
                <p className="text-xs text-slate-500 mt-0.5">{getServerName(dep.server_id)}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200/60">
                    {dep.trigger_type}
                  </span>
                  {dep.result?.url && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      Live
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDep && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={() => setSelectedDep(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div>
                <h2 className="text-base font-bold text-slate-900">{getProjectName(selectedDep.project_id)}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{getServerName(selectedDep.server_id)} · {formatDate(selectedDep.started_at)}</p>
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
}
