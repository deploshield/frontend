import React, { useState } from 'react';
import { Server, Plus, Cloud, Globe, Boxes, Terminal, Radio, Cpu, CheckCircle2, Layers } from 'lucide-react';
import { Target } from '../types';

interface TargetsViewProps {
  targets: Target[];
  onSelectTargetForDeploy: (target: Target) => void;
}

export const TargetsView: React.FC<TargetsViewProps> = ({ targets, onSelectTargetForDeploy }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'Amazon Web Services': return <Cloud className="w-5 h-5 text-amber-500" />;
      case 'DigitalOcean': return <Globe className="w-5 h-5 text-blue-500" />;
      case 'Microsoft Azure': return <Server className="w-5 h-5 text-sky-500" />;
      case 'Google Cloud Platform': return <Cloud className="w-5 h-5 text-rose-500" />;
      case 'Railway Inc': return <Terminal className="w-5 h-5 text-purple-500" />;
      case 'Render': return <Boxes className="w-5 h-5 text-teal-500" />;
      case 'Kubernetes': return <Cpu className="w-5 h-5 text-blue-600" />;
      default: return <Radio className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            <span>Infrastructure Deployment Targets</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Managed clusters, cloud runners, and baremetal Docker hosts integrated with Deploy Shield.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Connect New Target</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {targets.map((target) => (
          <div
            key={target.id}
            className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  {getProviderIcon(target.provider)}
                </div>
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{target.status}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900">
                {target.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {target.provider}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Region:</span>
                  <span className="font-mono text-slate-900 font-semibold">{target.region}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Latency:</span>
                  <span className="font-mono text-emerald-600 font-bold">{target.latencyMs} ms</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Workloads:</span>
                  <span className="font-bold text-blue-600">{target.activeContainers} containers</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => onSelectTargetForDeploy(target)}
                className="w-full py-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Deploy Workload Here</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Target Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white card-18 w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">
              Connect Deployment Target
            </h3>
            <p className="text-xs text-slate-500">
              Paste cluster Kubeconfig or Cloud API access token to link new deployment target.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Name</label>
                <input type="text" placeholder="e.g. EU-West K8s Cluster" className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Access Token / Kubeconfig</label>
                <textarea rows={3} placeholder="Paste credentials..." className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-semibold bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-xl">Link Target</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
