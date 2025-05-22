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
interface ModuleQuickActionsContextType {
  currentModule: string;
  quickActions: QuickAction[];
  moduleName: string;
  executeQuickAction: (actionId: string) => void;
}

// Create context with default values
const ModuleQuickActionsContext = createContext<ModuleQuickActionsContextType>({
  currentModule: '',
  quickActions: [],
  moduleName: '',
  executeQuickAction: () => {},
});

// Provider component
export const ModuleQuickActionsProvider: React.FC<{ children: ReactNode; modules: Module[] }> = ({
  children,
  modules
}) => {
  const [currentModule, setCurrentModule] = useState<string>('');
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [moduleName, setModuleName] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();

  // Update current module and quick actions based on the current path
  useEffect(() => {
    const path = location.pathname;
    let moduleId = '';

    // Determine current module based on path
    if (path === '/' || path === '/dashboard') {
      moduleId = 'dashboard';
    } else if (path.startsWith('/clinical')) {
      moduleId = 'clinical';
    } else if (path.startsWith('/pharmacy')) {
      moduleId = 'pharmacy';
    } else if (path.startsWith('/laboratory') || path.startsWith('/lab')) {
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
    } else if (path.startsWith('/patients')) {
      moduleId = 'patients';
    } else if (path.startsWith('/admissions')) {
      moduleId = 'admissions';
    } else if (path.startsWith('/appointments')) {
      moduleId = 'appointments';
    } else if (path.startsWith('/document-center')) {
      moduleId = 'document-center';
    } else {
      // Default to dashboard
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
        setModuleName(module.name);
      } else {
        setQuickActions([]);
        setModuleName('Dashboard');
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
    <ModuleQuickActionsContext.Provider
      value={{
        currentModule,
        quickActions,
        moduleName,
        executeQuickAction
      }}
    >
      {children}
    </ModuleQuickActionsContext.Provider>
  );
};

// Custom hook to use the context
export const useModuleQuickActions = () => {
  const context = useContext(ModuleQuickActionsContext);
  if (context === undefined) {
    throw new Error('useModuleQuickActions must be used within a ModuleQuickActionsProvider');
  }
  return context;
};
