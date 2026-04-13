import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { countries } from '@/data/mock-data';
import { Download, Save } from 'lucide-react';

const availableFields = [
  { id: 'name', label: 'Country Name' },
  { id: 'region', label: 'Region' },
  { id: 'phase', label: 'Phase' },
  { id: 'ragStatus', label: 'RAG Status' },
  { id: 'progress', label: 'Progress' },
  { id: 'partner', label: 'Partner' },
  { id: 'goLiveDate', label: 'Go-Live Date' },
];

export function ReportBuilder() {
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'region', 'phase', 'ragStatus', 'progress']);
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState<{ name: string; fields: string[] }[]>([
    { name: 'LATAM Overview', fields: ['name', 'phase', 'ragStatus', 'progress', 'goLiveDate'] },
    { name: 'Partner Report', fields: ['name', 'partner', 'phase', 'progress'] },
  ]);

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId) ? prev.filter(f => f !== fieldId) : [...prev, fieldId]
    );
  };

  const filteredCountries = countries.filter(c => {
    if (filterRegion !== 'all' && c.region !== filterRegion) return false;
    if (filterPhase !== 'all' && c.phase !== filterPhase) return false;
    return true;
  });

  const regions = [...new Set(countries.map(c => c.region))];
  const phases = [...new Set(countries.map(c => c.phase))];

  const handleSaveTemplate = () => {
    if (templateName) {
      setSavedTemplates(prev => [...prev, { name: templateName, fields: [...selectedFields] }]);
      setTemplateName('');
    }
  };

  const handleExport = () => {
    const header = selectedFields.map(f => availableFields.find(af => af.id === f)?.label || f).join(',');
    const rows = filteredCountries.map(c =>
      selectedFields.map(f => (c as unknown as Record<string, unknown>)[f]).join(',')
    ).join('\n');
    const blob = new Blob([header + '\n' + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custom-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Select Fields</h4>
            <div className="space-y-2">
              {availableFields.map(field => (
                <button
                  key={field.id}
                  onClick={() => toggleField(field.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedFields.includes(field.id)
                      ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Filters</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Region</label>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Phase</label>
                <Select value={filterPhase} onValueChange={setFilterPhase}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    {phases.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Saved Templates</h4>
            <div className="space-y-2 mb-3">
              {savedTemplates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFields([...t.fields])}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm bg-slate-50 hover:bg-blue-50 transition-all"
                >
                  {t.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name..."
                className="h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleSaveTemplate} disabled={!templateName}>
                <Save className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="col-span-2">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">Preview</h4>
                <Badge variant="secondary" className="text-xs">{filteredCountries.length} rows</Badge>
              </div>
              <Button size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>

            <div className="overflow-auto max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedFields.map(f => (
                      <TableHead key={f} className="text-xs">
                        {availableFields.find(af => af.id === f)?.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCountries.map(c => (
                    <TableRow key={c.id} className="hover:bg-slate-50">
                      {selectedFields.map(f => (
                        <TableCell key={f} className="text-sm">
                          {f === 'name' ? (
                            <span className="flex items-center gap-2">{c.flag} {c.name}</span>
                          ) : f === 'progress' ? (
                            <span>{c.progress}%</span>
                          ) : f === 'ragStatus' ? (
                            <Badge variant="outline" className={`text-xs ${
                              c.ragStatus === 'Green' ? 'bg-emerald-100 text-emerald-700' :
                              c.ragStatus === 'Amber' ? 'bg-amber-100 text-amber-700' :
                              'bg-red-100 text-red-700'
                            }`}>{c.ragStatus}</Badge>
                          ) : (
                            String((c as unknown as Record<string, unknown>)[f] || '')
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
