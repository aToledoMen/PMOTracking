import { useCallback, useEffect, useState } from 'react';
import { fetchGateStatuses, GateStatusDB, GateStatusWithDocId } from '@/data/domo-api';
import { generateGatesForProject, StageGate, GateMilestone } from '@/data/stage-gates';
import { ProjectTaskWithStatus } from '@/data/project-types';

export interface MilestoneState extends GateMilestone {
  checked: boolean;
  completionDate: string | null;
  evidence: string | null;
}

export interface ApprovalLogEntry {
  approved: boolean;
  approverName: string;
  comment: string;
  date: string;
}

export interface GateState {
  gate: StageGate;
  milestones: MilestoneState[];
  allTasksDone: boolean;
  allMilestonesComplete: boolean;
  isUnlocked: boolean;
  isApproved: boolean;
  approvalLog: ApprovalLogEntry[];
}

export function useStageGates(flat: ProjectTaskWithStatus[]) {
  const [gateStatuses, setGateStatuses] = useState<GateStatusWithDocId[]>([]);

  useEffect(() => {
    fetchGateStatuses()
      .then(setGateStatuses)
      .catch(() => {});
  }, []);

  function getDescendants(parentId: number): typeof flat {
    const children = flat.filter(t => t.parentId === parentId);
    const all = [...children];
    for (const c of children) {
      all.push(...getDescendants(c.id));
    }
    return all;
  }

  // Generate gates dynamically from the phase IDs in the data
  const phaseIds = flat.filter(t => t.outlineLevel === 0).map(t => t.id);
  const projectGates = generateGatesForProject(phaseIds);

  const getGateState = useCallback((gate: StageGate): GateState => {
    // Milestone states
    const milestones: MilestoneState[] = gate.milestones.map(m => {
      const status = gateStatuses.find(g => g.gateItemId === m.id);
      return {
        ...m,
        checked: status?.checked ?? false,
        completionDate: status?.completionDate ?? null,
        evidence: status?.evidence ?? null,
      };
    });

    // Approval log (all decisions for this phase, sorted by date)
    const approvalLog: ApprovalLogEntry[] = gateStatuses
      .filter(g => g.phaseId === gate.phaseId && g.gateItemId?.startsWith('gate-decision-'))
      .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
      .map(g => ({
        approved: g.gateApproved ?? false,
        approverName: g.approverName ?? 'Unknown',
        comment: g.comment ?? '',
        date: g.updatedAt,
      }));

    const lastDecision = approvalLog[approvalLog.length - 1];
    const isApproved = lastDecision?.approved === true;

    // Check all descendant leaf tasks
    const allDescendants = getDescendants(gate.phaseId);
    const leafChildren = allDescendants.filter(t => !t.summary);
    const allTasksDone = leafChildren.length > 0 && leafChildren.every(t =>
      t.status === 'Done' || t.status === 'Approved'
    );

    const allMilestonesComplete = milestones.every(m => m.checked);
    const isUnlocked = allTasksDone && allMilestonesComplete;

    return { gate, milestones, allTasksDone, allMilestonesComplete, isUnlocked, isApproved, approvalLog };
  }, [flat, gateStatuses]);

  const toggleMilestone = useCallback(async (milestoneId: string, evidenceFile?: string) => {
    const existing = gateStatuses.find(g => g.gateItemId === milestoneId);
    const newChecked = !(existing?.checked);
    const now = new Date().toISOString();
    const milestone = projectGates.flatMap(g => g.milestones).find(m => m.id === milestoneId);

    const record = {
      gateItemId: milestoneId,
      checked: newChecked,
      completionDate: newChecked ? now.slice(0, 10) : undefined,
      evidence: newChecked ? (evidenceFile || milestone?.evidenceExample) : undefined,
      updatedBy: milestone?.owner ?? 'Sarah Chen',
      updatedAt: now,
    };

    setGateStatuses(prev => {
      const idx = prev.findIndex(g => g.gateItemId === milestoneId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...record };
        return updated;
      }
      return [...prev, { ...record, _docId: undefined }];
    });

    try {
      if (existing?._docId) {
        await GateStatusDB.update(existing._docId, record);
      } else {
        const doc = await GateStatusDB.create(record);
        setGateStatuses(prev => prev.map(g => g.gateItemId === milestoneId ? { ...g, _docId: doc.id } : g));
      }
    } catch (e) {
      console.error('[GateStatus] Write failed', e);
    }
  }, [gateStatuses]);

  const approveGate = useCallback(async (phaseId: number, approverName: string, comment: string) => {
    const now = new Date().toISOString();
    const record = {
      gateItemId: `gate-decision-${phaseId}-${Date.now()}`,
      checked: true,
      gateApproved: true,
      phaseId,
      approverName,
      comment,
      updatedBy: approverName,
      updatedAt: now,
    };

    setGateStatuses(prev => [...prev, { ...record, _docId: undefined }]);

    try {
      await GateStatusDB.create(record);
    } catch (e) {
      console.error('[GateStatus] Approve failed', e);
    }
  }, []);

  const rejectGate = useCallback(async (phaseId: number, approverName: string, comment: string) => {
    const now = new Date().toISOString();
    const record = {
      gateItemId: `gate-decision-${phaseId}-${Date.now()}`,
      checked: true,
      gateApproved: false,
      phaseId,
      approverName,
      comment,
      updatedBy: approverName,
      updatedAt: now,
    };

    setGateStatuses(prev => [...prev, { ...record, _docId: undefined }]);

    try {
      await GateStatusDB.create(record);
    } catch (e) {
      console.error('[GateStatus] Reject failed', e);
    }
  }, []);

  const gates = projectGates.map(getGateState);

  return { gates, toggleMilestone, approveGate, rejectGate };
}
