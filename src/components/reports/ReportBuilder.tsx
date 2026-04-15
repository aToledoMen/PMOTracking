import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/data/data-context';
import { getCountryCode } from '@/lib/country-code';
import { Download, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const { countries } = useData();
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

  const sectionLabel = 'text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2';

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="space-y-3">
        <div className="bg-white border border-slate-200 rounded-md p-3">
          <h4 className={sectionLabel}>Fields</h4>
          <div className="space-y-1">
            {availableFields.map(field => (
              <label
                key={field.id}
                className={cn(
                  'flex items-center gap-2 px-2 py-1.5 rounded-sm text-[12px] cursor-pointer transition-colors',
                  selectedFields.includes(field.id)
                    ? 'bg-blue-50 text-blue-900'
                    : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedFields.includes(field.id)}
                  onChange={() => toggleField(field.id)}
                  className="w-3 h-3"
                />
                <span>{field.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3">
          <h4 className={sectionLabel}>Filters</h4>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-slate-500 mb-0.5 block">Region</label>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[10px] text-slate-500 mb-0.5 block">Phase</label>
              <Select value={filterPhase} onValueChange={setFilterPhase}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-md p-3">
          <h4 className={sectionLabel}>Templates</h4>
          <div className="space-y-1 mb-2">
            {savedTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => setSelectedFields([...t.fields])}
                className="w-full text-left px-2 py-1.5 rounded-sm text-[12px] hover:bg-blue-50 text-slate-700 transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            <Input
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template name..."
              className="h-7 text-[11px]"
            />
            <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={handleSaveTemplate} disabled={!templateName}>
              <Save className="w-3 h-3" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </div>

      <div className="col-span-3">
        <div className="bg-white border border-slate-200 rounded-md">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <h4 className="text-[13px] font-semibold text-slate-900">Preview</h4>
              <span className="text-[11px] text-slate-500 tabular-nums">{filteredCountries.length} rows</span>
            </div>
            <Button size="sm" className="h-7 text-[11px] bg-blue-700 hover:bg-blue-800" onClick={handleExport}>
              <Download className="w-3 h-3 mr-1.5" strokeWidth={1.75} />
              Export CSV
            </Button>
          </div>

          <div className="overflow-auto max-h-[500px]">
            <table className="w-full text-[12px] tabular-nums">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200">
                  {selectedFields.map(f => (
                    <th key={f} className="text-left px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      {availableFields.find(af => af.id === f)?.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCountries.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    {selectedFields.map(f => (
                      <td key={f} className="px-3 py-2">
                        {f === 'name' ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                              {getCountryCode(c.id)}
                            </span>
                            <span className="font-medium text-slate-900">{c.name}</span>
                          </div>
                        ) : f === 'progress' ? (
                          <span className="text-slate-600">{c.progress}%</span>
                        ) : f === 'ragStatus' ? (
                          <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider',
                            c.ragStatus === 'Green' ? 'text-emerald-700' :
                            c.ragStatus === 'Amber' ? 'text-amber-700' :
                            'text-red-700'
                          )}>
                            <span className={cn('w-1.5 h-1.5 rounded-full',
                              c.ragStatus === 'Green' ? 'bg-emerald-600' :
                              c.ragStatus === 'Amber' ? 'bg-amber-600' :
                              'bg-red-700'
                            )} />
                            {c.ragStatus}
                          </span>
                        ) : (
                          <span className="text-slate-600">{String((c as unknown as Record<string, unknown>)[f] || '')}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
