import React, { useState } from 'react';
import { UserRole, User } from '../../types';
import { 
  Users, 
  Shield, 
  Settings, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  X,
  Mail,
  Phone,
  Building
} from 'lucide-react';

interface SystemAdminViewProps {
  currentUser: User;
}

export const SystemAdminView: React.FC<SystemAdminViewProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: UserRole.PROJECT_ENGINEER,
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Edit user form state
  const [editUser, setEditUser] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: UserRole.PROJECT_ENGINEER
  });

  const [resetPasswordData, setResetPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Mock data - in real app, this would come from API
  const [users, setUsers] = useState<User[]>([
    {
      id: 'u1',
      name: 'Alex Sterling',
      role: UserRole.PROJECT_OWNER,
      avatar: 'https://picsum.photos/seed/alex/100/100'
    },
    {
      id: 'u2',
      name: 'Sarah Chen',
      role: UserRole.FINANCE,
      avatar: 'https://picsum.photos/seed/sarah/100/100'
    },
    {
      id: 'u3',
      name: 'Marcus Ford',
      role: UserRole.PROJECT_MANAGER,
      avatar: 'https://picsum.photos/seed/marcus/100/100'
    },
    {
      id: 'u4',
      name: 'Emily Dao',
      role: UserRole.PROJECT_ENGINEER,
      avatar: 'https://picsum.photos/seed/emily/100/100'
    }
  ]);

  const stats = {
    totalUsers: users.length,
    activeUsers: users.length,
    systemHealth: 98.5,
    lastBackup: '2 hours ago'
  };

  const roleColors = {
    [UserRole.SYSTEM_ADMIN]: 'bg-purple-100 text-purple-800 border-purple-200',
    [UserRole.PROJECT_OWNER]: 'bg-blue-100 text-blue-800 border-blue-200',
    [UserRole.FINANCE]: 'bg-green-100 text-green-800 border-green-200',
    [UserRole.PROJECT_MANAGER]: 'bg-orange-100 text-orange-800 border-orange-200',
    [UserRole.PROJECT_ENGINEER]: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const validateNewUser = (): boolean => {
    const errors: Record<string, string> = {};

    if (!newUser.name.trim()) errors.name = 'Name is required';
    if (!newUser.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(newUser.email)) errors.email = 'Invalid email format';
    if (!newUser.phone.trim()) errors.phone = 'Phone is required';
    if (!newUser.department.trim()) errors.department = 'Department is required';
    if (!newUser.username.trim()) errors.username = 'Username is required';
    if (newUser.username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!newUser.password.trim()) errors.password = 'Password is required';
    if (newUser.password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = () => {
    if (!validateNewUser()) return;

    // Create new user object
    const user: User = {
      id: `u${Date.now()}`,
      name: newUser.name,
      role: newUser.role,
      avatar: `https://picsum.photos/seed/${newUser.username}/100/100`
    };

    // Add user to list (in real app, this would be an API call)
    setUsers(prev => [...prev, user]);

    // Reset form and close modal
    setNewUser({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: UserRole.PROJECT_ENGINEER,
      username: '',
      password: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setShowAddUserModal(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: '', // Would come from user data
      phone: '', // Would come from user data
      department: '', // Would come from user data
      role: user.role
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    // Update user in list (in real app, this would be an API call)
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id 
        ? { ...user, name: editUser.name, role: editUser.role }
        : user
    ));

    // Reset form and close modal
    setEditUser({
      name: '',
      email: '',
      phone: '',
      department: '',
      role: UserRole.PROJECT_ENGINEER
    });
    setSelectedUser(null);
    setShowEditUserModal(false);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    // Remove user from list (in real app, this would be an API call)
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));

    // Reset and close modal
    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setResetPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    setShowResetPasswordModal(true);
  };

  const confirmResetPassword = () => {
    if (!selectedUser) return;

    // Validate passwords
    if (resetPasswordData.newPassword.length < 8) {
      setFormErrors({ newPassword: 'Password must be at least 8 characters' });
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setFormErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    // Reset password (in real app, this would be an API call)
    console.log(`Password reset for user ${selectedUser.name}: ${resetPasswordData.newPassword}`);

    // Reset form and close modal
    setResetPasswordData({
      newPassword: '',
      confirmPassword: ''
    });
    setFormErrors({});
    setSelectedUser(null);
    setShowResetPasswordModal(false);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage user accounts and system security</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
            <Download size={16} className="mr-2" />
            Export Users
          </button>
          <button 
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <Plus size={16} className="mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Active Users</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={20} className="sm:w-6 sm:h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">System Health</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.systemHealth}%</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield size={20} className="sm:w-6 sm:h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Last Backup</p>
              <p className="text-base sm:text-lg font-bold text-gray-900">{stats.lastBackup}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={20} className="sm:w-6 sm:h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-6 lg:space-x-8 px-3 sm:px-4 lg:px-6 min-w-max">
            {[
              { id: 'users', label: 'User Accounts', icon: Users },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'settings', label: 'System Settings', icon: Settings },
              { id: 'logs', label: 'Activity Logs', icon: Activity }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center py-3 sm:py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} className="sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'users' && (
            <div>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                <button className="flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base">
                  <Filter size={16} className="mr-2" />
                  Filter by Role
                </button>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                >
                  <option value="all">All Roles</option>
                  <option value={UserRole.PROJECT_OWNER}>Project Owner</option>
                  <option value={UserRole.FINANCE}>Finance</option>
                  <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                  <option value={UserRole.PROJECT_ENGINEER}>Project Engineer</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider">User</th>
                      <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider">Role</th>
                      <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider hidden sm:table-cell">Status</th>
                      <th className="text-left py-2 px-2 sm:px-3 font-medium text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider hidden md:table-cell">Last Login</th>
                      <th className="text-right py-2 px-2 sm:px-3 font-medium text-gray-600 text-[10px] sm:text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-2 sm:px-3">
                          <div className="flex items-center">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 sm:mr-3 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-[11px] sm:text-sm truncate">{user.name}</p>
                              <p className="text-[9px] sm:text-xs text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-2 sm:px-3">
                          <span className={`inline-block px-1.5 py-0.5 sm:px-2 sm:py-1 text-[9px] sm:text-xs font-medium rounded-full border ${roleColors[user.role]}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-2 px-2 sm:px-3 hidden sm:table-cell">
                          <span className="flex items-center text-green-600">
                            <CheckCircle size={12} className="mr-1" />
                            <span className="text-[9px] sm:text-xs">Active</span>
                          </span>
                        </td>
                        <td className="py-2 px-2 sm:px-3 text-[9px] sm:text-xs text-gray-500 hidden md:table-cell">2h ago</td>
                        <td className="py-2 px-2 sm:px-3">
                          <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                            <button 
                              className="p-1 sm:p-1.5 text-gray-400 hover:text-blue-600 transition-colors" 
                              title="Edit User"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit size={12} className="sm:w-3 sm:h-3" />
                            </button>
                            <button 
                              className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                              onClick={() => handleResetPassword(user)}
                              title="Reset Password"
                            >
                              <Lock size={12} className="sm:w-3 sm:h-3" />
                            </button>
                            <button 
                              className="p-1 sm:p-1.5 text-gray-400 hover:text-red-600 transition-colors" 
                              title="Delete User"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 size={12} className="sm:w-3 sm:h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Password Policy</p>
                    <p className="text-xs sm:text-sm text-gray-500">Minimum 8 characters, special chars required</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Update Policy
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Session Timeout</p>
                    <p className="text-xs sm:text-sm text-gray-500">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Configure
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Login Attempts</p>
                    <p className="text-xs sm:text-sm text-gray-500">Lock account after 5 failed attempts</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">User Registration</p>
                    <p className="text-xs sm:text-sm text-gray-500">Allow new user account creation</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Configure
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Email Notifications</p>
                    <p className="text-xs sm:text-sm text-gray-500">Send account creation and password reset emails</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Configure
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Default User Role</p>
                    <p className="text-xs sm:text-sm text-gray-500">Set default role for new users</p>
                  </div>
                  <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Account Activity Logs</h3>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { action: 'User account created', user: 'System Admin', target: 'Emily Dao', time: '2 hours ago', status: 'success' },
                  { action: 'Password reset', user: 'Sarah Chen', target: 'Self', time: '4 hours ago', status: 'success' },
                  { action: 'Role changed', user: 'System Admin', target: 'Marcus Ford', time: '6 hours ago', status: 'success' },
                  { action: 'Failed login attempt', user: 'Unknown', target: 'admin', time: '8 hours ago', status: 'warning' },
                  { action: 'Account deactivated', user: 'System Admin', target: 'Old User', time: '1 day ago', status: 'info' }
                ].map((log, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                    <div className="flex items-start sm:items-center">
                      {log.status === 'success' ? (
                        <CheckCircle size={16} className="text-green-600 mr-3 flex-shrink-0" />
                      ) : log.status === 'warning' ? (
                        <AlertTriangle size={16} className="text-yellow-600 mr-3 flex-shrink-0" />
                      ) : (
                        <Clock size={16} className="text-blue-600 mr-3 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{log.action}</p>
                        <p className="text-xs sm:text-sm text-gray-500">by {log.user} {log.target !== 'Self' && `on ${log.target}`}</p>
                      </div>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <UserPlus size={16} className="sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create New User Account</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Fill in the details to create a new user account</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full pl-9 sm:pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="email@example.com"
                      />
                    </div>
                    {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={newUser.phone}
                        onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-full pl-9 sm:pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <div className="relative">
                      <Building size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={newUser.department}
                        onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                        className={`w-full pl-9 sm:pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                          formErrors.department ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Engineering, Finance, etc."
                      />
                    </div>
                    {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Username *</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                        formErrors.username ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter username"
                    />
                    {formErrors.username && <p className="text-red-500 text-xs mt-1">{formErrors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    >
                      <option value={UserRole.PROJECT_OWNER}>Project Owner</option>
                      <option value={UserRole.FINANCE}>Finance</option>
                      <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                      <option value={UserRole.PROJECT_ENGINEER}>Project Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password *</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                    />
                    {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) => setNewUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base ${
                        formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                    {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                  <li>• Contains at least one special character</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end p-4 sm:p-6 border-t border-gray-200 gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <Plus size={16} className="mr-2" />
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 border-b border-gray-200 gap-4">
              <div className="flex items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Edit size={16} className="sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">Edit User Account</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Update user information and role</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEditUserModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value={UserRole.PROJECT_OWNER}>Project Owner</option>
                    <option value={UserRole.FINANCE}>Finance</option>
                    <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                    <option value={UserRole.PROJECT_ENGINEER}>Project Engineer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end p-4 sm:p-6 border-t border-gray-200 gap-2 sm:gap-3">
              <button
                onClick={() => setShowEditUserModal(false)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <Edit size={16} className="mr-2" />
                Update User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete User Account</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Are you sure you want to delete the account for <strong>{selectedUser.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full mb-4">
                <Lock size={24} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Reset Password</h3>
              <p className="text-sm text-gray-600 text-center mb-6">
                Set a new password for <strong>{selectedUser.name}</strong>
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                  <input
                    type="password"
                    value={resetPasswordData.newPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter new password"
                  />
                  {formErrors.newPassword && <p className="text-red-500 text-xs mt-1">{formErrors.newPassword}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={resetPasswordData.confirmPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Confirm new password"
                  />
                  {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResetPassword}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
                >
                  <Lock size={16} className="mr-2" />
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
