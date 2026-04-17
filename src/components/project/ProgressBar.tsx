import { cn } from '@/lib/utils';

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const color = value === 100 ? 'bg-emerald-600' : value > 0 ? 'bg-blue-600' : 'bg-slate-300';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-slate-600 tabular-nums w-8">{value}%</span>
    </div>
  );
}
