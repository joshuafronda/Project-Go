import React, { useState, useCallback, useMemo } from 'react';
import { UserRole } from '../types';
import { ArrowRight, Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from 'lucide-react';

// Types
interface LoginProps {
  onLogin: (role: UserRole) => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginError {
  message: string;
  type: 'validation' | 'authentication';
}

interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

// Constants
const AUTH_CONFIG = {
  USERS: [
    {
      id: 'admin',
      username: 'superadmin',
      password: 'admin2024!',
      role: UserRole.SYSTEM_ADMIN,
      name: 'System Administrator'
    },
    {
      id: 'u1',
      username: 'admin',
      password: 'admin123',
      role: UserRole.PROJECT_OWNER,
      name: 'Alex Sterling'
    },
    {
      id: 'u2',
      username: 'finance',
      password: 'finance123',
      role: UserRole.FINANCE,
      name: 'Sarah Chen'
    },
    {
      id: 'u3',
      username: 'manager',
      password: 'manager123',
      role: UserRole.PROJECT_MANAGER,
      name: 'Marcus Ford'
    },
    {
      id: 'u4',
      username: 'engineer',
      password: 'engineer123',
      role: UserRole.PROJECT_ENGINEER,
      name: 'Emily Dao'
    }
  ] as const,
  SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
} as const;

// Custom Hooks
const useAuth = () => {
  const [formData, setFormData] = useState<LoginFormData>({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<LoginError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = useCallback((field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.username.trim() || !formData.password.trim()) {
      setError({ message: 'Please enter username and password', type: 'validation' });
      return false;
    }

    if (formData.username.length < 3) {
      setError({ message: 'Username must be at least 3 characters', type: 'validation' });
      return false;
    }

    if (formData.password.length < 6) {
      setError({ message: 'Password must be at least 6 characters', type: 'validation' });
      return false;
    }

    return true;
  }, [formData]);

  const authenticate = useCallback((): User | null => {
    const user = AUTH_CONFIG.USERS.find(
      u => u.username === formData.username && u.password === formData.password
    );

    if (!user) {
      setError({ message: 'Invalid username or password', type: 'authentication' });
      return null;
    }

    return user;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent, onSuccess: (role: UserRole) => void) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = authenticate();
    if (user) {
      onSuccess(user.role);
    }

    setIsLoading(false);
  }, [validateForm, authenticate]);

  const resetForm = useCallback(() => {
    setFormData({ username: '', password: '' });
    setShowPassword(false);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    formData,
    showPassword,
    error,
    isLoading,
    updateFormData,
    setShowPassword,
    handleSubmit,
    resetForm
  };
};

// UI Components
const BrandSection: React.FC = () => (
  <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[300px] lg:min-h-full">
    <div className="relative z-10">
      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
        <span className="text-xl sm:text-2xl lg:text-3xl font-bold">P</span>
      </div>
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">Project Go</h1>
      <p className="text-sm sm:text-base lg:text-lg text-blue-100 leading-relaxed">
        Enterprise project management platform. Secure access to your workspace with advanced authentication.
      </p>
    </div>
    
    <div className="relative z-10 space-y-2 lg:space-y-4">
      <div className="flex items-center space-x-2 text-blue-200">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-xs sm:text-sm lg:text-sm">System Status: Online</span>
      </div>
      <p className="text-xs sm:text-sm lg:text-sm text-blue-200">© 2024 Project Go Inc.</p>
    </div>

    <div className="absolute -top-12 -right-12 sm:-top-16 sm:-right-16 lg:-top-20 lg:-right-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
    <div className="absolute -bottom-12 -left-12 sm:-bottom-16 sm:-left-16 lg:-bottom-20 lg:-left-20 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-indigo-600 rounded-full blur-3xl opacity-50"></div>
  </div>
);

const InputField: React.FC<{
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
  showToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}> = ({ label, type, value, onChange, placeholder, icon, disabled, showToggle, showPassword, onTogglePassword }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 placeholder-gray-400 text-sm sm:text-base"
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : 'username'}
      />
      {showToggle && onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center disabled:opacity-50"
        >
          {showPassword ? (
            <EyeOff size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
          ) : (
            <Eye size={18} className="text-gray-400 hover:text-gray-600 transition-colors" />
          )}
        </button>
      )}
    </div>
  </div>
);

const ErrorMessage: React.FC<{ error: LoginError | null }> = ({ error }) => {
  if (!error) return null;

  const errorStyles = error.type === 'validation' 
    ? 'bg-amber-500 border-amber-600 text-white'
    : 'bg-red-500 border-red-600 text-white';

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl border shadow-lg flex items-center ${errorStyles} backdrop-blur-sm`}>
        <AlertCircle size={18} className="mr-3 flex-shrink-0" />
        <span className="font-medium text-sm sm:text-base">{error.message}</span>
      </div>
    </div>
  );
};

const DemoCredentials: React.FC = () => {
  const [showCredentials, setShowCredentials] = useState(false);

  return (
    <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
      <button
        onClick={() => setShowCredentials(!showCredentials)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-xs sm:text-sm font-medium text-gray-700">Demo Credentials</span>
        <span className="text-xs text-gray-500">
          {showCredentials ? 'Hide' : 'Show'}
        </span>
      </button>
      
      {showCredentials && (
        <div className="mt-3 sm:mt-4 space-y-2">
          {AUTH_CONFIG.USERS.map(user => (
            <div key={user.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 bg-white rounded-lg text-xs">
              <span className="font-medium mb-1 sm:mb-0">{user.name} ({user.role.replace('_', ' ')})</span>
              <span className="text-gray-500">{user.username} / {user.password}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const {
    formData,
    showPassword,
    error,
    isLoading,
    updateFormData,
    setShowPassword,
    handleSubmit
  } = useAuth();

  const memoizedUsers = useMemo(() => AUTH_CONFIG.USERS, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4">
      {/* Overlay Error Message */}
      <ErrorMessage error={error} />
      
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
        
        <BrandSection />

        <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 bg-gray-50 flex flex-col justify-center">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm sm:text-base text-gray-600">Sign in to access your project dashboard</p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, onLogin)} className="space-y-4 sm:space-y-6">
            <InputField
              label="Username"
              type="text"
              value={formData.username}
              onChange={(value) => updateFormData('username', value)}
              placeholder="Enter your username"
              icon={<User size={18} className="text-gray-400" />}
              disabled={isLoading}
            />

            <InputField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(value) => updateFormData('password', value)}
              placeholder="Enter your password"
              icon={<Lock size={18} className="text-gray-400" />}
              disabled={isLoading}
              showToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <DemoCredentials />

          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-500">
            <p>Secure authentication • Enterprise grade</p>
          </div>
        </div>
      </div>
    </div>
  );
};
