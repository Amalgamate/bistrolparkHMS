import React from 'react';
import { Button } from '../ui/button';
import { UserPlus, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ClinicalHeaderProps {
  onNewPatient: () => void;
  onRefresh?: () => void;
  className?: string;
}

export const ClinicalHeader: React.FC<ClinicalHeaderProps> = ({
  onNewPatient,
  onRefresh,
  className
}) => {
  return (
    <div className={cn("bg-white p-4 rounded-md shadow-sm", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#2B4F60]">Clinical Module</h2>
          <p className="text-sm text-muted">Manage patient flow, consultations, and clinical services</p>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}
          
          <Button
            onClick={onNewPatient}
            className="bg-[#2B4F60] hover:bg-[#1e3a48] text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalHeader;
