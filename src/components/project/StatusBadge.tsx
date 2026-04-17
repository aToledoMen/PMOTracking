import { cn } from '@/lib/utils';
import { TaskStatusValue } from '@/data/project-types';

const config: Record<TaskStatusValue, { dot: string; text: string; bg: string }> = {
  'Not Started': { dot: 'bg-slate-400', text: 'text-slate-600', bg: '' },
  'In Progress': { dot: 'bg-blue-600', text: 'text-blue-700', bg: '' },
  'Done': { dot: 'bg-emerald-600', text: 'text-emerald-700', bg: '' },
  'Pending Approval': { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  'Approved': { dot: 'bg-emerald-600', text: 'text-emerald-700', bg: 'bg-emerald-50' },
};

export function StatusBadge({ status }: { status: TaskStatusValue }) {
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm', c.text, c.bg)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
      {status}
    </span>
  );
}
