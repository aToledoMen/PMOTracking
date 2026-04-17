import { useCallback, useEffect, useState } from 'react';
import { fetchProjectPlan, fetchTaskStatuses, TaskStatusDB, StatusWithDocId } from '@/data/domo-api';
import { ProjectTask, ProjectTaskWithStatus, TaskStatusValue } from '@/data/project-types';
import { mockProjectPlan } from '@/data/mock-project';

function buildTree(tasks: ProjectTask[], statusMap: Map<number, StatusWithDocId>): ProjectTaskWithStatus[] {
  const result: ProjectTaskWithStatus[] = [];
  const stack: ProjectTaskWithStatus[] = [];

  for (const t of tasks) {
    const st = statusMap.get(t.id);
    const node: ProjectTaskWithStatus = {
      ...t,
      status: (st?.status as TaskStatusValue) || (t.pctComplete >= 100 ? 'Done' : t.pctComplete > 0 ? 'In Progress' : 'Not Started'),
      actualProgress: st?.progress ?? t.pctComplete,
      approvedBy: st?.approvedBy ?? null,
      approvedAt: st?.approvedAt ?? null,
      _docId: st?._docId,
      children: [],
      parentId: null,
    };

    while (stack.length > 0 && stack[stack.length - 1].outlineLevel >= t.outlineLevel) {
      stack.pop();
    }

    if (stack.length > 0) {
      node.parentId = stack[stack.length - 1].id;
      stack[stack.length - 1].children.push(node);
    } else {
      result.push(node);
    }

    stack.push(node);
  }

  return result;
}

function flattenTree(tree: ProjectTaskWithStatus[]): ProjectTaskWithStatus[] {
  const flat: ProjectTaskWithStatus[] = [];
  function walk(nodes: ProjectTaskWithStatus[]) {
    for (const n of nodes) {
      flat.push(n);
      walk(n.children);
    }
  }
  walk(tree);
  return flat;
}

export type ProjectSource = 'mock' | 'live';

export function useProjectData(selectedProject?: string) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [statuses, setStatuses] = useState<StatusWithDocId[]>([]);
  const [source, setSource] = useState<ProjectSource>('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let planData: ProjectTask[] = mockProjectPlan;
      let statusData: StatusWithDocId[] = [];
      let isLive = false;

      // Try dataset
      try {
        const plan = await fetchProjectPlan();
        if (plan.length > 0) {
          planData = plan;
          isLive = true;
          console.log('[ProjectPlan] Loaded', plan.length, 'tasks from dataset');
        }
      } catch (e) {
        console.warn('[ProjectPlan] Dataset unavailable, using mock', e);
      }

      // Try AppDB (independently)
      try {
        statusData = await fetchTaskStatuses();
        console.log('[ProjectPlan] Loaded', statusData.length, 'statuses from AppDB');
      } catch (e) {
        console.warn('[ProjectPlan] AppDB taskstatus unavailable', e);
      }

      if (!cancelled) {
        setTasks(planData);
        setStatuses(statusData);
        setSource(isLive ? 'live' : 'mock');
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredTasks = selectedProject ? tasks.filter(t => t.project === selectedProject) : tasks;
  const projects = [...new Set(tasks.map(t => t.project))].sort();
  const statusMap = new Map(statuses.map(s => [s.taskId, s]));
  const tree = buildTree(filteredTasks, statusMap);
  const flat = flattenTree(tree);

  const updateStatus = useCallback(async (taskId: number, newStatus: TaskStatusValue, progress: number) => {
    const existing = statuses.find(s => s.taskId === taskId);
    const record = {
      taskId,
      status: newStatus,
      progress,
      updatedBy: 'Sarah Chen',
      updatedAt: new Date().toISOString(),
      approvedBy: newStatus === 'Approved' ? 'Sarah Chen' : (existing?.approvedBy ?? null),
      approvedAt: newStatus === 'Approved' ? new Date().toISOString() : (existing?.approvedAt ?? null),
    };

    // Optimistic
    setStatuses(prev => {
      const idx = prev.findIndex(s => s.taskId === taskId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...record, _docId: prev[idx]._docId };
        return updated;
      }
      return [...prev, { ...record, _docId: undefined }];
    });

    if (source === 'live') {
      try {
        if (existing?._docId) {
          await TaskStatusDB.update(existing._docId, record);
        } else {
          const doc = await TaskStatusDB.create(record);
          setStatuses(prev => prev.map(s => s.taskId === taskId ? { ...s, _docId: doc.id } : s));
        }
      } catch (e) {
        console.error('[TaskStatus] Write failed', e);
      }
    }
  }, [source, statuses]);

  const toggleDone = useCallback(async (taskId: number) => {
    const current = statusMap.get(taskId);
    const isDone = current?.status === 'Done';
    const newStatus: TaskStatusValue = isDone ? 'Not Started' : 'Done';
    const newProgress = isDone ? 0 : 100;

    await updateStatus(taskId, newStatus, newProgress);

    // Auto-escalate parent
    const task = flat.find(t => t.id === taskId);
    if (task?.parentId) {
      const parent = flat.find(t => t.id === task.parentId);
      if (parent) {
        const siblings = flat.filter(t => t.parentId === parent.id);
        const allDone = siblings.every(s => {
          if (s.id === taskId) return newStatus === 'Done';
          return statusMap.get(s.id)?.status === 'Done';
        });
        const doneCount = siblings.filter(s => {
          if (s.id === taskId) return newStatus === 'Done';
          return statusMap.get(s.id)?.status === 'Done';
        }).length;
        const parentProgress = Math.round((doneCount / siblings.length) * 100);
        const parentStatus: TaskStatusValue = allDone ? 'Pending Approval' : parentProgress > 0 ? 'In Progress' : 'Not Started';
        await updateStatus(parent.id, parentStatus, parentProgress);
      }
    }
  }, [flat, statusMap, updateStatus]);

  const approve = useCallback(async (taskId: number) => {
    await updateStatus(taskId, 'Approved', 100);
  }, [updateStatus]);

  const reject = useCallback(async (taskId: number) => {
    // Only change parent status back, keep children as-is
    const children = flat.filter(t => t.parentId === taskId);
    const doneCount = children.filter(t => t.status === 'Done' || t.status === 'Approved').length;
    const progress = children.length > 0 ? Math.round((doneCount / children.length) * 100) : 0;
    await updateStatus(taskId, 'In Progress', progress);
  }, [flat, updateStatus]);

  // All tasks (unfiltered) for cross-project summary
  const allTree = buildTree(tasks, statusMap);
  const allFlat = flattenTree(allTree);

  return { tree, flat, loading, source, projects, allFlat, toggleDone, approve, reject };
}
