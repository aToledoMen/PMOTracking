import { users } from '@/data/mock-data';
import { getCountryCode } from '@/lib/country-code';
import { useData } from '@/data/data-context';
import { cn } from '@/lib/utils';

export function EscalationsTable() {
  const { countries, tasks } = useData();
  const escalatedTasks = tasks
    .filter(t => t.status === 'Overdue' || t.status === 'Blocked')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6);

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-900">Top Escalations</h3>
          <p className="text-[11px] text-slate-500">Requiring attention · {escalatedTasks.length} items</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {escalatedTasks.map((task) => {
          const country = countries.find(c => c.id === task.country);
          const assignee = users.find(u => u.id === task.assignedTo);
          const daysOverdue = Math.ceil((new Date().getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));
          return (
            <div key={task.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
              <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                {getCountryCode(task.country)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-900 truncate">{task.title}</p>
                <p className="text-[10px] text-slate-500">{assignee?.name} · {country?.name}</p>
              </div>
              <span className={cn(
                'inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-sm',
                task.status === 'Overdue' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'
              )}>
                {task.status === 'Overdue' ? `${daysOverdue}d OVERDUE` : 'BLOCKED'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
