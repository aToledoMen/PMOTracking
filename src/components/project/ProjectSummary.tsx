import { ProjectTaskWithStatus } from '@/data/project-types';
import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/utils';

interface ProjectSummaryProps {
  allFlat: ProjectTaskWithStatus[];
  onSelectProject: (project: string) => void;
}

export function ProjectSummary({ allFlat, onSelectProject }: ProjectSummaryProps) {
  const projects = [...new Set(allFlat.map(t => t.project))].filter(Boolean).sort();

  const projectStats = projects.map(project => {
    const tasks = allFlat.filter(t => t.project === project);
    const leaves = tasks.filter(t => !t.summary);
    const done = leaves.filter(t => t.status === 'Done' || t.status === 'Approved').length;
    const progress = leaves.length > 0 ? Math.round((done / leaves.length) * 100) : 0;

    const phases = tasks.filter(t => t.outlineLevel === 0);
    const currentPhase = phases.find(p => {
      const children = tasks.filter(t => t.project === project && t.outlineLevel > 0);
      const phaseChildren = children.filter(c => c.wbs.startsWith(p.wbs + '.'));
      return phaseChildren.some(c => c.status === 'In Progress' || c.pctComplete > 0 && c.pctComplete < 100);
    }) || phases.find(p => p.actualProgress < 100) || phases[0];

    const delayed = leaves.filter(t => {
      if (!t.baselineFinish || !t.finish) return false;
      return new Date(t.finish) > new Date(t.baselineFinish);
    }).length;
    const onSchedule = leaves.length > 0 ? Math.round(((leaves.length - delayed) / leaves.length) * 100) : 100;

    const status = delayed > 2 ? 'At Risk' : progress >= 80 ? 'On Track' : progress > 0 ? 'On Track' : 'Not Started';

    return {
      project,
      progress,
      currentPhase: currentPhase?.name?.replace('Phase ', '').replace(/^\d+: /, '') || '—',
      done,
      total: leaves.length,
      onSchedule,
      status,
    };
  });

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-[13px] font-semibold text-slate-900">All Projects Overview</h3>
        <p className="text-[11px] text-slate-500">{projects.length} active projects</p>
      </div>

      <div className="grid grid-cols-[1fr_100px_120px_80px_80px_70px] items-center gap-3 px-4 py-2 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span>Project</span>
        <span>Progress</span>
        <span>Current Phase</span>
        <span>Tasks</span>
        <span>Schedule</span>
        <span>Status</span>
      </div>

      <div className="divide-y divide-slate-100">
        {projectStats.map(p => (
          <div
            key={p.project}
            onClick={() => onSelectProject(p.project)}
            className="grid grid-cols-[1fr_100px_120px_80px_80px_70px] items-center gap-3 px-4 py-3 hover:bg-blue-50/30 cursor-pointer transition-colors"
          >
            <span className="text-[13px] font-semibold text-slate-900">{p.project}</span>
            <ProgressBar value={p.progress} />
            <span className="text-[11px] text-slate-600">{p.currentPhase}</span>
            <span className="text-[11px] text-slate-600 tabular-nums">{p.done}/{p.total}</span>
            <span className={cn('text-[11px] font-semibold tabular-nums',
              p.onSchedule >= 90 ? 'text-emerald-700' : p.onSchedule >= 70 ? 'text-amber-700' : 'text-red-700'
            )}>
              {p.onSchedule}%
            </span>
            <span className={cn('text-[10px] font-semibold uppercase tracking-wider',
              p.status === 'On Track' ? 'text-emerald-700' :
              p.status === 'At Risk' ? 'text-amber-700' :
              'text-slate-500'
            )}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
