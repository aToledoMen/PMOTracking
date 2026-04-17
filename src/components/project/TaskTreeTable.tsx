import { useState } from 'react';
import { ProjectTaskWithStatus } from '@/data/project-types';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';
import { ApprovalButton } from './ApprovalButton';
import { StageGateRow } from './StageGateRow';
import { GateState } from '@/hooks/useStageGates';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, ExternalLink, Square, CheckSquare } from 'lucide-react';

interface TaskTreeTableProps {
  tree: ProjectTaskWithStatus[];
  gates: GateState[];
  onToggleDone: (taskId: number) => void;
  onApprove: (taskId: number) => void;
  onReject: (taskId: number) => void;
  onToggleMilestone: (milestoneId: string, evidenceFile?: string) => void;
  onApproveGate: (phaseId: number, approver: string, comment: string) => void;
  onRejectGate: (phaseId: number, approver: string, comment: string) => void;
}

function getVarianceDays(finish: string, baselineFinish: string): number | null {
  if (!finish || !baselineFinish) return null;
  const f = new Date(finish).getTime();
  const bf = new Date(baselineFinish).getTime();
  if (isNaN(f) || isNaN(bf)) return null;
  return Math.round((f - bf) / (1000 * 60 * 60 * 24));
}

export function TaskTreeTable({ tree, gates, onToggleDone, onApprove, onReject, onToggleMilestone, onApproveGate, onRejectGate }: TaskTreeTableProps) {
  const gateMap = new Map(gates.map(g => [g.gate.phaseId, g]));

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="grid grid-cols-[60px_1fr_130px_85px_85px_95px_80px_130px_100px] items-center gap-2 px-4 py-2 border-b border-slate-200 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        <span>WBS</span>
        <span>Task Name</span>
        <span>Resource</span>
        <span>Start</span>
        <span>Finish</span>
        <span>Progress</span>
        <span>Variance</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>
      <div>
        {tree.map((node) => (
          <div key={node.id}>
            <TaskRowRecursive
              task={node}
              depth={0}
              onToggleDone={onToggleDone}
              onApprove={onApprove}
              onReject={onReject}
            />
            {/* Stage gate after each phase */}
            {gateMap.has(node.id) && (
              <StageGateRow
                gateState={gateMap.get(node.id)!}
                onToggleMilestone={onToggleMilestone}
                onApprove={onApproveGate}
                onReject={onRejectGate}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskRowRecursive({
  task,
  depth,
  onToggleDone,
  onApprove,
  onReject,
}: {
  task: ProjectTaskWithStatus;
  depth: number;
  onToggleDone: (id: number) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = task.children.length > 0;
  const isLeaf = !task.summary;
  const isDone = task.status === 'Done' || task.status === 'Approved';
  const isPending = task.status === 'Pending Approval';
  const hasStarted = task.status !== 'Not Started';
  const variance = getVarianceDays(task.finish, task.baselineFinish);

  const rowBg = task.status === 'Approved' ? 'bg-emerald-50/30' :
    isPending ? 'bg-amber-50/30' :
    isDone ? 'bg-emerald-50/20' : '';

  return (
    <>
      <div
        className={cn(
          'grid grid-cols-[60px_1fr_130px_85px_85px_95px_80px_130px_100px] items-center gap-2 px-4 py-2 hover:bg-slate-50 transition-colors',
          rowBg,
          task.outlineLevel === 0 && 'border-t border-slate-200 first:border-t-0'
        )}
      >
        <span className="text-[11px] text-slate-500 tabular-nums font-medium">{task.wbs}</span>

        <div className="flex items-center min-w-0" style={{ paddingLeft: `${depth * 20}px` }}>
          {hasChildren ? (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-0.5 hover:bg-slate-200 rounded-sm mr-1 flex-shrink-0"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <span className={cn(
            'text-[12px] truncate',
            task.summary ? 'font-semibold text-slate-900' : 'text-slate-700'
          )}>
            {task.name}
          </span>
        </div>

        <span className="text-[11px] text-slate-600 truncate">{task.resourceNames}</span>
        <span className="text-[11px] text-slate-500 tabular-nums">{task.start}</span>
        <span className="text-[11px] text-slate-500 tabular-nums">{task.finish}</span>
        <ProgressBar value={task.actualProgress} />

        {/* Variance column */}
        <span className={cn(
          'text-[11px] tabular-nums',
          variance === null ? 'text-slate-300' :
          variance > 0 && hasStarted ? 'text-red-700 font-semibold' :
          variance > 0 && !hasStarted ? 'text-amber-600 font-medium' :
          variance < 0 ? 'text-emerald-700 font-semibold' :
          'text-slate-500'
        )}>
          {variance === null ? '—' :
           variance === 0 ? 'On time' :
           variance > 0 && !hasStarted ? `+${variance}d *` :
           variance > 0 ? `+${variance}d` :
           `${variance}d`}
        </span>

        <StatusBadge status={task.status} />

        <div className="flex items-center justify-end gap-1">
          {isLeaf && (
            <button
              onClick={() => onToggleDone(task.id)}
              className="p-1 hover:bg-slate-200 rounded-sm transition-colors"
            >
              {isDone ? (
                <CheckSquare className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
              ) : (
                <Square className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
              )}
            </button>
          )}
          {isPending && (
            <ApprovalButton
              onApprove={() => onApprove(task.id)}
              onReject={() => onReject(task.id)}
            />
          )}
          {task.notes && (
            <span title="SharePoint link">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-blue-600" strokeWidth={1.75} />
            </span>
          )}
        </div>
      </div>

      {expanded && hasChildren && task.children.map(child => (
        <TaskRowRecursive
          key={child.id}
          task={child}
          depth={depth + 1}
          onToggleDone={onToggleDone}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </>
  );
}
