import React, { useState } from 'react';
import { 
  Server, 
  Check, 
  ArrowRight, 
  Cloud, 
  Globe, 
  Terminal, 
  Boxes, 
  Cpu, 
  Radio, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Target } from '../types';

interface StepDeployProps {
  targets: Target[];
  selectedTarget: Target;
  setSelectedTarget: (t: Target) => void;
  onDeployComplete: () => void;
}

export const StepDeploy: React.FC<StepDeployProps> = ({
  targets,
  selectedTarget,
  setSelectedTarget,
  onDeployComplete,
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(-1);

  const timelineSteps = [
    { label: 'Preparing', desc: 'Acquiring lock & pulling container manifest' },
    { label: 'Uploading', desc: 'Transferring layer blobs to cluster node' },
    { label: 'Creating Container', desc: 'Setting up cgroups, namespace & network bridge' },
    { label: 'Starting', desc: 'Invoking entrypoint PID 1 process' },
    { label: 'Health Check', desc: 'Executing HTTP probe /healthz (port 3000)' },
    { label: 'Completed', desc: 'Traffic routing switched over to new deployment' },
  ];

  const handleStartDeployment = (target: Target) => {
    setSelectedTarget(target);
    setIsDeploying(true);
    setCurrentTimelineIndex(0);

    timelineSteps.forEach((_, idx) => {
      setTimeout(() => {
        setCurrentTimelineIndex(idx);
        if (idx === timelineSteps.length - 1) {
          setIsDeploying(false);
        }
      }, (idx + 1) * 900);
    });
  };

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
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-blue-600" />
              Deployment Targets
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select target infrastructure and trigger automated container rollout.
            </p>
          </div>

          {currentTimelineIndex === timelineSteps.length - 1 && (
            <button
              onClick={onDeployComplete}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
            >
              <span>Proceed to Domain Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Deployment Target Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {targets.map((target) => {
          const isSelected = selectedTarget.id === target.id;
          return (
            <div
              key={target.id}
              className={`group bg-white card-18 p-5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-lg'
                  : 'border-slate-200/80 hover:border-slate-300 shadow-soft hover:shadow-soft-hover'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    {getProviderIcon(target.provider)}
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[11px] font-semibold border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{target.status}</span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {target.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {target.region} • {target.type}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Latency: <strong className="font-mono text-slate-800">{target.latencyMs}ms</strong></span>
                  <span>Active: <strong className="text-blue-600 font-bold">{target.activeContainers}</strong></span>
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  disabled={isDeploying}
                  onClick={() => handleStartDeployment(target)}
                  className={`w-full py-2 px-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    isSelected && isDeploying
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {isSelected && isDeploying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deploying...</span>
                    </>
                  ) : (
                    <span>Deploy to {target.id === 'aws-ec2' ? 'AWS' : target.id === 'digitalocean' ? 'DO' : target.name.split(' ')[0]}</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment Progress Animated Timeline */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-600" />
          <span>Deployment Rollout Progress — {selectedTarget.name}</span>
        </h3>

        <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6">
          {timelineSteps.map((step, idx) => {
            const isDone = currentTimelineIndex > idx;
            const isCurrent = currentTimelineIndex === idx;

            return (
              <div key={idx} className="relative group">
                {/* Bullet circle */}
                <div className={`absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}>
                  {isDone ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className={`text-sm font-bold transition-colors ${
                      isCurrent 
                        ? 'text-blue-600' 
                        : isDone 
                        ? 'text-slate-900' 
                        : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {step.desc}
                    </p>
                  </div>

                  {isDone && (
                    <span className="text-[11px] font-mono font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Completed
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[11px] font-mono font-semibold text-blue-600 animate-pulse">
                      Processing...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
