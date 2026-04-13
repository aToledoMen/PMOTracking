import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskStatus } from '@/data/types';
import { countries, currentUser } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle2, Clock, AlertCircle, Circle, Ban } from 'lucide-react';

const statusConfig: Record<TaskStatus, { icon: React.ElementType; color: string; bg: string }> = {
  Open: { icon: Circle, color: 'text-blue-600', bg: 'bg-blue-100' },
  'In Progress': { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
  Blocked: { icon: Ban, color: 'text-red-600', bg: 'bg-red-100' },
  Completed: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  Overdue: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-100' },
};

interface MyTasksViewProps {
  allTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function MyTasksView({ allTasks, onTasksChange }: MyTasksViewProps) {
  const myTasks = allTasks
    .filter(t => t.assignedTo === currentUser.id)
    .sort((a, b) => {
      if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
      if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  const overdue = myTasks.filter(t => t.status === 'Overdue').length;
  const inProgress = myTasks.filter(t => t.status === 'In Progress').length;
  const completed = myTasks.filter(t => t.status === 'Completed').length;

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    onTasksChange(allTasks.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-cyan-500 text-white text-lg font-bold">
              {currentUser.avatar}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-slate-900">{currentUser.name}</h3>
            <p className="text-sm text-slate-500">{currentUser.role}</p>
          </div>
        </div>
        <div className="flex gap-3 ml-auto">
          <div className="text-center px-4 py-2 rounded-xl bg-red-50">
            <p className="text-lg font-bold text-red-600">{overdue}</p>
            <p className="text-[10px] text-red-500 font-medium">Overdue</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-amber-50">
            <p className="text-lg font-bold text-amber-600">{inProgress}</p>
            <p className="text-[10px] text-amber-500 font-medium">In Progress</p>
          </div>
          <div className="text-center px-4 py-2 rounded-xl bg-emerald-50">
            <p className="text-lg font-bold text-emerald-600">{completed}</p>
            <p className="text-[10px] text-emerald-500 font-medium">Completed</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {myTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="text-slate-500">All caught up! No tasks assigned to you.</p>
          </Card>
        ) : (
          myTasks.map(task => {
            const country = countries.find(c => c.id === task.country);
            const StatusIcon = statusConfig[task.status].icon;
            const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

            return (
              <Card
                key={task.id}
                className={cn(
                  'p-4 transition-all duration-200 hover:shadow-md',
                  task.status === 'Overdue' && 'border-l-4 border-l-red-500 bg-red-50/30'
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', statusConfig[task.status].bg)}>
                    <StatusIcon className={cn('w-5 h-5', statusConfig[task.status].color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-slate-900 truncate">{task.title}</h4>
                      {country && <span className="text-sm">{country.flag}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500">{country?.name}</span>
                      <Badge variant="outline" className={cn('text-[10px]',
                        task.priority === 'High' ? 'border-red-200 text-red-700' :
                        task.priority === 'Medium' ? 'border-amber-200 text-amber-700' :
                        'border-blue-200 text-blue-700'
                      )}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className={cn(task.status === 'Overdue' && 'text-red-600 font-semibold')}>
                      {task.status === 'Overdue' ? `${Math.abs(daysUntilDue)}d overdue` : task.dueDate}
                    </span>
                  </div>

                  <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v as TaskStatus)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Blocked">Blocked</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
