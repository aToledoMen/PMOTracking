import { LayoutDashboard, CheckSquare, User, FileBarChart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewType = 'dashboard' | 'tasks' | 'my-tasks' | 'reports' | 'notifications';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  notificationCount: number;
}

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Task Management', icon: CheckSquare },
  { id: 'my-tasks', label: 'My Tasks', icon: User },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function Sidebar({ activeView, onViewChange, notificationCount }: SidebarProps) {
  return (
    <aside className="w-60 bg-slate-950 text-slate-300 flex flex-col min-h-screen border-r border-slate-800">
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-sm bg-white flex items-center justify-center font-bold text-[13px] text-slate-900">
            P
          </div>
          <div>
            <h1 className="font-semibold text-[13px] tracking-tight text-white">PMO Tracker</h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase">Global Deployment</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">Navigation</p>
      </div>

      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-2.5 pl-3 pr-3 py-2 text-[13px] transition-colors duration-150 relative border-l-2',
                isActive
                  ? 'border-blue-500 text-white bg-slate-900/50 font-medium'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              )}
            >
              <Icon className="w-4 h-4" strokeWidth={1.75} />
              <span>{item.label}</span>
              {item.id === 'notifications' && notificationCount > 0 && (
                <span className="ml-auto text-[10px] font-semibold text-slate-400 tabular-nums">
                  {notificationCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-slate-300 border border-slate-700">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-200 truncate">Sarah Chen</p>
            <p className="text-[10px] text-slate-500 tracking-wide">PMO Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
