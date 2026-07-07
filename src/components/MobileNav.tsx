import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Menu, X, Rocket, FolderOpen, Server, History, Settings, LogOut } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const { signOut } = useClerk();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Rocket },
    { path: '/projects', label: 'Projects', icon: FolderOpen },
    { path: '/targets', label: 'Targets', icon: Server },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'User'
    : 'User';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const handleNav = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="lg:hidden" ref={menuRef}>
      {/* Top navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E5E7EB]">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://res.cloudinary.com/dso1dpawx/image/upload/v1783404868/logo-bg_poxwj4.png"
              alt="DeployShield"
              className="w-8 h-8 object-contain"
            />
            <span className="font-extrabold text-base text-slate-900">
              Deploy<span className="text-blue-600">Shield</span>
            </span>
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Backdrop blur */}
      {open && (
        <div className="fixed inset-0 top-[57px] z-30 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      )}

      {/* Dropdown menu - auto height, below navbar */}
      {open && (
        <div className="absolute left-4 right-4 top-[57px] z-40 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl">
          <div className="p-3 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User + Sign Out */}
          <div className="border-t border-[#E5E7EB] p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {fullName[0]?.toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{fullName}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
