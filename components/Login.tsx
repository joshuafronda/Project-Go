import React from 'react';
import { UserRole } from '../types';
import { ArrowRight, LayoutDashboard, Briefcase, HardHat, PieChart } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row h-[600px]">
        
        {/* Left Side: Brand & Hero */}
        <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl font-bold">P</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Project Go</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Unified project management for the modern enterprise. Coordinate finance, engineering, and management in one secure ecosystem.
            </p>
          </div>
          
          <div className="relative z-10">
            <p className="text-sm text-blue-200">© 2024 Project Go Inc.</p>
          </div>

          {/* Abstract circles */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
        </div>

        {/* Right Side: Role Selector */}
        <div className="md:w-1/2 p-12 bg-gray-50 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Select Access Portal</h2>
            <p className="text-gray-500 mt-2">Choose your role to enter the secure dashboard.</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => onLogin(UserRole.PROJECT_OWNER)}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <LayoutDashboard size={20} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">Project Owner</h3>
                <p className="text-xs text-gray-500">Strategic oversight & Approvals</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-blue-500" />
            </button>

             <button 
              onClick={() => onLogin(UserRole.FINANCE)}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <PieChart size={20} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">Finance</h3>
                <p className="text-xs text-gray-500">Budgets & Expenses</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-green-500" />
            </button>

             <button 
              onClick={() => onLogin(UserRole.PROJECT_MANAGER)}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Briefcase size={20} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">Project Manager</h3>
                <p className="text-xs text-gray-500">Tasks, Team, Risks</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-purple-500" />
            </button>

             <button 
              onClick={() => onLogin(UserRole.PROJECT_ENGINEER)}
              className="group flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-left"
            >
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <HardHat size={20} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-semibold text-gray-800">Project Engineer</h3>
                <p className="text-xs text-gray-500">Execution & Reporting</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-orange-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};