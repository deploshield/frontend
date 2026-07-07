import React from 'react';
import { X, ShieldCheck, User, Mail, Building, Key } from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white card-18 w-full max-w-md border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-slate-900">User Profile & Permissions</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
            AR
          </div>
          <div>
            <h4 className="font-bold text-base text-slate-900">Alex Rivera</h4>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>DevOps Platform Lead</span>
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
            <span className="flex items-center gap-2 text-slate-500">
              <Mail className="w-4 h-4 text-slate-400" />
              Email
            </span>
            <span className="font-mono font-bold text-slate-900">alex.rivera@acme.com</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
            <span className="flex items-center gap-2 text-slate-500">
              <Building className="w-4 h-4 text-slate-400" />
              Organization
            </span>
            <span className="font-bold text-slate-900">Acme Corp Enterprise</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl">
            <span className="flex items-center gap-2 text-slate-500">
              <Key className="w-4 h-4 text-slate-400" />
              2FA Enforcement
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">Enabled</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
