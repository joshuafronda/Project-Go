import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, Task, Comment, Message, User, UserRole, Document, Notification, ChangeRequest, Transaction } from '../types';
import { INITIAL_TASKS, MOCK_USERS, INITIAL_DOCUMENTS, INITIAL_NOTIFICATIONS, INITIAL_CHANGE_REQUESTS, INITIAL_TRANSACTIONS } from '../constants';

interface ProjectContextType {
  projects: Project[];
  tasks: Task[];
  comments: Comment[];
  messages: Message[];
  documents: Document[];
  notifications: Notification[];
  changeRequests: ChangeRequest[];
  transactions: Transaction[];
  
  addProject: (project: Project) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  addComment: (comment: Comment) => void;
  addMessage: (message: Message) => void;
  addDocument: (doc: Document) => void;
  markNotificationRead: (id: string) => void;
  addChangeRequest: (req: ChangeRequest) => void;
  updateChangeRequest: (id: string, status: ChangeRequest['status']) => void;
  updateTransaction: (id: string, status: Transaction['status']) => void;
  getProjectProgress: (projectId: string) => number;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mock Initial Data
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'Contoso Tower A',
    description: 'Main residential tower construction including foundation and core structure.',
    status: 'Active',
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    progress: 68,
    budget: 4200000,
    manager: 'Marcus Ford'
  },
  {
    id: 'p2',
    name: 'West Wing Expansion',
    description: 'Commercial annex expansion for retail units.',
    status: 'Planning',
    startDate: '2023-11-01',
    endDate: '2024-03-01',
    progress: 0,
    budget: 1500000,
    manager: 'Marcus Ford'
  }
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [comments, setComments] = useState<Comment[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', channelId: 'general', userId: 'u3', userName: 'Marcus Ford', userAvatar: 'https://picsum.photos/seed/marcus/100/100', content: 'Team, please update your progress logs by EOD.', timestamp: '10:30 AM' },
    { id: 'm2', channelId: 'general', userId: 'u4', userName: 'Emily Dao', userAvatar: 'https://picsum.photos/seed/emily/100/100', content: 'Copy that. Uploading site photos now.', timestamp: '10:32 AM' }
  ]);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(INITIAL_CHANGE_REQUESTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  const addProject = (project: Project) => setProjects([...projects, project]);
  const addTask = (task: Task) => setTasks([...tasks, task]);
  const updateTask = (taskId: string, updates: Partial<Task>) => setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  const addComment = (comment: Comment) => setComments([...comments, comment]);
  const addMessage = (message: Message) => setMessages([...messages, message]);
  const addDocument = (doc: Document) => setDocuments([...documents, doc]);
  
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addChangeRequest = (req: ChangeRequest) => setChangeRequests([...changeRequests, req]);
  const updateChangeRequest = (id: string, status: ChangeRequest['status']) => {
    setChangeRequests(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };
  
  const updateTransaction = (id: string, status: Transaction['status']) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const getProjectProgress = (projectId: string) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const totalProgress = projectTasks.reduce((acc, t) => acc + t.progress, 0);
    return Math.round(totalProgress / projectTasks.length);
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, tasks, comments, messages, documents, notifications, changeRequests, transactions,
      addProject, addTask, updateTask, addComment, addMessage, addDocument, markNotificationRead, 
      addChangeRequest, updateChangeRequest, updateTransaction, getProjectProgress 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
