import { Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { ViewType } from './Sidebar';

interface HeaderProps {
  activeView: ViewType;
  notificationCount: number;
  onNotificationsClick: () => void;
}

const viewTitles: Record<ViewType, { title: string; subtitle: string }> = {
  dashboard: { title: 'Executive Dashboard', subtitle: 'Global deployment overview & KPIs' },
  tasks: { title: 'Task Management', subtitle: 'Manage and track all deployment tasks' },
  'my-tasks': { title: 'My Tasks', subtitle: 'Your personal task inbox' },
  reports: { title: 'Reports & Analytics', subtitle: 'Weekly reports and custom analytics' },
  notifications: { title: 'Notifications', subtitle: 'Alerts, escalations and updates' },
};

export function Header({ activeView, notificationCount, onNotificationsClick }: HeaderProps) {
  const { title, subtitle } = viewTitles[activeView];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-400 hidden md:block">{today}</p>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-56 h-9 text-sm bg-slate-50 border-slate-200"
          />
        </div>
        <button
          onClick={onNotificationsClick}
          className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {notificationCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-red-500 hover:bg-red-500">
              {notificationCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
}
