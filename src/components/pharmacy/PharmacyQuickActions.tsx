import React from 'react';
import {
  Pill,
  FileText,
  CheckSquare,
  RotateCcw,
  AlertTriangle,
  Calendar,
  ClipboardList,
  Package,
  ShoppingCart,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { StatsCard, StatsCardGrid } from '../ui/stats-card';

const PharmacyQuickActions: React.FC = () => {
  const navigate = useNavigate();
  const {
    prescriptions,
    medicationInventory,
    getStockReorderReport,
    getMedicineExpiryReport
  } = usePharmacy();

  // Calculate dashboard stats
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;
  const lowStockItems = getStockReorderReport().length;
  const expiringItems = getMedicineExpiryReport(3).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <StatsCardGrid columns={3}>
        <StatsCard
          title="Pending Prescriptions"
          value={pendingPrescriptions}
          icon={Pill}
          color="blue"
          onClick={() => navigate('/pharmacy/queue')}
        />

        <StatsCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          color="amber"
          onClick={() => navigate('/pharmacy/reorder-report')}
        />

        <StatsCard
          title="Expiring Soon"
          value={expiringItems}
          icon={Calendar}
          color="red"
          onClick={() => navigate('/pharmacy/expiry-report')}
        />
      </StatsCardGrid>

      {/* Quick Action Cards */}
      <ActionCardGrid columns={4}>
        <ActionCard
          icon={Pill}
          color="blue"
          title="Walk In Patients"
          description="Create prescriptions for walk-in patients"
          onClick={() => navigate('/pharmacy/walkin')}
        />

        <ActionCard
          icon={FileText}
          color="green"
          title="New Pharmacy Request"
          description="Create a new pharmacy request"
          onClick={() => navigate('/pharmacy/new-request')}
        />

        <ActionCard
          icon={CheckSquare}
          color="purple"
          title="Confirm Drugs"
          description="Confirm drugs for dispensing"
          onClick={() => navigate('/pharmacy/confirm')}
        />

        <ActionCard
          icon={RotateCcw}
          color="orange"
          title="Reverse Confirmed Requests"
          description="Reverse previously confirmed requests"
          onClick={() => navigate('/pharmacy/reverse')}
        />

        <ActionCard
          icon={ClipboardList}
          color="teal"
          title="View Inventory"
          description="Check current drug inventory"
          onClick={() => navigate('/pharmacy/inventory')}
        />

        <ActionCard
          icon={Package}
          color="indigo"
          title="Manage Stock"
          description="Add or adjust medication stock"
          onClick={() => navigate('/pharmacy/stock-movement')}
        />

        <ActionCard
          icon={ShoppingCart}
          color="pink"
          title="Purchase Orders"
          description="Create and manage purchase orders"
          onClick={() => navigate('/pharmacy/purchase-orders')}
        />

        <ActionCard
          icon={BarChart3}
          color="amber"
          title="Pharmacy Reports"
          description="View and generate pharmacy reports"
          onClick={() => navigate('/pharmacy/reports')}
        />
      </ActionCardGrid>
    </div>
  );
};

export default PharmacyQuickActions;
