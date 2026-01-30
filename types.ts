export enum UserRole {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  PROJECT_OWNER = 'PROJECT_OWNER',
  FINANCE = 'FINANCE',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  PROJECT_ENGINEER = 'PROJECT_ENGINEER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'On Hold' | 'Completed';
  startDate: string;
  endDate: string;
  progress: number; // 0-100
  budget: number;
  manager: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  assignee: string; // User ID
  assigneeName: string;
  status: 'Todo' | 'In Progress' | 'Review' | 'Done';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  progress: number; // 0-100
  dependencies?: string[]; // IDs of tasks that must be done first
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Milestone {
  id: string;
  title: string;
  status: 'Completed' | 'Pending Approval' | 'Upcoming';
  date: string;
}

// Module 6
export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'xls' | 'doc' | 'img';
  size: string;
  uploadedBy: string;
  date: string;
  projectId?: string;
  taskId?: string;
  version: number;
  url?: string; // Mock url
}

// Module 10
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  time: string;
  read: boolean;
}

// Module 9
export interface ChangeRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  impactCost: number;
  impactTime: number; // Days
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedBy: string;
  date: string;
}
