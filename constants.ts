import { UserRole, User, Task, Transaction, Milestone, Document, Notification, ChangeRequest } from './types';

export const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.PROJECT_OWNER]: {
    id: 'u1',
    name: 'Alex Sterling',
    role: UserRole.PROJECT_OWNER,
    avatar: 'https://picsum.photos/seed/alex/100/100'
  },
  [UserRole.FINANCE]: {
    id: 'u2',
    name: 'Sarah Chen',
    role: UserRole.FINANCE,
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  [UserRole.PROJECT_MANAGER]: {
    id: 'u3',
    name: 'Marcus Ford',
    role: UserRole.PROJECT_MANAGER,
    avatar: 'https://picsum.photos/seed/marcus/100/100'
  },
  [UserRole.PROJECT_ENGINEER]: {
    id: 'u4',
    name: 'Emily Dao',
    role: UserRole.PROJECT_ENGINEER,
    avatar: 'https://picsum.photos/seed/emily/100/100'
  }
};

export const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', 
    projectId: 'p1', 
    title: 'Foundation Inspection', 
    description: 'Standard task procedure as per ISO-9001 guidelines.',
    assignee: 'u4', 
    assigneeName: 'Emily Dao', 
    status: 'In Progress', 
    priority: 'High', 
    dueDate: '2023-10-25',
    progress: 45
  },
  { 
    id: 't2', 
    projectId: 'p1', 
    title: 'HVAC Blueprint Review', 
    description: 'Standard task procedure as per ISO-9001 guidelines.',
    assignee: 'u4', 
    assigneeName: 'Emily Dao', 
    status: 'Todo', 
    priority: 'Medium', 
    dueDate: '2023-10-28',
    progress: 0
  },
  { 
    id: 't3', 
    projectId: 'p1', 
    title: 'Safety Compliance Check', 
    description: 'Standard task procedure as per ISO-9001 guidelines.',
    assignee: 'u3', 
    assigneeName: 'Marcus Ford', 
    status: 'Done', 
    priority: 'High', 
    dueDate: '2023-10-20',
    progress: 100 
  },
  { 
    id: 't4', 
    projectId: 'p1', 
    title: 'Material Procurement', 
    description: 'Standard task procedure as per ISO-9001 guidelines.',
    assignee: 'u4', 
    assigneeName: 'Emily Dao', 
    status: 'Review', 
    priority: 'High', 
    dueDate: '2023-10-24',
    progress: 80 
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', description: 'Steel Beams Batch A', amount: 45000, category: 'Materials', date: '2023-10-22', status: 'Pending' },
  { id: 'tx2', description: 'Consultant Fee: Geo-Tech', amount: 12000, category: 'Services', date: '2023-10-21', status: 'Approved' },
  { id: 'tx3', description: 'Site Excavation Rental', amount: 8500, category: 'Equipment', date: '2023-10-20', status: 'Approved' },
  { id: 'tx4', description: 'Safety Gear Bulk Order', amount: 3200, category: 'Materials', date: '2023-10-23', status: 'Pending' },
];

export const INITIAL_MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Phase 1: Excavation', status: 'Completed', date: '2023-09-15' },
  { id: 'm2', title: 'Phase 2: Foundation Pour', status: 'Pending Approval', date: '2023-10-22' },
  { id: 'm3', title: 'Phase 3: Structural Steel', status: 'Upcoming', date: '2023-11-30' },
];

export const INITIAL_DOCUMENTS: Document[] = [
  { id: 'd1', name: 'Site_Safety_Protocol_v2.pdf', type: 'pdf', size: '2.4 MB', uploadedBy: 'Marcus Ford', date: '2023-10-15', projectId: 'p1', version: 2 },
  { id: 'd2', name: 'Budget_Forecast_Q4.xls', type: 'xls', size: '1.1 MB', uploadedBy: 'Sarah Chen', date: '2023-10-18', projectId: 'p1', version: 1 },
  { id: 'd3', name: 'Foundation_Blueprints.img', type: 'img', size: '15 MB', uploadedBy: 'Emily Dao', date: '2023-10-01', projectId: 'p1', version: 1 },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Budget Alert', message: 'Logistics budget is at 89% utilization.', type: 'alert', time: '2 hours ago', read: false },
  { id: 'n2', title: 'Task Completed', message: 'Safety Compliance Check marked as done by Marcus.', type: 'success', time: '5 hours ago', read: false },
  { id: 'n3', title: 'New Document', message: 'Emily uploaded Foundation Blueprints.', type: 'info', time: '1 day ago', read: true },
];

export const INITIAL_CHANGE_REQUESTS: ChangeRequest[] = [
  { id: 'cr1', projectId: 'p1', title: 'Upgrade Concrete Grade', description: 'Switch to C50/60 for better durability due to soil report.', impactCost: 15000, impactTime: 2, status: 'Pending', requestedBy: 'Emily Dao', date: '2023-10-20' },
  { id: 'cr2', projectId: 'p1', title: 'Additional Crane Rental', description: 'Extend rental for 3 days due to weather delay.', impactCost: 4500, impactTime: 3, status: 'Approved', requestedBy: 'Marcus Ford', date: '2023-10-15' },
];
