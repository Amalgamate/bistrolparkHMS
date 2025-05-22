import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

// Define the quick action type
export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  description?: string;
}

// Define module type with its quick actions
export interface Module {
  id: string;
  name: string;
  quickActions: QuickAction[];
}

// Context type
interface QuickActionsContextType {
  currentModule: string;
  quickActions: QuickAction[];
  setCurrentModule: (moduleId: string) => void;
  executeQuickAction: (actionId: string) => void;
}

// Create context with default values
const QuickActionsContext = createContext<QuickActionsContextType>({
  currentModule: '',
  quickActions: [],
  setCurrentModule: () => {},
  executeQuickAction: () => {},
});

// Provider component
export const QuickActionsProvider: React.FC<{ children: ReactNode; modules: Module[] }> = ({ 
  children, 
  modules 
}) => {
  const [currentModule, setCurrentModule] = useState<string>('');
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Update current module and quick actions based on the current path
  useEffect(() => {
    const path = location.pathname;
    let moduleId = '';

    // Determine current module based on path
    if (path.startsWith('/clinical')) {
      moduleId = 'clinical';
    } else if (path.startsWith('/pharmacy')) {
      moduleId = 'pharmacy';
    } else if (path.startsWith('/laboratory')) {
      moduleId = 'laboratory';
    } else if (path.startsWith('/radiology')) {
      moduleId = 'radiology';
    } else if (path.startsWith('/physiotherapy')) {
      moduleId = 'physiotherapy';
    } else if (path.startsWith('/maternity')) {
      moduleId = 'maternity';
    } else if (path.startsWith('/procedures')) {
      moduleId = 'procedures';
    } else if (path.startsWith('/emergency')) {
      moduleId = 'emergency';
    } else if (path.startsWith('/blood-bank')) {
      moduleId = 'blood-bank';
    } else if (path.startsWith('/ambulance')) {
      moduleId = 'ambulance';
    } else if (path.startsWith('/mortuary')) {
      moduleId = 'mortuary';
    } else if (path.startsWith('/back-office')) {
      moduleId = 'back-office';
    } else {
      // Default to dashboard or home
      moduleId = 'dashboard';
    }

    setCurrentModule(moduleId);
  }, [location.pathname]);

  // Update quick actions when current module changes
  useEffect(() => {
    if (currentModule) {
      const module = modules.find(m => m.id === currentModule);
      if (module) {
        setQuickActions(module.quickActions);
      } else {
        setQuickActions([]);
      }
    }
  }, [currentModule, modules]);

  // Function to execute a quick action
  const executeQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      navigate(action.path);
    }
  };

  return (
    <QuickActionsContext.Provider
      value={{
        currentModule,
        quickActions,
        setCurrentModule,
        executeQuickAction
      }}
    >
      {children}
    </QuickActionsContext.Provider>
  );
};

// Custom hook to use the context
export const useQuickActions = () => {
  const context = useContext(QuickActionsContext);
  if (context === undefined) {
    throw new Error('useQuickActions must be used within a QuickActionsProvider');
  }
  return context;
};
