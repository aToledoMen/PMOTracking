export interface GateMilestone {
  id: string;
  label: string;
  owner: string;
  dueDate: string;
  evidenceExample: string;
}

export interface StageGateTemplate {
  phaseIndex: number;
  phaseName: string;
  nextPhaseName: string;
  milestones: GateMilestone[];
}

export interface StageGate extends StageGateTemplate {
  phaseId: number;
}

export const stageGateTemplates: StageGateTemplate[] = [
  {
    phaseIndex: 0,
    phaseName: 'Discovery',
    nextPhaseName: 'Planning',
    milestones: [
      { id: 'g1-1', label: 'Partner contract signed', owner: 'Marcus Johnson', dueDate: '', evidenceExample: 'Partner-Contract-v2.pdf' },
      { id: 'g1-2', label: 'IT security certification received', owner: 'Tom Wilson', dueDate: '', evidenceExample: 'Security-Cert-2026.pdf' },
      { id: 'g1-3', label: 'Site approved by local authority', owner: 'Sarah Chen', dueDate: '', evidenceExample: 'Site-Approval-Letter.docx' },
    ],
  },
  {
    phaseIndex: 1,
    phaseName: 'Planning',
    nextPhaseName: 'Build',
    milestones: [
      { id: 'g2-1', label: 'Project plan approved by sponsor', owner: 'Sarah Chen', dueDate: '', evidenceExample: 'Project-Plan-Signed.pdf' },
      { id: 'g2-2', label: 'Budget allocated and confirmed', owner: 'James Park', dueDate: '', evidenceExample: 'Budget-Approval-Form.xlsx' },
      { id: 'g2-3', label: 'All vendor contracts executed', owner: 'Tom Wilson', dueDate: '', evidenceExample: 'Vendor-SOW-Bundle.pdf' },
      { id: 'g2-4', label: 'Risk mitigation plan reviewed', owner: 'Aisha Patel', dueDate: '', evidenceExample: 'Risk-Register-v3.xlsx' },
    ],
  },
  {
    phaseIndex: 2,
    phaseName: 'Build',
    nextPhaseName: 'UAT',
    milestones: [
      { id: 'g3-1', label: 'Code review completed for all modules', owner: 'Lisa Chang', dueDate: '', evidenceExample: 'Code-Review-Report.pdf' },
      { id: 'g3-2', label: 'Unit test coverage above 80%', owner: 'David Kim', dueDate: '', evidenceExample: 'Coverage-Report.html' },
      { id: 'g3-3', label: 'Integration tests passing', owner: 'David Kim', dueDate: '', evidenceExample: 'Integration-Test-Results.pdf' },
      { id: 'g3-4', label: 'Security scan — no critical issues', owner: 'Tom Wilson', dueDate: '', evidenceExample: 'SAST-Scan-Report.pdf' },
    ],
  },
  {
    phaseIndex: 3,
    phaseName: 'UAT',
    nextPhaseName: 'Go-Live',
    milestones: [
      { id: 'g4-1', label: 'All test cases executed and passed', owner: 'Maria Santos', dueDate: '', evidenceExample: 'UAT-Execution-Log.xlsx' },
      { id: 'g4-2', label: 'No open critical or high defects', owner: 'Maria Santos', dueDate: '', evidenceExample: 'Defect-Summary.pdf' },
      { id: 'g4-3', label: 'Business owner UAT sign-off', owner: 'Sarah Chen', dueDate: '', evidenceExample: 'UAT-Signoff-Form.pdf' },
      { id: 'g4-4', label: 'Performance benchmarks met', owner: 'David Kim', dueDate: '', evidenceExample: 'Perf-Benchmark-Results.pdf' },
      { id: 'g4-5', label: 'Training materials delivered', owner: 'Elena Rodriguez', dueDate: '', evidenceExample: 'Training-Package.zip' },
    ],
  },
  {
    phaseIndex: 4,
    phaseName: 'Go-Live',
    nextPhaseName: 'Complete',
    milestones: [
      { id: 'g5-1', label: 'Production deployment verified', owner: 'Tom Wilson', dueDate: '', evidenceExample: 'Deployment-Checklist.pdf' },
      { id: 'g5-2', label: 'Data migration validated', owner: 'Alex Turner', dueDate: '', evidenceExample: 'Migration-Validation.xlsx' },
      { id: 'g5-3', label: 'Rollback plan tested', owner: 'Tom Wilson', dueDate: '', evidenceExample: 'Rollback-Test-Log.pdf' },
      { id: 'g5-4', label: 'Support team handover complete', owner: 'Lisa Chang', dueDate: '', evidenceExample: 'Handover-Document.docx' },
    ],
  },
];

// Generate concrete gates for a specific project's phase IDs
export function generateGatesForProject(phaseIds: number[]): StageGate[] {
  return stageGateTemplates
    .filter((_, i) => i < phaseIds.length)
    .map((template, i) => ({
      ...template,
      phaseId: phaseIds[i],
      milestones: template.milestones.map(m => ({
        ...m,
        id: `${m.id}-${phaseIds[i]}`,
      })),
    }));
}

// For backward compat with config
export const stageGates = stageGateTemplates as unknown as StageGate[];
