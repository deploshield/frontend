import React, { useState, useEffect } from 'react';
import { HardDrive, Clock, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface StepBuildProps {
  project: Project;
  onBuildComplete: () => void;
}

export const StepBuild: React.FC<StepBuildProps> = ({ project, onBuildComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isBuilding, setIsBuilding] = useState(true);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [imageSize, setImageSize] = useState('0.0 MB');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isBuilding) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBuilding]);

  useEffect(() => {
    const logsSequence = [
      { p: 10, msg: '[Step 1/8] FROM node:20-alpine AS builder', size: '12.4 MB' },
      { p: 25, msg: '[Step 2/8] WORKDIR /app', size: '12.4 MB' },
      { p: 40, msg: '[Step 3/8] COPY package*.json ./', size: '12.8 MB' },
      { p: 55, msg: '[Step 4/8] RUN npm ci -> Using cached layer sha256:7b91...', size: '84.2 MB' },
      { p: 70, msg: '[Step 5/8] COPY . .', size: '92.1 MB' },
      { p: 85, msg: '[Step 6/8] RUN npm run build (Next.js standalone compiler)', size: '138.5 MB' },
      { p: 95, msg: '[Step 7/8] Exporting image sha256:e3b0c44298fc...', size: '142.8 MB' },
      { p: 100, msg: '[Step 8/8] Docker image pushed to registry: registry.deployshield.app/v2.4.12', size: '142.8 MB' },
    ];

    logsSequence.forEach((item, index) => {
      setTimeout(() => {
        setProgress(item.p);
        setImageSize(item.size);
        setBuildLogs(prev => [...prev, item.msg]);

        if (index === logsSequence.length - 1) {
          setIsBuilding(false);
        }
      }, (index + 1) * 800);
    });
  }, []);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}m ${remaining < 10 ? '0' : ''}${remaining}s`;
  };

  const estimatedTotal = 12; // estimated 12 seconds total in sim
  const remainingSeconds = Math.max(0, estimatedTotal - elapsedSeconds);

  return (
    <div className="space-y-6">
      
      {/* Docker Build Overview Banner */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  Docker Image Construction
                </h2>
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                  isBuilding 
                    ? 'bg-blue-100 text-blue-700 animate-pulse'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isBuilding ? 'Building Docker Image...' : 'Build Completed'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Targeting multi-stage container build for <strong className="text-slate-700">{project.name}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!isBuilding && (
              <button
                onClick={onBuildComplete}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Continue to Target Deploy</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Build Progress ({progress}%)</span>
            <span>{isBuilding ? 'Step in progress...' : 'Image ready for registry'}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Metrics Bar: Size, Duration, Remaining, Cache */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>Image Size</span>
            </div>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {imageSize}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Elapsed Duration</span>
            </div>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {formatDuration(elapsedSeconds)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isBuilding ? 'animate-spin' : ''}`} />
              <span>Est. Remaining</span>
            </div>
            <span className="text-lg font-bold text-slate-900 font-mono">
              {isBuilding ? formatDuration(remainingSeconds) : '0m 00s'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium mb-1">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Cache Hit Ratio</span>
            </div>
            <span className="text-lg font-bold text-emerald-600 font-mono">
              87.5% Cached
            </span>
          </div>

        </div>
      </div>

      {/* Build Terminal Console */}
      <div className="bg-slate-950 text-slate-200 card-18 p-5 border border-slate-800 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-slate-400 font-semibold text-xs ml-2">
              Docker Engine Stream Output
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            Image: <span className="text-blue-400">registry.deployshield.app/{project.name}:latest</span>
          </span>
        </div>

        <div className="space-y-2 min-h-[220px] max-h-[380px] overflow-y-auto pr-2">
          {buildLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2 text-slate-300 leading-relaxed">
              <span className="text-blue-500 select-none">#</span>
              <span className={log.includes('pushed') ? 'text-emerald-400 font-bold' : ''}>
                {log}
              </span>
            </div>
          ))}

          {isBuilding && (
            <div className="flex items-center gap-2 text-amber-400 pt-2 animate-pulse">
              <span className="inline-block w-2 h-4 bg-amber-400 animate-blink" />
              <span>Compiling assets and building layer diffs...</span>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
