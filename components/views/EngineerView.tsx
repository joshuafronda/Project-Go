import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { User, Task } from '../../types';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { ClipboardList, Upload, AlertOctagon, CheckSquare, FileText, MessageSquare } from 'lucide-react';

interface EngineerViewProps {
  currentUser: User;
}

export const EngineerView: React.FC<EngineerViewProps> = ({ currentUser }) => {
  const { tasks, updateTask, comments, addComment } = useProject();
  const myTasks = tasks.filter(t => t.assignee === currentUser.id);
  
  const [activeTab, setActiveTab] = useState<'tasks' | 'upload' | 'issues'>('tasks');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commentText, setCommentText] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Operations - PIC</h1>
        <p className="text-gray-500">Execute tasks, update progress reports, and collaborate.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-100">My Tasks</h3>
            <ClipboardList className="text-blue-200" />
          </div>
          <p className="text-3xl font-bold">{myTasks.filter(t => t.status !== 'Done').length} <span className="text-lg font-normal text-blue-200">Active</span></p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-500">Docs Pending</h3>
            <FileText className="text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">5</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
           <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-500">Issues</h3>
            <AlertOctagon className="text-red-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800">0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Navigation */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <nav className="space-y-1">
               {[
                 { id: 'tasks', icon: CheckSquare, label: 'My Tasks' },
                 { id: 'upload', icon: Upload, label: 'Document Upload' },
                 { id: 'issues', icon: AlertOctagon, label: 'Report Issue' },
               ].map((item) => (
                 <button
                   key={item.id}
                   onClick={() => setActiveTab(item.id as any)}
                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium
                     ${activeTab === item.id 
                       ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                       : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                   <item.icon size={18} />
                   <span>{item.label}</span>
                 </button>
               ))}
             </nav>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          {activeTab === 'tasks' && (
            <Card title="Assigned Activities">
              <div className="space-y-4">
                {myTasks.length === 0 ? <p className="text-gray-500 text-center py-4">No tasks assigned.</p> : 
                myTasks.map(task => (
                  <div key={task.id} className="group border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-colors bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <div className="flex items-center space-x-2 mb-1">
                           <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                           <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{task.priority} Priority</span>
                        </div>
                        <h3 className="font-semibold text-gray-800 text-lg cursor-pointer hover:text-blue-600" onClick={() => setSelectedTask(task)}>{task.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">Due: {task.dueDate}</p>
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
                    
                    {/* Progress Slider (Module 4) */}
                    <div className="mt-4">
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

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center"
                      >
                        <MessageSquare size={16} className="mr-1" />
                        Comments
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {/* Upload and Issues tabs would go here... (kept simple for brevity as requested focus is on new modules) */}
        </div>
      </div>

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
  );
};
