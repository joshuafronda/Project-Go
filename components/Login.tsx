import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { ArrowRight, LayoutDashboard, Briefcase, HardHat, PieChart, UserPlus, LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Hardcoded user database
const USER_DB: Record<string, { password: string; user: User }> = {
  'alex.sterling': { password: 'owner123', user: { id: 'u1', name: 'Alex Sterling', role: UserRole.PROJECT_OWNER, avatar: 'https://picsum.photos/seed/alex/100/100' }},
  'sarah.chen': { password: 'finance123', user: { id: 'u2', name: 'Sarah Chen', role: UserRole.FINANCE, avatar: 'https://picsum.photos/seed/sarah/100/100' }},
  'marcus.ford': { password: 'manager123', user: { id: 'u3', name: 'Marcus Ford', role: UserRole.PROJECT_MANAGER, avatar: 'https://picsum.photos/seed/marcus/100/100' }},
  'emily.dao': { password: 'engineer123', user: { id: 'u4', name: 'Emily Dao', role: UserRole.PROJECT_ENGINEER, avatar: 'https://picsum.photos/seed/emily/100/100' }}
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: UserRole.PROJECT_ENGINEER });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userRecord = USER_DB[username];
    if (userRecord && userRecord.password === password) {
      onLogin(userRecord.user);
    } else {
      setError('Invalid credentials');
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== UserRole.PROJECT_OWNER) {
      setError('Only Project Owners can create accounts');
      return;
    }
    
    const newUserData: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      role: newUser.role,
      avatar: `https://picsum.photos/seed/${newUser.username}/100/100`
    };
    
    USER_DB[newUser.username] = { password: newUser.password, user: newUserData };
    onLogin(newUserData);
  };

  if (!isLogin && currentUser && currentUser.role === UserRole.PROJECT_OWNER) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6">Create New Account</h2>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="w-full p-3 border rounded-lg" required />
            <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} className="w-full p-3 border rounded-lg" required />
            <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="w-full p-3 border rounded-lg" required />
            <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})} className="w-full p-3 border rounded-lg">
              <option value={UserRole.PROJECT_OWNER}>Project Owner</option>
              <option value={UserRole.FINANCE}>Finance</option>
              <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
              <option value={UserRole.PROJECT_ENGINEER}>Project Engineer</option>
            </select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Create Account</button>
            <button type="button" onClick={() => setIsLogin(true)} className="w-full text-blue-600 p-2">Back to Login</button>
          </form>
        </div>
      </div>
    );
  }
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

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-12 bg-gray-50 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                required 
              />
            </div>
            
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <LogIn size={20} className="mr-2" />
              Sign In
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => {
                setCurrentUser(USER_DB['alex.sterling'].user);
                setIsLogin(false);
              }}
              className="w-full text-blue-600 p-3 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
            >
              <UserPlus size={20} className="mr-2" />
              Create New Account (Project Owner Only)
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-500">
              <p>alex.sterling / owner123 (Project Owner)</p>
              <p>sarah.chen / finance123 (Finance)</p>
              <p>marcus.ford / manager123 (Project Manager)</p>
              <p>emily.dao / engineer123 (Project Engineer)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};