import Domo from 'ryuu.js';
import type { Country, Task, DeploymentPhase, RAGStatus } from './types';

// ===== Dataset: Countries =====

export async function fetchCountries(): Promise<Country[]> {
  const rows = await Domo.get('/data/v1/pmocountries') as Record<string, unknown>[];
  return rows.map(r => ({
    id: String(r.country_id),
    name: String(r.country_name),
    region: String(r.region),
    flag: '',
    phase: r.phase as DeploymentPhase,
    ragStatus: r.rag_status as RAGStatus,
    goLiveDate: String(r.go_live_date).slice(0, 10),
    partner: String(r.partner),
    progress: Number(r.progress),
    milestones: [],
  }));
}

// ===== AppDB: Tasks collection =====

const COLL = '/domo/datastores/v1/collections/tasks/documents';

type AppDBDoc<T> = {
  id: string;
  content: T;
};

export const TasksDB = {
  list: () => Domo.get(`${COLL}/`) as unknown as Promise<AppDBDoc<Task>[]>,
  create: (task: Task) => Domo.post(`${COLL}/`, { content: task }) as unknown as Promise<AppDBDoc<Task>>,
  update: (docId: string, task: Task) =>
    Domo.put(`${COLL}/${docId}`, { content: task }) as unknown as Promise<AppDBDoc<Task>>,
  remove: (docId: string) => Domo.delete(`${COLL}/${docId}`) as unknown as Promise<void>,
  bulkCreate: (tasks: Task[]) =>
    Domo.post(`${COLL}/bulk`, tasks.map(t => ({ content: t }))) as unknown as Promise<AppDBDoc<Task>[]>,
};

// Task shape augmented with AppDB document id for updates/deletes
export type TaskWithDocId = Task & { _docId?: string };

export async function fetchTasks(): Promise<TaskWithDocId[]> {
  const docs = await TasksDB.list();
  return docs.map(d => {
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
}

// ===== Dataset: Project Plan =====

import type { ProjectTask, TaskStatusRecord } from './project-types';

export async function fetchProjectPlan(): Promise<ProjectTask[]> {
  const rows = await Domo.get('/data/v1/projectplan') as Record<string, unknown>[];
  console.log('[ProjectPlan] Column names:', rows.length > 0 ? Object.keys(rows[0]) : 'no rows');
  console.log('[ProjectPlan] First row:', rows[0]);
  return rows.map(r => ({
    id: Number(r.ID),
    wbs: String(r.WBS),
    name: String(r.Name),
    duration: String(r.Duration),
    start: String(r.Start).slice(0, 10),
    finish: String(r.Finish).slice(0, 10),
    pctComplete: Number(r.Pct_Complete),
    predecessors: String(r.Predecessors || ''),
    resourceNames: String(r.Resource_Names || ''),
    outlineLevel: Number(r.Outline_Level),
    summary: String(r.Summary).toUpperCase() === 'Y',
    notes: String(r.Notes || ''),
    baselineStart: String(r.Baseline_Start).slice(0, 10),
    baselineFinish: String(r.Baseline_Finish).slice(0, 10),
    project: String(r.Project || 'Default'),
  }));
}

// ===== AppDB: Task Status collection =====

const STATUS_COLL = '/domo/datastores/v1/collections/taskstatus/documents';

export const TaskStatusDB = {
  list: () => Domo.get(`${STATUS_COLL}/`) as unknown as Promise<AppDBDoc<TaskStatusRecord>[]>,
  create: (rec: TaskStatusRecord) => Domo.post(`${STATUS_COLL}/`, { content: rec }) as unknown as Promise<AppDBDoc<TaskStatusRecord>>,
  update: (docId: string, rec: TaskStatusRecord) =>
    Domo.put(`${STATUS_COLL}/${docId}`, { content: rec }) as unknown as Promise<AppDBDoc<TaskStatusRecord>>,
  bulkCreate: (recs: TaskStatusRecord[]) =>
    Domo.post(`${STATUS_COLL}/bulk`, recs.map(r => ({ content: r }))) as unknown as Promise<unknown>,
};

export type StatusWithDocId = TaskStatusRecord & { _docId?: string };

export async function fetchTaskStatuses(): Promise<StatusWithDocId[]> {
  const docs = await TaskStatusDB.list();
  return docs.map(d => {
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
}

// ===== AppDB: Gate Status collection =====

export interface GateStatusRecord {
  gateItemId: string;
  checked: boolean;
  completionDate?: string;
  evidence?: string;
  gateApproved?: boolean;
  phaseId?: number;
  approverName?: string;
  comment?: string;
  updatedBy: string;
  updatedAt: string;
}

const GATE_COLL = '/domo/datastores/v1/collections/gatestatus/documents';

export const GateStatusDB = {
  list: () => Domo.get(`${GATE_COLL}/`) as unknown as Promise<AppDBDoc<GateStatusRecord>[]>,
  create: (rec: GateStatusRecord) => Domo.post(`${GATE_COLL}/`, { content: rec }) as unknown as Promise<AppDBDoc<GateStatusRecord>>,
  update: (docId: string, rec: GateStatusRecord) =>
    Domo.put(`${GATE_COLL}/${docId}`, { content: rec }) as unknown as Promise<AppDBDoc<GateStatusRecord>>,
};

export type GateStatusWithDocId = GateStatusRecord & { _docId?: string };

// ===== AppDB: Milestone Template =====

export interface MilestoneTemplateRecord {
  phaseId: number;
  milestoneId: string;
  label: string;
}

const TPL_COLL = '/domo/datastores/v1/collections/milestonetemplate/documents';

export const TemplateDB = {
  list: () => Domo.get(`${TPL_COLL}/`) as unknown as Promise<AppDBDoc<MilestoneTemplateRecord>[]>,
  create: (rec: MilestoneTemplateRecord) => Domo.post(`${TPL_COLL}/`, { content: rec }) as unknown as Promise<AppDBDoc<MilestoneTemplateRecord>>,
  remove: (docId: string) => Domo.delete(`${TPL_COLL}/${docId}`) as unknown as Promise<void>,
  bulkCreate: (recs: MilestoneTemplateRecord[]) =>
    Domo.post(`${TPL_COLL}/bulk`, recs.map(r => ({ content: r }))) as unknown as Promise<unknown>,
};

export type TemplateWithDocId = MilestoneTemplateRecord & { _docId?: string };

export async function fetchTemplates(): Promise<TemplateWithDocId[]> {
  const docs = await TemplateDB.list();
  return docs.map(d => {
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
}

// ===== AppDB: Milestone Overrides =====

export interface MilestoneOverrideRecord {
  projectId: string;
  phaseId: number;
  milestoneId: string;
  action: 'remove' | 'add';
  label?: string;
}

const OVR_COLL = '/domo/datastores/v1/collections/milestoneoverrides/documents';

export const OverrideDB = {
  list: () => Domo.get(`${OVR_COLL}/`) as unknown as Promise<AppDBDoc<MilestoneOverrideRecord>[]>,
  create: (rec: MilestoneOverrideRecord) => Domo.post(`${OVR_COLL}/`, { content: rec }) as unknown as Promise<AppDBDoc<MilestoneOverrideRecord>>,
  remove: (docId: string) => Domo.delete(`${OVR_COLL}/${docId}`) as unknown as Promise<void>,
};

export type OverrideWithDocId = MilestoneOverrideRecord & { _docId?: string };

export async function fetchOverrides(): Promise<OverrideWithDocId[]> {
  const docs = await OverrideDB.list();
  return docs.map(d => {
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
}

export async function fetchGateStatuses(): Promise<GateStatusWithDocId[]> {
  const docs = await GateStatusDB.list();
  return docs.map(d => {
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
}
