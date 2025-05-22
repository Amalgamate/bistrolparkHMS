import React from 'react';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { 
  Pill, 
  FileText, 
  CheckSquare, 
  RotateCcw,
  ClipboardList,
  Package,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

interface PharmacyActionCardsProps {
  onWalkInPatients?: () => void;
  onNewRequest?: () => void;
  onConfirmDrugs?: () => void;
  onReverseConfirmed?: () => void;
  onViewInventory?: () => void;
  onManageStock?: () => void;
  onPurchaseOrder?: () => void;
  onReports?: () => void;
}

export const PharmacyActionCards: React.FC<PharmacyActionCardsProps> = ({
  onWalkInPatients,
  onNewRequest,
  onConfirmDrugs,
  onReverseConfirmed,
  onViewInventory,
  onManageStock,
  onPurchaseOrder,
  onReports
}) => {
  return (
    <ActionCardGrid columns={4}>
      <ActionCard
        icon={Pill}
        color="blue"
        title="Walk In Patients"
        description="Create prescriptions for walk-in patients"
        onClick={onWalkInPatients}
      />
      
      <ActionCard
        icon={FileText}
        color="green"
        title="New Pharmacy Request"
        description="Create a new pharmacy request"
        onClick={onNewRequest}
      />
      
      <ActionCard
        icon={CheckSquare}
        color="purple"
        title="Confirm Drugs"
        description="Confirm drugs for dispensing"
        onClick={onConfirmDrugs}
      />
      
      <ActionCard
        icon={RotateCcw}
        color="orange"
        title="Reverse Confirmed Requests"
        description="Reverse previously confirmed requests"
        onClick={onReverseConfirmed}
      />

      <ActionCard
        icon={ClipboardList}
        color="teal"
        title="View Inventory"
        description="Check current drug inventory"
        onClick={onViewInventory}
      />

      <ActionCard
        icon={Package}
        color="indigo"
        title="Manage Stock"
        description="Add or adjust medication stock"
        onClick={onManageStock}
      />

      <ActionCard
        icon={ShoppingCart}
        color="pink"
        title="Purchase Orders"
        description="Create and manage purchase orders"
        onClick={onPurchaseOrder}
      />

      <ActionCard
        icon={BarChart3}
        color="amber"
        title="Pharmacy Reports"
        description="View and generate pharmacy reports"
        onClick={onReports}
      />
    </ActionCardGrid>
  );
};

export default PharmacyActionCards;
