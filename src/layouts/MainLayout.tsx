import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { MobileNav } from '../components/MobileNav';
import { NotificationsDrawer } from '../components/NotificationsDrawer';
import { UserProfileModal } from '../components/UserProfileModal';

export function MainLayout() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#1F2937] font-sans">
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile navbar - hidden on desktop */}
      <MobileNav />

      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        {/* Desktop header - hidden on mobile */}
        <div className="hidden lg:block">
          <Header
            unreadNotificationsCount={unreadNotifications}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        </div>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-[1536px]">
          <Outlet />
        </main>
      </div>

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setUnreadNotifications(0)}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
