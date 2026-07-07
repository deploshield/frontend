import React, { useState } from 'react';
import { History, Search, RotateCcw, CheckCircle2, AlertTriangle, GitCommit, ArrowLeftRight, X } from 'lucide-react';
import { DeploymentHistoryItem } from '../types';

interface HistoryViewProps {
  historyItems: DeploymentHistoryItem[];
  onRollback: (item: DeploymentHistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ historyItems, onRollback }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rollbackTargetItem, setRollbackTargetItem] = useState<DeploymentHistoryItem | null>(null);

  const filteredHistory = historyItems.filter(item => 
    item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.commit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.commitMsg.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmRollback = () => {
    if (rollbackTargetItem) {
      onRollback(rollbackTargetItem);
      setRollbackTargetItem(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white card-18 p-5 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            <span>Deployment Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Complete revision log of builds, active target deployments, and instant rollback controls.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search commits, authors, projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Deployment Table Card */}
      <div className="bg-white card-18 p-6 border border-slate-200/80 shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-3">Time</th>
                <th className="py-3.5 px-3">Project</th>
                <th className="py-3.5 px-3">Branch & Commit</th>
                <th className="py-3.5 px-3">Target Platform</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Duration</th>
                <th className="py-3.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredHistory.map((item) => {
                const isSuccess = item.status === 'Success';
                const isRolledBack = item.status === 'Rolled Back';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-medium">
                      {item.time}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {item.project}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 font-mono text-slate-800">
                          <GitCommit className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-bold text-blue-600">{item.commit}</span>
                          <span className="text-slate-400">({item.branch})</span>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                          {item.commitMsg}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {item.target}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isSuccess
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                          : isRolledBack
                          ? 'bg-purple-50 text-purple-600 border border-purple-200/60'
                          : 'bg-rose-50 text-rose-600 border border-rose-200/60'
                      }`}>
                        {isSuccess ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : isRolledBack ? (
                          <ArrowLeftRight className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">
                      {item.duration}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setRollbackTargetItem(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Rollback</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rollback Confirmation Modal */}
      {rollbackTargetItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white card-18 w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600">
                <RotateCcw className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900">
                  Confirm Instant Rollback
                </h3>
              </div>
              <button
                onClick={() => setRollbackTargetItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to perform zero-downtime traffic cutover to release commit <strong className="font-mono text-blue-600">{rollbackTargetItem.commit}</strong> for <strong className="text-slate-900">{rollbackTargetItem.project}</strong>?
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono">
              <p className="text-slate-500">Target Commit Message:</p>
              <p className="font-semibold text-slate-800 mt-1">
                "{rollbackTargetItem.commitMsg}"
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRollbackTargetItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRollback}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Execute Rollback Now
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
