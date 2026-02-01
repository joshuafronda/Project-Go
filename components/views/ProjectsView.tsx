import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { LocationPicker } from '../LocationPicker';
import { Project, UserRole, User } from '../../types';
import { Plus, Calendar, Target, DollarSign, BarChart, MapPin, Map as MapIcon, Users, MessageCircle, UserPlus, X, Search, Mail, Phone, Settings, Edit, Save } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ProjectsViewProps {
  currentUser: User;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ currentUser }) => {
  const { projects, addProject, getProjectProgress } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'Planning',
    budget: 0,
    location: {
      lat: 14.5995,
      lng: 120.9842,
      address: 'Manila, Philippines'
    }
  });

  const [editingProject, setEditingProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'Planning',
    budget: 0,
    location: {
      lat: 14.5995,
      lng: 120.9842,
      address: 'Manila, Philippines'
    }
  });

  // Mock available engineers to add to projects
  const availableEngineers = [
    { id: 'u4', name: 'Emily Dao', role: 'Project Engineer', avatar: 'https://picsum.photos/seed/emily/100/100', email: 'emily@projectgo.com', phone: '+1-555-0101', specialization: 'Structural Engineering' },
    { id: 'u5', name: 'David Kim', role: 'Site Supervisor', avatar: 'https://picsum.photos/seed/david/100/100', email: 'david@projectgo.com', phone: '+1-555-0102', specialization: 'Site Management' },
    { id: 'u6', name: 'Lisa Rodriguez', role: 'Quality Engineer', avatar: 'https://picsum.photos/seed/lisa/100/100', email: 'lisa@projectgo.com', phone: '+1-555-0103', specialization: 'Quality Control' },
    { id: 'u7', name: 'Michael Chen', role: 'Safety Engineer', avatar: 'https://picsum.photos/seed/michael/100/100', email: 'michael@projectgo.com', phone: '+1-555-0104', specialization: 'Safety Management' },
    { id: 'u8', name: 'Sarah Johnson', role: 'Electrical Engineer', avatar: 'https://picsum.photos/seed/sarah/100/100', email: 'sarah@projectgo.com', phone: '+1-555-0105', specialization: 'Electrical Systems' },
  ];

  // Mock project team members and messages
  const [projectTeams, setProjectTeams] = useState<Record<string, typeof availableEngineers>>({});
  const [projectMessages, setProjectMessages] = useState<Record<string, Array<{
    id: string;
    sender: string;
    senderAvatar: string;
    content: string;
    timestamp: string;
  }>>>({});

  const canEdit = currentUser.role === UserRole.PROJECT_MANAGER || currentUser.role === UserRole.PROJECT_OWNER;

  // Filter projects that have locations
  const projectsWithLocations = projects.filter(project => project.location);

  // Create custom icon for project markers
  const createCustomIcon = (status: string) => {
    const color = status === 'Active' ? '#10b981' : status === 'Planning' ? '#3b82f6' : '#f59e0b';
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.startDate) {
      const project = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProject.name,
        description: newProject.description || '',
        status: 'Planning',
        startDate: newProject.startDate,
        endDate: newProject.endDate || '',
        progress: 0,
        budget: Number(newProject.budget),
        manager: currentUser.name,
        location: newProject.location
      } as Project;
      
      addProject(project);
      
      // Initialize empty team and messages for new project
      setProjectTeams(prev => ({ ...prev, [project.id]: [] }));
      setProjectMessages(prev => ({ ...prev, [project.id]: [] }));
      
      setIsModalOpen(false);
      setNewProject({ 
        name: '', 
        description: '', 
        budget: 0,
        location: {
          lat: 14.5995,
          lng: 120.9842,
          address: 'Manila, Philippines'
        }
      });
    }
  };

  // Team management functions
  const handleAddTeamMember = (projectId: string, engineer: typeof availableEngineers[0]) => {
    setProjectTeams(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), engineer]
    }));
  };

  const handleRemoveTeamMember = (projectId: string, engineerId: string) => {
    setProjectTeams(prev => ({
      ...prev,
      [projectId]: prev[projectId].filter(member => member.id !== engineerId)
    }));
  };

  // Message functions
  const handleSendMessage = (projectId: string) => {
    if (!projectMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: projectMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setProjectMessages(prev => ({
      ...prev,
      [projectId]: [...(prev[projectId] || []), newMessage]
    }));
    
    setProjectMessage('');
  };

  // Filter engineers based on search
  const filteredEngineers = availableEngineers.filter(engineer =>
    engineer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    engineer.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Edit project functions
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setEditingProject({
      name: project.name,
      description: project.description,
      status: project.status,
      budget: project.budget,
      startDate: project.startDate,
      endDate: project.endDate,
      location: project.location
    });
    setShowEditModal(true);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !editingProject.name) return;

    // In a real app, this would update the project in the database
    // For now, we'll just log the update
    console.log('Updating project:', {
      id: selectedProject.id,
      ...editingProject
    });

    setShowEditModal(false);
    setSelectedProject(null);
    setEditingProject({
      name: '',
      description: '',
      status: 'Planning',
      budget: 0,
      location: {
        lat: 14.5995,
        lng: 120.9842,
        address: 'Manila, Philippines'
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Portfolio</h1>
          <p className="text-gray-500">Manage timelines, objectives, and resource allocation.</p>
        </div>
        <div className="flex items-center gap-3">
          {projectsWithLocations.length > 0 && (
            <button 
              onClick={() => setShowMapView(!showMapView)}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                showMapView 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MapIcon size={18} className="mr-2" />
              {showMapView ? 'Hide Map' : 'Show Map'}
            </button>
          )}
          {canEdit && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} className="mr-2" />
              New Project
            </button>
          )}
        </div>
      </div>

      {/* Map View */}
      {showMapView && projectsWithLocations.length > 0 && (
        <Card className="p-0 overflow-hidden">
          <div className="h-96 bg-gray-100">
            <MapContainer
              center={[14.5995, 120.9842]} // Manila center
              zoom={10}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {projectsWithLocations.map(project => (
                <Marker
                  key={project.id}
                  position={[project.location!.lat, project.location!.lng]}
                  icon={createCustomIcon(project.status)}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-600">{project.description}</p>
                        <div className="flex items-center text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          <span className="text-xs">{project.location!.address}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.status === 'Active' ? 'bg-green-100 text-green-700' : 
                            project.status === 'Planning' ? 'bg-blue-100 text-blue-700' : 
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            ${project.budget.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Manager: {project.manager}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Active</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>Planning</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                  <span>On Hold</span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {projectsWithLocations.length} of {projects.length} projects have locations
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => {
            const progress = getProjectProgress(project.id);
            const teamMembers = projectTeams[project.id] || [];
            const messages = projectMessages[project.id] || [];
            
            return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {project.status}
                    </span>
                </div>
                <div className="flex items-center space-x-2">
                    {canEdit && (
                        <button 
                            onClick={() => handleEditProject(project)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Project"
                        >
                            <Edit size={18} />
                        </button>
                    )}
                    <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <BarChart size={20} className="text-gray-500" />
                    </div>
                </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">{project.description}</p>

                <div className="space-y-3 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>{project.startDate} — {project.endDate}</span>
                </div>
                <div className="flex items-center">
                    <DollarSign size={16} className="mr-2 text-gray-400" />
                    <span>Budget: ${project.budget.toLocaleString()}</span>
                </div>
                <div className="flex items-center">
                    <Target size={16} className="mr-2 text-gray-400" />
                    <span>Manager: {project.manager}</span>
                </div>
                {project.location && (
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-400" />
                    <span className="truncate">{project.location.address}</span>
                  </div>
                )}
                </div>

                {/* Team Members Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-700">
                            <Users size={16} className="mr-2" />
                            <span className="font-medium">Team Members ({teamMembers.length})</span>
                        </div>
                        {canEdit && (
                            <button 
                                onClick={() => {
                                    setSelectedProject(project);
                                    setShowTeamModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                            >
                                <UserPlus size={14} className="mr-1" />
                                Add
                            </button>
                        )}
                    </div>
                    {teamMembers.length > 0 ? (
                        <div className="flex -space-x-2">
                            {teamMembers.slice(0, 4).map(member => (
                                <img
                                    key={member.id}
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                    title={member.name}
                                />
                            ))}
                            {teamMembers.length > 4 && (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                    +{teamMembers.length - 4}
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No team members assigned yet</p>
                    )}
                </div>

                {/* Messages Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-700">
                            <MessageCircle size={16} className="mr-2" />
                            <span className="font-medium">Messages ({messages.length})</span>
                        </div>
                        <button 
                            onClick={() => {
                                setSelectedProject(project);
                                setShowMessagesModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            View All
                        </button>
                    </div>
                    {messages.length > 0 ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-2 mb-1">
                                <img src={messages[messages.length - 1].senderAvatar} className="w-6 h-6 rounded-full" alt="" />
                                <span className="text-xs font-medium text-gray-700">{messages[messages.length - 1].sender}</span>
                                <span className="text-xs text-gray-400">{messages[messages.length - 1].timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{messages[messages.length - 1].content}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">No messages yet</p>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="text-gray-900 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                    ></div>
                </div>
                </div>
            </Card>
        )})}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input 
              required
              type="text" 
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newProject.name}
              onChange={e => setNewProject({...newProject, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Scope</label>
            <textarea 
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                required
                type="date" 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newProject.startDate}
                onChange={e => setNewProject({...newProject, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                required
                type="date" 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={newProject.endDate}
                onChange={e => setNewProject({...newProject, endDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={newProject.budget}
              onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Location</label>
            <LocationPicker
              onLocationSelect={(lat, lng, address) => {
                setNewProject({
                  ...newProject,
                  location: { lat, lng, address }
                });
              }}
              initialLocation={newProject.location || { lat: 14.5995, lng: 120.9842, address: 'Manila, Philippines' }}
              height="250px"
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Team Management Modal */}
      <Modal 
        isOpen={showTeamModal} 
        onClose={() => setShowTeamModal(false)} 
        title={`Manage Team - ${selectedProject?.name}`}
        size="large"
      >
        {selectedProject && (
          <div className="space-y-6">
            {/* Current Team Members */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Current Team Members</h3>
              {projectTeams[selectedProject.id]?.length > 0 ? (
                <div className="space-y-3">
                  {projectTeams[selectedProject.id].map(member => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img src={member.avatar} className="w-12 h-12 rounded-full" alt={member.name} />
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">{member.role}</p>
                          <p className="text-xs text-gray-400">{member.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Mail size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Phone size={16} />
                        </button>
                        {canEdit && (
                          <button 
                            onClick={() => handleRemoveTeamMember(selectedProject.id, member.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No team members assigned yet</p>
              )}
            </div>

            {/* Add Team Members */}
            {canEdit && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Add Team Members</h3>
                <div className="relative mb-4">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search engineers by name or specialization..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredEngineers
                    .filter(engineer => !projectTeams[selectedProject.id]?.some(member => member.id === engineer.id))
                    .map(engineer => (
                    <div key={engineer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <img src={engineer.avatar} className="w-10 h-10 rounded-full" alt={engineer.name} />
                        <div>
                          <h4 className="font-medium text-gray-900">{engineer.name}</h4>
                          <p className="text-sm text-gray-500">{engineer.role}</p>
                          <p className="text-xs text-gray-400">{engineer.specialization}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleAddTeamMember(selectedProject.id, engineer)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <UserPlus size={14} className="mr-1" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Project Messages Modal */}
      <Modal 
        isOpen={showMessagesModal} 
        onClose={() => setShowMessagesModal(false)} 
        title={`Project Messages - ${selectedProject?.name}`}
        size="large"
      >
        {selectedProject && (
          <div className="flex flex-col h-[600px]">
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-lg">
              {projectMessages[selectedProject.id]?.length > 0 ? (
                projectMessages[selectedProject.id].map(message => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <img src={message.senderAvatar} className="w-8 h-8 rounded-full" alt={message.sender} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-400">{message.timestamp}</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No messages yet in this project</p>
                  <p className="text-sm text-gray-400">Start the conversation with your team!</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="mt-4">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(selectedProject.id);
              }} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={projectMessage}
                  onChange={(e) => setProjectMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Project">
        <form onSubmit={handleUpdateProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input 
              required
              type="text" 
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={editingProject.name}
              onChange={e => setEditingProject({...editingProject, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Scope</label>
            <textarea 
              className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
              value={editingProject.description}
              onChange={e => setEditingProject({...editingProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={editingProject.status}
                onChange={e => setEditingProject({...editingProject, status: e.target.value as any})}
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
              <input 
                type="number" 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={editingProject.budget}
                onChange={e => setEditingProject({...editingProject, budget: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={editingProject.startDate}
                onChange={e => setEditingProject({...editingProject, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={editingProject.endDate}
                onChange={e => setEditingProject({...editingProject, endDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Location</label>
            <LocationPicker
              onLocationSelect={(lat, lng, address) => {
                setEditingProject({
                  ...editingProject,
                  location: { lat, lng, address }
                });
              }}
              initialLocation={editingProject.location || { lat: 14.5995, lng: 120.9842, address: 'Manila, Philippines' }}
              height="250px"
            />
          </div>
          <div className="pt-4 flex space-x-3">
            <button 
              type="button"
              onClick={() => setShowEditModal(false)}
              className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button type="submit" className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center">
              <Save size={18} className="mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
