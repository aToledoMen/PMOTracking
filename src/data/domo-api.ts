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
  console.log('[AppDB] Raw docs sample:', docs[0]);
  const mapped = docs.map(d => {
    // content may be serialized as a JSON string by AppDB in some envs
    const content = typeof d.content === 'string' ? JSON.parse(d.content) : d.content;
    return { ...content, _docId: d.id };
  });
  console.log('[AppDB] Mapped task sample:', mapped[0]);
  return mapped;
}
