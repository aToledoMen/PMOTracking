import type { ProjectTask } from './project-types';

const germanyTasks: ProjectTask[] = [
  { id: 1, wbs: '1', name: 'Phase 1: Discovery', duration: '30d', start: '2026-02-15', finish: '2026-03-16', pctComplete: 100, predecessors: '', resourceNames: 'Sarah Chen', outlineLevel: 0, summary: true, notes: 'Discovery phase', baselineStart: '2026-02-15', baselineFinish: '2026-03-10', project: 'Germany' },
  { id: 2, wbs: '1.1', name: 'Requirements Gathering', duration: '15d', start: '2026-02-15', finish: '2026-03-01', pctComplete: 100, predecessors: '', resourceNames: 'Marcus Johnson', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-02-15', baselineFinish: '2026-02-28', project: 'Germany' },
  { id: 3, wbs: '1.1.1', name: 'Stakeholder Interviews', duration: '5d', start: '2026-02-15', finish: '2026-02-19', pctComplete: 100, predecessors: '', resourceNames: 'Aisha Patel', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-02-15', baselineFinish: '2026-02-19', project: 'Germany' },
  { id: 4, wbs: '1.1.2', name: 'Document Requirements', duration: '5d', start: '2026-02-20', finish: '2026-02-26', pctComplete: 100, predecessors: '3', resourceNames: 'Aisha Patel', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-02-20', baselineFinish: '2026-02-24', project: 'Germany' },
  { id: 5, wbs: '1.1.3', name: 'Requirements Sign-off', duration: '5d', start: '2026-02-27', finish: '2026-03-01', pctComplete: 100, predecessors: '4', resourceNames: 'Marcus Johnson', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-02-25', baselineFinish: '2026-02-28', project: 'Germany' },
  { id: 6, wbs: '1.2', name: 'Stakeholder Analysis', duration: '15d', start: '2026-03-02', finish: '2026-03-16', pctComplete: 100, predecessors: '5', resourceNames: 'Elena Rodriguez', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-03-01', baselineFinish: '2026-03-10', project: 'Germany' },
  { id: 7, wbs: '1.2.1', name: 'Impact Assessment', duration: '7d', start: '2026-03-02', finish: '2026-03-08', pctComplete: 100, predecessors: '', resourceNames: 'Elena Rodriguez', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-03-01', baselineFinish: '2026-03-05', project: 'Germany' },
  { id: 8, wbs: '1.2.2', name: 'Communication Plan', duration: '8d', start: '2026-03-09', finish: '2026-03-16', pctComplete: 100, predecessors: '7', resourceNames: 'Elena Rodriguez', outlineLevel: 2, summary: false, notes: 'Slipped 6 days', baselineStart: '2026-03-06', baselineFinish: '2026-03-10', project: 'Germany' },
  { id: 9, wbs: '2', name: 'Phase 2: Planning', duration: '35d', start: '2026-03-17', finish: '2026-04-30', pctComplete: 65, predecessors: '1', resourceNames: 'Sarah Chen', outlineLevel: 0, summary: true, notes: '', baselineStart: '2026-03-11', baselineFinish: '2026-04-14', project: 'Germany' },
  { id: 10, wbs: '2.1', name: 'Resource Allocation', duration: '20d', start: '2026-03-17', finish: '2026-04-05', pctComplete: 100, predecessors: '', resourceNames: 'James Park', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-03-11', baselineFinish: '2026-03-28', project: 'Germany' },
  { id: 11, wbs: '2.1.1', name: 'Team Assignment', duration: '7d', start: '2026-03-17', finish: '2026-03-23', pctComplete: 100, predecessors: '', resourceNames: 'James Park', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-03-11', baselineFinish: '2026-03-17', project: 'Germany' },
  { id: 12, wbs: '2.1.2', name: 'Budget Approval', duration: '8d', start: '2026-03-24', finish: '2026-03-31', pctComplete: 100, predecessors: '11', resourceNames: 'James Park', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-03-18', baselineFinish: '2026-03-25', project: 'Germany' },
  { id: 13, wbs: '2.1.3', name: 'Vendor Contracts', duration: '5d', start: '2026-04-01', finish: '2026-04-05', pctComplete: 100, predecessors: '12', resourceNames: 'Tom Wilson', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-03-26', baselineFinish: '2026-03-28', project: 'Germany' },
  { id: 14, wbs: '2.2', name: 'Risk Assessment', duration: '15d', start: '2026-04-06', finish: '2026-04-30', pctComplete: 40, predecessors: '10', resourceNames: 'Aisha Patel', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-03-29', baselineFinish: '2026-04-14', project: 'Germany' },
  { id: 15, wbs: '2.2.1', name: 'Risk Identification', duration: '7d', start: '2026-04-06', finish: '2026-04-12', pctComplete: 100, predecessors: '', resourceNames: 'Aisha Patel', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-03-29', baselineFinish: '2026-04-04', project: 'Germany' },
  { id: 16, wbs: '2.2.2', name: 'Mitigation Planning', duration: '8d', start: '2026-04-13', finish: '2026-04-30', pctComplete: 30, predecessors: '15', resourceNames: 'Aisha Patel', outlineLevel: 2, summary: false, notes: 'In progress', baselineStart: '2026-04-05', baselineFinish: '2026-04-14', project: 'Germany' },
  { id: 17, wbs: '3', name: 'Phase 3: Build', duration: '45d', start: '2026-05-01', finish: '2026-06-14', pctComplete: 10, predecessors: '9', resourceNames: 'Sarah Chen', outlineLevel: 0, summary: true, notes: '', baselineStart: '2026-04-15', baselineFinish: '2026-05-29', project: 'Germany' },
  { id: 18, wbs: '3.1', name: 'Core Development', duration: '25d', start: '2026-05-01', finish: '2026-05-25', pctComplete: 15, predecessors: '', resourceNames: 'Lisa Chang', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-04-15', baselineFinish: '2026-05-09', project: 'Germany' },
  { id: 19, wbs: '3.1.1', name: 'Backend API Development', duration: '10d', start: '2026-05-01', finish: '2026-05-10', pctComplete: 30, predecessors: '', resourceNames: 'David Kim', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-04-15', baselineFinish: '2026-04-24', project: 'Germany' },
  { id: 20, wbs: '3.1.2', name: 'Frontend Development', duration: '10d', start: '2026-05-11', finish: '2026-05-20', pctComplete: 0, predecessors: '19', resourceNames: 'Lisa Chang', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-04-25', baselineFinish: '2026-05-04', project: 'Germany' },
  { id: 21, wbs: '3.1.3', name: 'Database Setup', duration: '5d', start: '2026-05-21', finish: '2026-05-25', pctComplete: 0, predecessors: '19', resourceNames: 'David Kim', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-05-05', baselineFinish: '2026-05-09', project: 'Germany' },
  { id: 22, wbs: '3.2', name: 'Integration Setup', duration: '20d', start: '2026-05-26', finish: '2026-06-14', pctComplete: 0, predecessors: '18', resourceNames: 'Tom Wilson', outlineLevel: 1, summary: true, notes: '', baselineStart: '2026-05-10', baselineFinish: '2026-05-29', project: 'Germany' },
  { id: 23, wbs: '3.2.1', name: 'SSO Configuration', duration: '7d', start: '2026-05-26', finish: '2026-06-01', pctComplete: 0, predecessors: '', resourceNames: 'Tom Wilson', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-05-10', baselineFinish: '2026-05-16', project: 'Germany' },
  { id: 24, wbs: '3.2.2', name: 'Data Pipeline Setup', duration: '7d', start: '2026-06-02', finish: '2026-06-08', pctComplete: 0, predecessors: '23', resourceNames: 'Alex Turner', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-05-17', baselineFinish: '2026-05-23', project: 'Germany' },
  { id: 25, wbs: '3.2.3', name: 'SharePoint Integration', duration: '6d', start: '2026-06-09', finish: '2026-06-14', pctComplete: 0, predecessors: '24', resourceNames: 'Alex Turner', outlineLevel: 2, summary: false, notes: '', baselineStart: '2026-05-24', baselineFinish: '2026-05-29', project: 'Germany' },
];

// Generate Brazil (IDs 101-141) and USA (IDs 201-241) from Germany template with different dates
function shiftDates(tasks: ProjectTask[], idOffset: number, dayOffset: number, project: string, pctMultiplier: number): ProjectTask[] {
  return tasks.map(t => {
    const shift = (d: string) => {
      const date = new Date(d);
      date.setDate(date.getDate() + dayOffset);
      return date.toISOString().slice(0, 10);
    };
    return {
      ...t,
      id: t.id + idOffset,
      predecessors: t.predecessors ? t.predecessors.split(',').map(p => String(Number(p.trim()) + idOffset)).join(',') : '',
      start: shift(t.start),
      finish: shift(t.finish),
      baselineStart: shift(t.baselineStart),
      baselineFinish: shift(t.baselineFinish),
      pctComplete: Math.min(100, Math.round(t.pctComplete * pctMultiplier)),
      project,
    };
  });
}

const brazilTasks = shiftDates(germanyTasks, 100, 14, 'Brazil', 0.7);
const usaTasks = shiftDates(germanyTasks, 200, 45, 'United States', 0.3);

export const mockProjectPlan: ProjectTask[] = [...germanyTasks, ...brazilTasks, ...usaTasks];
