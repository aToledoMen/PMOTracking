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
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col min-h-screen">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-500/25">
            P
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">PMO Tracker</h1>
            <p className="text-xs text-slate-400">Global Deployment</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-black/10 backdrop-blur-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.id === 'notifications' && notificationCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notificationCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Sarah Chen</p>
            <p className="text-xs text-slate-400">PMO Director</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
