import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';
import { BulkAssign } from './BulkAssign';
import { Task, TaskStatus } from '@/data/types';
import { countries } from '@/data/mock-data';
import { Plus, Users, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const columns: { status: TaskStatus; label: string; topBorder: string; dot: string }[] = [
  { status: 'Open', label: 'Open', topBorder: 'border-t-blue-600', dot: 'bg-blue-600' },
  { status: 'In Progress', label: 'In Progress', topBorder: 'border-t-amber-600', dot: 'bg-amber-600' },
  { status: 'Blocked', label: 'Blocked', topBorder: 'border-t-red-700', dot: 'bg-red-700' },
  { status: 'Completed', label: 'Completed', topBorder: 'border-t-emerald-700', dot: 'bg-emerald-700' },
];

interface TaskBoardProps {
  allTasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

function DroppableColumn({
  status,
  label,
  topBorder,
  dot,
  tasks,
  onEdit,
}: {
  status: TaskStatus;
  label: string;
  topBorder: string;
  dot: string;
  tasks: Task[];
  onEdit: (t: Task) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'bg-white border border-slate-200 border-t-2 rounded-sm min-h-[400px] transition-colors',
        topBorder,
        isOver && 'bg-blue-50/40 ring-1 ring-blue-400'
      )}
    >
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className={cn('w-1.5 h-1.5 rounded-full', dot)} />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">{label}</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{tasks.length}</span>
      </div>
      <div className="p-2 space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
}

export function TaskBoard({ allTasks, onTasksChange }: TaskBoardProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterCountry, setFilterCountry] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredTasks = allTasks.filter(t => {
    if (filterCountry !== 'all' && t.country !== filterCountry) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

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

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = allTasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    onTasksChange(
      allTasks.map(t =>
        t.id === taskId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
          : t
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" strokeWidth={2} />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-56 h-8 text-[12px] border-slate-200"
            />
          </div>
          <Select value={filterCountry} onValueChange={setFilterCountry}>
            <SelectTrigger className="w-40 h-8 text-[12px] border-slate-200">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32 h-8 text-[12px] border-slate-200"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={() => setShowBulk(true)}>
            <Users className="w-3.5 h-3.5 mr-1.5" strokeWidth={1.75} />
            Bulk Assign
          </Button>
          <Button size="sm" className="h-8 text-[12px] bg-blue-700 hover:bg-blue-800" onClick={() => { setEditingTask(null); setShowDialog(true); }}>
            <Plus className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
            New Task
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {columns.map(col => (
            <DroppableColumn
              key={col.status}
              status={col.status}
              label={col.label}
              topBorder={col.topBorder}
              dot={col.dot}
              tasks={getColumnTasks(col.status)}
              onEdit={(t) => { setEditingTask(t); setShowDialog(true); }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-2">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

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
