import React from 'react';

interface TabContentProps {
  id: string;
  activeTab: string;
  children: React.ReactNode;
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({ 
  id, 
  activeTab, 
  children, 
  className = "" 
}) => {
  if (id !== activeTab) return null;
  
  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export default TabContent;
