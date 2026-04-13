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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Active Countries"
          value={activeCountries}
          icon={Globe}
          color="blue"
          trend={8}
          trendLabel="vs last month"
          delay={0}
        />
        <KPICard
          title="On-Time Go-Live Rate"
          value={latestKPI.onTimeRate}
          suffix="%"
          icon={Target}
          color="emerald"
          trend={onTimeTrend}
          trendLabel="vs last week"
          delay={100}
        />
        <KPICard
          title="Avg Days per Phase"
          value={latestKPI.avgDaysPerPhase}
          suffix=" days"
          icon={Clock}
          color="violet"
          trend={-3}
          trendLabel="improvement"
          delay={200}
        />
        <KPICard
          title="Overdue Tasks"
          value={overdueCount}
          icon={AlertTriangle}
          color="red"
          trend={12}
          trendLabel="vs last week"
          delay={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RAGStatusChart />
        <PhaseProgress />
        <TrendChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineChart />
        <EscalationsTable />
      </div>
    </div>
  );
}
