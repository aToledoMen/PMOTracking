export type TaskStatusValue = 'Not Started' | 'In Progress' | 'Done' | 'Pending Approval' | 'Approved';

export interface ProjectTask {
  id: number;
  wbs: string;
  name: string;
  duration: string;
  start: string;
  finish: string;
  pctComplete: number;
  predecessors: string;
  resourceNames: string;
  outlineLevel: number;
  summary: boolean;
  notes: string;
  baselineStart: string;
  baselineFinish: string;
  project: string;
}

export interface TaskStatusRecord {
  taskId: number;
  status: TaskStatusValue;
  progress: number;
  updatedBy: string;
  updatedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
}

export interface ProjectTaskWithStatus extends ProjectTask {
  status: TaskStatusValue;
  actualProgress: number;
  children: ProjectTaskWithStatus[];
  parentId: number | null;
  approvedBy: string | null;
  approvedAt: string | null;
  _docId?: string;
}
