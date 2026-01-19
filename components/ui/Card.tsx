import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
          {title && <h3 className="font-semibold text-gray-800 text-lg">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}> = ({ label, value, icon, trend, trendUp }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
      {trend && (
        <p className={`text-xs font-medium mt-2 flex items-center ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trendUp ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
    <div className="p-3 bg-brand-50 rounded-lg text-brand-600">
      {icon}
    </div>
  </div>
);
