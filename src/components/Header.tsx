import { useState, useRef, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadNotificationsCount,
  onOpenNotifications,
}) => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'U'
    : 'U';

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'User'
    : 'User';

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] transition-colors duration-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              System Operational
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl text-slate-600 bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {initials}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {fullName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                  {user?.emailAddresses[0]?.emailAddress || ''}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#E5E7EB] shadow-lg py-1.5 z-50">
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
