import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  overdue: { icon: Clock, color: 'text-red-600', bg: 'bg-red-100', label: 'Overdue' },
  escalation: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Escalation' },
  status_change: { icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Status Change' },
  assignment: { icon: UserPlus, color: 'text-violet-600', bg: 'bg-violet-100', label: 'Assignment' },
};

export function NotificationPanel({ notifications, onMarkRead, onMarkAllRead }: NotificationPanelProps) {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-slate-900">Notifications</h3>
          {unread > 0 && (
            <Badge className="bg-red-500 hover:bg-red-500">{unread} unread</Badge>
          )}
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={onMarkAllRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map(notif => {
          const config = typeConfig[notif.type];
          const Icon = config.icon;
          const time = new Date(notif.timestamp);
          const timeAgo = getTimeAgo(time);

          return (
            <Card
              key={notif.id}
              onClick={() => !notif.read && onMarkRead(notif.id)}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
                !notif.read && 'border-l-4 border-l-blue-500 bg-blue-50/20'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', config.bg)}>
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-slate-900">{notif.title}</h4>
                    <Badge variant="outline" className={cn('text-[10px]', config.bg, config.color)}>
                      {config.label}
                    </Badge>
                    {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <p className="text-sm text-slate-600">{notif.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{timeAgo}</p>
                </div>
              </div>
            </Card>
          );
        })}
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
