import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { countries, users } from '@/data/mock-data';
import { Priority, Task } from '@/data/types';
import { X } from 'lucide-react';

interface BulkAssignProps {
  open: boolean;
  onClose: () => void;
  onAssign: (tasks: Partial<Task>[]) => void;
}

export function BulkAssign({ open, onClose, onAssign }: BulkAssignProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const toggleCountry = (id: string) => {
    setSelectedCountries(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    const newTasks = selectedCountries.map(countryId => ({
      id: `t${Date.now()}-${countryId}`,
      title,
      description,
      assignedTo,
      country: countryId,
      priority,
      status: 'Open' as const,
      dueDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'u1',
    }));
    onAssign(newTasks);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Task Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Task Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task template title..." />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Assign To</label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                <SelectContent>
                  {users.map(u => (
                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">🔴 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🔵 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Due Date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Select Countries ({selectedCountries.length} selected)
            </label>
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedCountries.map(id => {
                  const c = countries.find(co => co.id === id);
                  return c ? (
                    <Badge key={id} variant="secondary" className="gap-1 pr-1">
                      {c.flag} {c.name}
                      <button onClick={() => toggleCountry(id)} className="ml-1 hover:bg-slate-300 rounded-full p-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto p-1">
              {countries.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCountry(c.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
                    selectedCountries.includes(c.id)
                      ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAssign} disabled={!title || !assignedTo || selectedCountries.length === 0}>
            Assign to {selectedCountries.length} Countries
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
