import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import {
  BookOpen,
  DollarSign,
  FileText,
  Calculator,
  TrendingUp,
  Receipt,
  Landmark,
  PieChart,
  BarChart,
  Calendar,
  Briefcase,
  Plus,
  CheckSquare,
  Wallet,
  Clock
} from 'lucide-react';
import AccountingModuleMenu from '../../../components/back-office/AccountingModuleMenu';

const AccountingModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('accounting-chart-of-accounts');

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  // Placeholder components for each accounting section
  const renderContent = () => {
    switch (activeItem) {
      case 'accounting-chart-of-accounts':
        return <ChartOfAccountsContent />;
      case 'accounting-general-ledger':
        return <GeneralLedgerContent />;
      case 'accounting-journal-entries':
        return <JournalEntriesContent />;
      case 'accounting-accounts-payable':
        return <AccountsPayableContent />;
      case 'accounting-accounts-receivable':
        return <AccountsReceivableContent />;
      case 'accounting-banking':
        return <BankingContent />;
      case 'accounting-petty-cash':
        return <PettyCashContent />;
      case 'accounting-budgeting':
        return <BudgetingContent />;
      case 'accounting-reconciliation':
        return <ReconciliationContent />;
      case 'accounting-inpatient-deposits':
        return <InpatientDepositsContent />;
      case 'accounting-shifts':
        return <ShiftManagementContent />;
      case 'accounting-financial-reports':
        return <FinancialReportsContent />;
      case 'accounting-fiscal-periods':
        return <FiscalPeriodsContent />;
      case 'accounting-tax-management':
        return <TaxManagementContent />;
      default:
        return <ChartOfAccountsContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <AccountingModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Accounting</h2>
              <p className="text-gray-500">Manage financial accounts, transactions, and reports</p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Placeholder content components
const ChartOfAccountsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Chart of Accounts</h3>
    <p className="text-gray-500">Manage your organization's financial accounts structure.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Chart of Accounts functionality will be implemented soon.</p>
    </div>
  </div>
);

const GeneralLedgerContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">General Ledger</h3>
    <p className="text-gray-500">View and manage your organization's general ledger.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">General Ledger functionality will be implemented soon.</p>
    </div>
  </div>
);

const JournalEntriesContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Journal Entries</h3>
    <p className="text-gray-500">Create and manage journal entries for your accounting records.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Calculator className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Journal Entries functionality will be implemented soon.</p>
    </div>
  </div>
);

const AccountsPayableContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Accounts Payable</h3>
    <p className="text-gray-500">Manage money owed to vendors and suppliers.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <TrendingUp className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Accounts Payable functionality will be implemented soon.</p>
    </div>
  </div>
);

const AccountsReceivableContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Accounts Receivable</h3>
    <p className="text-gray-500">Manage money owed to your organization by customers.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Receipt className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Accounts Receivable functionality will be implemented soon.</p>
    </div>
  </div>
);

const BankingContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Banking</h3>
    <p className="text-gray-500">Manage bank accounts, reconciliations, and transactions.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Landmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Banking functionality will be implemented soon.</p>
    </div>
  </div>
);

const PettyCashContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Petty Cash</h3>
    <p className="text-gray-500">Manage small cash expenditures and reconciliations.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Petty Cash functionality will be implemented soon.</p>
    </div>
  </div>
);

const BudgetingContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Budgeting</h3>
    <p className="text-gray-500">Create and manage departmental and organizational budgets.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <PieChart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Budgeting functionality will be implemented soon.</p>
    </div>
  </div>
);

const FinancialReportsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Financial Reports</h3>
    <p className="text-gray-500">Generate and view financial reports for your organization.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Financial Reports functionality will be implemented soon.</p>
    </div>
  </div>
);

const FiscalPeriodsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Fiscal Periods</h3>
    <p className="text-gray-500">Manage fiscal years, quarters, and accounting periods.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Fiscal Periods functionality will be implemented soon.</p>
    </div>
  </div>
);

const TaxManagementContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Tax Management</h3>
    <p className="text-gray-500">Manage tax configurations, rates, and reports.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Tax Management functionality will be implemented soon.</p>
    </div>
  </div>
);

const ReconciliationContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Reconciliation</h3>
    <p className="text-gray-500">Reconcile accounts, payments, and financial records.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <CheckSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Reconciliation functionality will be implemented soon.</p>
    </div>
  </div>
);

const InpatientDepositsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Inpatient Cash Deposits</h3>
    <p className="text-gray-500">Manage cash deposits for inpatient services.</p>
    <div className="text-center py-8 bg-gray-50 rounded-lg">
      <Wallet className="h-12 w-12 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Inpatient Cash Deposits functionality will be implemented soon.</p>
    </div>
  </div>
);

const ShiftManagementContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Shift Management</h3>
    <p className="text-gray-500">Open, close, and manage cashier shifts.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Open Shift</h4>
        <p className="text-sm text-gray-500 mb-4">Start a new cashier shift with opening balance.</p>
        <Button size="sm" variant="outline">Open New Shift</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Close Shift</h4>
        <p className="text-sm text-gray-500 mb-4">Close current shift and reconcile cash.</p>
        <Button size="sm" variant="outline">Close Current Shift</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Shift History</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Shift history will be displayed here.</p>
      </div>
    </div>
  </div>
);

export default AccountingModule;
