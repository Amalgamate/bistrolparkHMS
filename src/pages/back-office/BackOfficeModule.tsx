import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import CompactModuleHeader from '../../components/layout/CompactModuleHeader';
import ModuleSelector from '../../components/layout/ModuleSelector';
import {
  Users,
  DollarSign,
  Building,
  Package,
  Truck,
  Briefcase,
  ShieldCheck,
  FileText,
  BarChart,
  Clipboard,
  Calendar,
  Database,
  Settings,
  UserPlus,
  CreditCard,
  Receipt,
  TrendingUp,
  Layers,
  AlertTriangle,
  BookOpen,
  Wrench
} from 'lucide-react';
import BackOfficeMenu from '../../components/back-office/BackOfficeMenu';
import BackOfficeQuickActions from '../../components/back-office/BackOfficeQuickActions';

// Import module components
import HumanResourcesModule from './modules/HumanResourcesModule';
import FinanceModule from './modules/FinanceModule';
import AccountingModule from './modules/AccountingModule';
import InventoryModule from './modules/InventoryModule';
import AdministrationModule from './modules/AdministrationModule';
import ProcurementModule from './modules/ProcurementModule';
import FacilitiesManagementModule from './modules/FacilitiesManagementModule';
import {
  ReportsModule,
  BackOfficeSettingsModule
} from './modules/PlaceholderModules';

// Import form components
import {
  AddEmployeeForm,
  NewTransactionForm,
  InventoryCheckForm,
  NewPurchaseOrderForm,
  FacilityManagementForm,
  GenerateReportForm
} from './forms/QuickActionForms';

// Back Office Dashboard Component
const BackOfficeDashboard: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Back Office Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">Staff</h3>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Total</div>
          </div>
          <div className="text-2xl font-bold mb-0.5">156</div>
          <div className="text-xs text-gray-500">12 new this month</div>
        </Card>

        <Card className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">Budget Utilization</h3>
            <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Q3 2023</div>
          </div>
          <div className="text-2xl font-bold mb-0.5">78%</div>
          <div className="text-xs text-gray-500">On track with projections</div>
        </Card>

        <Card className="bg-white p-3 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium">Pending Approvals</h3>
            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded">Action Required</div>
          </div>
          <div className="text-2xl font-bold mb-0.5">24</div>
          <div className="text-xs text-gray-500">8 high priority</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="flex flex-col items-center p-3">
          <Users className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Human Resources</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage staff, payroll, and HR policies.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/hr')} className="mt-auto">View HR</Button>
        </Card>

        <Card className="flex flex-col items-center p-3">
          <DollarSign className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Finance</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage budgets, expenses, and financial reports.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/finance')} className="mt-auto">View Finance</Button>
        </Card>

        <Card className="flex flex-col items-center p-3">
          <BookOpen className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Accounting</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage accounts, ledgers, and financial transactions.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/accounting')} className="mt-auto">View Accounting</Button>
        </Card>

        <Card className="flex flex-col items-center p-3">
          <Package className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Inventory</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage hospital inventory and supplies.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/inventory')} className="mt-auto">View Inventory</Button>
        </Card>

        <Card className="flex flex-col items-center p-3">
          <Truck className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Procurement</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage vendors, purchase orders, and requisitions.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/procurement')} className="mt-auto">View Procurement</Button>
        </Card>

        <Card className="flex flex-col items-center p-3">
          <Wrench className="h-8 w-8 text-gray-300 mb-2" />
          <h3 className="text-base font-medium text-gray-700 mb-1">Facilities</h3>
          <p className="text-xs text-gray-500 mb-2 text-center">
            Manage laundry, waste, maintenance, and equipment.
          </p>
          <Button size="sm" onClick={() => navigate('/back-office/facilities')} className="mt-auto">View Facilities</Button>
        </Card>
      </div>
    </div>
  );
};

const BackOfficeModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/back-office');
        break;
      case 'hr':
        navigate('/back-office/hr');
        break;
      case 'finance':
        navigate('/back-office/finance');
        break;
      case 'accounting':
        navigate('/back-office/accounting');
        break;
      case 'administration':
        navigate('/back-office/administration');
        break;
      case 'inventory':
        navigate('/back-office/inventory');
        break;
      case 'procurement':
        navigate('/back-office/procurement');
        break;
      case 'facilities':
        navigate('/back-office/facilities');
        break;
      case 'reports':
        navigate('/back-office/reports');
        break;
      case 'approvals':
        navigate('/approvals');
        break;
      case 'settings':
        navigate('/back-office/settings');
        break;
      // Quick action routes
      case 'hr-add-employee':
        navigate('/back-office/hr/add-employee');
        break;
      case 'finance-new-transaction':
        navigate('/back-office/finance/new-transaction');
        break;
      case 'inventory-check':
        navigate('/back-office/inventory/check');
        break;
      case 'procurement-new-order':
        navigate('/back-office/procurement/new-order');
        break;
      case 'administration-facility':
        navigate('/back-office/administration/facility');
        break;
      case 'reports-generate':
        navigate('/back-office/reports/generate');
        break;
      default:
        navigate('/back-office');
    }
  };

  // No need for module options or handler as they're now in the ModuleSelector component

  return (
    <div className="container mx-auto px-2 py-2">
      <CompactModuleHeader
        title="Back Office Management"
        actions={
          <ModuleSelector currentModule="back-office" />
        }
      />

      <div className="min-h-[800px]">
        <Routes>
          <Route path="/" element={<BackOfficeDashboard navigate={navigate} />} />
          <Route path="/hr/*" element={<HumanResourcesModule />} />
          <Route path="/finance/*" element={<FinanceModule />} />
          <Route path="/accounting/*" element={<AccountingModule />} />
          <Route path="/administration/*" element={<AdministrationModule />} />
          <Route path="/inventory/*" element={<InventoryModule />} />
          <Route path="/procurement/*" element={<ProcurementModule />} />
          <Route path="/facilities/*" element={<FacilitiesManagementModule />} />
          <Route path="/reports/*" element={<ReportsModule />} />
          <Route path="/settings/*" element={<BackOfficeSettingsModule />} />

          {/* Quick action routes */}
          <Route path="/hr/add-employee" element={<AddEmployeeForm />} />
          <Route path="/finance/new-transaction" element={<NewTransactionForm />} />
          <Route path="/inventory/check" element={<InventoryCheckForm />} />
          <Route path="/procurement/new-order" element={<NewPurchaseOrderForm />} />
          <Route path="/administration/facility" element={<FacilityManagementForm />} />
          <Route path="/reports/generate" element={<GenerateReportForm />} />
        </Routes>
      </div>
    </div>
  );
};

export default BackOfficeModule;