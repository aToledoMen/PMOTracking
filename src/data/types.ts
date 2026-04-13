export type DeploymentPhase = 'Discovery' | 'Planning' | 'Build' | 'UAT' | 'Go-Live' | 'Hypercare';
export type RAGStatus = 'Green' | 'Amber' | 'Red';
export type TaskStatus = 'Open' | 'In Progress' | 'Blocked' | 'Completed' | 'Overdue';
export type Priority = 'High' | 'Medium' | 'Low';
export type UserRole = 'PMO Director' | 'Deployment Manager' | 'Project Manager' | 'Partner Lead';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
}

export interface Country {
  id: string;
  name: string;
  region: string;
  flag: string;
  phase: DeploymentPhase;
  ragStatus: RAGStatus;
  goLiveDate: string;
  partner: string;
  progress: number;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  completedDate?: string;
  status: 'Completed' | 'On Track' | 'At Risk' | 'Overdue';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'overdue' | 'escalation' | 'status_change' | 'assignment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
  countryId?: string;
}

export interface KPIData {
  week: string;
  avgDaysPerPhase: number;
  onTimeRate: number;
  countriesInPhase: number;
  reopenedGates: number;
  partnerScore: number;
}

export interface WeeklyReportData {
  countriesByRAG: { green: number; amber: number; red: number };
  milestonesCompleted: number;
  milestonesOverdue: number;
  tasksEscalated: number;
  upcomingGoLives: Country[];
  phaseProgress: { phase: DeploymentPhase; count: number }[];
}
