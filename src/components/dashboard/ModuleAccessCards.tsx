import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  Stethoscope, 
  Pill, 
  Microscope, 
  Dumbbell,
  Bed,
  Calendar,
  CreditCard,
  Truck,
  Droplets,
  FileText,
  Scissors,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ModuleAccessCards: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Hospital Modules</h2>
      
      <ActionCardGrid columns={4}>
        <ActionCard
          icon={Stethoscope}
          color="blue"
          title="Clinical"
          description="Patient consultations and care"
          onClick={() => navigate('/clinical')}
        />
        
        <ActionCard
          icon={Pill}
          color="green"
          title="Pharmacy"
          description="Medication management"
          onClick={() => navigate('/pharmacy')}
        />
        
        <ActionCard
          icon={Microscope}
          color="purple"
          title="Laboratory"
          description="Medical tests and results"
          onClick={() => navigate('/lab')}
        />
        
        <ActionCard
          icon={Dumbbell}
          color="orange"
          title="Physiotherapy"
          description="Rehabilitation services"
          onClick={() => navigate('/physiotherapy')}
        />

        <ActionCard
          icon={Bed}
          color="teal"
          title="Admissions"
          description="Inpatient management"
          onClick={() => navigate('/admissions')}
        />

        <ActionCard
          icon={Calendar}
          color="indigo"
          title="Appointments"
          description="Schedule patient visits"
          onClick={() => navigate('/appointments')}
        />

        <ActionCard
          icon={CreditCard}
          color="pink"
          title="Billing"
          description="Patient billing and payments"
          onClick={() => navigate('/billing')}
        />

        <ActionCard
          icon={Truck}
          color="amber"
          title="Ambulance"
          description="Emergency transport services"
          onClick={() => navigate('/ambulance')}
        />
      </ActionCardGrid>

      <h2 className="text-xl font-semibold text-gray-800 mt-8">Additional Services</h2>
      
      <ActionCardGrid columns={4}>
        <ActionCard
          icon={Droplets}
          color="red"
          title="Blood Bank"
          description="Blood inventory management"
          onClick={() => navigate('/blood-bank')}
        />
        
        <ActionCard
          icon={FileText}
          color="blue"
          title="Maternity"
          description="Maternal and newborn care"
          onClick={() => navigate('/maternity')}
        />
        
        <ActionCard
          icon={Scissors}
          color="purple"
          title="Procedures"
          description="Surgical and medical procedures"
          onClick={() => navigate('/procedures')}
        />
        
        <ActionCard
          icon={Users}
          color="gray"
          title="Administration"
          description="Hospital administration"
          onClick={() => navigate('/admin')}
        />
      </ActionCardGrid>
    </div>
  );
};

export default ModuleAccessCards;
