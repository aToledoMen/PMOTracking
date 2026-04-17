import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TemplateWithDocId } from '@/data/domo-api';
import { Plus, X, Shield } from 'lucide-react';

interface Phase {
  phaseId: number;
  phaseName: string;
  nextPhaseName: string;
}

interface TemplateEditorProps {
  phases: Phase[];
  templates: TemplateWithDocId[];
  onAdd: (phaseId: number, label: string) => void;
  onRemove: (milestoneId: string) => void;
}

export function TemplateEditor({ phases, templates, onAdd, onRemove }: TemplateEditorProps) {
  const [newLabels, setNewLabels] = useState<Record<number, string>>({});

  const handleAdd = (phaseId: number) => {
    const label = newLabels[phaseId]?.trim();
    if (!label) return;
    onAdd(phaseId, label);
    setNewLabels(prev => ({ ...prev, [phaseId]: '' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-blue-700" strokeWidth={1.75} />
        <h3 className="text-[14px] font-semibold text-slate-900">Global Milestone Template</h3>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider ml-2">Applies to all projects</span>
      </div>

      {phases.map(phase => {
        const phaseMilestones = templates.filter(t => t.phaseId === phase.phaseId);
        return (
          <div key={phase.phaseId} className="bg-white border border-slate-200 rounded-md">
            <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  {phase.phaseName}
                </span>
                <span className="text-[11px] text-slate-400">→ {phase.nextPhaseName}</span>
              </div>
              <span className="text-[10px] text-slate-500 tabular-nums">{phaseMilestones.length} milestones</span>
            </div>

            <div className="divide-y divide-slate-100">
              {phaseMilestones.map(m => (
                <div key={m.milestoneId} className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                  <span className="text-[12px] text-slate-700">{m.label}</span>
                  <button
                    onClick={() => onRemove(m.milestoneId)}
                    className="p-1 hover:bg-red-50 rounded-sm text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              ))}

              {phaseMilestones.length === 0 && (
                <div className="px-4 py-3 text-[11px] text-slate-400 text-center">No milestones configured</div>
              )}
            </div>

            <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-100 bg-slate-50/50">
              <Input
                value={newLabels[phase.phaseId] || ''}
                onChange={e => setNewLabels(prev => ({ ...prev, [phase.phaseId]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleAdd(phase.phaseId)}
                placeholder="New milestone name..."
                className="h-7 text-[11px] flex-1 border-slate-200"
              />
              <Button
                size="sm"
                className="h-7 text-[10px] px-2.5 bg-blue-700 hover:bg-blue-800"
                disabled={!newLabels[phase.phaseId]?.trim()}
                onClick={() => handleAdd(phase.phaseId)}
              >
                <Plus className="w-3 h-3 mr-1" strokeWidth={2} />
                Add
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
