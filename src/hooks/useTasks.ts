import { useCallback, useEffect, useState } from 'react';
import { tasks as initialTasks } from '@/data/mock-data';
import { fetchTasks, TasksDB, TaskWithDocId } from '@/data/domo-api';
import type { Task } from '@/data/types';

// Expose a cleanup utility on window for one-time use from devtools console:
//   await window.__cleanupTaskDuplicates()
// Keeps the FIRST occurrence of each task.id and deletes the rest.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__cleanupTaskDuplicates = async () => {
    const all = await fetchTasks();
    console.log('[Cleanup] Total docs:', all.length);
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const t of all) {
      if (seen.has(t.id)) {
        if (t._docId) dupes.push(t._docId);
      } else {
        seen.add(t.id);
      }
    }
    console.log('[Cleanup] Unique tasks:', seen.size, '· Duplicates to delete:', dupes.length);
    let done = 0;
    for (const docId of dupes) {
      try {
        await TasksDB.remove(docId);
        done++;
        if (done % 50 === 0) console.log('[Cleanup] Deleted', done, '/', dupes.length);
      } catch (e) {
        console.error('[Cleanup] Failed to delete', docId, e);
      }
    }
    console.log('[Cleanup] Done. Reload the page.');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__resetTaskCollection = async () => {
    const all = await fetchTasks();
    console.log('[Reset] Deleting', all.length, 'docs...');
    for (const t of all) {
      if (t._docId) await TasksDB.remove(t._docId);
    }
    console.log('[Reset] Done. Reload the page to re-seed.');
  };
}

export type DataSource = 'mock' | 'appdb';

export function useTasks() {
  const [tasks, setTasks] = useState<TaskWithDocId[]>(initialTasks);
  const [source, setSource] = useState<DataSource>('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Only seed when GET succeeds AND returns 0 docs.
        // If GET throws (transient/auth/missing collection) we DO NOT seed,
        // to avoid creating duplicate batches of tasks on each load.
        const list = await fetchTasks();

        if (list.length === 0) {
          console.log('[AppDB] Empty collection - seeding once with', initialTasks.length, 'documents');
          await TasksDB.bulkCreate(initialTasks);
          const seeded = await fetchTasks();
          if (!cancelled) {
            setTasks(seeded);
            setSource('appdb');
          }
        } else {
          if (!cancelled) {
            setTasks(list);
            setSource('appdb');
            console.log('[AppDB] Loaded', list.length, 'tasks from collection');
          }
        }
      } catch (e) {
        console.warn('[AppDB] Unavailable, keeping mock tasks', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const create = useCallback(async (task: Task) => {
    // Optimistic
    setTasks(prev => [...prev, task]);
    if (source === 'appdb') {
      try {
        const doc = await TasksDB.create(task);
        setTasks(prev => prev.map(t => t.id === task.id ? { ...task, _docId: doc.id } : t));
      } catch (e) {
        console.error('AppDB create failed', e);
      }
    }
  }, [source]);

  const update = useCallback(async (task: TaskWithDocId) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    if (source === 'appdb' && task._docId) {
      try {
        await TasksDB.update(task._docId, task);
      } catch (e) {
        console.error('AppDB update failed', e);
      }
    }
  }, [source]);

  const bulkAdd = useCallback(async (newTasks: Task[]) => {
    // Optimistic
    setTasks(prev => [...prev, ...newTasks]);
    if (source === 'appdb') {
      try {
        await TasksDB.bulkCreate(newTasks);
        // Refetch to get the canonical shape with _docId for each
        const fresh = await fetchTasks();
        setTasks(fresh);
      } catch (e) {
        console.error('AppDB bulk create failed', e);
      }
    }
  }, [source]);

  // Bulk replace (used when a child currently calls onTasksChange with the full array)
  const replaceAll = useCallback((next: TaskWithDocId[]) => {
    setTasks(next);
  }, []);

  return { tasks, source, loading, create, update, bulkAdd, replaceAll };
}
