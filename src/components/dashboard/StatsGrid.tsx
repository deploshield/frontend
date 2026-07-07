import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { projectsApi } from '../../api/projects';
import { serversApi } from '../../api/servers';
import { deploymentsApi, Deployment } from '../../api/deployments';

export const StatsGrid = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { title: 'Projects Registered', value: '—' },
    { title: 'Servers Connected', value: '—' },
    { title: 'Deployments Run', value: '—' },
    { title: 'Validation Pass Rate', value: '—' },
  ]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [projects, servers, deployments] = await Promise.all([
          projectsApi.list(),
          serversApi.list(),
          deploymentsApi.list(1, 1000),
        ]);

        const deps: Deployment[] = Array.isArray(deployments) ? deployments : [];
        const totalDeps = deps.length;
        const successDeps = deps.filter(d => d.status === 'success').length;
        const passRate = totalDeps > 0 ? Math.round((successDeps / totalDeps) * 100) : 0;

        setStats([
          { title: 'Projects Registered', value: String(projects.length) },
          { title: 'Servers Connected', value: String(servers.length) },
          { title: 'Deployments Run', value: String(totalDeps) },
          { title: 'Validation Pass Rate', value: `${passRate}%` },
        ]);
      } catch {
        // keep default values
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="bg-white rounded-xl p-4 border border-[#E5E7EB]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{stat.title}</p>
          {loading ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin mt-2" />
          ) : (
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
          )}
        </div>
      ))}
    </div>
  );
};
