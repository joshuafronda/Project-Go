import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { LocationPicker } from '../LocationPicker';
import { Project, UserRole, User } from '../../types';
import { Plus, Calendar, Target, DollarSign, BarChart, MapPin } from 'lucide-react';

interface ProjectsViewProps {
  currentUser: User;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ currentUser }) => {
  const { projects, addProject, getProjectProgress } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const canEdit = currentUser.role === UserRole.PROJECT_MANAGER || currentUser.role === UserRole.PROJECT_OWNER;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.startDate) {
      addProject({
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
      } as Project);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Portfolio</h1>
          <p className="text-gray-500">Manage timelines, objectives, and resource allocation.</p>
        </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map(project => {
            const progress = getProjectProgress(project.id);
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
                <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                    <BarChart size={20} className="text-gray-500" />
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
    </div>
  );
};
