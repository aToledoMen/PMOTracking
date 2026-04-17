import { useMilestoneConfig } from '@/hooks/useMilestoneConfig';
import { TemplateEditor } from './TemplateEditor';
import { OverrideEditor } from './OverrideEditor';
import { Separator } from '@/components/ui/separator';

export function ConfigView() {
  const {
    templates, overrides, phases, loaded,
    addMilestone, removeMilestone,
    addOverride, removeOverride, toggleGlobalForProject,
  } = useMilestoneConfig();

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-slate-400">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[16px] font-semibold text-slate-900">Milestone Configuration</h2>
        <p className="text-[12px] text-slate-500 mt-0.5">Define mandatory milestones per phase globally, and customize per project</p>
      </div>

      <TemplateEditor
        phases={phases}
        templates={templates}
        onAdd={addMilestone}
        onRemove={removeMilestone}
      />

      <Separator />

      <OverrideEditor
        phases={phases}
        templates={templates}
        overrides={overrides}
        onToggleGlobal={toggleGlobalForProject}
        onAddOverride={addOverride}
        onRemoveOverride={removeOverride}
      />
    </div>
  );
}
