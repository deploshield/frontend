import { useState, useEffect } from 'react';
import { ChevronDown, Activity, Server, Wifi, Clock, Loader2 } from 'lucide-react';
import { projectsApi, Project } from '../../api/projects';
import api from '../../api/client';

interface HealthData {
  cpu: number;
  memory: number;
  uptime: string;
  latency: string;
  status: string;
}

export const SystemHealth = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<HealthData | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await projectsApi.list();
        setProjects(data);
        if (data.length > 0) {
          setSelected(data[0].id);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fetchHealth = async () => {
      try {
        const data = await api.get<HealthData>(`/projects/${selected}/health`).then(r => r.data);
        setHealth(data);
      } catch {
        setHealth({ cpu: 0, memory: 0, uptime: '—', latency: '—', status: 'Unknown' });
      }
    };
    fetchHealth();
  }, [selected]);

  const selectedProject = projects.find(p => p.id === selected);

  if (loading) {
    return (
      <div className="bg-white card-18 border border-[#E5E7EB] shadow-soft p-5 flex items-center justify-center py-12">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="bg-white card-18 border border-[#E5E7EB] shadow-soft p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-3">System Health</h2>
        <p className="text-xs text-slate-500 text-center py-4">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white card-18 border border-[#E5E7EB] shadow-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900">System Health</h2>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F8F4EC] border border-[#E5E7EB] rounded-lg text-[11px] font-semibold text-slate-700 hover:border-blue-300 transition-colors cursor-pointer"
          >
            <span className="max-w-[100px] truncate">{selectedProject?.name || '—'}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-20 py-1 overflow-hidden max-h-48 overflow-y-auto">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => { setSelected(proj.id); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    selected === proj.id ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {proj.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {health ? (
        <>
          <div className="flex items-center gap-1.5 mb-4">
            <span className={`w-2 h-2 rounded-full ${health.status === 'Healthy' ? 'bg-emerald-500 animate-pulse' : health.status === 'Down' ? 'bg-rose-500' : 'bg-amber-500'}`} />
            <span className={`text-xs font-bold ${health.status === 'Healthy' ? 'text-emerald-600' : health.status === 'Down' ? 'text-rose-600' : 'text-amber-600'}`}>
              {health.status}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs text-slate-600">CPU</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{health.cpu}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${health.cpu}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-xs text-slate-600">Memory</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{health.memory}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${health.memory}%` }} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-xs text-slate-600">Latency</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{health.latency}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-xs text-slate-600">Uptime</span>
              </div>
              <span className="text-xs font-bold text-slate-900">{health.uptime}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        </div>
      )}
    </div>
  );
};
