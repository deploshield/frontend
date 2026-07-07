import React, { useState } from 'react';
import { Terminal, Search, Trash2, Download, Pause, Play } from 'lucide-react';
import { LogEntry } from '../types';

interface LogsViewProps {
  logs: LogEntry[];
  setLogs: React.Dispatch<React.SetStateAction<LogEntry[]>>;
}

export const LogsView: React.FC<LogsViewProps> = ({ logs, setLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [isTailing, setIsTailing] = useState(true);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleDownloadLogs = () => {
    const textContent = filteredLogs.map(l => `[${l.timestamp}] [${l.level}] [${l.service}] ${l.message}`).join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deploy-shield-system-logs.txt`;
    a.click();
  };

  const getLevelBadge = (level: LogEntry['level']) => {
    switch (level) {
      case 'INFO': return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-900/60 text-blue-300 border border-blue-700/60">INFO</span>;
      case 'WARN': return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-900/60 text-amber-300 border border-amber-700/60">WARN</span>;
      case 'ERROR': return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-900/60 text-rose-300 border border-rose-700/60">ERROR</span>;
      case 'SUCCESS': return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/60">SUCCESS</span>;
      default: return <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-300">DEBUG</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="bg-slate-900 text-white card-18 p-5 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Filter log stream..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {['ALL', 'INFO', 'WARN', 'ERROR', 'SUCCESS'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedLevel === lvl
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTailing(!isTailing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              isTailing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isTailing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isTailing ? 'Tailing ON' : 'Paused'}</span>
          </button>

          <button
            onClick={handleDownloadLogs}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
            title="Download log file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleClearLogs}
            className="p-2 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-xl transition-colors"
            title="Clear terminal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Terminal Output */}
      <div className="bg-slate-950 text-slate-200 card-18 p-5 border border-slate-800 shadow-2xl font-mono text-xs min-h-[420px] max-h-[600px] overflow-y-auto space-y-2.5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-slate-500 text-[11px]">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-500" />
            Deploy Shield Global Ingress & Pipeline Telemetry Stream
          </span>
          <span>Showing {filteredLogs.length} events</span>
        </div>

        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 hover:bg-slate-900/60 p-1.5 rounded transition-colors">
            <span className="text-slate-500 shrink-0 select-none">{log.timestamp}</span>
            <div className="shrink-0">{getLevelBadge(log.level)}</div>
            <span className="text-blue-400 shrink-0 font-bold">[{log.service}]</span>
            <span className="text-slate-200 break-all">{log.message}</span>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 text-slate-600">
            No system log events matched the current filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
