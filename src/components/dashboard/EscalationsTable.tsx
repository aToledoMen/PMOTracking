import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { countries, tasks, users } from '@/data/mock-data';
import { AlertTriangle } from 'lucide-react';

export function EscalationsTable() {
  const escalatedTasks = tasks
    .filter(t => t.status === 'Overdue' || t.status === 'Blocked')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Top Escalations</h3>
          <p className="text-xs text-slate-500">Tasks requiring immediate attention</p>
        </div>
        <AlertTriangle className="w-5 h-5 text-amber-500" />
      </div>
      <div className="space-y-2">
        {escalatedTasks.map((task) => {
          const country = countries.find(c => c.id === task.country);
          const assignee = users.find(u => u.id === task.assignedTo);
          const daysOverdue = Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-red-50/50 transition-colors">
              <span className="text-lg">{country?.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                <p className="text-xs text-slate-500">{assignee?.name} · {country?.name}</p>
              </div>
              <Badge variant={task.status === 'Overdue' ? 'destructive' : 'outline'} className="text-xs">
                {task.status === 'Overdue' ? `${daysOverdue}d overdue` : 'Blocked'}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
