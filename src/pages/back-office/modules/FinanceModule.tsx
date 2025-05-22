import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  FileText,
  BarChart,
  Briefcase,
  PieChart,
  BookOpen,
  Stethoscope,
  Truck,
  User,
  AlertTriangle,
  Edit,
  CheckCircle
} from 'lucide-react';
import FinanceModuleMenu from '../../../components/back-office/FinanceModuleMenu';

const FinanceModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('finance-transactions');

  const handleMenuItemClick = (itemId: string) => {
    setActiveItem(itemId);

    // Special case for accounting - navigate to the dedicated accounting module
    if (itemId === 'finance-accounting') {
      navigate('/back-office/accounting');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <FinanceModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Finance</h2>
              <p className="text-gray-500">Manage budgets, expenses, and financial reports</p>
            </div>
            <Button className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              New Transaction
            </Button>
          </div>

          {activeItem === 'finance-accounting' ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Access the full accounting module with comprehensive features.</p>
              <Button onClick={() => navigate('/back-office/accounting')}>
                Go to Accounting Module
              </Button>
            </div>
          ) : activeItem === 'finance-bill-consultation' ? (
            <BillConsultationContent />
          ) : activeItem === 'finance-bill-transport' ? (
            <BillTransportContent />
          ) : activeItem === 'finance-patient-charges' ? (
            <PatientChargesContent />
          ) : activeItem === 'finance-billing-limits' ? (
            <BillingLimitsContent />
          ) : activeItem === 'finance-charges-reports' ? (
            <ChargesReportsContent />
          ) : (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="payables">Accounts Payable</TabsTrigger>
                <TabsTrigger value="receivables">Accounts Receivable</TabsTrigger>
                <TabsTrigger value="reports">Financial Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center py-12">
                  <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Finance overview will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="budgeting" className="space-y-4">
                <div className="text-center py-12">
                  <PieChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Budgeting functionality will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Expense management functionality will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="revenue" className="space-y-4">
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Revenue tracking functionality will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="payables" className="space-y-4">
                <div className="text-center py-12">
                  <Receipt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Accounts payable functionality will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="receivables" className="space-y-4">
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Accounts receivable functionality will be implemented soon.</p>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-12">
                  <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Financial reporting functionality will be implemented soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

// Billing-related content components
const BillConsultationContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Bill Consultation</h3>
    <p className="text-gray-500">Create and manage consultation billing for patients.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">New Consultation Bill</h4>
        <p className="text-sm text-gray-500 mb-4">Create a new consultation bill for a patient.</p>
        <Button size="sm" variant="outline">Create Bill</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Pending Bills</h4>
        <p className="text-sm text-gray-500 mb-4">View and manage pending consultation bills.</p>
        <Button size="sm" variant="outline">View Pending</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Recent Consultation Bills</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Stethoscope className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Recent consultation bills will be displayed here.</p>
      </div>
    </div>
  </div>
);

const BillTransportContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Bill Transport</h3>
    <p className="text-gray-500">Create and manage transport billing for patients.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">New Transport Bill</h4>
        <p className="text-sm text-gray-500 mb-4">Create a new transport bill for a patient.</p>
        <Button size="sm" variant="outline">Create Bill</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Pending Bills</h4>
        <p className="text-sm text-gray-500 mb-4">View and manage pending transport bills.</p>
        <Button size="sm" variant="outline">View Pending</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Recent Transport Bills</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Truck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Recent transport bills will be displayed here.</p>
      </div>
    </div>
  </div>
);

const PatientChargesContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Patient Charges</h3>
    <p className="text-gray-500">Confirm and manage patient charges and personal account charges.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Confirm Patient Charges</h4>
        <p className="text-sm text-gray-500 mb-4">Review and confirm pending patient charges.</p>
        <Button size="sm" variant="outline">Confirm Charges</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Personal Account Charges</h4>
        <p className="text-sm text-gray-500 mb-4">Manage personal account charges for patients.</p>
        <Button size="sm" variant="outline">View Accounts</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Recent Charges</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Recent patient charges will be displayed here.</p>
      </div>
    </div>
  </div>
);

const BillingLimitsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Billing Limits</h3>
    <p className="text-gray-500">Set and manage billing limits for different services and departments.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Set Billing Limits</h4>
        <p className="text-sm text-gray-500 mb-4">Configure billing limits for services.</p>
        <Button size="sm" variant="outline">Configure Limits</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Billing Exceptions</h4>
        <p className="text-sm text-gray-500 mb-4">Manage exceptions to billing limits.</p>
        <Button size="sm" variant="outline">Manage Exceptions</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Current Billing Limits</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Current billing limits will be displayed here.</p>
      </div>
    </div>
  </div>
);

const ChargesReportsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-medium">Charges Reports</h3>
    <p className="text-gray-500">View and generate reports for cancelled and edited charges.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Cancelled Charges Report</h4>
        <p className="text-sm text-gray-500 mb-4">View report of all cancelled charges.</p>
        <Button size="sm" variant="outline">Generate Report</Button>
      </Card>
      <Card className="p-4">
        <h4 className="text-md font-medium mb-2">Edited Charges Report</h4>
        <p className="text-sm text-gray-500 mb-4">View report of all edited charges.</p>
        <Button size="sm" variant="outline">Generate Report</Button>
      </Card>
    </div>
    <div className="mt-4">
      <h4 className="text-md font-medium mb-2">Recent Reports</h4>
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Edit className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Recent reports will be displayed here.</p>
      </div>
    </div>
  </div>
);

export default FinanceModule;
