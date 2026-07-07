import React from 'react';
import { Bell, X, CheckCircle2, Info, Clock } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose, onClear }) => {
  if (!isOpen) return null;

  const notifications = [
    { id: '1', title: 'Deployment Succeeded', msg: 'acme-api-gateway live on AWS EC2 Cluster', type: 'success', time: '2m ago' },
    { id: '2', title: 'Pre-Deploy Health Passed', msg: 'Validation score 98% for branch main', type: 'info', time: '14m ago' },
    { id: '3', title: 'Build Cache Refreshed', msg: 'Multi-stage Docker layer sha256:e3b0 cached', type: 'info', time: '1h ago' },
    { id: '4', title: 'Auto-SSL Renewed', msg: 'Let\'s Encrypt certificate valid for 90 days', type: 'success', time: '3h ago' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5 text-slate-900">
                  {n.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Info className="w-3.5 h-3.5 text-blue-500" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-slate-400 font-normal flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  {n.time}
                </span>
              </div>
              <p className="text-slate-600">{n.msg}</p>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between">
          <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-900 font-semibold">Mark all as read</button>
          <button onClick={onClose} className="px-4 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl">Done</button>
        </div>
      </div>
    </div>
  );
};
