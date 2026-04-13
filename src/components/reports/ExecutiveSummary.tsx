import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { countries, kpiHistory, tasks } from '@/data/mock-data';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getRAGSummary } from '@/data/mock-data';
import { Target, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

export function ExecutiveSummary() {
  const rag = getRAGSummary();
  const total = rag.Green + rag.Amber + rag.Red;
  const latestKPI = kpiHistory[kpiHistory.length - 1];
  const quarterData = [
    { quarter: 'Q1 2026', count: countries.filter(c => ['2026-01', '2026-02', '2026-03'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q2 2026', count: countries.filter(c => ['2026-04', '2026-05', '2026-06'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q3 2026', count: countries.filter(c => ['2026-07', '2026-08', '2026-09'].some(m => c.goLiveDate.startsWith(m))).length },
    { quarter: 'Q4 2026', count: countries.filter(c => ['2026-10', '2026-11', '2026-12'].some(m => c.goLiveDate.startsWith(m))).length },
  ];

  const escalations = tasks.filter(t => t.status === 'Blocked' || t.status === 'Overdue').slice(0, 3);
  const ragData = [
    { name: 'On Track', value: rag.Green, color: '#10b981' },
    { name: 'At Risk', value: rag.Amber, color: '#f59e0b' },
    { name: 'Off Track', value: rag.Red, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">Executive Summary</h3>
          <p className="text-sm text-slate-500">Leadership dashboard — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>
        <Badge variant="outline" className="text-xs">Auto-generated</Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{total}</p>
              <p className="text-xs text-slate-500">Total Countries</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{latestKPI.onTimeRate}%</p>
              <p className="text-xs text-slate-500">On-Time Rate</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round((rag.Green / total) * 100)}%</p>
              <p className="text-xs text-slate-500">Portfolio Health</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{escalations.length}</p>
              <p className="text-xs text-slate-500">Escalations</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-sm font-semibold mb-4">Go-Live Pipeline by Quarter</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={quarterData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Go-Lives" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h4 className="text-sm font-semibold mb-4">Portfolio RAG Distribution</h4>
          <div className="flex items-center gap-8">
            <div className="w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ragData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {ragData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {ragData.map(item => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600 w-20">{item.name}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                  <span className="text-xs text-slate-400">({Math.round((item.value / total) * 100)}%)</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h4 className="text-sm font-semibold mb-4">Top Escalations Requiring Decision</h4>
        <div className="space-y-3">
          {escalations.map(t => {
            const country = countries.find(c => c.id === t.country);
            return (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50">
                <span className="text-lg">{country?.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-slate-500">{country?.name} · Due: {t.dueDate}</p>
                </div>
                <Badge variant="destructive" className="text-xs">{t.status}</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
