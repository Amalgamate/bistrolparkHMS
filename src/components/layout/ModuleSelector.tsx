import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';

// Define module options
export const MODULE_OPTIONS = [
  { value: 'back-office', label: 'Back Office' },
  { value: 'clinical', label: 'Clinical' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'radiology', label: 'Radiology' },
  { value: 'physiotherapy', label: 'Physiotherapy' },
  { value: 'maternity', label: 'Maternity' },
  { value: 'procedures', label: 'Procedures' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'blood-bank', label: 'Blood Bank' },
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'mortuary', label: 'Mortuary' }
];

interface ModuleSelectorProps {
  currentModule: string;
  className?: string;
}

/**
 * A reusable module selector dropdown component
 * Used to navigate between different modules in the application
 */
const ModuleSelector: React.FC<ModuleSelectorProps> = ({ 
  currentModule,
  className
}) => {
  const navigate = useNavigate();

  // Handle module change
  const handleModuleChange = (value: string) => {
    navigate(`/${value}`);
  };

  return (
    <Select 
      onValueChange={handleModuleChange} 
      defaultValue={currentModule}
    >
      <SelectTrigger className={`w-[180px] h-8 text-xs ${className}`}>
        <SelectValue placeholder="Select Module" />
      </SelectTrigger>
      <SelectContent>
        {MODULE_OPTIONS.map((module) => (
          <SelectItem 
            key={module.value} 
            value={module.value} 
            className="text-xs"
          >
            {module.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModuleSelector;
