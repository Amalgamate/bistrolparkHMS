import React, { useState, useEffect } from 'react';
import { Grid, Building2, Clock } from 'lucide-react';

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (id: string) => void;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, isActive, onClick }) => {
  return (
    <div
      className={`
        dashboard-tab flex items-center justify-center gap-3 px-4 py-3
        rounded-lg cursor-pointer transition-all duration-200 border border-gray-200
        ${isActive ? 'active bg-white shadow-sm' : 'bg-gray-100 hover:bg-gray-50'}
        ${id === 'quick-access' ? 'quick-access' : ''}
        ${id === 'hospital-overview' ? 'hospital-reports' : ''}
        ${id === 'financial-reports' ? 'accounts-overview' : ''}
      `}
      onClick={() => onClick(id)}
    >
      <span className="text-gray-500">{icon}</span>
      <span className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
};

interface DashboardTabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onChange }) => {
  const tabs = [
    {
      id: 'quick-access',
      label: 'Quick Access',
      icon: <Grid className="w-5 h-5" />,
    },
    {
      id: 'hospital-overview',
      label: 'Hospital Reports',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'financial-reports',
      label: 'Accounts Overview',
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="dashboard-tabs grid grid-cols-3 gap-4 mb-6">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={onChange}
        />
      ))}
    </div>
  );
};

export default DashboardTabs;
