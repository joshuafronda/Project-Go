import React, { useState } from 'react';
import { UserRole, User } from './types';
import { MOCK_USERS } from './constants';
import { ProjectProvider } from './context/ProjectContext';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { ProjectOwnerView } from './components/views/ProjectOwnerView';
import { FinanceView } from './components/views/FinanceView';
import { ManagerView } from './components/views/ManagerView';
import { EngineerView } from './components/views/EngineerView';
import { SystemAdminView } from './components/views/SystemAdminView';
import { ProjectsView } from './components/views/ProjectsView';
import { MessagesView } from './components/views/MessagesView';
import { DocumentsView } from './components/views/DocumentsView';
import { ReportsView } from './components/views/ReportsView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('Dashboard');

  const handleLogin = (role: UserRole) => {
    // Simulate auth
    const user = MOCK_USERS[role];
    setCurrentUser(user);
    setCurrentView('Dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (currentView === 'Projects') return <ProjectsView currentUser={currentUser} />;
    if (currentView === 'Messages') return <MessagesView currentUser={currentUser} />;
    if (currentView === 'Documents') return <DocumentsView currentUser={currentUser} />;
    if (currentView === 'Reports') return <ReportsView />;

    switch (currentUser.role) {
      case UserRole.SYSTEM_ADMIN:
        return <SystemAdminView currentUser={currentUser} />;
      case UserRole.PROJECT_OWNER:
        return <ProjectOwnerView />;
      case UserRole.FINANCE:
        return <FinanceView />;
      case UserRole.PROJECT_MANAGER:
        return <ManagerView />;
      case UserRole.PROJECT_ENGINEER:
        return <EngineerView />;
      default:
        return <div>Role not found</div>;
    }
  };

  const getRoleMeta = (role: UserRole) => {
    switch (role) {
      case UserRole.SYSTEM_ADMIN:
        return {
          title: 'System Administrator',
          icon: '🛡️',
          color: 'bg-purple-600',
          description: 'System management and user administration'
        };
      case UserRole.PROJECT_OWNER:
        return {
          title: 'Project Owner',
          icon: '👔',
          color: 'bg-blue-600',
          description: 'Strategic oversight & Approvals'
        };
      case UserRole.FINANCE:
        return {
          title: 'Finance',
          icon: '💰',
          color: 'bg-green-600',
          description: 'Budgets & Expenses'
        };
      case UserRole.PROJECT_MANAGER:
        return {
          title: 'Project Manager',
          icon: '📋',
          color: 'bg-purple-600',
          description: 'Tasks, Team, Risks'
        };
      case UserRole.PROJECT_ENGINEER:
        return {
          title: 'Project Engineer',
          icon: '🔧',
          color: 'bg-orange-600',
          description: 'Execution & Reporting'
        };
      default:
        return {
          title: 'User',
          icon: '👤',
          color: 'bg-gray-600',
          description: 'System User'
        };
    }
  };

  return (
    <ProjectProvider>
      <DashboardLayout 
        user={currentUser} 
        onLogout={handleLogout} 
        currentView={currentView}
        onNavigate={setCurrentView}
      >
      {renderContent()}
      </DashboardLayout>
    </ProjectProvider>
  );
};

export default App;
