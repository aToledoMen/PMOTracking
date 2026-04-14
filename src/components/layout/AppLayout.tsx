import { ReactNode } from 'react';
import { Sidebar, ViewType } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  notificationCount: number;
  children: ReactNode;
}

export function AppLayout({ activeView, onViewChange, notificationCount, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={onViewChange}
        notificationCount={notificationCount}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeView={activeView}
          notificationCount={notificationCount}
          onNotificationsClick={() => onViewChange('notifications')}
        />
        <main className="flex-1 overflow-auto px-6 py-5">
          <div key={activeView} className="animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
