import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
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
  color: 'blue' | 'emerald' | 'violet' | 'amber' | 'red';
  delay?: number;
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  emerald: 'from-emerald-500 to-emerald-600',
  violet: 'from-violet-500 to-violet-600',
  amber: 'from-amber-500 to-amber-600',
  red: 'from-red-500 to-red-600',
};

const shadowMap = {
  blue: 'shadow-blue-500/20',
  emerald: 'shadow-emerald-500/20',
  violet: 'shadow-violet-500/20',
  amber: 'shadow-amber-500/20',
  red: 'shadow-red-500/20',
};

export function KPICard({ title, value, suffix = '', prefix = '', trend, trendLabel, icon: Icon, color, delay = 0 }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!visible) return;
    const duration = 1200;
    const steps = 40;
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
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-700 hover:scale-[1.02] hover:shadow-xl',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        `shadow-lg ${shadowMap[color]}`
      )}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">
              {prefix}{typeof displayValue === 'number' && displayValue % 1 !== 0 ? displayValue.toFixed(1) : Math.round(displayValue)}{suffix}
            </p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : trend < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400" />
                )}
                <span className={cn('text-xs font-medium', trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-slate-500')}>
                  {trend > 0 ? '+' : ''}{trend}% {trendLabel}
                </span>
              </div>
            )}
          </div>
          <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg', colorMap[color], shadowMap[color])}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}
