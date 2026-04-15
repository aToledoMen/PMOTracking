import { kpiHistory } from '@/data/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getRAGSummary } from '@/data/mock-data';
import { useData } from '@/data/data-context';
import { getCountryCode } from '@/lib/country-code';
import { Target, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExecutiveSummary() {
  const { countries, tasks } = useData();
  const rag = getRAGSummary(countries);
  const total = rag.Green + rag.Amber + rag.Red;
  const latestKPI = kpiHistory[kpiHistory.length - 1];

  const quarterData = [
    { quarter: 'Q1 2026', count: countries.filter(c => ['2026-01', '2026-02', '2026-03'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q2 2026', count: countries.filter(c => ['2026-04', '2026-05', '2026-06'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q3 2026', count: countries.filter(c => ['2026-07', '2026-08', '2026-09'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q4 2026', count: countries.filter(c => ['2026-10', '2026-11', '2026-12'].some(m => c.goLiveDate.startsWith(m))).length },
  ];

  const escalations = tasks.filter(t => t.status === 'Blocked' || t.status === 'Overdue').slice(0, 4);
  const ragData = [
    { name: 'On Track', value: rag.Green, color: '#15803d' },
    { name: 'At Risk', value: rag.Amber, color: '#b45309' },
    { name: 'Off Track', value: rag.Red, color: '#b91c1c' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900">Executive Summary</h3>
          <p className="text-[11px] text-slate-500">Leadership dashboard · {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1 border border-slate-200 rounded-sm">
          Auto-generated
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <StatCard label="Total Countries" value={total} icon={Globe} color="text-blue-700" />
        <StatCard label="On-Time Rate" value={`${latestKPI.onTimeRate}%`} icon={Target} color="text-emerald-700" />
        <StatCard label="Portfolio Health" value={`${Math.round((rag.Green / total) * 100)}%`} icon={CheckCircle} color="text-emerald-700" />
        <StatCard label="Escalations" value={escalations.length} icon={AlertTriangle} color="text-red-700" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-4">
          <h4 className="text-[13px] font-semibold text-slate-900 mb-3">Go-Live Pipeline</h4>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={quarterData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }}
              />
              <Bar dataKey="count" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-4">
          <h4 className="text-[13px] font-semibold text-slate-900 mb-3">RAG Distribution</h4>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ragData} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {ragData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {ragData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 tabular-nums">
                    <span className="font-semibold text-slate-900">{item.value}</span>
                    <span className="text-[10px] text-slate-400">{Math.round((item.value / total) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <div className="px-4 py-3 border-b border-slate-200">
          <h4 className="text-[13px] font-semibold text-slate-900">Escalations Requiring Decision</h4>
        </div>
        <div className="divide-y divide-slate-100">
          {escalations.map(t => {
            const country = countries.find(c => c.id === t.country);
            return (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                  {getCountryCode(t.country)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-slate-900 truncate">{t.title}</p>
                  <p className="text-[10px] text-slate-500">{country?.name} · Due {t.dueDate}</p>
                </div>
                <span className={cn(
                  'inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-sm',
                  t.status === 'Overdue' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'
                )}>
                  {t.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md px-4 py-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <Icon className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
      </div>
      <p className={cn('text-2xl font-semibold tabular-nums tracking-tight leading-none', color)}>{value}</p>
    </div>
  );
}
