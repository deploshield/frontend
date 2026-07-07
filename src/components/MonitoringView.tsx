import React, { useState, useEffect } from 'react';
import { Activity, Cpu, HardDrive, CheckCircle2, AlertCircle, Play, Pause, Server, Zap } from 'lucide-react';
import { ContainerStatus } from '../types';

interface MonitoringViewProps {
  containers: ContainerStatus[];
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({ containers: initialContainers }) => {
  const [containers, setContainers] = useState<ContainerStatus[]>(initialContainers);
  const [isLive, setIsLive] = useState(true);
  const [rps, setRps] = useState(1420);
  const [p99Latency, setP99Latency] = useState(14.2);

  // Simulated live metric fluctuations
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setRps(Math.floor(1380 + Math.random() * 120));
      setP99Latency(parseFloat((13.5 + Math.random() * 2.5).toFixed(1)));
      
      setContainers(prev => prev.map(c => {
        if (c.status === 'stopped') return c;
        const cpuDelta = (Math.random() * 4 - 2);
        const newCpu = Math.max(1, Math.min(99, parseFloat((c.cpu + cpuDelta).toFixed(1))));
        return { ...c, cpu: newCpu };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Compute total CPU & RAM averages
  const activeContainers = containers.filter(c => c.status === 'running');
  const avgCpu = (activeContainers.reduce((acc, c) => acc + c.cpu, 0) / activeContainers.length).toFixed(1);
  const totalRam = activeContainers.reduce((acc, c) => acc + c.ramMb, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control */}
      <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Cluster Realtime Telemetry
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Monitoring node resources, active pod instances, and endpoint response times.
          </p>
        </div>

        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isLive 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-slate-200 text-slate-800'
          }`}
        >
          {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isLive ? 'Pause Stream' : 'Resume Stream'}</span>
        </button>
      </div>

      {/* Metric Visual Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CPU Usage Card */}
        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">
              CPU Usage
            </span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {avgCpu}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">Normal</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${avgCpu}%` }} />
          </div>
        </div>

        {/* RAM Usage Card */}
        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">
              RAM Allocated
            </span>
            <HardDrive className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {totalRam} MB
            </span>
            <span className="text-xs font-semibold text-slate-500">16 GB Total</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${(totalRam / 16000) * 100}%` }} />
          </div>
        </div>

        {/* Disk Usage Card */}
        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Disk I/O
            </span>
            <Server className="w-4 h-4 text-sky-600" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              24.8 GB
            </span>
            <span className="text-xs font-semibold text-slate-500">22% Used</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500 rounded-full" style={{ width: '22%' }} />
          </div>
        </div>

        {/* Requests/sec Card */}
        <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-500">
              Requests / Sec
            </span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {rps.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 font-mono">{p99Latency}ms p99</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: '68%' }} />
          </div>
        </div>

      </div>

      {/* Container Status Table */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Active Containers ({containers.length})</span>
          </h3>

          <span className="text-xs font-semibold text-slate-500">
            {activeContainers.length} Running • {containers.length - activeContainers.length} Stopped
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold tracking-wider">
                <th className="py-3 px-3">Container ID</th>
                <th className="py-3 px-3">Project</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">CPU Usage</th>
                <th className="py-3 px-3">RAM</th>
                <th className="py-3 px-3">Port</th>
                <th className="py-3 px-3">Uptime</th>
                <th className="py-3 px-3 text-right">Restarts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {containers.map((cnt) => {
                const isRunning = cnt.status === 'running';
                return (
                  <tr key={cnt.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {cnt.name}
                    </td>
                    <td className="py-3 px-3 font-sans text-blue-600 font-medium">
                      {cnt.project}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        isRunning
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isRunning ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span className="capitalize">{cnt.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">
                      {cnt.cpu}%
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {cnt.ramMb} MB
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      :{cnt.port}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-500">
                      {cnt.uptime}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-500">
                      {cnt.restarts}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
