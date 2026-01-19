import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Card } from '../ui/Card';
import { FileText, Download, BarChart2, PieChart as PieIcon, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, Legend } from 'recharts';

export const ReportsView: React.FC = () => {
  const { projects, tasks, transactions } = useProject();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.id || 'p1');

  // Calculate mock stats
  const projectTasks = tasks.filter(t => t.projectId === selectedProject);
  const doneTasks = projectTasks.filter(t => t.status === 'Done').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
  const completionRate = projectTasks.length > 0 ? Math.round((doneTasks / projectTasks.length) * 100) : 0;

  const chartData = [
    { name: 'Week 1', completed: 5, planned: 8 },
    { name: 'Week 2', completed: 12, planned: 15 },
    { name: 'Week 3', completed: 18, planned: 22 },
    { name: 'Week 4', completed: doneTasks, planned: projectTasks.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
           <p className="text-gray-500">Generate insights for stakeholders and track KPIs.</p>
        </div>
        <select 
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none w-64"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
        >
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-indigo-100 font-medium">Completion Rate</span>
                  <Activity className="text-indigo-200" />
              </div>
              <div className="text-4xl font-bold mb-2">{completionRate}%</div>
              <div className="text-sm text-indigo-100">Across {projectTasks.length} tasks</div>
          </Card>
          <Card className="bg-white">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Task Velocity</span>
                  <BarChart2 className="text-blue-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{doneTasks + inProgressTasks}</div>
              <div className="text-sm text-gray-500">Tasks active or completed</div>
          </Card>
           <Card className="bg-white">
              <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Budget Health</span>
                  <PieIcon className="text-green-500" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">Good</div>
              <div className="text-sm text-gray-500">Within 5% variance</div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Planned vs Actual Progress">
             <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f8fafc'}} />
                        <Legend />
                        <Bar dataKey="planned" fill="#e2e8f0" radius={[4,4,0,0]} name="Planned Tasks" />
                        <Bar dataKey="completed" fill="#3b82f6" radius={[4,4,0,0]} name="Completed Tasks" />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card title="Available Reports">
              <div className="space-y-4">
                  {[
                      { title: 'Executive Summary', desc: 'High-level overview of project health, budget, and timeline.', type: 'PDF' },
                      { title: 'Financial Audit Log', desc: 'Detailed breakdown of all approved transactions.', type: 'Excel' },
                      { title: 'Risk Assessment', desc: 'Current active risks and mitigation strategies.', type: 'PDF' },
                      { title: 'Resource Utilization', desc: 'Manpower allocation and equipment usage.', type: 'CSV' },
                  ].map((report, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                          <div className="flex items-center">
                              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4">
                                  <FileText size={20} />
                              </div>
                              <div>
                                  <h4 className="font-semibold text-gray-800">{report.title}</h4>
                                  <p className="text-xs text-gray-500">{report.desc}</p>
                              </div>
                          </div>
                          <button className="text-gray-400 hover:text-blue-600 flex items-center text-sm font-medium">
                              <Download size={16} className="mr-1" />
                              {report.type}
                          </button>
                      </div>
                  ))}
              </div>
          </Card>
      </div>
    </div>
  );
};
