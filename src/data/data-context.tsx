import { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useCountries } from '@/hooks/useCountries';
import type { Country, Task } from './types';
import type { TaskWithDocId } from './domo-api';

type DataContextValue = {
  countries: Country[];
  countriesSource: 'mock' | 'dataset';
  countriesLoading: boolean;

  tasks: TaskWithDocId[];
  tasksSource: 'mock' | 'appdb';
  tasksLoading: boolean;

  createTask: (t: Task) => Promise<void>;
  updateTask: (t: TaskWithDocId) => Promise<void>;
  bulkAddTasks: (tasks: Task[]) => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { countries, source: countriesSource, loading: countriesLoading } = useCountries();
  const { tasks, source: tasksSource, loading: tasksLoading, create, update, bulkAdd } = useTasks();

  return (
    <DataContext.Provider value={{
      countries,
      countriesSource,
      countriesLoading,
      tasks,
      tasksSource,
      tasksLoading,
      createTask: create,
      updateTask: update,
      bulkAddTasks: bulkAdd,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
