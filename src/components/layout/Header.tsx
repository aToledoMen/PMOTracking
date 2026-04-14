import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { ViewType } from './Sidebar';

interface HeaderProps {
  activeView: ViewType;
  notificationCount: number;
  onNotificationsClick: () => void;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Executive Dashboard',
  tasks: 'Task Management',
  'my-tasks': 'My Tasks',
  reports: 'Reports & Analytics',
  notifications: 'Notifications',
};

export function Header({ activeView, notificationCount, onNotificationsClick }: HeaderProps) {
  const title = viewTitles[activeView];
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-slate-400">PMO</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-900 font-semibold">{title}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 tracking-wide hidden md:block tabular-nums">{today}</span>
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
          <Input
            placeholder="Search..."
            className="pl-8 w-52 h-8 text-[12px] bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        </div>
        <button
          onClick={onNotificationsClick}
          className="relative p-1.5 rounded-sm hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" strokeWidth={1.75} />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
}
