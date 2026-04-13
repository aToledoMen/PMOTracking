import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { getRAGSummary } from '@/data/mock-data';

const COLORS = { Green: '#10b981', Amber: '#f59e0b', Red: '#ef4444' };

export function RAGStatusChart() {
  const rag = getRAGSummary();
  const data = [
    { name: 'On Track', value: rag.Green, color: COLORS.Green },
    { name: 'At Risk', value: rag.Amber, color: COLORS.Amber },
    { name: 'Off Track', value: rag.Red, color: COLORS.Red },
  ];
  const total = rag.Green + rag.Amber + rag.Red;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">Portfolio RAG Status</h3>
      <p className="text-xs text-slate-500 mb-4">{total} countries total</p>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} countries`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{Math.round((rag.Green / total) * 100)}%</p>
              <p className="text-[10px] text-slate-500">On Track</p>
            </div>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{item.value}</span>
                <span className="text-xs text-slate-400">({Math.round((item.value / total) * 100)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
