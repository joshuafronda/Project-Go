import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { User, Task } from '../../types';
import { Modal } from '../ui/Modal';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Calendar, Users, AlertCircle, Plus } from 'lucide-react';

interface ManagerViewProps {
  currentUser: User;
}

export const ManagerView: React.FC<ManagerViewProps> = ({ currentUser }) => {
  const { tasks, updateTask, addTask, projects } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    priority: 'Medium',
    projectId: 'p1',
    assignee: 'u4', // Default to Engineer
    dueDate: ''
  });

  const statuses: Task['status'][] = ['Todo', 'In Progress', 'Review', 'Done'];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    updateTask(result.draggableId, {
      status: result.destination.droppableId as Task['status']
    });
  };

  const getPriorityColor = (p: string) => {
    if (p === 'High') return 'bg-red-100 text-red-700';
    if (p === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if(newTask.title && newTask.projectId) {
        addTask({
            id: 't' + Date.now(),
            projectId: newTask.projectId,
            title: newTask.title,
            description: newTask.description || '',
            assignee: newTask.assignee || 'u4',
            assigneeName: newTask.assignee === 'u4' ? 'Emily Dao' : 'Marcus Ford', // Simple mock lookup
            status: 'Todo',
            priority: newTask.priority as any,
            dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
            progress: 0,
            dependencies: []
        });
        setIsModalOpen(false);
        setNewTask({ title: '', priority: 'Medium', projectId: 'p1', assignee: 'u4', dueDate: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-500">Track tasks, manage team workload, and mitigate risks.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-blue-700 transition"
        >
          <Plus size={18} className="mr-2" />
          Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><Users size={24}/></div>
          <div>
            <p className="text-gray-500 text-sm">Active Tasks</p>
            <p className="font-bold text-xl text-gray-900">{tasks.filter(t => t.status !== 'Done').length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Calendar size={24}/></div>
          <div>
            <p className="text-gray-500 text-sm">Schedule Variance</p>
            <p className="font-bold text-xl text-gray-900">-2 Days</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><AlertCircle size={24}/></div>
          <div>
            <p className="text-gray-500 text-sm">High Priority</p>
            <p className="font-bold text-xl text-gray-900">{tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length}</p>
          </div>
        </div>
      </div>

      <div className="h-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statuses.map(status => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100/50 p-4 rounded-xl min-h-[500px] flex flex-col"
                  >
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                      {status}
                      <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                        {tasks.filter(t => t.status === status).length}
                      </span>
                    </h3>
                    <div className="space-y-3 flex-1">
                      {tasks.filter(t => t.status === status).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-grab"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              <h4 className="font-medium text-gray-800 text-sm mb-3">{task.title}</h4>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                <div className="flex items-center text-xs text-gray-500">
                                  <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-1 text-[10px] font-bold">
                                    {task.assigneeName.charAt(0)}
                                  </div>
                                  {task.assigneeName.split(' ')[0]}
                                </div>
                                <span className="text-xs text-gray-400">{task.dueDate.slice(5)}</span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
                <select 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTask.projectId}
                    onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                    required
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select 
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newTask.priority}
                        onChange={e => setNewTask({...newTask, priority: e.target.value as any})}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                     <input 
                        type="date"
                        required
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        value={newTask.dueDate}
                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                     />
                </div>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                 <select 
                    className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newTask.assignee}
                    onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                 >
                    <option value="u4">Emily Dao (Engineer)</option>
                    <option value="u3">Marcus Ford (Manager)</option>
                 </select>
            </div>
             <div className="pt-4">
                <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">
                Create Task
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};
