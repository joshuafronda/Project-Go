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
import { ProjectsView } from './components/views/ProjectsView';
import { MessagesView } from './components/views/MessagesView';
import { DocumentsView } from './components/views/DocumentsView';
import { ReportsView } from './components/views/ReportsView';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('Dashboard');

  const handleLogin = (user: User) => {
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
    
    // For "Tasks" or "Dashboard" we map to role specific view for now, 
    // though ideally tasks would be a unified view too.
    // Keeping role specific dashboards as the "Home" view.
    if (currentView === 'Dashboard' || currentView === 'Tasks') {
        switch (currentUser.role) {
        case UserRole.PROJECT_OWNER:
            return <ProjectOwnerView />;
        case UserRole.FINANCE:
            return <FinanceView />;
        case UserRole.PROJECT_MANAGER:
            return <ManagerView currentUser={currentUser} />;
        case UserRole.PROJECT_ENGINEER:
            return <EngineerView currentUser={currentUser} />;
        default:
            return <div>Role not recognized</div>;
        }
    }
    
    return <div className="p-10 text-center text-gray-500">Module under construction</div>;
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
