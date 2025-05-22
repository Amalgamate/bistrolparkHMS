import React from 'react';
import { Button } from '../ui/button';
import { PlusCircle, Download, Printer, RefreshCw } from 'lucide-react';
import StandardModuleHeader from '../layout/StandardModuleHeader';

interface AdmissionsHeaderProps {
  onNewAdmission: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onPrint?: () => void;
  searchComponent?: React.ReactNode;
  className?: string;
}

export const AdmissionsHeader: React.FC<AdmissionsHeaderProps> = ({
  onNewAdmission,
  onRefresh,
  onExport,
  onPrint,
  searchComponent,
  className
}) => {
  const badges = [
    { text: 'SHA Integrated', color: 'blue' },
    { text: 'KES Currency', color: 'green' }
  ];

  const actions = (
    <>
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

      {onPrint && (
        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>
      )}
    </>
  );

  return (
    <StandardModuleHeader
      title="Admissions Management"
      description="Manage patient admissions, discharges, and bed allocation"
      badges={badges}
      actions={actions}
      searchComponent={searchComponent}
      className={className}
    />
  );
};

export default AdmissionsHeader;
