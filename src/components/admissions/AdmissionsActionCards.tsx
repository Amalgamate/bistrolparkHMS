import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  UserPlus, 
  Bed, 
  ClipboardCheck, 
  DoorOpen,
  Calendar,
  CreditCard,
  FileText,
  Users
} from 'lucide-react';

interface AdmissionsActionCardsProps {
  onNewAdmission?: () => void;
  onBedManagement?: () => void;
  onPatientStatus?: () => void;
  onDischarge?: () => void;
  onAppointments?: () => void;
  onBilling?: () => void;
  onReports?: () => void;
  onPatientRecords?: () => void;
}

export const AdmissionsActionCards: React.FC<AdmissionsActionCardsProps> = ({
  onNewAdmission,
  onBedManagement,
  onPatientStatus,
  onDischarge,
  onAppointments,
  onBilling,
  onReports,
  onPatientRecords
}) => {
  return (
    <ActionCardGrid columns={4}>
      <ActionCard
        icon={UserPlus}
        color="blue"
        title="New Admission"
        description="Admit a new patient"
        onClick={onNewAdmission}
      />
      
      <ActionCard
        icon={Bed}
        color="green"
        title="Bed Management"
        description="Manage hospital beds and wards"
        onClick={onBedManagement}
      />
      
      <ActionCard
        icon={ClipboardCheck}
        color="purple"
        title="Patient Status"
        description="Check admitted patient status"
        onClick={onPatientStatus}
      />
      
      <ActionCard
        icon={DoorOpen}
        color="orange"
        title="Discharge Patient"
        description="Process patient discharge"
        onClick={onDischarge}
      />

      <ActionCard
        icon={Calendar}
        color="teal"
        title="Appointments"
        description="Manage patient appointments"
        onClick={onAppointments}
      />

      <ActionCard
        icon={CreditCard}
        color="indigo"
        title="Billing"
        description="Process admission billing"
        onClick={onBilling}
      />

      <ActionCard
        icon={FileText}
        color="pink"
        title="Reports"
        description="Generate admission reports"
        onClick={onReports}
      />

      <ActionCard
        icon={Users}
        color="amber"
        title="Patient Records"
        description="View patient medical records"
        onClick={onPatientRecords}
      />
    </ActionCardGrid>
  );
};

export default AdmissionsActionCards;
