import React, { useState } from 'react';
import { Card, StatCard } from '../ui/Card';
import { INITIAL_MILESTONES } from '../../constants';
import { useProject } from '../../context/ProjectContext';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Target, GitPullRequest, ArrowUpRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const dataProgress = [
  { name: 'Jan', completed: 10, planned: 15 },
  { name: 'Feb', completed: 25, planned: 30 },
  { name: 'Mar', completed: 45, planned: 45 },
  { name: 'Apr', completed: 60, planned: 65 },
  { name: 'May', completed: 72, planned: 80 },
];

const dataBudget = [
  { name: 'Materials', value: 45 },
  { name: 'Labor', value: 30 },
  { name: 'Ops', value: 15 },
  { name: 'Contingency', value: 10 },
];

export const ProjectOwnerView: React.FC = () => {
  const { changeRequests, updateChangeRequest } = useProject();
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals'>('overview');

  const approveMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => m.id === id ? { ...m, status: 'Completed' as const } : m));
  };

  const pendingChanges = changeRequests.filter(c => c.status === 'Pending');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
            <p className="text-gray-500">Welcome back. High-level status and strategic decisions.</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveTab('approvals')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'approvals' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-900'}`}
            >
                Approvals <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs">{pendingChanges.length}</span>
            </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Budget" value="$4.2M" icon={<TrendingUp size={24} />} trend="2.4%" trendUp={true} />
            <StatCard label="Project Completion" value="68%" icon={<Target size={24} />} trend="On Track" trendUp={true} />
            <StatCard label="Active Risks" value="3" icon={<AlertTriangle size={24} />} trend="1 New" trendUp={false} />
            <StatCard label="Decision Velocity" value="High" icon={<ArrowUpRight size={24} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Project Velocity" className="lg:col-span-2">
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataProgress}>
                    <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="completed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCompleted)" />
                    <Area type="monotone" dataKey="planned" stroke="#94a3b8" strokeDasharray="5 5" fill="none" />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            </Card>

            <Card title="Milestone Tracker">
            <div className="space-y-6 relative pl-4 border-l-2 border-gray-200 ml-2">
                {[
                { title: 'Project Initiation', date: 'Jan 2023', active: false, completed: true },
                { title: 'Structural Completion', date: 'Aug 2023', active: false, completed: true },
                { title: 'Interior Fit-out', date: 'Current', active: true, completed: false },
                { title: 'System Testing', date: 'Dec 2023', active: false, completed: false },
                { title: 'Handover', date: 'Jan 2024', active: false, completed: false },
                ].map((step, idx) => (
                <div key={idx} className="relative pl-6">
                    <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-blue-600 border-blue-600' : step.active ? 'bg-white border-blue-600 animate-pulse' : 'bg-white border-gray-300'}`}></div>
                    <h4 className={`font-medium ${step.active ? 'text-blue-600' : 'text-gray-800'}`}>{step.title}</h4>
                    <p className="text-sm text-gray-500">{step.date}</p>
                </div>
                ))}
            </div>
            </Card>
        </div>
      </>
      ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card title="Change Requests (Module 9)">
                  <div className="space-y-4">
                      {changeRequests.filter(c => c.status === 'Pending').length === 0 ? (
                          <div className="text-center py-8 text-gray-500">No pending change requests.</div>
                      ) : (
                          changeRequests.filter(c => c.status === 'Pending').map(req => (
                              <div key={req.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                                  <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-gray-800">{req.title}</h4>
                                      <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">{req.status}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-3">{req.description}</p>
                                  <div className="grid grid-cols-2 gap-4 text-sm mb-4 bg-gray-50 p-3 rounded-lg">
                                      <div>
                                          <p className="text-gray-500">Cost Impact</p>
                                          <p className="font-bold text-red-600">+${req.impactCost}</p>
                                      </div>
                                      <div>
                                          <p className="text-gray-500">Time Impact</p>
                                          <p className="font-bold text-red-600">+{req.impactTime} Days</p>
                                      </div>
                                  </div>
                                  <div className="flex space-x-3">
                                      <button 
                                        onClick={() => updateChangeRequest(req.id, 'Approved')}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm hover:bg-green-700"
                                      >
                                          Approve
                                      </button>
                                      <button 
                                        onClick={() => updateChangeRequest(req.id, 'Rejected')}
                                        className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50"
                                      >
                                          Reject
                                      </button>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              </Card>

              <Card title="Milestone Approvals">
                <div className="space-y-4">
                    {milestones.filter(m => m.status === 'Pending Approval').map(milestone => (
                        <div key={milestone.id} className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{milestone.title}</h4>
                            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">Pending</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Milestone reached on {milestone.date}. Ready for review.</p>
                        <div className="flex space-x-2">
                            <button 
                            onClick={() => approveMilestone(milestone.id)}
                            className="flex-1 bg-green-600 text-white text-sm py-2 rounded-lg hover:bg-green-700 transition"
                            >
                            Approve
                            </button>
                            <button className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm py-2 rounded-lg hover:bg-gray-50 transition">
                            Review
                            </button>
                        </div>
                        </div>
                    ))}
                    {milestones.filter(m => m.status === 'Pending Approval').length === 0 && (
                        <div className="text-center py-8 text-gray-500">No milestones pending approval.</div>
                    )}
                </div>
              </Card>
          </div>
      )}
    </div>
  );
};
