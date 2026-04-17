import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TemplateWithDocId, OverrideWithDocId } from '@/data/domo-api';
import { cn } from '@/lib/utils';
import { Plus, X, CheckSquare, Square, Layers } from 'lucide-react';

interface Phase {
  phaseId: number;
  phaseName: string;
  nextPhaseName: string;
}

const projects = [
  { id: 'germany', name: 'Germany' },
  { id: 'brazil', name: 'Brazil' },
  { id: 'japan', name: 'Japan' },
  { id: 'usa', name: 'United States' },
  { id: 'uk', name: 'United Kingdom' },
];

interface OverrideEditorProps {
  phases: Phase[];
  templates: TemplateWithDocId[];
  overrides: OverrideWithDocId[];
  onToggleGlobal: (projectId: string, phaseId: number, milestoneId: string) => void;
  onAddOverride: (projectId: string, phaseId: number, action: 'add', milestoneId: string, label: string) => void;
  onRemoveOverride: (milestoneId: string, projectId: string) => void;
}

export function OverrideEditor({ phases, templates, overrides, onToggleGlobal, onAddOverride, onRemoveOverride }: OverrideEditorProps) {
  const [selectedProject, setSelectedProject] = useState('');
  const [newLabels, setNewLabels] = useState<Record<number, string>>({});

  const handleAdd = (phaseId: number) => {
    if (!selectedProject) return;
    const label = newLabels[phaseId]?.trim();
    if (!label) return;
    onAddOverride(selectedProject, phaseId, 'add', `ovr-${Date.now()}`, label);
    setNewLabels(prev => ({ ...prev, [phaseId]: '' }));
  };

  const projOverrides = overrides.filter(o => o.projectId === selectedProject);
  const removedIds = new Set(projOverrides.filter(o => o.action === 'remove').map(o => o.milestoneId));
  const addedOverrides = projOverrides.filter(o => o.action === 'add');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-700" strokeWidth={1.75} />
          <h3 className="text-[14px] font-semibold text-slate-900">Project Overrides</h3>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-48 h-8 text-[12px] border-slate-200">
            <SelectValue placeholder="Select project..." />
          </SelectTrigger>
          <SelectContent>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedProject ? (
        <div className="bg-white border border-slate-200 rounded-md p-8 text-center">
          <p className="text-[12px] text-slate-400">Select a project to configure overrides</p>
        </div>
      ) : (
        phases.map(phase => {
          const phaseMilestones = templates.filter(t => t.phaseId === phase.phaseId);
          const phaseAdds = addedOverrides.filter(o => o.phaseId === phase.phaseId);
          const hasOverrides = phaseAdds.length > 0 || phaseMilestones.some(m => removedIds.has(m.milestoneId));

          return (
            <div key={phase.phaseId} className="bg-white border border-slate-200 rounded-md">
              <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {phase.phaseName}
                  </span>
                  <span className="text-[11px] text-slate-400">→ {phase.nextPhaseName}</span>
                </div>
                {hasOverrides && (
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                    CUSTOMIZED
                  </span>
                )}
              </div>

              {/* Global milestones with toggle */}
              <div className="divide-y divide-slate-100">
                <div className="px-4 py-1.5 bg-slate-50/50">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">Global milestones</span>
                </div>
                {phaseMilestones.map(m => {
                  const isRemoved = removedIds.has(m.milestoneId);
                  return (
                    <div key={m.milestoneId} className="flex items-center justify-between px-4 py-2 hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onToggleGlobal(selectedProject, phase.phaseId, m.milestoneId)}>
                          {isRemoved ? (
                            <Square className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                          ) : (
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                          )}
                        </button>
                        <span className={cn('text-[12px]', isRemoved ? 'text-slate-400 line-through' : 'text-slate-700')}>
                          {m.label}
                        </span>
                      </div>
                      {isRemoved && (
                        <span className="text-[9px] font-semibold text-red-600 uppercase tracking-wider">Removed</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Project-specific additions */}
              {phaseAdds.length > 0 && (
                <div className="divide-y divide-slate-100 border-t border-slate-200">
                  <div className="px-4 py-1.5 bg-blue-50/30">
                    <span className="text-[9px] font-semibold uppercase tracking-wider text-blue-600">Added for this project</span>
                  </div>
                  {phaseAdds.map(o => (
                    <div key={o.milestoneId} className="flex items-center justify-between px-4 py-2 hover:bg-blue-50/20">
                      <div className="flex items-center gap-2">
                        <Plus className="w-3.5 h-3.5 text-blue-600" strokeWidth={2} />
                        <span className="text-[12px] text-blue-800">{o.label}</span>
                      </div>
                      <button
                        onClick={() => onRemoveOverride(o.milestoneId, selectedProject)}
                        className="p-1 hover:bg-red-50 rounded-sm text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-100 bg-slate-50/50">
                <Input
                  value={newLabels[phase.phaseId] || ''}
                  onChange={e => setNewLabels(prev => ({ ...prev, [phase.phaseId]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleAdd(phase.phaseId)}
                  placeholder="Add milestone for this project..."
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
        })
      )}
    </div>
  );
}
