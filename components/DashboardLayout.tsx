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
  ClipboardList
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
      case UserRole.PROJECT_OWNER: return { icon: LayoutDashboard, label: 'Executive' };
      case UserRole.FINANCE: return { icon: PieChart, label: 'Finance' };
      case UserRole.PROJECT_MANAGER: return { icon: Briefcase, label: 'Manager' };
      case UserRole.PROJECT_ENGINEER: return { icon: HardHat, label: 'Engineer' };
      default: return { icon: LayoutDashboard, label: 'User' };
    }
  };

  const roleMeta = getRoleMeta(user.role);

  const NavItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: string }) => {
    const isActive = currentView === id;
    return (
      <button
        onClick={() => { onNavigate(id); setIsSidebarOpen(false); }}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden
          ${isActive 
            ? 'bg-blue-600 shadow-lg shadow-blue-900/40 text-white' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
        `}
      >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-100 z-[-1]"></div>}
        
        <div className="flex items-center space-x-3 z-10">
          <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'} />
          <span className="font-medium text-sm tracking-wide">{label}</span>
        </div>
        {isActive && <ChevronRight size={16} className="text-blue-200 animate-in fade-in slide-in-from-left-1" />}
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
          fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0B1120] text-white transform transition-transform duration-300 ease-out flex flex-col border-r border-slate-800 shadow-2xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
               <span className="font-bold text-white text-xl leading-none font-sans">P</span>
             </div>
             <div className="flex flex-col">
               <h1 className="font-bold text-xl tracking-tight text-white leading-tight">Project <span className="text-blue-500">Go</span></h1>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Enterprise OS</p>
             </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-4 space-y-8 scrollbar-hide">
          
          <div>
            <div className="px-4 mb-4 flex items-center justify-between group">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Overview</span>
            </div>
            <div className="space-y-1">
              <NavItem icon={roleMeta.icon} label={`${roleMeta.label} Dashboard`} id="Dashboard" />
              <NavItem icon={ClipboardList} label="Reports & Analytics" id="Reports" />
            </div>
          </div>

          <div>
            <div className="px-4 mb-4 flex items-center justify-between group">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Workspace</span>
            </div>
            <div className="space-y-1">
              <NavItem icon={FolderDot} label="Projects" id="Projects" />
              <NavItem icon={Briefcase} label="All Tasks" id="Tasks" />
              <NavItem icon={FileText} label="Documents" id="Documents" />
            </div>
          </div>

          <div>
            <div className="px-4 mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Communication</span>
            </div>
            <div className="space-y-1">
              <NavItem icon={MessageSquare} label="Messages" id="Messages" />
              <NavItem icon={Users} label="Team" id="Team" />
            </div>
          </div>

          <div>
            <div className="px-4 mb-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">System</span>
            </div>
            <div className="space-y-1">
              <NavItem icon={Settings} label="Settings" id="Settings" />
              <NavItem icon={HelpCircle} label="Help & Support" id="Help" />
            </div>
          </div>

        </div>

        <div className="p-4 bg-[#0f1629] border-t border-slate-800/50">
           <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/30 hover:bg-slate-800/60 border border-slate-700/30 transition-all cursor-pointer group">
             <div className="relative">
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-600 group-hover:border-blue-500 transition-colors object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0f1629] rounded-full"></span>
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold text-white truncate">{user.name}</p>
               <p className="text-xs text-slate-400 truncate group-hover:text-blue-400 transition-colors">{user.role.replace('_', ' ').toLowerCase()}</p>
             </div>
             <button 
               onClick={(e) => { e.stopPropagation(); onLogout(); }}
               className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
               title="Sign out"
             >
               <LogOut size={18} />
             </button>
           </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]"> 
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-20 px-4 lg:px-8 flex items-center justify-between">
           <div className="flex items-center">
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg mr-4"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block tracking-tight">
               {currentView === 'Dashboard' ? `${roleMeta.label} Overview` : currentView}
             </h2>
           </div>

          <div className="flex items-center space-x-3 md:space-x-6">
             <div className="hidden md:flex items-center bg-slate-100/50 rounded-full px-4 py-2.5 w-72 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <Search size={18} className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder-slate-400"
                />
              </div>

              <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

              <div className="relative">
                 <button 
                   onClick={() => setIsNotifOpen(!isNotifOpen)}
                   className="relative p-2.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hover:text-blue-600"
                 >
                   <Bell size={20} />
                   {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                 </button>

                 {/* Notification Dropdown */}
                 {isNotifOpen && (
                   <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 animate-in zoom-in-95 duration-200">
                     <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                       <h3 className="font-semibold text-gray-800">Notifications</h3>
                       <span className="text-xs text-gray-500">{unreadCount} New</span>
                     </div>
                     <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">No new notifications.</p>}
                        {notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className={`mt-1 w-2 h-2 rounded-full mr-2 ${n.type === 'alert' ? 'bg-red-500' : n.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                              <div>
                                <h4 className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>{n.title}</h4>
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

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
             {children}
          </div>
        </main>
      </div>

    </div>
  );
};
