import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card } from '@/components/ui/card';
import { kpiHistory } from '@/data/mock-data';

export function TrendChart() {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">KPI Trends</h3>
      <p className="text-xs text-slate-500 mb-4">On-time rate & partner score over 12 weeks</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={kpiHistory}>
          <defs>
            <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="partnerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[60, 100]} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="onTimeRate" stroke="#3b82f6" strokeWidth={2.5} fill="url(#onTimeGrad)" name="On-Time Rate %" dot={false} />
          <Area type="monotone" dataKey="partnerScore" stroke="#10b981" strokeWidth={2.5} fill="url(#partnerGrad)" name="Partner Score" dot={false} yAxisId={0} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-500">On-Time Rate %</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs text-slate-500">Partner Score</span>
        </div>
      </div>
    </Card>
  );
}
