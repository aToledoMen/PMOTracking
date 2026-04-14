import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getRAGSummary } from '@/data/mock-data';

const COLORS = { Green: '#15803d', Amber: '#b45309', Red: '#b91c1c' };

export function RAGStatusChart() {
  const rag = getRAGSummary();
  const data = [
    { name: 'On Track', value: rag.Green, color: COLORS.Green },
    { name: 'At Risk', value: rag.Amber, color: COLORS.Amber },
    { name: 'Off Track', value: rag.Red, color: COLORS.Red },
  ];
  const total = rag.Green + rag.Amber + rag.Red;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-900">Portfolio RAG</h3>
          <p className="text-[11px] text-slate-500 tabular-nums">{total} countries</p>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <div className="w-28 h-28 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={38}
                outerRadius={54}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                formatter={(value) => [`${value} countries`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xl font-semibold text-slate-900 tabular-nums leading-none">{Math.round((rag.Green / total) * 100)}%</p>
              <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-wider">On Track</p>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
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
  );
}
