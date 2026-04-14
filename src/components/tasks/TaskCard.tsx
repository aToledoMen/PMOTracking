import { cn } from '@/lib/utils';
import { Task } from '@/data/types';
import { users } from '@/data/mock-data';
import { getCountryCode } from '@/lib/country-code';
import { Calendar } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityBorder = {
  High: 'border-l-red-700',
  Medium: 'border-l-amber-600',
  Low: 'border-l-blue-600',
};

const priorityLabel = {
  High: 'text-red-700',
  Medium: 'text-amber-700',
  Low: 'text-blue-700',
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  });

  const assignee = users.find(u => u.id === task.assignedTo);
  const isOverdue = task.status === 'Overdue';
  const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger edit if not dragging
    if (!isDragging) onEdit?.(task);
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        'bg-white border border-slate-200 rounded-sm px-3 py-2.5 cursor-grab active:cursor-grabbing transition-colors hover:border-slate-300 border-l-2 select-none touch-none',
        priorityBorder[task.priority],
        isDragging && 'shadow-lg ring-1 ring-blue-400'
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={cn('text-[9px] font-semibold uppercase tracking-wider', priorityLabel[task.priority])}>
          {task.priority}
        </span>
        <span className="inline-flex items-center justify-center min-w-[20px] h-4 px-1 rounded-sm bg-slate-100 text-[9px] font-semibold text-slate-600 border border-slate-200 tracking-wider">
          {getCountryCode(task.country)}
        </span>
      </div>

      <h4 className="text-[12px] font-medium text-slate-900 leading-snug line-clamp-2 mb-2.5">{task.title}</h4>

      <div className="flex items-center justify-between">
        <div className={cn('flex items-center gap-1 text-[10px] tabular-nums', isOverdue ? 'text-red-700 font-semibold' : 'text-slate-500')}>
          <Calendar className="w-3 h-3" strokeWidth={1.75} />
          <span>
            {isOverdue ? `${Math.abs(daysUntilDue)}d overdue` : daysUntilDue <= 3 ? `${daysUntilDue}d left` : task.dueDate}
          </span>
        </div>
        {assignee && (
          <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-semibold text-slate-600">
            {assignee.avatar}
          </div>
        )}
      </div>
    </div>
  );
}
