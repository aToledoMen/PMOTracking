import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { getCountriesByPhase } from '@/data/mock-data';

const phaseColors: Record<string, string> = {
  Discovery: '#8b5cf6',
  Planning: '#6366f1',
  Build: '#3b82f6',
  UAT: '#06b6d4',
  'Go-Live': '#10b981',
  Hypercare: '#14b8a6',
};

export function PhaseProgress() {
  const data = getCountriesByPhase();

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Countries by Phase</h3>
      <p className="text-xs text-slate-500 mb-4">Current deployment phase distribution</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="phase" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
            formatter={(value) => [`${value} countries`, 'Count']}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.phase} fill={phaseColors[entry.phase] || '#3b82f6'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
