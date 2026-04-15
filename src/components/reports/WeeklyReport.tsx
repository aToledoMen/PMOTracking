import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/data/data-context';
import { getCountryCode } from '@/lib/country-code';
import { Download, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

const ragStyle = {
  Green: { dot: 'bg-emerald-600', label: 'text-emerald-700' },
  Amber: { dot: 'bg-amber-600', label: 'text-amber-700' },
  Red: { dot: 'bg-red-700', label: 'text-red-700' },
};

export function WeeklyReport() {
  const { countries, tasks } = useData();
  const handleExport = () => {
    const header = 'Country,Region,Phase,RAG Status,Progress,Partner,Go-Live Date\n';
    const rows = countries.map(c =>
      `${c.name},${c.region},${c.phase},${c.ragStatus},${c.progress}%,${c.partner},${c.goLiveDate}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pmo-weekly-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[14px] font-semibold text-slate-900">Weekly Deployment Report</h3>
          <p className="text-[11px] text-slate-500">Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={handleExport}>
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px]">
            <Download className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Metric label="On Track" value={countries.filter(c => c.ragStatus === 'Green').length} color="text-emerald-700" dot="bg-emerald-600" />
        <Metric label="At Risk" value={countries.filter(c => c.ragStatus === 'Amber').length} color="text-amber-700" dot="bg-amber-600" />
        <Metric label="Off Track" value={countries.filter(c => c.ragStatus === 'Red').length} color="text-red-700" dot="bg-red-700" />
        <Metric label="Tasks Overdue" value={tasks.filter(t => t.status === 'Overdue').length} color="text-slate-900" dot="bg-slate-600" />
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <table className="w-full text-[12px] tabular-nums">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Country</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Region</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Phase</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">RAG</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Progress</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Partner</th>
              <th className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Go-Live</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {countries
              .sort((a, b) => {
                const order = { Red: 0, Amber: 1, Green: 2 };
                return order[a.ragStatus] - order[b.ragStatus];
              })
              .map(c => {
                const rs = ragStyle[c.ragStatus];
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                          {getCountryCode(c.id)}
                        </span>
                        <span className="font-medium text-slate-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{c.region}</td>
                    <td className="px-4 py-2 text-slate-700">{c.phase}</td>
                    <td className="px-4 py-2">
                      <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider', rs.label)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', rs.dot)} />
                        {c.ragStatus}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Progress value={c.progress} className="w-16 h-1.5" />
                        <span className="text-[11px] text-slate-600 tabular-nums">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-slate-600">{c.partner}</td>
                    <td className="px-4 py-2 text-slate-600">{c.goLiveDate}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Metric({ label, value, color, dot }: { label: string; value: number; color: string; dot: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md px-4 py-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      </div>
      <p className={cn('text-2xl font-semibold tabular-nums tracking-tight leading-none', color)}>{value}</p>
    </div>
  );
}
