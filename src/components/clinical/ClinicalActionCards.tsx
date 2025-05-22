import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  UserPlus, 
  Users, 
  Activity, 
  Stethoscope,
  ClipboardList,
  Pill,
  FileText,
  Microscope
} from 'lucide-react';

interface ClinicalActionCardsProps {
  onNewPatient?: () => void;
  onConsultationQueue?: () => void;
  onVitalsCapture?: () => void;
  onDoctorConsultation?: () => void;
  onPatientRecords?: () => void;
  onPrescriptions?: () => void;
  onReferrals?: () => void;
  onLabRequests?: () => void;
}

export const ClinicalActionCards: React.FC<ClinicalActionCardsProps> = ({
  onNewPatient,
  onConsultationQueue,
  onVitalsCapture,
  onDoctorConsultation,
  onPatientRecords,
  onPrescriptions,
  onReferrals,
  onLabRequests
}) => {
  return (
    <ActionCardGrid columns={4}>
      <ActionCard
        icon={UserPlus}
        color="blue"
        title="New Patient"
        description="Register a new patient"
        onClick={onNewPatient}
      />
      
      <ActionCard
        icon={Users}
        color="green"
        title="Consultation Queue"
        description="View waiting patients"
        onClick={onConsultationQueue}
      />
      
      <ActionCard
        icon={Activity}
        color="purple"
        title="Vitals Capture"
        description="Record patient vitals"
        onClick={onVitalsCapture}
      />
      
      <ActionCard
        icon={Stethoscope}
        color="orange"
        title="Doctor Consultation"
        description="Start patient consultation"
        onClick={onDoctorConsultation}
      />

      <ActionCard
        icon={ClipboardList}
        color="teal"
        title="Patient Records"
        description="View patient medical records"
        onClick={onPatientRecords}
      />

      <ActionCard
        icon={Pill}
        color="indigo"
        title="Prescriptions"
        description="Manage patient prescriptions"
        onClick={onPrescriptions}
      />

      <ActionCard
        icon={FileText}
        color="pink"
        title="Referrals"
        description="Create and manage referrals"
        onClick={onReferrals}
      />

      <ActionCard
        icon={Microscope}
        color="amber"
        title="Lab Requests"
        description="Order laboratory tests"
        onClick={onLabRequests}
      />
    </ActionCardGrid>
  );
};

export default ClinicalActionCards;
