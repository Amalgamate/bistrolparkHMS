import React from 'react';
import { Card, CardContent } from '../ui/card';
import {
  Pill,
  Package,
  FileText,
  Calendar,
  Clock,
  AlertTriangle,
  ArrowUpDown,
  BarChart,
  DollarSign,
  Clipboard,
  RefreshCw,
  Truck,
  RotateCcw,
  Edit,
  Layers,
  Box
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePharmacy } from '../../context/PharmacyContext';
import { ActionCard, ActionCardGrid } from '../ui/action-card';
import { StatsCard, StatsCardGrid } from '../ui/stats-card';

const PharmacyDashboard: React.FC = () => {
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

  // Feature cards data - using our new colored icon components

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

      {/* Feature Cards */}
      <ActionCardGrid columns={4}>
        <ActionCard
          icon={Package}
          color="indigo"
          title="Dispense Outpatient Drugs"
          description="Dispense drugs to outpatients"
          onClick={() => navigate('/pharmacy/dispense-outpatient')}
        />

        <ActionCard
          icon={Layers}
          color="pink"
          title="Dispense Inpatient Drugs"
          description="Dispense drugs to inpatients"
          onClick={() => navigate('/pharmacy/dispense-inpatient')}
        />

        <ActionCard
          icon={AlertTriangle}
          color="red"
          title="Delete Undispensed Drugs"
          description="Delete drugs that haven't been dispensed"
          onClick={() => navigate('/pharmacy/delete-undispensed')}
        />

        <ActionCard
          icon={BarChart}
          color="teal"
          title="Undispensed Drugs Report"
          description="View report of undispensed drugs"
          onClick={() => navigate('/pharmacy/undispensed-report')}
        />

        <ActionCard
          icon={RefreshCw}
          color="orange"
          title="Drugs Dispensed Reversal"
          description="Reverse dispensed drugs"
          onClick={() => navigate('/pharmacy/dispensed-reversal')}
        />

        <ActionCard
          icon={ArrowUpDown}
          color="green"
          title="Stock Movement Summary"
          description="View stock movement summary"
          onClick={() => navigate('/pharmacy/stock-movement')}
        />

        <ActionCard
          icon={Truck}
          color="blue"
          title="Stock Reorder Report"
          description="View items that need reordering"
          onClick={() => navigate('/pharmacy/reorder-report')}
        />

        <ActionCard
          icon={Calendar}
          color="amber"
          title="Medicine Expiry Report"
          description="View medicines approaching expiry"
          onClick={() => navigate('/pharmacy/expiry-report')}
        />

        <ActionCard
          icon={Clock}
          color="amber"
          title="Expiry Report (3 Months)"
          description="View medicines expiring within 3 months"
          onClick={() => navigate('/pharmacy/expiry-report-3months')}
        />

        <ActionCard
          icon={Edit}
          color="purple"
          title="Edit Medication Details"
          description="Edit medication information"
          onClick={() => navigate('/pharmacy/inventory')}
        />

        <ActionCard
          icon={Clipboard}
          color="teal"
          title="Stock Take Entry Sheet"
          description="Enter stock take information"
          onClick={() => navigate('/pharmacy/stock-take-entry')}
        />

        <ActionCard
          icon={Box}
          color="green"
          title="Medicine Stock Take"
          description="Perform stock take"
          onClick={() => navigate('/pharmacy/stock-take')}
        />

        <ActionCard
          icon={FileText}
          color="blue"
          title="Stock Take Report"
          description="View stock take reports"
          onClick={() => navigate('/pharmacy/stock-take-report')}
        />

        <ActionCard
          icon={ArrowUpDown}
          color="pink"
          title="Internal Transfers"
          description="Manage internal medication transfers"
          onClick={() => navigate('/pharmacy/transfers')}
        />

        <ActionCard
          icon={BarChart}
          color="red"
          title="Internal Transfers Report"
          description="View internal transfer reports"
          onClick={() => navigate('/pharmacy/internal-transfers-report')}
        />

        <ActionCard
          icon={DollarSign}
          color="green"
          title="Medicine Prices"
          description="Manage medication prices"
          onClick={() => navigate('/pharmacy/prices')}
        />

        <ActionCard
          icon={RotateCcw}
          color="blue"
          title="Pharmacy Returns Report"
          description="View pharmacy returns"
          onClick={() => navigate('/pharmacy/returns-report')}
        />
      </ActionCardGrid>
    </div>
  );
};

export default PharmacyDashboard;
