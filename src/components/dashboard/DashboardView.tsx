import { Globe, Clock, Target, AlertTriangle } from 'lucide-react';
import { KPICard } from './KPICard';
import { RAGStatusChart } from './RAGStatusChart';
import { PhaseProgress } from './PhaseProgress';
import { TrendChart } from './TrendChart';
import { TimelineChart } from './TimelineChart';
import { EscalationsTable } from './EscalationsTable';
import { countries, tasks, kpiHistory } from '@/data/mock-data';

export function DashboardView() {
  const activeCountries = countries.filter(c => c.phase !== 'Hypercare').length;
  const overdueCount = tasks.filter(t => t.status === 'Overdue').length;
  const latestKPI = kpiHistory[kpiHistory.length - 1];
  const prevKPI = kpiHistory[kpiHistory.length - 2];
  const onTimeTrend = Math.round(latestKPI.onTimeRate - prevKPI.onTimeRate);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          title="Active Countries"
          value={activeCountries}
          icon={Globe}
          trend={8}
          trendLabel="vs last month"
          delay={0}
        />
        <KPICard
          title="On-Time Go-Live"
          value={latestKPI.onTimeRate}
          suffix="%"
          icon={Target}
          trend={onTimeTrend}
          trendLabel="vs last week"
          delay={60}
        />
        <KPICard
          title="Avg Days / Phase"
          value={latestKPI.avgDaysPerPhase}
          icon={Clock}
          trend={-3}
          trendLabel="improvement"
          delay={120}
        />
        <KPICard
          title="Overdue Tasks"
          value={overdueCount}
          icon={AlertTriangle}
          trend={12}
          trendLabel="vs last week"
          delay={180}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RAGStatusChart />
        <PhaseProgress />
        <TrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TimelineChart />
        <EscalationsTable />
      </div>
    </div>
  );
}
