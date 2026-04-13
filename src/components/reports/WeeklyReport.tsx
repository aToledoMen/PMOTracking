import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { countries, tasks } from '@/data/mock-data';
import { Download, FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';

const ragBadgeColors = {
  Green: 'bg-emerald-100 text-emerald-700',
  Amber: 'bg-amber-100 text-amber-700',
  Red: 'bg-red-100 text-red-700',
};

export function WeeklyReport() {
  const handleExport = (type: 'csv' | 'pdf') => {
    if (type === 'csv') {
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
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Weekly Deployment Report</h3>
          <p className="text-sm text-slate-500">Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{countries.filter(c => c.ragStatus === 'Green').length}</p>
          <p className="text-xs text-slate-500 mt-1">On Track</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">{countries.filter(c => c.ragStatus === 'Amber').length}</p>
          <p className="text-xs text-slate-500 mt-1">At Risk</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{countries.filter(c => c.ragStatus === 'Red').length}</p>
          <p className="text-xs text-slate-500 mt-1">Off Track</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'Overdue').length}</p>
          <p className="text-xs text-slate-500 mt-1">Tasks Overdue</p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>RAG</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Go-Live</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries
              .sort((a, b) => {
                const order = { Red: 0, Amber: 1, Green: 2 };
                return order[a.ragStatus] - order[b.ragStatus];
              })
              .map(c => (
                <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">{c.region}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{c.phase}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('text-xs border', ragBadgeColors[c.ragStatus])}>
                      {c.ragStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={c.progress} className="w-20 h-2" />
                      <span className="text-xs text-slate-500">{c.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500">{c.partner}</TableCell>
                  <TableCell className="text-slate-500">{c.goLiveDate}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
