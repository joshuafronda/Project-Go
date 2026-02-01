import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { User, Task, Document } from '../../types';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { LocationPicker } from '../LocationPicker';
import { 
  ClipboardList, 
  Upload, 
  AlertOctagon, 
  CheckSquare, 
  FileText, 
  MessageSquare, 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Map as MapIcon,
  User as UserIcon,
  Activity,
  TrendingUp,
  CheckCircle,
  Circle,
  AlertTriangle,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  Settings,
  Home,
  Folder,
  BarChart3,
  Users,
  Shield,
  Wrench,
  Phone,
  Mail,
  Briefcase,
  Award,
  Star,
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface EngineerViewProps {
  currentUser: User;
}

export const EngineerView: React.FC<EngineerViewProps> = ({ currentUser }) => {
  const { tasks, updateTask, comments, addComment } = useProject();
  const myTasks = tasks.filter(t => t.assignee === currentUser.id);
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'upload' | 'issues' | 'team' | 'messages'>('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTaskLocationModal, setShowTaskLocationModal] = useState(false);
  const [showSiteMap, setShowSiteMap] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<User | null>(null);
  const [messageText, setMessageText] = useState('');
  const [selectedMessageRecipient, setSelectedMessageRecipient] = useState<User | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Mock team data for the current project
  const [projectTeam] = useState<User[]>([
    {
      id: 'u3',
      name: 'Marcus Ford',
      role: 'PROJECT_MANAGER' as any,
      avatar: 'https://picsum.photos/seed/marcus/100/100'
    },
    {
      id: 'u4',
      name: 'Emily Dao',
      role: 'PROJECT_ENGINEER' as any,
      avatar: 'https://picsum.photos/seed/emily/100/100'
    },
    {
      id: 'u5',
      name: 'David Kim',
      role: 'PROJECT_ENGINEER' as any,
      avatar: 'https://picsum.photos/seed/david/100/100'
    },
    {
      id: 'u6',
      name: 'Sarah Johnson',
      role: 'PROJECT_ENGINEER' as any,
      avatar: 'https://picsum.photos/seed/sarah/100/100'
    },
    {
      id: 'u7',
      name: 'Michael Chen',
      role: 'PROJECT_ENGINEER' as any,
      avatar: 'https://picsum.photos/seed/michael/100/100'
    },
    {
      id: 'u8',
      name: 'Lisa Rodriguez',
      role: 'FINANCE' as any,
      avatar: 'https://picsum.photos/seed/lisa/100/100'
    }
  ]);

  // Team member details with contact info and expertise
  const [teamMemberDetails] = useState<Record<string, any>>({
    'u3': {
      email: 'marcus.ford@projectgo.com',
      phone: '+1-555-0123',
      expertise: 'Project Management, Risk Assessment',
      experience: '12 years',
      currentTasks: 8,
      completedTasks: 45,
      availability: 'Available',
      location: 'Main Office'
    },
    'u4': {
      email: 'emily.dao@projectgo.com',
      phone: '+1-555-0124',
      expertise: 'Structural Engineering, Site Management',
      experience: '8 years',
      currentTasks: 3,
      completedTasks: 28,
      availability: 'On Site',
      location: 'Construction Site A'
    },
    'u5': {
      email: 'david.kim@projectgo.com',
      phone: '+1-555-0125',
      expertise: 'MEP Systems, Quality Control',
      experience: '6 years',
      currentTasks: 4,
      completedTasks: 22,
      availability: 'On Site',
      location: 'Construction Site B'
    },
    'u6': {
      email: 'sarah.johnson@projectgo.com',
      phone: '+1-555-0126',
      expertise: 'Civil Engineering, Surveying',
      experience: '5 years',
      currentTasks: 2,
      completedTasks: 18,
      availability: 'Remote',
      location: 'Home Office'
    },
    'u7': {
      email: 'michael.chen@projectgo.com',
      phone: '+1-555-0127',
      expertise: 'Safety Management, Compliance',
      experience: '7 years',
      currentTasks: 3,
      completedTasks: 31,
      availability: 'On Site',
      location: 'Construction Site A'
    },
    'u8': {
      email: 'lisa.rodriguez@projectgo.com',
      phone: '+1-555-0128',
      expertise: 'Budget Management, Cost Control',
      experience: '10 years',
      currentTasks: 5,
      completedTasks: 38,
      availability: 'Available',
      location: 'Main Office'
    }
  });

  // Mock messages data
  const [messages] = useState([
    {
      id: 'm1',
      sender: projectTeam[0], // Marcus Ford
      recipient: currentUser,
      subject: 'Site Inspection Schedule',
      content: 'Please review the updated site inspection schedule for next week. We need to coordinate with the safety team.',
      timestamp: '2024-01-20 09:30',
      read: false,
      priority: 'high'
    },
    {
      id: 'm2',
      sender: projectTeam[2], // David Kim
      recipient: currentUser,
      subject: 'Material Delivery Update',
      content: 'The steel beams for Building A will arrive tomorrow morning. Can you coordinate the receiving team?',
      timestamp: '2024-01-20 08:15',
      read: true,
      priority: 'medium'
    },
    {
      id: 'm3',
      sender: currentUser,
      recipient: projectTeam[1], // Emily Dao (sent to self for demo)
      subject: 'Progress Report',
      content: 'Foundation work is 75% complete. Expected to finish by end of week.',
      timestamp: '2024-01-19 16:45',
      read: true,
      priority: 'low'
    },
    {
      id: 'm4',
      sender: projectTeam[4], // Michael Chen
      recipient: currentUser,
      subject: 'Safety Meeting Reminder',
      content: 'Monthly safety meeting tomorrow at 2 PM in the main site office. Please bring your safety reports.',
      timestamp: '2024-01-19 14:20',
      read: false,
      priority: 'high'
    }
  ]);

  const [issues, setIssues] = useState([
    {
      id: '1',
      title: 'Equipment malfunction',
      description: 'Concrete mixer not working properly',
      severity: 'high' as 'high' | 'medium' | 'low',
      status: 'open' as 'open' | 'resolved',
      reportedBy: currentUser.name,
      reportedAt: '2024-01-15 09:30',
      project: 'Building A Construction',
      location: {
        lat: 14.5995,
        lng: 120.9842,
        address: 'Construction Site A, Manila'
      }
    }
  ]);

  // Mock documents data with location
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Safety Report Q1.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: currentUser.name,
      date: '2024-01-15',
      projectId: 'proj1',
      version: 1
    },
    {
      id: '2',
      name: 'Site Photos.zip',
      type: 'img',
      size: '15.7 MB',
      uploadedBy: currentUser.name,
      date: '2024-01-14',
      projectId: 'proj1',
      version: 1
    }
  ]);

  // Mock task locations
  const [taskLocations, setTaskLocations] = useState<Record<string, {lat: number; lng: number; address: string}>>({
    't1': { lat: 14.5995, lng: 120.9842, address: 'Foundation Area, Site A' },
    't2': { lat: 14.6005, lng: 120.9852, address: 'Building Floor 5, Site A' },
    't4': { lat: 14.5985, lng: 120.9832, address: 'Storage Area, Site A' }
  });

  const [currentIssueLocation, setCurrentIssueLocation] = useState({
    lat: 14.5995,
    lng: 120.9842,
    address: 'Construction Site A, Manila'
  });

  const [currentTaskLocation, setCurrentTaskLocation] = useState({
    lat: 14.5995,
    lng: 120.9842,
    address: 'Construction Site A, Manila'
  });

  const taskComments = selectedTask ? comments.filter(c => c.taskId === selectedTask.id) : [];

  const handleStatusChange = (taskId: string, status: string) => {
    updateTask(taskId, { status: status as any });
  };

  const handleProgressChange = (taskId: string, progress: number) => {
    updateTask(taskId, { progress });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if(selectedTask && commentText.trim()) {
        addComment({
            id: Date.now().toString(),
            taskId: selectedTask.id,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar,
            content: commentText,
            createdAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        });
        setCommentText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    // In real app, this would upload files to server
    console.log('Uploading files:', uploadedFiles);
    setUploadedFiles([]);
    setShowUploadModal(false);
  };

  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newIssue = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      severity: formData.get('severity') as 'high' | 'medium' | 'low',
      status: 'open' as 'open' | 'resolved',
      reportedBy: currentUser.name,
      reportedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      project: formData.get('project') as string,
      location: currentIssueLocation
    };
    setIssues(prev => [...prev, newIssue]);
    setShowIssueModal(false);
  };

  const handleResolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, status: 'resolved' as 'open' | 'resolved' } : issue
    ));
  };

  const handleTaskLocationUpdate = (taskId: string) => {
    setTaskLocations(prev => ({
      ...prev,
      [taskId]: currentTaskLocation
    }));
    setShowTaskLocationModal(false);
  };

  // Create custom icon for markers
  const createCustomIcon = (type: string) => {
    const color = type === 'task' ? '#3b82f6' : type === 'issue' ? '#ef4444' : '#10b981';
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.373 18.627 0 12 0z" fill="${color}"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
      `)}`,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Engineering Operations</h1>
              <p className="text-gray-500 text-sm sm:text-base">Project execution & site management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSiteMap(!showSiteMap)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                showSiteMap 
                  ? 'bg-green-600 text-white shadow-lg hover:bg-green-700' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm'
              }`}
            >
              <MapIcon size={18} className="mr-2" />
              {showSiteMap ? 'Hide Map' : 'Site Map'}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Dashboard */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Active Tasks Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ClipboardList className="text-blue-600" size={24} />
              </div>
              <div className="flex items-center text-green-500 text-sm">
                <TrendingUp size={16} className="mr-1" />
                <span className="font-medium">+12%</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status !== 'Done').length}</h3>
              <p className="text-gray-500 text-sm mt-1">Active Tasks</p>
            </div>
          </div>

          {/* Completed Tasks Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <div className="flex items-center text-green-500 text-sm">
                <Activity size={16} className="mr-1" />
                <span className="font-medium">On Track</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{myTasks.filter(t => t.status === 'Done').length}</h3>
              <p className="text-gray-500 text-sm mt-1">Completed</p>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FileText className="text-purple-600" size={24} />
              </div>
              <div className="flex items-center text-blue-500 text-sm">
                <Upload size={16} className="mr-1" />
                <span className="font-medium">Recent</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{documents.length}</h3>
              <p className="text-gray-500 text-sm mt-1">Documents</p>
            </div>
          </div>

          {/* Issues Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="flex items-center text-orange-500 text-sm">
                <AlertOctagon size={16} className="mr-1" />
                <span className="font-medium">Attention</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{issues.filter(i => i.status === 'open').length}</h3>
              <p className="text-gray-500 text-sm mt-1">Open Issues</p>
            </div>
          </div>
        </div>

      {/* Site Map */}
      {showSiteMap && (
        <Card className="p-0 overflow-hidden mt-5 ">
          <div className="h-96 bg-gray-100">
            <MapContainer
              center={[14.5995, 120.9842]} // Manila center
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Task Markers */}
              {myTasks.map(task => {
                const location = taskLocations[task.id];
                if (!location) return null;
                return (
                  <Marker
                    key={task.id}
                    position={[location.lat, location.lng]}
                    icon={createCustomIcon('task')}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">{task.description}</p>
                          <div className="flex items-center text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            <span className="text-xs">{location.address}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              task.status === 'Done' ? 'bg-green-100 text-green-700' : 
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                              task.status === 'Review' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {task.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {task.progress}% Complete
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
              
              {/* Issue Markers */}
              {issues.map(issue => {
                if (!issue.location) return null;
                return (
                  <Marker
                    key={issue.id}
                    position={[issue.location.lat, issue.location.lng]}
                    icon={createCustomIcon('issue')}
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">{issue.description}</p>
                          <div className="flex items-center text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            <span className="text-xs">{issue.location.address}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {issue.severity}
                            </span>
                            <span className="text-xs text-gray-500">
                              {issue.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Tasks</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span>Issues</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {Object.keys(taskLocations).length} tasks with locations • {issues.filter(i => i.location).length} issues with locations
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Operations</h3>
              <nav className="space-y-2">
                {[
                  { id: 'tasks', icon: CheckSquare, label: 'My Tasks', count: myTasks.filter(t => t.status !== 'Done').length },
                  { id: 'upload', icon: Upload, label: 'Documents', count: documents.length },
                  { id: 'issues', icon: AlertOctagon, label: 'Issues', count: issues.filter(i => i.status === 'open').length },
                  { id: 'team', icon: Users, label: 'Team', count: projectTeam.length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all font-medium ${
                      activeTab === item.id 
                        ? 'bg-orange-50 text-orange-700 border border-orange-200' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.count > 0 && (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activeTab === item.id ? 'bg-orange-200 text-orange-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
          {activeTab === 'tasks' && (
            <Card title="Assigned Activities">
              <div className="space-y-3 sm:space-y-4">
                {myTasks.length === 0 ? <p className="text-gray-500 text-center py-4 text-sm sm:text-base">No tasks assigned.</p> : 
                myTasks.map(task => (
                  <div key={task.id} className="group border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-400 transition-colors bg-white">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                           <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{task.priority} Priority</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg cursor-pointer hover:text-blue-600" onClick={() => setSelectedTask(task)}>{task.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
                        {taskLocations[task.id] && (
                          <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                            <MapPin size={12} className="mr-1" />
                            <span className="truncate">{taskLocations[task.id].address}</span>
                          </div>
                        )}
                      </div>
                      <select 
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option>Todo</option>
                        <option>In Progress</option>
                        <option>Review</option>
                        <option>Done</option>
                      </select>
                    </div>
                    
                    {/* Progress Slider */}
                    <div className="mt-3 sm:mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={task.progress} 
                            onChange={(e) => handleProgressChange(task.id, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex justify-between">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="text-xs sm:text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center"
                      >
                        <MessageSquare size={14} className="mr-1" />
                        Comments
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedTask(task);
                          setCurrentTaskLocation(taskLocations[task.id] || { lat: 14.5995, lng: 120.9842, address: 'Construction Site A, Manila' });
                          setShowTaskLocationModal(true);
                        }}
                        className="text-xs sm:text-sm text-green-600 font-medium hover:text-green-800 flex items-center"
                      >
                        <MapPin size={14} className="mr-1" />
                        Set Location
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'upload' && (
            <Card title="Document Management">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Uploaded Documents</h3>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                  >
                    <Plus size={16} className="mr-2" />
                    Upload
                  </button>
                </div>
                
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          doc.type === 'pdf' ? 'bg-red-100' : 
                          doc.type === 'xls' ? 'bg-green-100' : 
                          doc.type === 'doc' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          <FileText size={16} className={
                            doc.type === 'pdf' ? 'text-red-600' : 
                            doc.type === 'xls' ? 'text-green-600' : 
                            doc.type === 'doc' ? 'text-blue-600' : 'text-purple-600'
                          } />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                          <p className="text-xs text-gray-500">{doc.size} • {doc.date}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'team' && (
            <Card title="Project Team">
              <div className="space-y-6">
                {/* Team Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectTeam.map(member => {
                    const details = teamMemberDetails[member.id];
                    const isCurrentUser = member.id === currentUser.id;
                    
                    return (
                      <div 
                        key={member.id} 
                        className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${
                          isCurrentUser ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedTeamMember(member)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 flex items-center">
                              {member.name}
                              {isCurrentUser && (
                                <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                                  You
                                </span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {member.role.replace('_', ' ').replace('PROJECT_', '')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              details.availability === 'Available' ? 'bg-green-100 text-green-700' :
                              details.availability === 'On Site' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {details.availability}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Tasks:</span>
                            <span className="text-gray-700">{details.currentTasks} active</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Location:</span>
                            <span className="text-gray-700">{details.location}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              {[...Array(Math.min(3, details.completedTasks))].map((_, i) => (
                                <div key={i} className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle size={12} className="text-green-600" />
                                </div>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{details.completedTasks} completed</span>
                          </div>
                          <ChevronRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-blue-900">{projectTeam.length}</h3>
                    <p className="text-blue-700 text-sm">Team Members</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-green-900">
                      {projectTeam.reduce((acc, member) => acc + teamMemberDetails[member.id].completedTasks, 0)}
                    </h3>
                    <p className="text-green-700 text-sm">Tasks Completed</p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="text-orange-600" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-orange-900">
                      {projectTeam.reduce((acc, member) => acc + teamMemberDetails[member.id].currentTasks, 0)}
                    </h3>
                    <p className="text-orange-700 text-sm">Active Tasks</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'issues' && (
            <Card title="Issue Reporting">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Reported Issues</h3>
                  <button 
                    onClick={() => setShowIssueModal(true)}
                    className="flex items-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
                  >
                    <Plus size={16} className="mr-2" />
                    Report Issue
                  </button>
                </div>
                
                <div className="space-y-3">
                  {issues.map(issue => (
                    <div key={issue.id} className={`border rounded-lg p-3 sm:p-4 ${
                      issue.status === 'resolved' ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{issue.title}</h4>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">{issue.description}</p>
                          {issue.location && (
                            <div className="flex items-center text-xs sm:text-sm text-gray-500 mt-1">
                              <MapPin size={12} className="mr-1" />
                              <span className="truncate">{issue.location.address}</span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                          issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{issue.reportedAt}</span>
                          <span>•</span>
                          <span>{issue.reportedBy}</span>
                        </div>
                        {issue.status === 'open' && (
                          <button 
                            onClick={() => handleResolveIssue(issue.id)}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Documents">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
            >
              Select Files
            </label>
          </div>
          
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Selected Files:</h4>
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={uploadedFiles.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Upload Files
            </button>
          </div>
        </div>
      </Modal>

      {/* Issue Reporting Modal */}
      <Modal isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} title="Report Issue">
        <form onSubmit={handleReportIssue} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title *</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the issue"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed description of the issue"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity *</label>
              <select
                name="severity"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select
                name="project"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Building A Construction">Building A Construction</option>
                <option value="Road Development">Road Development</option>
                <option value="Bridge Project">Bridge Project</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Location</label>
            <LocationPicker
              onLocationSelect={(lat, lng, address) => {
                setCurrentIssueLocation({ lat, lng, address });
              }}
              initialLocation={currentIssueLocation}
              height="200px"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowIssueModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Report Issue
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Location Modal */}
      <Modal isOpen={showTaskLocationModal} onClose={() => setShowTaskLocationModal(false)} title="Set Task Location">
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Task: {selectedTask.title}</h3>
              <p className="text-sm text-gray-600">{selectedTask.description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Location</label>
              <LocationPicker
                onLocationSelect={(lat, lng, address) => {
                  setCurrentTaskLocation({ lat, lng, address });
                }}
                initialLocation={currentTaskLocation}
                height="250px"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTaskLocationModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTaskLocationUpdate(selectedTask.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Set Location
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Team Member Detail Modal */}
      <Modal isOpen={!!selectedTeamMember} onClose={() => setSelectedTeamMember(null)} title="Team Member Details">
        {selectedTeamMember && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img 
                src={selectedTeamMember.avatar} 
                alt={selectedTeamMember.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedTeamMember.name}</h3>
                <p className="text-gray-500">{selectedTeamMember.role.replace('_', ' ').replace('PROJECT_', '')}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    teamMemberDetails[selectedTeamMember.id].availability === 'Available' ? 'bg-green-100 text-green-700' :
                    teamMemberDetails[selectedTeamMember.id].availability === 'On Site' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {teamMemberDetails[selectedTeamMember.id].availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="text-gray-400" size={16} />
                  <span className="text-gray-600">{teamMemberDetails[selectedTeamMember.id].email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="text-gray-400" size={16} />
                  <span className="text-gray-600">{teamMemberDetails[selectedTeamMember.id].phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="text-gray-400" size={16} />
                  <span className="text-gray-600">{teamMemberDetails[selectedTeamMember.id].location}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Experience:</span>
                  <span className="text-gray-700 font-medium">{teamMemberDetails[selectedTeamMember.id].experience}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Current Tasks:</span>
                  <span className="text-gray-700 font-medium">{teamMemberDetails[selectedTeamMember.id].currentTasks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Completed:</span>
                  <span className="text-gray-700 font-medium">{teamMemberDetails[selectedTeamMember.id].completedTasks}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Expertise</h4>
              <p className="text-gray-600 text-sm">{teamMemberDetails[selectedTeamMember.id].expertise}</p>
            </div>

            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                <MessageCircle size={16} className="mr-2" />
                Send Message
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                <Phone size={16} className="mr-2" />
                Call
              </button>
              <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                <Mail size={16} className="mr-2" />
                Email
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Task Detail & Comments Modal */}
      <Modal isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} title="Task Details">
         {selectedTask && (
             <div className="space-y-6">
                 <div>
                     <h2 className="text-xl font-bold text-gray-900">{selectedTask.title}</h2>
                     <p className="text-gray-600 mt-1">{selectedTask.description}</p>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        <span className="font-medium text-gray-900">{selectedTask.status}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Due Date</span>
                        <span className="font-medium text-gray-900">{selectedTask.dueDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-900">{selectedTask.progress}%</span>
                    </div>
                 </div>

                 {/* Comments Section (Module 5) */}
                 <div>
                     <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                         <MessageSquare size={18} className="mr-2" />
                         Comments
                     </h3>
                     <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                        {taskComments.length === 0 && <p className="text-gray-400 text-sm italic">No comments yet.</p>}
                        {taskComments.map(c => (
                            <div key={c.id} className="flex space-x-3">
                                <img src={c.userAvatar} className="w-8 h-8 rounded-full border border-gray-200" alt="" />
                                <div className="flex-1 bg-gray-50 p-3 rounded-lg rounded-tl-none">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <span className="text-sm font-semibold text-gray-800">{c.userName}</span>
                                        <span className="text-xs text-gray-400">{c.createdAt}</span>
                                    </div>
                                    <p className="text-sm text-gray-600">{c.content}</p>
                                </div>
                            </div>
                        ))}
                     </div>
                     <form onSubmit={handlePostComment} className="flex gap-2">
                         <input 
                            type="text" 
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                         />
                         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Post</button>
                     </form>
                 </div>
             </div>
         )}
      </Modal>
          </div>
        </div>
  );
};
