import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Rocket, FolderOpen, Server, History, Settings } from 'lucide-react';
import { PipelineModal } from './pipeline';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pipelineOpen, setPipelineOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Rocket },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/targets', label: 'Targets', icon: Server },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed top-0 bottom-0 left-0 z-50 w-[260px] h-screen bg-[#F8F4EC] border-r border-[#E5E7EB] shadow-soft flex flex-col justify-between">
      <div className="flex flex-col h-full overflow-y-auto scrollbar-none">

        <div className="p-6 flex items-center justify-between border-b border-[#E5E7EB]/80 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <img
              src="https://res.cloudinary.com/dso1dpawx/image/upload/v1783404868/logo-bg_poxwj4.png"
              alt="DeployShield Logo"
              className="w-13 h-13 object-contain shrink-0 transition-transform group-hover:scale-105"
              loading="eager"
            />
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">
                Deploy<span className="text-blue-600">Shield</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-500 mt-0.5 leading-tight">
                Pre-Deployment Validation Platform
              </span>
            </div>
          </button>
        </div>


        <nav className="p-4 space-y-1.5 flex-1">
          

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-gradient text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

      </div>

      <PipelineModal isOpen={pipelineOpen} onClose={() => setPipelineOpen(false)} />
    </aside>
  );
};
