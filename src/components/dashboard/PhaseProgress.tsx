import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getCountriesByPhase } from '@/data/mock-data';

export function PhaseProgress() {
  const data = getCountriesByPhase();

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4">
      <div className="mb-3">
        <h3 className="text-[13px] font-semibold text-slate-900">Countries by Phase</h3>
        <p className="text-[11px] text-slate-500">Deployment phase distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barCategoryGap="25%" margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="phase" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', padding: '4px 8px' }}
            formatter={(value) => [`${value} countries`, 'Count']}
          />
          <Bar dataKey="count" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
