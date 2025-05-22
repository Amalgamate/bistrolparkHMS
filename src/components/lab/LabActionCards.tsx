import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  Microscope, 
  FileText, 
  CheckSquare, 
  ClipboardList,
  Flask,
  Beaker,
  BarChart3,
  Settings
} from 'lucide-react';

interface LabActionCardsProps {
  onNewTest?: () => void;
  onPendingTests?: () => void;
  onVerifyResults?: () => void;
  onViewResults?: () => void;
  onManageTemplates?: () => void;
  onManageReagents?: () => void;
  onReports?: () => void;
  onSettings?: () => void;
}

export const LabActionCards: React.FC<LabActionCardsProps> = ({
  onNewTest,
  onPendingTests,
  onVerifyResults,
  onViewResults,
  onManageTemplates,
  onManageReagents,
  onReports,
  onSettings
}) => {
  return (
    <ActionCardGrid columns={4}>
      <ActionCard
        icon={Microscope}
        color="blue"
        title="New Lab Test"
        description="Create a new lab test request"
        onClick={onNewTest}
      />
      
      <ActionCard
        icon={FileText}
        color="green"
        title="Pending Tests"
        description="View and process pending tests"
        onClick={onPendingTests}
      />
      
      <ActionCard
        icon={CheckSquare}
        color="purple"
        title="Verify Results"
        description="Review and verify test results"
        onClick={onVerifyResults}
      />
      
      <ActionCard
        icon={ClipboardList}
        color="teal"
        title="View Results"
        description="View completed test results"
        onClick={onViewResults}
      />

      <ActionCard
        icon={Flask}
        color="indigo"
        title="Test Templates"
        description="Manage lab test templates"
        onClick={onManageTemplates}
      />

      <ActionCard
        icon={Beaker}
        color="pink"
        title="Reagent Inventory"
        description="Manage lab reagents and supplies"
        onClick={onManageReagents}
      />

      <ActionCard
        icon={BarChart3}
        color="amber"
        title="Lab Reports"
        description="Generate and view lab reports"
        onClick={onReports}
      />

      <ActionCard
        icon={Settings}
        color="gray"
        title="Lab Settings"
        description="Configure lab module settings"
        onClick={onSettings}
      />
    </ActionCardGrid>
  );
};

export default LabActionCards;
