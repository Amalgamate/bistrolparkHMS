import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  Users, 
  Calendar, 
  Clipboard, 
  Dumbbell,
  FileText,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';

interface PhysiotherapyActionCardsProps {
  onManagePatients?: () => void;
  onScheduleAppointment?: () => void;
  onViewTreatments?: () => void;
  onExerciseLibrary?: () => void;
  onTreatmentPlans?: () => void;
  onProgressTracking?: () => void;
  onReports?: () => void;
  onSettings?: () => void;
}

export const PhysiotherapyActionCards: React.FC<PhysiotherapyActionCardsProps> = ({
  onManagePatients,
  onScheduleAppointment,
  onViewTreatments,
  onExerciseLibrary,
  onTreatmentPlans,
  onProgressTracking,
  onReports,
  onSettings
}) => {
  return (
    <ActionCardGrid columns={4}>
      <ActionCard
        icon={Users}
        color="blue"
        title="Manage Patients"
        description="View and manage physiotherapy patients"
        onClick={onManagePatients}
      />
      
      <ActionCard
        icon={Calendar}
        color="green"
        title="Schedule Appointment"
        description="Book a new physiotherapy session"
        onClick={onScheduleAppointment}
      />
      
      <ActionCard
        icon={Clipboard}
        color="purple"
        title="View Treatments"
        description="View ongoing treatment sessions"
        onClick={onViewTreatments}
      />
      
      <ActionCard
        icon={Dumbbell}
        color="orange"
        title="Exercise Library"
        description="Browse exercise and therapy techniques"
        onClick={onExerciseLibrary}
      />

      <ActionCard
        icon={FileText}
        color="teal"
        title="Treatment Plans"
        description="Create and manage treatment plans"
        onClick={onTreatmentPlans}
      />

      <ActionCard
        icon={Activity}
        color="indigo"
        title="Progress Tracking"
        description="Track patient recovery progress"
        onClick={onProgressTracking}
      />

      <ActionCard
        icon={BarChart3}
        color="pink"
        title="Reports"
        description="Generate physiotherapy reports"
        onClick={onReports}
      />

      <ActionCard
        icon={Settings}
        color="gray"
        title="Settings"
        description="Configure physiotherapy module"
        onClick={onSettings}
      />
    </ActionCardGrid>
  );
};

export default PhysiotherapyActionCards;
