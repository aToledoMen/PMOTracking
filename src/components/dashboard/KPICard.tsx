import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ElementType;
  delay?: number;
}

export function KPICard({ title, value, suffix = '', prefix = '', trend, trendLabel, icon: Icon, delay = 0 }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    const duration = 800;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.round(current * 10) / 10);
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value, visible]);

  return (
    <div
      className={cn(
        'bg-white border border-slate-200 rounded-md px-4 py-3.5 transition-all duration-200 hover:border-slate-300',
        visible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className="flex items-start justify-between mb-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{title}</p>
        <Icon className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
      </div>
      <p className="text-[28px] font-semibold text-slate-900 tracking-tight tabular-nums leading-none">
        {prefix}{typeof displayValue === 'number' && displayValue % 1 !== 0 ? displayValue.toFixed(1) : Math.round(displayValue)}{suffix}
      </p>
      {trend !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? (
            <TrendingUp className="w-3 h-3 text-emerald-700" strokeWidth={2} />
          ) : trend < 0 ? (
            <TrendingDown className="w-3 h-3 text-red-700" strokeWidth={2} />
          ) : (
            <Minus className="w-3 h-3 text-slate-400" strokeWidth={2} />
          )}
          <span className={cn('text-[11px] font-medium tabular-nums', trend > 0 ? 'text-emerald-700' : trend < 0 ? 'text-red-700' : 'text-slate-500')}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-[11px] text-slate-400">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
