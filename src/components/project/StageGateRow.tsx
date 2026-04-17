import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GateState } from '@/hooks/useStageGates';
import { users } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Lock, Unlock, ShieldCheck, Check, X, Square, CheckSquare, Paperclip, ChevronRight } from 'lucide-react';

interface StageGateRowProps {
  gateState: GateState;
  onToggleMilestone: (milestoneId: string, evidenceFile?: string) => void;
  onApprove: (phaseId: number, approver: string, comment: string) => void;
  onReject: (phaseId: number, approver: string, comment: string) => void;
}

export function StageGateRow({ gateState, onToggleMilestone, onApprove, onReject }: StageGateRowProps) {
  const { gate, milestones, allTasksDone, isUnlocked, isApproved, approvalLog } = gateState;
  const [approver, setApprover] = useState('');
  const [comment, setComment] = useState('');
  // Auto-expand when tasks are done (so user sees what milestones are pending)
  const hasActivity = milestones.some(m => m.checked) || approvalLog.length > 0;
  const shouldExpand = allTasksDone || isUnlocked || isApproved || hasActivity;
  const [expanded, setExpanded] = useState(shouldExpand);
  // Re-expand when tasks become done
  const [prevTasksDone, setPrevTasksDone] = useState(allTasksDone);
  if (allTasksDone && !prevTasksDone) {
    setExpanded(true);
    setPrevTasksDone(true);
  } else if (!allTasksDone && prevTasksDone) {
    setPrevTasksDone(false);
  }

  const completedCount = milestones.filter(m => m.checked).length;
  const GateIcon = isApproved ? ShieldCheck : isUnlocked ? Unlock : Lock;
  const gateColor = isApproved ? 'text-emerald-700' : isUnlocked ? 'text-blue-700' : 'text-slate-500';
  const gateBg = isApproved ? 'bg-emerald-50/60' : isUnlocked ? 'bg-blue-50/40' : 'bg-slate-50';
  const gateLabel = isApproved ? 'APPROVED' : isUnlocked ? 'READY FOR APPROVAL' : 'LOCKED';

  const canApprove = isUnlocked && !isApproved && approver && comment.trim();
  const canReject = !isApproved && approver && comment.trim();

  const handleApprove = () => {
    if (canApprove) {
      onApprove(gate.phaseId, approver, comment);
      setComment('');
    }
  };

  const handleReject = () => {
    if (canReject) {
      onReject(gate.phaseId, approver, comment);
      setComment('');
    }
  };

  const pmoUsers = users.filter(u => u.role === 'PMO Director' || u.role === 'Deployment Manager');

  return (
    <div className={cn('border-y-2 border-slate-300', gateBg)}>
      {/* Gate Header — clickable to toggle */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-100/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <ChevronRight className={cn('w-3.5 h-3.5 text-slate-400 transition-transform', expanded && 'rotate-90')} strokeWidth={2} />
          <GateIcon className={cn('w-4 h-4', gateColor)} strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Stage Gate
          </span>
          <span className="text-[11px] text-slate-500">
            {gate.phaseName} → {gate.nextPhaseName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!allTasksDone && <span className="text-[10px] text-slate-400">Tasks pending</span>}
          <span className="text-[10px] text-slate-500 tabular-nums">{completedCount}/{milestones.length} milestones</span>
          <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm',
            isApproved ? 'bg-emerald-100 text-emerald-700' :
            isUnlocked ? 'bg-blue-100 text-blue-700' :
            'bg-slate-200 text-slate-600'
          )}>
            {gateLabel}
          </span>
        </div>
      </div>

      {/* Collapsible content */}
      {!expanded ? null : <>

      {/* Milestone Checklist Table */}
      <div className="px-4 py-2 border-t border-slate-200/80">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Milestone Checklist</p>
        <div className="border border-slate-200 rounded-sm overflow-hidden bg-white">
          <div className="grid grid-cols-[1fr_120px_85px_85px_70px_160px] items-center gap-2 px-3 py-1.5 border-b border-slate-200 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Milestone</span>
            <span>Owner</span>
            <span>Due Date</span>
            <span>Completed</span>
            <span>Status</span>
            <span>Evidence</span>
          </div>
          {milestones.map(m => (
            <div
              key={m.id}
              className={cn(
                'grid grid-cols-[1fr_120px_85px_85px_70px_160px] items-center gap-2 px-3 py-1.5 border-b border-slate-100 last:border-b-0',
                m.checked ? 'bg-emerald-50/30' : ''
              )}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleMilestone(m.id, m.evidenceExample)}
                  disabled={isApproved}
                  className={cn('flex-shrink-0', isApproved ? 'opacity-50 cursor-default' : 'cursor-pointer')}
                >
                  {m.checked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2} />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.75} />
                  )}
                </button>
                <span className={cn('text-[11px]', m.checked ? 'text-slate-500 line-through' : 'text-slate-800')}>
                  {m.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-600">{m.owner}</span>
              <span className="text-[11px] text-slate-500 tabular-nums">{m.dueDate}</span>
              <span className="text-[11px] text-slate-500 tabular-nums">
                {m.completionDate || '—'}
              </span>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider',
                m.checked ? 'text-emerald-700' : 'text-slate-400'
              )}>
                {m.checked ? 'Done' : 'Pending'}
              </span>
              <div className="flex items-center gap-1 text-[10px]">
                {m.checked && m.evidence ? (
                  <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-sm">
                    <Paperclip className="w-3 h-3" strokeWidth={1.75} />
                    <span className="truncate max-w-[120px]">{m.evidence}</span>
                  </span>
                ) : !isApproved ? (
                  <label className="flex items-center gap-1 text-blue-600 hover:text-blue-800 cursor-pointer px-1.5 py-0.5 rounded-sm hover:bg-blue-50 transition-colors">
                    <Paperclip className="w-3 h-3" strokeWidth={1.75} />
                    <span>Attach</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onToggleMilestone(m.id, file.name);
                        }
                      }}
                    />
                  </label>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stage-Gate Sign-Off Panel */}
      <div className="px-4 py-2.5 border-t border-slate-200/80">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Stage-Gate Sign-Off</p>

        {!isApproved && (
          <div className="flex items-end gap-3 mb-3">
            <div className="flex-1 max-w-[180px]">
              <label className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5 block">PMO Approver *</label>
              <Select value={approver} onValueChange={setApprover}>
                <SelectTrigger className="h-7 text-[11px] border-slate-200">
                  <SelectValue placeholder="Select approver" />
                </SelectTrigger>
                <SelectContent>
                  {pmoUsers.map(u => (
                    <SelectItem key={u.id} value={u.name}>{u.name} · {u.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5 block">Comment *</label>
              <Input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Reason for decision..."
                className="h-7 text-[11px] border-slate-200"
              />
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] px-2.5 text-red-700 border-red-200 hover:bg-red-50"
                disabled={!canReject}
                onClick={handleReject}
              >
                <X className="w-3 h-3 mr-1" strokeWidth={2} />
                Reject
              </Button>
              <Button
                size="sm"
                className="h-7 text-[10px] px-2.5 bg-emerald-700 hover:bg-emerald-800"
                disabled={!canApprove}
                onClick={handleApprove}
              >
                <Check className="w-3 h-3 mr-1" strokeWidth={2} />
                Approve
              </Button>
            </div>
          </div>
        )}

        {/* Immutable Decision Log */}
        {approvalLog.length > 0 && (
          <div className="mt-1">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Decision Log (immutable)</p>
            <div className="border border-slate-200 rounded-sm bg-white divide-y divide-slate-100">
              {approvalLog.map((entry, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-1.5 text-[10px]">
                  <span className={cn('font-bold uppercase tracking-wider',
                    entry.approved ? 'text-emerald-700' : 'text-red-700'
                  )}>
                    {entry.approved ? '✓ APPROVED' : '✗ REJECTED'}
                  </span>
                  <span className="text-slate-500 tabular-nums">{entry.date.slice(0, 10)}</span>
                  <span className="text-slate-700 font-medium">{entry.approverName}</span>
                  <span className="text-slate-500 italic truncate">&quot;{entry.comment}&quot;</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </>}
    </div>
  );
}
