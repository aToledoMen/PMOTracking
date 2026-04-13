import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Task } from '@/data/types';
import { countries, users } from '@/data/mock-data';
import { Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityConfig = {
  High: { color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
  Medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🟡' },
  Low: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🔵' },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const country = countries.find(c => c.id === task.country);
  const assignee = users.find(u => u.id === task.assignedTo);
  const isOverdue = task.status === 'Overdue';
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card
      onClick={() => onEdit?.(task)}
      className={cn(
        'p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 border-l-4',
        isOverdue ? 'border-l-red-500 bg-red-50/30 animate-pulse-subtle' : 'border-l-transparent hover:border-l-blue-500'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge variant="outline" className={cn('text-[10px]', priorityConfig[task.priority].color)}>
          {task.priority}
        </Badge>
        {country && (
          <span className="text-sm" title={country.name}>{country.flag}</span>
        )}
      </div>

      <h4 className="text-sm font-medium text-slate-900 mb-2 line-clamp-2">{task.title}</h4>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          <span className={cn(isOverdue && 'text-red-600 font-semibold')}>
            {isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : daysUntilDue <= 3 ? `${daysUntilDue}d left` : task.dueDate}
          </span>
        </div>
        {assignee && (
          <Avatar className="w-6 h-6">
            <AvatarFallback className="text-[10px] bg-gradient-to-br from-slate-200 to-slate-300">
              {assignee.avatar}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </Card>
  );
}
