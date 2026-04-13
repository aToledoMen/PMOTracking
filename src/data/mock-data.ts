import { User, Country, Task, Notification, KPIData, DeploymentPhase, TaskStatus, Priority } from './types';

export const users: User[] = [
  { id: 'u1', name: 'Sarah Chen', role: 'PMO Director', avatar: 'SC', email: 'sarah.chen@company.com' },
  { id: 'u2', name: 'Marcus Johnson', role: 'Deployment Manager', avatar: 'MJ', email: 'marcus.j@company.com' },
  { id: 'u3', name: 'Elena Rodriguez', role: 'Deployment Manager', avatar: 'ER', email: 'elena.r@company.com' },
  { id: 'u4', name: 'James Park', role: 'Project Manager', avatar: 'JP', email: 'james.p@company.com' },
  { id: 'u5', name: 'Aisha Patel', role: 'Project Manager', avatar: 'AP', email: 'aisha.p@company.com' },
  { id: 'u6', name: 'Tom Wilson', role: 'Deployment Manager', avatar: 'TW', email: 'tom.w@company.com' },
  { id: 'u7', name: 'Lisa Chang', role: 'Project Manager', avatar: 'LC', email: 'lisa.c@company.com' },
  { id: 'u8', name: 'David Kim', role: 'Partner Lead', avatar: 'DK', email: 'david.k@company.com' },
  { id: 'u9', name: 'Maria Santos', role: 'Project Manager', avatar: 'MS', email: 'maria.s@company.com' },
  { id: 'u10', name: 'Alex Turner', role: 'Partner Lead', avatar: 'AT', email: 'alex.t@company.com' },
];

export const currentUser = users[0]; // Sarah Chen - PMO Director

const phases: DeploymentPhase[] = ['Discovery', 'Planning', 'Build', 'UAT', 'Go-Live', 'Hypercare'];

function makeMilestones(phaseStr: string, goLive: string) {
  const phase = phaseStr as DeploymentPhase;
  const base = new Date(goLive);
  const ms = [
    { name: 'Kickoff Complete', offset: -180 },
    { name: 'Requirements Signed Off', offset: -150 },
    { name: 'Design Approved', offset: -120 },
    { name: 'Build Complete', offset: -75 },
    { name: 'UAT Sign-off', offset: -30 },
    { name: 'Go-Live', offset: 0 },
  ];
  const phaseIdx = phases.indexOf(phase);
  return ms.map((m, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + m.offset);
    const completed = i < phaseIdx;
    const isCurrentOrPast = i <= phaseIdx;
    const dStr = d.toISOString().split('T')[0];
    const overdue = !completed && new Date(dStr) < new Date() && isCurrentOrPast;
    return {
      id: `ms-${Math.random().toString(36).slice(2, 8)}`,
      name: m.name,
      dueDate: dStr,
      completedDate: completed ? dStr : undefined,
      status: completed ? 'Completed' as const : overdue ? 'Overdue' as const : i === phaseIdx ? 'At Risk' as const : 'On Track' as const,
    };
  });
}

export const countries: Country[] = [
  { id: 'c1', name: 'United States', region: 'North America', flag: '🇺🇸', phase: 'Hypercare', ragStatus: 'Green', goLiveDate: '2026-02-15', partner: 'Accenture', progress: 95 },
  { id: 'c2', name: 'United Kingdom', region: 'Europe', flag: '🇬🇧', phase: 'Go-Live', ragStatus: 'Green', goLiveDate: '2026-04-01', partner: 'Deloitte', progress: 88 },
  { id: 'c3', name: 'Germany', region: 'Europe', flag: '🇩🇪', phase: 'UAT', ragStatus: 'Amber', goLiveDate: '2026-05-10', partner: 'Deloitte', progress: 72 },
  { id: 'c4', name: 'France', region: 'Europe', flag: '🇫🇷', phase: 'UAT', ragStatus: 'Green', goLiveDate: '2026-05-20', partner: 'Capgemini', progress: 70 },
  { id: 'c5', name: 'Japan', region: 'Asia Pacific', flag: '🇯🇵', phase: 'Build', ragStatus: 'Amber', goLiveDate: '2026-07-01', partner: 'Fujitsu', progress: 48 },
  { id: 'c6', name: 'Brazil', region: 'Latin America', flag: '🇧🇷', phase: 'Build', ragStatus: 'Red', goLiveDate: '2026-06-15', partner: 'KPMG', progress: 40 },
  { id: 'c7', name: 'Australia', region: 'Asia Pacific', flag: '🇦🇺', phase: 'Go-Live', ragStatus: 'Green', goLiveDate: '2026-04-10', partner: 'PwC', progress: 85 },
  { id: 'c8', name: 'Canada', region: 'North America', flag: '🇨🇦', phase: 'Hypercare', ragStatus: 'Green', goLiveDate: '2026-03-01', partner: 'Accenture', progress: 92 },
  { id: 'c9', name: 'Mexico', region: 'Latin America', flag: '🇲🇽', phase: 'Planning', ragStatus: 'Amber', goLiveDate: '2026-09-01', partner: 'KPMG', progress: 22 },
  { id: 'c10', name: 'India', region: 'Asia Pacific', flag: '🇮🇳', phase: 'Build', ragStatus: 'Green', goLiveDate: '2026-07-15', partner: 'Infosys', progress: 45 },
  { id: 'c11', name: 'Spain', region: 'Europe', flag: '🇪🇸', phase: 'Planning', ragStatus: 'Green', goLiveDate: '2026-08-20', partner: 'Capgemini', progress: 25 },
  { id: 'c12', name: 'Italy', region: 'Europe', flag: '🇮🇹', phase: 'Discovery', ragStatus: 'Amber', goLiveDate: '2026-10-01', partner: 'Deloitte', progress: 10 },
  { id: 'c13', name: 'South Korea', region: 'Asia Pacific', flag: '🇰🇷', phase: 'UAT', ragStatus: 'Green', goLiveDate: '2026-05-30', partner: 'Samsung SDS', progress: 68 },
  { id: 'c14', name: 'Netherlands', region: 'Europe', flag: '🇳🇱', phase: 'Build', ragStatus: 'Green', goLiveDate: '2026-06-20', partner: 'Deloitte', progress: 50 },
  { id: 'c15', name: 'Singapore', region: 'Asia Pacific', flag: '🇸🇬', phase: 'Go-Live', ragStatus: 'Amber', goLiveDate: '2026-04-15', partner: 'PwC', progress: 82 },
  { id: 'c16', name: 'Argentina', region: 'Latin America', flag: '🇦🇷', phase: 'Discovery', ragStatus: 'Green', goLiveDate: '2026-11-01', partner: 'KPMG', progress: 8 },
  { id: 'c17', name: 'Chile', region: 'Latin America', flag: '🇨🇱', phase: 'Planning', ragStatus: 'Green', goLiveDate: '2026-09-15', partner: 'KPMG', progress: 20 },
  { id: 'c18', name: 'Sweden', region: 'Europe', flag: '🇸🇪', phase: 'Build', ragStatus: 'Red', goLiveDate: '2026-06-01', partner: 'Capgemini', progress: 35 },
  { id: 'c19', name: 'Poland', region: 'Europe', flag: '🇵🇱', phase: 'Discovery', ragStatus: 'Green', goLiveDate: '2026-10-15', partner: 'Deloitte', progress: 12 },
  { id: 'c20', name: 'Thailand', region: 'Asia Pacific', flag: '🇹🇭', phase: 'Planning', ragStatus: 'Amber', goLiveDate: '2026-08-01', partner: 'Fujitsu', progress: 18 },
  { id: 'c21', name: 'South Africa', region: 'Africa', flag: '🇿🇦', phase: 'Discovery', ragStatus: 'Green', goLiveDate: '2026-11-15', partner: 'PwC', progress: 5 },
  { id: 'c22', name: 'UAE', region: 'Middle East', flag: '🇦🇪', phase: 'Planning', ragStatus: 'Green', goLiveDate: '2026-08-15', partner: 'Deloitte', progress: 20 },
  { id: 'c23', name: 'Colombia', region: 'Latin America', flag: '🇨🇴', phase: 'Discovery', ragStatus: 'Amber', goLiveDate: '2026-10-20', partner: 'KPMG', progress: 7 },
  { id: 'c24', name: 'New Zealand', region: 'Asia Pacific', flag: '🇳🇿', phase: 'UAT', ragStatus: 'Green', goLiveDate: '2026-05-15', partner: 'PwC', progress: 65 },
  { id: 'c25', name: 'Portugal', region: 'Europe', flag: '🇵🇹', phase: 'Build', ragStatus: 'Green', goLiveDate: '2026-07-10', partner: 'Capgemini', progress: 42 },
].map(c => ({ ...c, milestones: makeMilestones(c.phase, c.goLiveDate) })) as Country[];

const taskTitles = [
  'Complete data migration validation', 'Review integration test results', 'Finalize user training materials',
  'Configure SSO authentication', 'Validate API endpoints', 'Approve go-live checklist',
  'Setup monitoring dashboards', 'Complete security audit', 'Review partner deliverables',
  'Update deployment runbook', 'Finalize rollback procedures', 'Test disaster recovery plan',
  'Approve UAT sign-off document', 'Configure alerting thresholds', 'Review change management plan',
  'Complete performance testing', 'Validate data accuracy reports', 'Setup production environment',
  'Complete regulatory compliance check', 'Review SLA agreements',
];

function randomDate(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return new Date(s + Math.random() * (e - s)).toISOString().split('T')[0];
}

function generateTasks(): Task[] {
  const statuses: TaskStatus[] = ['Open', 'In Progress', 'Blocked', 'Completed', 'Overdue'];
  const priorities: Priority[] = ['High', 'Medium', 'Low'];
  const tasks: Task[] = [];

  for (let i = 0; i < 80; i++) {
    const country = countries[i % countries.length];
    const assignee = users[Math.floor(Math.random() * users.length)];
    const creator = users[Math.floor(Math.random() * users.length)];
    const dueDate = randomDate('2026-03-01', '2026-06-30');
    const isOverdue = new Date(dueDate) < new Date() && Math.random() > 0.3;
    const status = isOverdue ? 'Overdue' : statuses[Math.floor(Math.random() * 4)]; // exclude Overdue from random

    tasks.push({
      id: `t${i + 1}`,
      title: taskTitles[i % taskTitles.length],
      description: `Task for ${country.name} deployment - ${taskTitles[i % taskTitles.length].toLowerCase()}. This requires coordination with the ${assignee.role} team.`,
      assignedTo: assignee.id,
      createdBy: creator.id,
      dueDate,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status,
      country: country.id,
      createdAt: randomDate('2026-01-01', '2026-03-15'),
      updatedAt: randomDate('2026-03-15', '2026-04-13'),
    });
  }
  return tasks;
}

export const tasks: Task[] = generateTasks();

export const notifications: Notification[] = [
  { id: 'n1', type: 'overdue', title: 'Task Overdue', message: 'Complete data migration validation for Brazil is 3 days overdue', timestamp: '2026-04-13T09:00:00', read: false, taskId: 't6' },
  { id: 'n2', type: 'escalation', title: 'Escalation Alert', message: 'Sweden deployment blocked - partner deliverables delayed by 2 weeks', timestamp: '2026-04-13T08:30:00', read: false, countryId: 'c18' },
  { id: 'n3', type: 'status_change', title: 'Status Update', message: 'Australia moved to Go-Live phase successfully', timestamp: '2026-04-12T16:00:00', read: false, countryId: 'c7' },
  { id: 'n4', type: 'overdue', title: 'Task Overdue', message: 'Review integration test results for Germany is 5 days overdue', timestamp: '2026-04-12T10:00:00', read: true, taskId: 't3' },
  { id: 'n5', type: 'assignment', title: 'New Assignment', message: 'You have been assigned: Setup monitoring dashboards for Singapore', timestamp: '2026-04-12T09:00:00', read: true, taskId: 't15' },
  { id: 'n6', type: 'escalation', title: 'Escalation Alert', message: 'Brazil RAG status changed to Red - immediate attention required', timestamp: '2026-04-11T14:00:00', read: true, countryId: 'c6' },
  { id: 'n7', type: 'status_change', title: 'Phase Complete', message: 'United Kingdom completed UAT phase', timestamp: '2026-04-11T11:00:00', read: true, countryId: 'c2' },
  { id: 'n8', type: 'overdue', title: 'Task Overdue (48h+)', message: 'Complete security audit for Sweden escalated to PMO Director', timestamp: '2026-04-10T08:00:00', read: true, taskId: 't18' },
];

export const kpiHistory: KPIData[] = Array.from({ length: 12 }, (_, i) => {
  const week = new Date('2026-01-26');
  week.setDate(week.getDate() + i * 7);
  return {
    week: `W${i + 1}`,
    avgDaysPerPhase: 28 + Math.round(Math.random() * 10 - 5),
    onTimeRate: 72 + Math.round(Math.random() * 16),
    countriesInPhase: 20 + Math.round(Math.random() * 5),
    reopenedGates: Math.round(Math.random() * 4),
    partnerScore: 3.2 + Math.round(Math.random() * 15) / 10,
  };
});

export function getTasksByStatus(status: TaskStatus) {
  return tasks.filter(t => t.status === status);
}

export function getTasksByUser(userId: string) {
  return tasks.filter(t => t.assignedTo === userId).sort((a, b) => {
    if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
    if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
}

export function getCountriesByPhase() {
  const result: Record<string, number> = { Discovery: 0, Planning: 0, Build: 0, UAT: 0, 'Go-Live': 0, Hypercare: 0 };
  countries.forEach(c => result[c.phase]++);
  return Object.entries(result).map(([phase, count]) => ({ phase: phase as DeploymentPhase, count }));
}

export function getRAGSummary() {
  const result = { Green: 0, Amber: 0, Red: 0 };
  countries.forEach(c => result[c.ragStatus]++);
  return result;
}

export function getUpcomingGoLives(days: number = 30) {
  const now = new Date();
  const limit = new Date();
  limit.setDate(limit.getDate() + days);
  return countries.filter(c => {
    const d = new Date(c.goLiveDate);
    return d >= now && d <= limit;
  }).sort((a, b) => new Date(a.goLiveDate).getTime() - new Date(b.goLiveDate).getTime());
}
