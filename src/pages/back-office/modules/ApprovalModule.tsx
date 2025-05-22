import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  CheckSquare,
  ClipboardList,
  Clock,
  Settings,
  FileText,
  Users,
  BarChart,
  AlertTriangle,
  Truck,
  Package,
  ShoppingCart,
  Layers,
  Home,
  Plus,
  Filter,
  Download,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  Edit,
  Trash,
  RefreshCw,
  Calendar,
  UserPlus,
  UserCheck,
  LogOut,
  Scissors,
  DollarSign,
  CreditCard,
  Briefcase,
  Building,
  Stethoscope,
  Activity
} from 'lucide-react';
import ApprovalModuleMenu from '../../../components/back-office/ApprovalModuleMenu';

const ApprovalModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('approval-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'approval-dashboard':
        return <ApprovalDashboardContent />;
      case 'approval-pending':
        return <PendingApprovalsContent />;

      // Procurement & Inventory
      case 'approval-procurement':
        return <ProcurementApprovalsContent />;
      case 'approval-inventory':
        return <InventoryApprovalsContent />;
      case 'approval-requisitions':
        return <RequisitionApprovalsContent />;
      case 'approval-transfers':
        return <TransferApprovalsContent />;

      // HR & Staff
      case 'approval-leave':
        return <LeaveRequestsContent />;
      case 'approval-shifts':
        return <ShiftSwapsContent />;
      case 'approval-recruitment':
        return <RecruitmentApprovalsContent />;

      // Clinical
      case 'approval-referrals':
        return <PatientReferralsContent />;
      case 'approval-discharges':
        return <DischargeAuthorizationsContent />;
      case 'approval-procedures':
        return <ProcedureApprovalsContent />;

      // Finance
      case 'approval-budget':
        return <BudgetApprovalsContent />;
      case 'approval-expenses':
        return <ExpenseApprovalsContent />;

      // System
      case 'approval-workflows':
        return <ApprovalWorkflowsContent />;
      case 'approval-history':
        return <ApprovalHistoryContent />;
      case 'approval-escalations':
        return <EscalationsContent />;
      case 'approval-delegations':
        return <DelegationsContent />;
      case 'approval-reports':
        return <ApprovalReportsContent />;
      case 'approval-settings':
        return <ApprovalSettingsContent />;
      default:
        return <ApprovalDashboardContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ApprovalModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// Approval Dashboard Content
const ApprovalDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Approval Dashboard</h2>
          <p className="text-gray-500">Overview of approval activities and metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold mt-1">42</p>
          <div className="text-xs text-amber-600 mt-1">Requires attention</div>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Urgent</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <div className="text-xs text-red-600 mt-1">High priority</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">26</p>
          <div className="text-xs text-green-600 mt-1">Processed successfully</div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Avg. Response Time</h3>
          <p className="text-2xl font-bold mt-1">2.8 hrs</p>
          <div className="text-xs text-blue-600 mt-1">This week</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Approvals by Type</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-blue-500" />
                <p className="font-medium">Procurement</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <p className="font-medium">Leave Requests</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">9</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-purple-500" />
                <p className="font-medium">Patient Referrals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
                <span className="text-sm font-medium">8</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-orange-500" />
                <p className="font-medium">Discharges</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium">7</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <p className="font-medium">Budget</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm font-medium">6</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Leave Request Approved</p>
                <p className="text-xs text-gray-500">Sarah Johnson - Nursing Department</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Patient Referral Approved</p>
                <p className="text-xs text-gray-500">Robert Johnson - Cardiology</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Budget Request Rejected</p>
                <p className="text-xs text-gray-500">Oncology Department - Q3 2023</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New Discharge Request</p>
                <p className="text-xs text-gray-500">James Wilson - Cardiology Ward</p>
                <p className="text-xs text-gray-400">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New Shift Swap Request</p>
                <p className="text-xs text-gray-500">Michael Chen - Nursing Department</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Pending by Department</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Nursing</p>
                <p className="text-xs text-gray-500">14 pending approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-sm font-medium">33%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Pharmacy</p>
                <p className="text-xs text-gray-500">10 pending approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Laboratory</p>
                <p className="text-xs text-gray-500">8 pending approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-medium">19%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Radiology</p>
                <p className="text-xs text-gray-500">6 pending approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <span className="text-sm font-medium">14%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Finance</p>
                <p className="text-xs text-gray-500">4 pending approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Approval Performance</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dr. Sarah Johnson</p>
                <p className="text-xs text-gray-500">Clinical Approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-medium">1.2 hrs</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">John Smith</p>
                <p className="text-xs text-gray-500">HR Approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">2.5 hrs</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Michael Chen</p>
                <p className="text-xs text-gray-500">Procurement Approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <span className="text-sm font-medium">3.1 hrs</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Emily Davis</p>
                <p className="text-xs text-gray-500">Finance Approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium">4.2 hrs</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Robert Wilson</p>
                <p className="text-xs text-gray-500">Inventory Approvals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">4.5 hrs</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Pending Approvals Content
const PendingApprovalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Pending Approvals</h2>
          <p className="text-gray-500">Review and manage pending approval requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search approvals..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="requisition">Requisitions</SelectItem>
              <SelectItem value="purchase">Purchase Orders</SelectItem>
              <SelectItem value="transfer">Stock Transfers</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Reference</div>
          <div>Type</div>
          <div>Requested By</div>
          <div>Date</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>REQ-2023-042</div>
            <div>Requisition</div>
            <div>Dr. Sarah Johnson</div>
            <div>May 20, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">High</span></div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-038</div>
            <div>Purchase Order</div>
            <div>John Smith</div>
            <div>May 21, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Medium</span></div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>TRF-2023-015</div>
            <div>Stock Transfer</div>
            <div>Michael Chen</div>
            <div>May 22, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Low</span></div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Procurement Approvals Content
const ProcurementApprovalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Procurement Approvals</h2>
          <p className="text-gray-500">Manage approval processes for procurement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Purchase Orders</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Requisitions</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-blue-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">15</p>
          <p className="text-xs text-green-600 mt-1">Processed successfully</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="purchase-orders">
          <TabsList className="mb-4">
            <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
            <TabsTrigger value="quotes">Quotes & Tenders</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase-orders" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search purchase orders..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>PO Number</div>
                <div>Vendor</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Value</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>PO-2023-042</div>
                  <div>MedSupply Inc.</div>
                  <div>John Smith</div>
                  <div>May 20, 2023</div>
                  <div>$12,450</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>PO-2023-041</div>
                  <div>PharmaCorp Ltd.</div>
                  <div>Jane Doe</div>
                  <div>May 19, 2023</div>
                  <div>$8,320</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requisitions" className="space-y-4">
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Requisition approvals view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Quotes & tenders approvals view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Inventory Approvals Content
const InventoryApprovalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Approvals</h2>
          <p className="text-gray-500">Manage approval processes for inventory operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Stock Adjustments</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Stock Transfers</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-blue-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-green-600 mt-1">Processed successfully</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="adjustments">
          <TabsList className="mb-4">
            <TabsTrigger value="adjustments">Stock Adjustments</TabsTrigger>
            <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
            <TabsTrigger value="write-offs">Write-offs</TabsTrigger>
          </TabsList>

          <TabsContent value="adjustments" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search adjustments..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Reference</div>
                <div>Item</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Quantity</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>ADJ-2023-015</div>
                  <div>Paracetamol 500mg</div>
                  <div>John Smith</div>
                  <div>May 20, 2023</div>
                  <div>+200</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>ADJ-2023-014</div>
                  <div>Surgical Gloves</div>
                  <div>Jane Doe</div>
                  <div>May 19, 2023</div>
                  <div>-50</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="transfers" className="space-y-4">
            <div className="text-center py-12">
              <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Stock transfers approval view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="write-offs" className="space-y-4">
            <div className="text-center py-12">
              <Trash className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Write-offs approval view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Requisition Approvals Content
const RequisitionApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Requisition Approvals</h2>
        <p className="text-gray-500">Manage approval processes for requisitions</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Requisition approvals view will be implemented soon.</p>
    </div>
  </div>
);

// Transfer Approvals Content
const TransferApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Transfer Approvals</h2>
        <p className="text-gray-500">Manage approval processes for stock transfers</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Transfer approvals view will be implemented soon.</p>
    </div>
  </div>
);

// Approval Workflows Content
const ApprovalWorkflowsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Approval Workflows</h2>
          <p className="text-gray-500">Configure and manage approval workflows</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Active Workflows</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-blue-600 mt-1">Across all departments</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approval Types</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-green-600 mt-1">Configured in system</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Avg. Approval Steps</h3>
          <p className="text-2xl font-bold mt-1">2.4</p>
          <p className="text-xs text-amber-600 mt-1">Per workflow</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="workflows">
          <TabsList className="mb-4">
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="approval-types">Approval Types</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search workflows..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="leave_request">Leave Requests</SelectItem>
                    <SelectItem value="purchase_order">Purchase Orders</SelectItem>
                    <SelectItem value="patient_referral">Patient Referrals</SelectItem>
                    <SelectItem value="discharge">Discharge</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Name</div>
                <div>Type</div>
                <div>Department</div>
                <div>Steps</div>
                <div>Created</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Standard Leave Request</div>
                  <div>Leave Request</div>
                  <div>All Departments</div>
                  <div>2</div>
                  <div>May 15, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Procurement Approval</div>
                  <div>Purchase Order</div>
                  <div>Procurement</div>
                  <div>3</div>
                  <div>May 10, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Patient Discharge</div>
                  <div>Discharge</div>
                  <div>Clinical</div>
                  <div>2</div>
                  <div>May 20, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approval-types" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search approval types..." className="pl-8" />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Approval Type
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Name</div>
                <div>Category</div>
                <div>Workflows</div>
                <div>Fields</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Leave Request</div>
                  <div>HR & Staff</div>
                  <div>2</div>
                  <div>8</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Purchase Order</div>
                  <div>Procurement</div>
                  <div>3</div>
                  <div>12</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Patient Referral</div>
                  <div>Clinical</div>
                  <div>1</div>
                  <div>10</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Discharge</div>
                  <div>Clinical</div>
                  <div>1</div>
                  <div>9</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Budget Request</div>
                  <div>Finance</div>
                  <div>1</div>
                  <div>15</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Workflow templates will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Approval History Content
const ApprovalHistoryContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Approval History</h2>
        <p className="text-gray-500">View history of approval activities</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export
      </Button>
    </div>

    <div className="text-center py-12">
      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Approval history view will be implemented soon.</p>
    </div>
  </div>
);

// Escalations Content
const EscalationsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Escalations</h2>
        <p className="text-gray-500">Manage escalated approval requests</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <AlertTriangle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Escalations management will be implemented soon.</p>
    </div>
  </div>
);

// Delegations Content
const DelegationsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Delegations</h2>
        <p className="text-gray-500">Manage approval delegations</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Delegation
      </Button>
    </div>

    <div className="text-center py-12">
      <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Delegations management will be implemented soon.</p>
    </div>
  </div>
);

// Approval Reports Content
const ApprovalReportsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Approval Reports</h2>
        <p className="text-gray-500">Generate and view approval reports</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Reports
      </Button>
    </div>

    <div className="text-center py-12">
      <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Approval reporting will be implemented soon.</p>
    </div>
  </div>
);

// Approval Settings Content
const ApprovalSettingsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Approval Settings</h2>
          <p className="text-gray-500">Configure approval system settings</p>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">Default Settings</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-expiry">Default Approval Expiry (days)</Label>
                    <Input id="default-expiry" type="number" defaultValue="7" />
                    <p className="text-xs text-gray-500">Number of days before pending approvals expire</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="escalation-time">Auto-escalation Time (hours)</Label>
                    <Input id="escalation-time" type="number" defaultValue="48" />
                    <p className="text-xs text-gray-500">Hours before auto-escalation to next level</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="approval-mode">Default Approval Mode</Label>
                    <Select defaultValue="sequential">
                      <SelectTrigger id="approval-mode">
                        <SelectValue placeholder="Select approval mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sequential">Sequential (Step by Step)</SelectItem>
                        <SelectItem value="parallel">Parallel (All at Once)</SelectItem>
                        <SelectItem value="any">Any Approver</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">How approvals flow through steps</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-priority">Default Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="default-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Default priority for new approval requests</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-approve" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="auto-approve">Enable auto-approval for low-risk items</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="comments-required" className="rounded border-gray-300" />
                  <Label htmlFor="comments-required">Require comments for rejections</Label>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">System Integration</h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-integration" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="email-integration">Enable email notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="sms-integration" className="rounded border-gray-300" />
                  <Label htmlFor="sms-integration">Enable SMS notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="dashboard-integration" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="dashboard-integration">Show approvals on main dashboard</Label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">Notification Templates</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="approval-request">Approval Request Template</Label>
                  <Input id="approval-request" defaultValue="[ApprovalType] requires your approval: [RequestID]" />
                  <p className="text-xs text-gray-500">Template for approval request notifications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approval-reminder">Reminder Template</Label>
                  <Input id="approval-reminder" defaultValue="Reminder: [ApprovalType] is awaiting your approval: [RequestID]" />
                  <p className="text-xs text-gray-500">Template for reminder notifications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approval-complete">Approval Complete Template</Label>
                  <Input id="approval-complete" defaultValue="Your [ApprovalType] has been approved: [RequestID]" />
                  <p className="text-xs text-gray-500">Template for approval completion notifications</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approval-rejected">Rejection Template</Label>
                  <Input id="approval-rejected" defaultValue="Your [ApprovalType] has been rejected: [RequestID]" />
                  <p className="text-xs text-gray-500">Template for rejection notifications</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-md font-medium mb-4">Notification Schedule</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-frequency">Reminder Frequency (hours)</Label>
                    <Input id="reminder-frequency" type="number" defaultValue="24" />
                    <p className="text-xs text-gray-500">Hours between reminder notifications</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-reminders">Maximum Reminders</Label>
                    <Input id="max-reminders" type="number" defaultValue="3" />
                    <p className="text-xs text-gray-500">Maximum number of reminders to send</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Roles and permissions settings will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Integration settings will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// HR & Staff Approval Content Components
const LeaveRequestsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Leave Requests</h2>
          <p className="text-gray-500">Manage staff leave request approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Approved This Month</h3>
          <p className="text-2xl font-bold mt-1">28</p>
          <p className="text-xs text-blue-600 mt-1">Total days: 84</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Avg. Response Time</h3>
          <p className="text-2xl font-bold mt-1">1.2 days</p>
          <p className="text-xs text-green-600 mt-1">Down from 1.8 days</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search leave requests..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="nursing">Nursing</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Employee</div>
                <div>Department</div>
                <div>Leave Type</div>
                <div>From</div>
                <div>To</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Sarah Johnson</div>
                  <div>Nursing</div>
                  <div>Annual Leave</div>
                  <div>Jun 15, 2023</div>
                  <div>Jun 22, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>John Smith</div>
                  <div>Pharmacy</div>
                  <div>Sick Leave</div>
                  <div>Jun 18, 2023</div>
                  <div>Jun 19, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Approved leave requests view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Rejected leave requests view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const ShiftSwapsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Shift Swaps</h2>
          <p className="text-gray-500">Manage staff shift swap approvals</p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Swaps</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Approved This Week</h3>
          <p className="text-2xl font-bold mt-1">15</p>
          <p className="text-xs text-blue-600 mt-1">From 12 last week</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Urgent Requests</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <p className="text-xs text-red-600 mt-1">For next 48 hours</p>
        </Card>
      </div>

      <div className="border rounded-md mb-6">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Requester</div>
          <div>Swap With</div>
          <div>Original Shift</div>
          <div>New Shift</div>
          <div>Reason</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Michael Chen</div>
            <div>Lisa Wong</div>
            <div>Jun 18, 2023 (Night)</div>
            <div>Jun 20, 2023 (Day)</div>
            <div>Family emergency</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Urgent</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Jane Doe</div>
            <div>John Smith</div>
            <div>Jun 19, 2023 (Day)</div>
            <div>Jun 21, 2023 (Day)</div>
            <div>Medical appointment</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecruitmentApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Recruitment Approvals</h2>
        <p className="text-gray-500">Manage recruitment and hiring approvals</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <UserPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Recruitment approvals view will be implemented soon.</p>
    </div>
  </div>
);

// Clinical Approval Content Components
const PatientReferralsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Patient Referrals</h2>
          <p className="text-gray-500">Manage patient referral approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Referrals</h3>
          <p className="text-2xl font-bold mt-1">14</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Urgent Referrals</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-xs text-red-600 mt-1">High priority</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-green-600 mt-1">Processed successfully</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search referrals..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="oncology">Oncology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Patient</div>
                <div>Referring Doctor</div>
                <div>Specialty</div>
                <div>Reason</div>
                <div>Date</div>
                <div>Priority</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Robert Johnson</div>
                  <div>Dr. Sarah Williams</div>
                  <div>Cardiology</div>
                  <div>Chest pain, abnormal ECG</div>
                  <div>Jun 15, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">High</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Mary Smith</div>
                  <div>Dr. John Davis</div>
                  <div>Neurology</div>
                  <div>Recurring migraines</div>
                  <div>Jun 16, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Medium</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Approved referrals view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Rejected referrals view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const DischargeAuthorizationsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Discharge Authorizations</h2>
          <p className="text-gray-500">Manage patient discharge approvals</p>
        </div>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Discharges</h3>
          <p className="text-2xl font-bold mt-1">9</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-blue-600 mt-1">Processed successfully</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Avg. Processing Time</h3>
          <p className="text-2xl font-bold mt-1">1.5 hrs</p>
          <p className="text-xs text-green-600 mt-1">Down from 2.3 hrs</p>
        </Card>
      </div>

      <div className="border rounded-md mb-6">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Patient</div>
          <div>Ward/Room</div>
          <div>Admission Date</div>
          <div>Requested By</div>
          <div>Reason</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>James Wilson</div>
            <div>Cardiology / 302</div>
            <div>Jun 10, 2023</div>
            <div>Dr. Emily Chen</div>
            <div>Treatment complete</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Patricia Brown</div>
            <div>Orthopedics / 215</div>
            <div>Jun 8, 2023</div>
            <div>Dr. Michael Lee</div>
            <div>Recovery complete</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcedureApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Procedure Approvals</h2>
        <p className="text-gray-500">Manage medical procedure approvals</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <Scissors className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Procedure approvals view will be implemented soon.</p>
    </div>
  </div>
);

// Finance Approval Content Components
const BudgetApprovalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Budget Approvals</h2>
          <p className="text-gray-500">Manage departmental budget approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Budgets</h3>
          <p className="text-2xl font-bold mt-1">6</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Total Value</h3>
          <p className="text-2xl font-bold mt-1">$1.2M</p>
          <p className="text-xs text-blue-600 mt-1">For Q3 2023</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved This Month</h3>
          <p className="text-2xl font-bold mt-1">4</p>
          <p className="text-xs text-green-600 mt-1">Value: $850K</p>
        </Card>
      </div>

      <div className="border rounded-md mb-6">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Department</div>
          <div>Requested By</div>
          <div>Period</div>
          <div>Amount</div>
          <div>Submission Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Radiology</div>
            <div>Dr. Robert Chen</div>
            <div>Q3 2023</div>
            <div>$320,000</div>
            <div>May 28, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Laboratory</div>
            <div>Dr. Sarah Johnson</div>
            <div>Q3 2023</div>
            <div>$280,000</div>
            <div>May 30, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Approve</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpenseApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Expense Approvals</h2>
        <p className="text-gray-500">Manage expense and reimbursement approvals</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <CreditCard className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Expense approvals view will be implemented soon.</p>
    </div>
  </div>
);

export default ApprovalModule;
