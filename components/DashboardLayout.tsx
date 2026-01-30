import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { useProject } from '../context/ProjectContext';
import { 
  LayoutDashboard, 
  PieChart, 
  Briefcase, 
  HardHat, 
  LogOut, 
  Menu, 
  X,
  Settings,
  Bell,
  Search,
  FileText,
  Users,
  BarChart3,
  FolderDot,
  HelpCircle,
  ChevronRight,
  MessageSquare,
  FileCheck,
  ClipboardList,
  Shield
} from 'lucide-react';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, currentView, onNavigate, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { notifications, markNotificationRead } = useProject();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleMeta = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN: return { icon: Users, label: 'Admin', color: 'bg-purple-600' };
      case UserRole.PROJECT_OWNER: return { icon: LayoutDashboard, label: 'Executive', color: 'bg-blue-600' };
      case UserRole.FINANCE: return { icon: PieChart, label: 'Finance', color: 'bg-green-600' };
      case UserRole.PROJECT_MANAGER: return { icon: Briefcase, label: 'Manager', color: 'bg-purple-600' };
      case UserRole.PROJECT_ENGINEER: return { icon: HardHat, label: 'Engineer', color: 'bg-orange-600' };
      default: return { icon: LayoutDashboard, label: 'User', color: 'bg-gray-600' };
    }
  };

  const getNavigationItems = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return [
          { section: 'Account Management', items: [
            { icon: Users, label: 'User Accounts', id: 'Dashboard' },
          ]}
        ];
      
      case UserRole.PROJECT_OWNER:
        return [
          { section: 'Overview', items: [
            { icon: roleMeta.icon, label: 'Executive Dashboard', id: 'Dashboard' },
            { icon: BarChart3, label: 'Reports & Analytics', id: 'Reports' }
          ]},
          { section: 'Portfolio', items: [
            { icon: FolderDot, label: 'All Projects', id: 'Projects' },
            { icon: PieChart, label: 'Financial Overview', id: 'Finance' },
            { icon: Users, label: 'Team Performance', id: 'Team' }
          ]},
          { section: 'Governance', items: [
            { icon: FileCheck, label: 'Approvals', id: 'Approvals' },
            { icon: MessageSquare, label: 'Executive Messages', id: 'Messages' }
          ]}
        ];
      
      case UserRole.FINANCE:
        return [
          { section: 'Financial Overview', items: [
            { icon: roleMeta.icon, label: 'Finance Dashboard', id: 'Dashboard' },
            { icon: BarChart3, label: 'Financial Reports', id: 'Reports' }
          ]},
          { section: 'Budget Management', items: [
            { icon: FolderDot, label: 'Project Budgets', id: 'Projects' },
            { icon: FileText, label: 'Transactions', id: 'Transactions' },
            { icon: PieChart, label: 'Expense Tracking', id: 'Expenses' }
          ]},
          { section: 'Communication', items: [
            { icon: MessageSquare, label: 'Finance Messages', id: 'Messages' },
            { icon: Users, label: 'Finance Team', id: 'Team' }
          ]}
        ];
      
      case UserRole.PROJECT_MANAGER:
        return [
          { section: 'Management', items: [
            { icon: roleMeta.icon, label: 'Manager Dashboard', id: 'Dashboard' },
            { icon: BarChart3, label: 'Project Analytics', id: 'Reports' }
          ]},
          { section: 'Projects', items: [
            { icon: FolderDot, label: 'My Projects', id: 'Projects' },
            { icon: Briefcase, label: 'Task Management', id: 'Tasks' },
            { icon: Users, label: 'Team Management', id: 'Team' }
          ]},
          { section: 'Operations', items: [
            { icon: MessageSquare, label: 'Team Messages', id: 'Messages' },
            { icon: FileText, label: 'Project Documents', id: 'Documents' }
          ]}
        ];
      
      case UserRole.PROJECT_ENGINEER:
        return [
          { section: 'Workspace', items: [
            { icon: roleMeta.icon, label: 'Engineer Dashboard', id: 'Dashboard' },
            { icon: Briefcase, label: 'My Tasks', id: 'Tasks' }
          ]},
          { section: 'Projects', items: [
            { icon: FolderDot, label: 'Assigned Projects', id: 'Projects' },
            { icon: FileText, label: 'Project Documents', id: 'Documents' }
          ]},
          { section: 'Communication', items: [
            { icon: MessageSquare, label: 'Team Messages', id: 'Messages' },
            { icon: Users, label: 'Project Team', id: 'Team' }
          ]}
        ];
      
      default:
        return [
          { section: 'Overview', items: [
            { icon: LayoutDashboard, label: 'Dashboard', id: 'Dashboard' }
          ]}
        ];
    }
  };

  const roleMeta = getRoleMeta(user.role);

  const NavItem = ({ icon: Icon, label, id, ...props }: { icon: any, label: string, id: string, [key: string]: any }) => {
    const isActive = currentView === id;
    return (
      <button
        onClick={() => { onNavigate(id); setIsSidebarOpen(false); }}
        className={`
          w-full flex items-center justify-between px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 group relative overflow-hidden
          ${isActive 
            ? 'bg-blue-600 shadow-lg shadow-blue-900/40 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
        `}
      >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 z-[-1]"></div>}
        
        <div className="flex items-center space-x-2 sm:space-x-3 z-10 min-w-0 flex-1">
          <Icon size={16} className="sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="font-medium text-xs sm:text-sm tracking-wide truncate">{label}</span>
        </div>
        {isActive && <ChevronRight size={14} className="text-blue-200 animate-in fade-in slide-in-from-left-1 flex-shrink-0" />}
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-72 sm:w-80 bg-[#0B1120] text-white transform transition-transform duration-300 ease-out flex flex-col border-r border-slate-800 shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-20 sm:h-24 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3">
             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
               <span className="font-bold text-white text-sm sm:text-xl leading-none font-sans">P</span>
             </div>
             <div className="flex flex-col">
               <h1 className="font-bold text-lg sm:text-xl tracking-tight text-white leading-tight">Project <span className="text-blue-500">Go</span></h1>
               <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase tracking-widest font-bold hidden sm:block">Enterprise OS</p>
             </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white transition-colors p-1">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2 sm:px-3 lg:px-4 space-y-6 sm:space-y-8 scrollbar-hide">
          {getNavigationItems(user.role).map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="px-2 sm:px-3 lg:px-4 mb-3 sm:mb-4 flex items-center justify-between group">
                <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">
                  {section.section}
                </span>
              </div>
              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <NavItem 
                    key={`${sectionIndex}-${itemIndex}`}
                    icon={item.icon} 
                    label={item.label} 
                    id={item.id} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 sm:p-4 bg-[#0f1629] border-t border-slate-800/50">
           <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 transition-all cursor-pointer group">
             <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-slate-600 group-hover:border-blue-500 transition-colors object-cover" />
                <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 border-2 border-[#0f1629] rounded-full"></span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-xs sm:text-sm font-semibold text-white truncate">{user.name}</p>
               <p className="text-[10px] sm:text-xs text-slate-400 truncate">{roleMeta.label}</p>
             </div>
             <button 
               onClick={onLogout}
               className="p-1.5 sm:p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
             >
               <LogOut size={14} className="sm:w-4 sm:h-4" />
             </button>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]"> 
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-20 px-3 sm:px-4 lg:px-8 flex items-center justify-between">
           <div className="flex items-center">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-3 sm:mr-4"
            >
              <Menu size={20} className="sm:w-6 sm:h-6" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 hidden md:block tracking-tight">
               {currentView === 'Dashboard' ? `${roleMeta.label} Overview` : currentView}
            </h2>
           </div>

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-6">
             <div className="hidden sm:flex items-center bg-slate-100/50 rounded-full px-3 py-2 sm:px-4 sm:py-2.5 w-48 sm:w-72 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <Search size={16} className="sm:w-4 sm:h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-slate-700 placeholder-slate-400"
                />
             </div>

             <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

             <div className="relative">
                 <button 
                   onClick={() => setIsNotifOpen(!isNotifOpen)}
                   className="relative p-2 sm:p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hover:text-blue-600"
                 >
                   <Bell size={18} className="sm:w-5 sm:h-5" />
                   {unreadCount > 0 && <span className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                 </button>

                 {/* Notification Dropdown */}
                 {isNotifOpen && (
                   <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-in zoom-in-95 duration-200">
                     <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-50 flex justify-between items-center">
                       <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Notifications</h3>
                       <span className="text-xs text-gray-500">{unreadCount} New</span>
                     </div>
                     <div className="max-h-72 sm:max-h-80 overflow-y-auto">
                        {notifications.length === 0 && <p className="p-3 sm:p-4 text-center text-gray-500 text-sm">No new notifications.</p>}
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2 sm:p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className={`mt-1 w-2 h-2 rounded-full mr-2 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                              <div>
                                <h4 className={`text-xs sm:text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>{n.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{n.message}</p>
                                <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                     </div>
                     <div className="p-2 border-t border-gray-50 text-center">
                       <button onClick={() => setIsNotifOpen(false)} className="text-xs text-blue-600 font-medium hover:underline">Close</button>
                     </div>
                   </div>
                 )}
              </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
             {children}
          </div>
        </main>
      </div>

    </div>
  );
};
