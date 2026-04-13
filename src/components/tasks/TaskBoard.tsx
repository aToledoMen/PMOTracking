import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { BulkAssign } from './BulkAssign';
import { Task, TaskStatus } from '@/data/types';
import { countries } from '@/data/mock-data';
import { Plus, Users, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

const columns: { status: TaskStatus; label: string; color: string; bgColor: string }[] = [
  { status: 'Open', label: 'Open', color: 'bg-blue-500', bgColor: 'bg-blue-50' },
  { status: 'In Progress', label: 'In Progress', color: 'bg-amber-500', bgColor: 'bg-amber-50' },
  { status: 'Blocked', label: 'Blocked', color: 'bg-red-500', bgColor: 'bg-red-50' },
  { status: 'Completed', label: 'Completed', color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
];

interface TaskBoardProps {
  allTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

export function TaskBoard({ allTasks, onTasksChange }: TaskBoardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = allTasks.filter(t => {
    if (filterCountry !== 'all' && t.country !== filterCountry) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Merge overdue into Open column for display
  const getColumnTasks = (status: TaskStatus) => {
    if (status === 'Open') {
      return filteredTasks.filter(t => t.status === 'Open' || t.status === 'Overdue');
    }
    return filteredTasks.filter(t => t.status === status);
  };

  const handleSave = (taskData: Partial<Task>) => {
    const existing = allTasks.find(t => t.id === taskData.id);
    if (existing) {
      onTasksChange(allTasks.map(t => t.id === taskData.id ? { ...t, ...taskData } as Task : t));
    } else {
      onTasksChange([...allTasks, taskData as Task]);
    }
  };

  const handleBulkAssign = (newTasks: Partial<Task>[]) => {
    onTasksChange([...allTasks, ...(newTasks as Task[])]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 h-9"
            />
          </div>
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-44 h-9">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.flag} {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-36 h-9"><SelectValue placeholder="All Priorities" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">🔴 High</SelectItem>
              <SelectItem value="Medium">🟡 Medium</SelectItem>
              <SelectItem value="Low">🔵 Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowBulk(true)}>
            <Users className="w-4 h-4 mr-2" />
            Bulk Assign
          </Button>
          <Button size="sm" onClick={() => { setEditingTask(null); setShowDialog(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(col => {
          const colTasks = getColumnTasks(col.status);
          return (
            <div key={col.status} className={cn('rounded-xl p-4 min-h-[400px]', col.bgColor)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2.5 h-2.5 rounded-full', col.color)} />
                  <h3 className="text-sm font-semibold text-slate-700">{col.label}</h3>
                </div>
                <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
              </div>
              <div className="space-y-3">
                {colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={(t) => { setEditingTask(t); setShowDialog(true); }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskDialog
        open={showDialog}
        onClose={() => { setShowDialog(false); setEditingTask(null); }}
        onSave={handleSave}
        task={editingTask}
      />

      <BulkAssign
        open={showBulk}
        onClose={() => setShowBulk(false)}
        onAssign={handleBulkAssign}
      />
    </div>
  );
}
