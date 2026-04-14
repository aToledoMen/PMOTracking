import { Button } from '@/components/ui/button';
import { Notification } from '@/data/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowUpRight, Clock, UserPlus } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const typeConfig = {
  overdue: { icon: Clock, color: 'text-red-700', label: 'Overdue' },
  escalation: { icon: AlertTriangle, color: 'text-amber-700', label: 'Escalation' },
  status_change: { icon: ArrowUpRight, color: 'text-blue-700', label: 'Status' },
  assignment: { icon: UserPlus, color: 'text-slate-700', label: 'Assignment' },
};

export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-[14px] font-semibold text-slate-900">Notifications</h3>
          {unread > 0 && (
            <span className="text-[11px] text-slate-500 tabular-nums">{unread} unread</span>
          )}
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <div className="divide-y divide-slate-100">
          {notifications.map(notif => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            const time = new Date(notif.timestamp);
            const timeAgo = getTimeAgo(time);

            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && onMarkRead(notif.id)}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50',
                  !notif.read && 'bg-blue-50/30'
                )}
              >
                <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', config.color)} strokeWidth={1.75} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="text-[12px] font-semibold text-slate-900">{notif.title}</h4>
                    <span className={cn('text-[9px] font-semibold uppercase tracking-wider', config.color)}>
                      {config.label}
                    </span>
                    {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </div>
                  <p className="text-[12px] text-slate-600 leading-snug">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 tabular-nums">{timeAgo}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
}
