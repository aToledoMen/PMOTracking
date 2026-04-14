import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries, users } from '@/data/mock-data';
import { getCountryCode } from '@/lib/country-code';
import { Priority, Task } from '@/data/types';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const labelCls = 'text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1 block';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[14px] font-semibold">Bulk Task Assignment</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Task Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task template title..." className="h-8 text-[12px]" />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." className="h-8 text-[12px]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Assign To</label>
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
              <label className={labelCls}>Due Date</label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-8 text-[12px]" />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              Select Countries <span className="tabular-nums ml-1 text-slate-400">({selectedCountries.length})</span>
            </label>
            {selectedCountries.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedCountries.map(id => {
                  const c = countries.find(co => co.id === id);
                  return c ? (
                    <span key={id} className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[11px] px-1.5 py-0.5 rounded-sm border border-blue-200">
                      <span className="font-semibold">{getCountryCode(c.id)}</span>
                      <span>{c.name}</span>
                      <button onClick={() => toggleCountry(id)} className="hover:bg-blue-100 rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ) : null;
                })}
              </div>
            )}
            <div className="grid grid-cols-4 gap-1.5 max-h-52 overflow-auto border border-slate-200 rounded-sm p-2">
              {countries.map(c => (
                <button
                  key={c.id}
                  onClick={() => toggleCountry(c.id)}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1.5 rounded-sm text-[11px] transition-colors',
                    selectedCountries.includes(c.id)
                      ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  )}
                >
                  <span className="font-semibold text-[10px] tracking-wider">{getCountryCode(c.id)}</span>
                  <span className="truncate">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" className="h-8 text-[12px]" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="h-8 text-[12px] bg-blue-700 hover:bg-blue-800" onClick={handleAssign} disabled={!title || !assignedTo || selectedCountries.length === 0}>
            Assign to {selectedCountries.length} {selectedCountries.length === 1 ? 'Country' : 'Countries'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
