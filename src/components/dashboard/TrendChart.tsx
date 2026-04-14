import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { kpiHistory } from '@/data/mock-data';

export function TrendChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-900">KPI Trends</h3>
          <p className="text-[11px] text-slate-500">12-week rolling window</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-blue-700" />
            <span className="text-[10px] text-slate-500">On-Time %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-0.5 bg-slate-400" />
            <span className="text-[10px] text-slate-500">Partner Score</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={kpiHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="onTimeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[60, 100]} width={30} />
          <Tooltip
            contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }}
          />
          <Area type="monotone" dataKey="onTimeRate" stroke="#1d4ed8" strokeWidth={1.75} fill="url(#onTimeGrad)" name="On-Time %" dot={false} />
          <Area type="monotone" dataKey="partnerScore" stroke="#94a3b8" strokeWidth={1.5} fill="transparent" strokeDasharray="3 3" name="Partner" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
