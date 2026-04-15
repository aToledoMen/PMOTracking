import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, TaskStatus, Priority } from '@/data/types';
import { users } from '@/data/mock-data';
import { useData } from '@/data/data-context';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  task?: Task | null;
}

export function TaskDialog({ open, onClose, onSave, task }: TaskDialogProps) {
  const { countries } = useData();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [country, setCountry] = useState(task?.country || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'Medium');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'Open');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  // Re-sync state whenever a different task is passed in or the dialog opens
  useEffect(() => {
    setTitle(task?.title || '');
    setDescription(task?.description || '');
    setAssignedTo(task?.assignedTo || '');
    setCountry(task?.country || '');
    setPriority(task?.priority || 'Medium');
    setStatus(task?.status || 'Open');
    setDueDate(task?.dueDate || '');
  }, [task, open]);

  const handleSave = () => {
    onSave({
      ...(task || {}),
      title,
      description,
      assignedTo,
      country,
      priority,
      status,
      dueDate,
      id: task?.id || `t${Date.now()}`,
      createdAt: task?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: task?.createdBy || 'u1',
    });
    onClose();
  };

  const labelCls = 'text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1 block';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[14px] font-semibold">{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-3">
          <div>
            <label className={labelCls}>Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title..." className="h-8 text-[12px]" />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description..."
              className="min-h-[96px] text-[12px] resize-y"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Assigned To</label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger className="h-8 text-[12px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={labelCls}>Due Date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-8 text-[12px]" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="h-8 text-[12px] bg-blue-700 hover:bg-blue-800" onClick={handleSave} disabled={!title || !assignedTo || !country}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
