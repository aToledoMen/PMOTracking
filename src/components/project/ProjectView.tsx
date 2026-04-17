import { useState } from 'react';
import { useProjectData } from '@/hooks/useProjectData';
import { useStageGates } from '@/hooks/useStageGates';
import { TaskTreeTable } from './TaskTreeTable';
import { GanttView } from './GanttView';
import { ProjectSummary } from './ProjectSummary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table2, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'table' | 'gantt';

export function ProjectView() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [filterPhase, setFilterPhase] = useState<string>('all');
  const [filterOwner, setFilterOwner] = useState<string>('all');

  const { tree, flat, loading, source, projects, allFlat, toggleDone, approve, reject } = useProjectData(selectedProject || undefined);
  const { gates, toggleMilestone, approveGate, rejectGate } = useStageGates(flat);

  const phases = flat.filter(t => t.outlineLevel === 0).map(t => ({ id: String(t.id), name: t.name }));
  const owners = [...new Set(flat.map(t => t.resourceNames).filter(Boolean))].sort();

  function filterTree(nodes: typeof tree): typeof tree {
    return nodes.reduce<typeof tree>((acc, node) => {
      const filteredChildren = filterTree(node.children);
      const ownerMatch = filterOwner === 'all' || node.resourceNames === filterOwner;
      const hasMatchingChildren = filteredChildren.length > 0;

      if (ownerMatch || hasMatchingChildren) {
        acc.push({
          ...node,
          children: filterOwner === 'all' ? node.children : filteredChildren,
        });
      }
      return acc;
    }, []);
  }

  const phaseFiltered = filterPhase === 'all' ? tree : tree.filter(t => String(t.id) === filterPhase);
  const filteredTree = filterOwner === 'all' ? phaseFiltered : filterTree(phaseFiltered);

  const filteredFlat = flat.filter(t => {
    if (filterPhase !== 'all') {
      const phase = flat.find(f => String(f.id) === filterPhase);
      if (phase && !t.wbs.startsWith(phase.wbs)) return false;
    }
    if (filterOwner !== 'all' && t.resourceNames !== filterOwner) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[13px] text-slate-400">Loading project plan...</p>
      </div>
    );
  }

  const totalTasks = flat.filter(t => !t.summary).length;
  const doneTasks = flat.filter(t => !t.summary && (t.status === 'Done' || t.status === 'Approved')).length;
  const pendingApproval = flat.filter(t => t.status === 'Pending Approval').length;
  const overallProgress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const leafTasks = flat.filter(t => !t.summary);
  const delayedTasks = leafTasks.filter(t => {
    if (!t.baselineFinish || !t.finish) return false;
    return new Date(t.finish) > new Date(t.baselineFinish);
  }).length;
  const onSchedule = totalTasks > 0 ? Math.round(((totalTasks - delayedTasks) / totalTasks) * 100) : 100;

  const gatesPassed = gates.filter(g => g.isApproved).length;
  const totalGates = gates.length;

  const isAllProjects = !selectedProject;

  return (
    <div className="space-y-4">
      {/* Project selector */}
      <div className="flex items-center justify-between">
        <Select value={selectedProject || 'all'} onValueChange={v => { setSelectedProject(v === 'all' ? '' : v); setFilterPhase('all'); setFilterOwner('all'); }}>
          <SelectTrigger className="w-56 h-9 text-[13px] border-slate-200 font-semibold">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2 py-1 border border-slate-200 rounded-sm">
          {source === 'live' ? 'LIVE' : 'DEMO'}
        </span>
      </div>

      {/* All Projects view */}
      {isAllProjects ? (
        <ProjectSummary allFlat={allFlat} onSelectProject={setSelectedProject} />
      ) : (
        <>
          {/* KPIs for selected project */}
          <div className="grid grid-cols-6 gap-3">
            <StatCard label="Total Tasks" value={totalTasks} color="text-slate-900" />
            <StatCard label="Completed" value={doneTasks} color="text-emerald-700" />
            <StatCard label="Pending Approval" value={pendingApproval} color="text-amber-700" />
            <StatCard label="Overall Progress" value={`${overallProgress}%`} color="text-blue-700" />
            <StatCard label="On Schedule" value={`${onSchedule}%`} color={delayedTasks > 0 ? 'text-red-700' : 'text-emerald-700'} subtitle={delayedTasks > 0 ? `${delayedTasks} delayed` : 'All on time'} />
            <StatCard label="Gates Passed" value={`${gatesPassed}/${totalGates}`} color={gatesPassed > 0 ? 'text-emerald-700' : 'text-slate-500'} subtitle={gatesPassed === totalGates ? 'All gates cleared' : `${totalGates - gatesPassed} remaining`} />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Select value={filterPhase} onValueChange={setFilterPhase}>
                <SelectTrigger className="w-52 h-8 text-[12px] border-slate-200">
                  <SelectValue placeholder="All Phases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterOwner} onValueChange={setFilterOwner}>
                <SelectTrigger className="w-40 h-8 text-[12px] border-slate-200">
                  <SelectValue placeholder="All Owners" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  {owners.map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-sm p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-colors',
                  viewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Table2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                Table
              </button>
              <button
                onClick={() => setViewMode('gantt')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-semibold transition-colors',
                  viewMode === 'gantt' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <BarChart3 className="w-3.5 h-3.5" strokeWidth={1.75} />
                Gantt
              </button>
            </div>
          </div>

          {/* View */}
          {viewMode === 'table' ? (
            <TaskTreeTable
              tree={filteredTree}
              gates={gates}
              onToggleDone={toggleDone}
              onApprove={approve}
              onReject={reject}
              onToggleMilestone={toggleMilestone}
              onApproveGate={approveGate}
              onRejectGate={rejectGate}
            />
          ) : (
            <GanttView flat={filteredFlat} />
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, color, subtitle }: { label: string; value: string | number; color: string; subtitle?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
      <p className={cn('text-2xl font-semibold tabular-nums tracking-tight leading-none', color)}>{value}</p>
      {subtitle && <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>}
    </div>
  );
}
