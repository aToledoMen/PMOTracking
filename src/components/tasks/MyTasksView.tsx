import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '@/data/types';
import { currentUser } from '@/data/mock-data';
import { useData } from '@/data/data-context';
import { getCountryCode } from '@/lib/country-code';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

const statusStyle: Record<TaskStatus, { label: string; dot: string }> = {
  Open: { label: 'text-blue-700', dot: 'bg-blue-600' },
  'In Progress': { label: 'text-amber-700', dot: 'bg-amber-600' },
  Blocked: { label: 'text-red-700', dot: 'bg-red-700' },
  Completed: { label: 'text-emerald-700', dot: 'bg-emerald-700' },
  Overdue: { label: 'text-red-700', dot: 'bg-red-700' },
};

const priorityStyle = {
  High: 'text-red-700',
  Medium: 'text-amber-700',
  Low: 'text-blue-700',
};

export function MyTasksView() {
  const { tasks, countries, updateTask } = useData();

  const myTasks = tasks
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
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    updateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200 rounded-md px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[13px] font-semibold text-white">
            {currentUser.avatar}
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-slate-900 leading-tight">{currentUser.name}</h3>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider">{currentUser.role}</p>
          </div>
        </div>
        <div className="flex gap-8">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Overdue</p>
            <p className="text-2xl font-semibold text-red-700 tabular-nums leading-none">{overdue}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">In Progress</p>
            <p className="text-2xl font-semibold text-amber-700 tabular-nums leading-none">{inProgress}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Completed</p>
            <p className="text-2xl font-semibold text-emerald-700 tabular-nums leading-none">{completed}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Total</p>
            <p className="text-2xl font-semibold text-slate-900 tabular-nums leading-none">{myTasks.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <div className="grid grid-cols-[80px_1fr_100px_90px_120px_130px] items-center gap-3 px-4 py-2 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          <span>Country</span>
          <span>Task</span>
          <span>Priority</span>
          <span className="text-right">Due</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        <div className="divide-y divide-slate-100">
          {myTasks.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-[13px] text-slate-400">All caught up. No tasks assigned.</p>
            </div>
          ) : (
            myTasks.map(task => {
              const country = countries.find(c => c.id === task.country);
              const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const st = statusStyle[task.status];

              return (
                <div
                  key={task.id}
                  className={cn(
                    'grid grid-cols-[80px_1fr_100px_90px_120px_130px] items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors',
                    task.status === 'Overdue' && 'bg-red-50/30'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                      {getCountryCode(task.country)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-[10px] text-slate-500">{country?.name}</p>
                  </div>
                  <span className={cn('text-[10px] font-semibold uppercase tracking-wider', priorityStyle[task.priority])}>
                    {task.priority}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[11px] tabular-nums">
                    <Calendar className="w-3 h-3 text-slate-400" strokeWidth={1.75} />
                    <span className={cn(task.status === 'Overdue' ? 'text-red-700 font-semibold' : 'text-slate-600')}>
                      {task.status === 'Overdue' ? `${Math.abs(daysUntilDue)}d over` : task.dueDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
                    <span className={cn('text-[11px] font-medium', st.label)}>{task.status}</span>
                  </div>
                  <div className="flex justify-end">
                    <Select value={task.status} onValueChange={(v) => handleStatusChange(task.id, v as TaskStatus)}>
                      <SelectTrigger className="w-28 h-7 text-[11px] border-slate-200">
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
