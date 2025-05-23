import React, { useState, useEffect } from 'react';
import { Grid, Building2, Clock, Users } from 'lucide-react';

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (id: string) => void;
  customStyle?: string;
}

const Tab: React.FC<TabProps> = ({ id, label, icon, isActive, onClick, customStyle }) => {
  return (
    <div
      className={`
        dashboard-tab flex items-center justify-center gap-3 px-4 py-3
        rounded-lg cursor-pointer transition-all duration-200 border border-gray-200        
        ${isActive ? 'active shadow-sm' : 'hover:bg-gray-50'}
        ${id === 'queues' ? 'queues-tab' : ''}
        ${id === 'quick-access' ? 'quick-access' : ''}
        ${id === 'hospital-overview' ? 'hospital-reports' : ''}
        ${id === 'financial-reports' ? 'accounts-overview' : ''}
        ${customStyle || ''}
        ${isActive && id === 'queues' ? 'bg-black text-white' :
          isActive ? 'bg-white' : 'bg-gray-100 '}
      `}
      onClick={() => onClick(id)}
    >
      <span className={`${id === 'queues' && isActive ? 'text-white' : 'text-gray-500'}`}>{icon}</span>
      <span className={`font-medium ${
        id === 'queues' && isActive ? 'text-white' :
        isActive ? 'text-gray-800' : 'text-gray-600'
      }`}>{label}</span>
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
      id: 'queues',
      label: 'Queues',
      icon: <Users className="w-5 h-5" />,
      customStyle: 'bg-black text-white border-black'
    },
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
    <div className="dashboard-tabs grid grid-cols-4 gap-4 mb-6">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          id={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeTab === tab.id}
          onClick={onChange}
          customStyle={tab.customStyle}
        />
      ))}
    </div>
  );
};

export default DashboardTabs;
