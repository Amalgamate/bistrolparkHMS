import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Truck,
  ShoppingCart,
  FileText,
  CheckSquare,
  Package,
  Users,
  DollarSign,
  BarChart,
  Home,
  Plus,
  Filter,
  Download,
  Upload,
  ClipboardList,
  Calendar,
  Clock,
  Search,
  Settings,
  AlertTriangle,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Clipboard,
  RefreshCw
} from 'lucide-react';
import ProcurementModuleMenu from '../../../components/back-office/ProcurementModuleMenu';

const ProcurementModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('procurement-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'procurement-dashboard':
        return <ProcurementDashboardContent />;
      case 'procurement-purchase-orders':
        return <PurchaseOrdersContent />;
      case 'procurement-requisitions':
        return <RequisitionsContent />;
      case 'procurement-vendors':
        return <VendorsContent />;
      case 'procurement-quotes':
        return <QuotesContent />;
      case 'procurement-contracts':
        return <ContractsContent />;
      case 'procurement-receiving':
        return <ReceivingContent />;
      case 'procurement-delivery-schedule':
        return <DeliveryScheduleContent />;
      case 'procurement-approvals':
        return <ApprovalsContent />;
      case 'procurement-order-tracking':
        return <OrderTrackingContent />;
      case 'procurement-pending-items':
        return <PendingItemsContent />;
      case 'procurement-item-search':
        return <ItemSearchContent />;
      case 'procurement-reports':
        return <ReportsContent />;
      case 'procurement-settings':
        return <SettingsContent />;
      default:
        return <ProcurementDashboardContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <ProcurementModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// Procurement Dashboard Content
const ProcurementDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Procurement Dashboard</h2>
          <p className="text-gray-500">Overview of procurement activities and metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Open POs</h3>
          <p className="text-2xl font-bold mt-1">24</p>
          <div className="text-xs text-blue-600 mt-1">+3 this week</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <div className="text-xs text-amber-600 mt-1">Requires attention</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Expected Deliveries</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <div className="text-xs text-green-600 mt-1">This week</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Monthly Spend</h3>
          <p className="text-2xl font-bold mt-1">$45,780</p>
          <div className="text-xs text-purple-600 mt-1">Under budget by 5%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Procurement by Category</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <BarChart className="h-16 w-16 text-gray-300" />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <ShoppingCart className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Purchase Order Created</p>
                <p className="text-xs text-gray-500">PO-2023-042 - Medical Supplies</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <CheckSquare className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Order Approved</p>
                <p className="text-xs text-gray-500">PO-2023-038 - Laboratory Equipment</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Truck className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Delivery Scheduled</p>
                <p className="text-xs text-gray-500">PO-2023-035 - Pharmaceuticals</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Pending Approvals</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-red-500 rounded-full"></div>
                <div>
                  <p className="font-medium">PO-2023-042</p>
                  <p className="text-xs text-gray-500">Medical Supplies - $12,450</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Review</Button>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="font-medium">PO-2023-041</p>
                  <p className="text-xs text-gray-500">Office Equipment - $5,780</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Review</Button>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="font-medium">PO-2023-040</p>
                  <p className="text-xs text-gray-500">IT Equipment - $8,320</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Review</Button>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Upcoming Deliveries</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Medical Supplies</p>
                <p className="text-xs text-gray-500">Expected: May 25, 2023</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">On Schedule</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Pharmaceuticals</p>
                <p className="text-xs text-gray-500">Expected: May 26, 2023</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">On Schedule</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Laboratory Equipment</p>
                <p className="text-xs text-gray-500">Expected: May 28, 2023</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Delayed</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Purchase Orders Content
const PurchaseOrdersContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Purchase Orders</h2>
          <p className="text-gray-500">Manage and track purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-xs text-blue-600 mt-1">Not yet submitted</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-green-600 mt-1">Ready for processing</p>
        </Card>
        <Card className="p-4 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold mt-1">42</p>
          <p className="text-xs text-purple-600 mt-1">This year</p>
        </Card>
      </div>

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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>PO Number</div>
          <div>Vendor</div>
          <div>Date</div>
          <div>Items</div>
          <div>Value</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-042</div>
            <div>MedSupply Inc.</div>
            <div>May 22, 2023</div>
            <div>15</div>
            <div>$12,450</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Draft</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-041</div>
            <div>Office Solutions</div>
            <div>May 21, 2023</div>
            <div>8</div>
            <div>$5,780</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Track</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-040</div>
            <div>Tech Innovations</div>
            <div>May 20, 2023</div>
            <div>12</div>
            <div>$8,320</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Track</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-039</div>
            <div>PharmaCorp Ltd.</div>
            <div>May 18, 2023</div>
            <div>20</div>
            <div>$15,620</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Receive</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-038</div>
            <div>Lab Equipment Co.</div>
            <div>May 15, 2023</div>
            <div>5</div>
            <div>$24,850</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Receive</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Requisitions Content
const RequisitionsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Requisitions</h2>
          <p className="text-gray-500">Manage and track requisition requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Requisition
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <p className="text-xs text-blue-600 mt-1">Not yet submitted</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-1">7</p>
          <p className="text-xs text-amber-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold mt-1">10</p>
          <p className="text-xs text-green-600 mt-1">Ready for processing</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-2xl font-bold mt-1">2</p>
          <p className="text-xs text-red-600 mt-1">Requires revision</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requisitions</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search requisitions..." className="pl-8" />
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
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="admin">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Req. ID</div>
                <div>Department</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Items</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-025</div>
                  <div>Medical</div>
                  <div>Dr. Sarah Johnson</div>
                  <div>May 22, 2023</div>
                  <div>12</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Draft</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-024</div>
                  <div>Laboratory</div>
                  <div>John Smith</div>
                  <div>May 21, 2023</div>
                  <div>8</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-023</div>
                  <div>Pharmacy</div>
                  <div>Jane Doe</div>
                  <div>May 20, 2023</div>
                  <div>15</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-022</div>
                  <div>Administration</div>
                  <div>Michael Chen</div>
                  <div>May 18, 2023</div>
                  <div>5</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Process</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-021</div>
                  <div>Medical</div>
                  <div>Dr. Robert Williams</div>
                  <div>May 15, 2023</div>
                  <div>10</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Rejected</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Revise</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Pending requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Approved requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Rejected requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">My requisition requests view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Requisition Workflow</h3>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">1</div>
              <p className="text-sm font-medium">Request</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">2</div>
              <p className="text-sm font-medium">Review</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">3</div>
              <p className="text-sm font-medium">Approve</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">4</div>
              <p className="text-sm font-medium">Process</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center mb-2">5</div>
              <p className="text-sm font-medium">Complete</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>Current workflow requires approval from department head and procurement manager before processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Vendors Content
const VendorsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Vendors</h2>
          <p className="text-gray-500">Manage vendor relationships and information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Vendors</h3>
          <p className="text-2xl font-bold mt-1">48</p>
          <div className="text-xs text-blue-600 mt-1">+3 this month</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Vendors</h3>
          <p className="text-2xl font-bold mt-1">42</p>
          <div className="text-xs text-green-600 mt-1">87.5% of total</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Evaluation</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <div className="text-xs text-amber-600 mt-1">Requires review</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Blacklisted</h3>
          <p className="text-2xl font-bold mt-1">1</p>
          <div className="text-xs text-red-600 mt-1">Due to poor performance</div>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all-vendors">
          <TabsList className="mb-4">
            <TabsTrigger value="all-vendors">All Vendors</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="categories">By Category</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="all-vendors" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search vendors..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="medical">Medical Supplies</SelectItem>
                    <SelectItem value="pharma">Pharmaceuticals</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Vendor Name</div>
                <div>Category</div>
                <div>Contact</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">MedSupply Inc.</p>
                    <p className="text-xs text-gray-500">Medical supplies and equipment</p>
                  </div>
                  <div>Medical Supplies</div>
                  <div>
                    <p className="text-sm">John Smith</p>
                    <p className="text-xs text-gray-500">john@medsupply.com</p>
                  </div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">PharmaCorp Ltd.</p>
                    <p className="text-xs text-gray-500">Pharmaceuticals and medications</p>
                  </div>
                  <div>Pharmaceuticals</div>
                  <div>
                    <p className="text-sm">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">sarah@pharmacorp.com</p>
                  </div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Lab Equipment Co.</p>
                    <p className="text-xs text-gray-500">Laboratory equipment and supplies</p>
                  </div>
                  <div>Equipment</div>
                  <div>
                    <p className="text-sm">Robert Williams</p>
                    <p className="text-xs text-gray-500">robert@labequip.com</p>
                  </div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Office Solutions</p>
                    <p className="text-xs text-gray-500">Office supplies and furniture</p>
                  </div>
                  <div>Office Supplies</div>
                  <div>
                    <p className="text-sm">Michael Chen</p>
                    <p className="text-xs text-gray-500">michael@officesol.com</p>
                  </div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Evaluation</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Tech Innovations</p>
                    <p className="text-xs text-gray-500">IT equipment and services</p>
                  </div>
                  <div>Equipment</div>
                  <div>
                    <p className="text-sm">Jane Doe</p>
                    <p className="text-xs text-gray-500">jane@techinno.com</p>
                  </div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Active vendors view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Vendors by category view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="text-center py-12">
              <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Vendor performance view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Vendor contracts view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Top Vendors by Spend</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">MedSupply Inc.</p>
                <p className="text-xs text-gray-500">Medical Supplies</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm font-medium">$125,450</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">PharmaCorp Ltd.</p>
                <p className="text-xs text-gray-500">Pharmaceuticals</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm font-medium">$98,320</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lab Equipment Co.</p>
                <p className="text-xs text-gray-500">Laboratory Equipment</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '55%' }}></div>
                </div>
                <span className="text-sm font-medium">$75,620</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Vendor Performance</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">MedSupply Inc.</p>
                <p className="text-xs text-gray-500">On-time delivery rate</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm font-medium">95%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">PharmaCorp Ltd.</p>
                <p className="text-xs text-gray-500">On-time delivery rate</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lab Equipment Co.</p>
                <p className="text-xs text-gray-500">On-time delivery rate</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-medium">75%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Placeholder components for remaining sections
const QuotesContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Quotes & Tenders</h2>
        <p className="text-gray-500">Manage quotes and tender processes</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Quote Request
      </Button>
    </div>

    <div className="text-center py-12">
      <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Quotes and tenders management will be implemented soon.</p>
    </div>
  </div>
);

const ContractsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Contracts</h2>
        <p className="text-gray-500">Manage vendor contracts and agreements</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Contract
      </Button>
    </div>

    <div className="text-center py-12">
      <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Contract management will be implemented soon.</p>
    </div>
  </div>
);

const ReceivingContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Receiving</h2>
        <p className="text-gray-500">Manage incoming shipments and deliveries</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Record Receiving
      </Button>
    </div>

    <div className="text-center py-12">
      <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Receiving management will be implemented soon.</p>
    </div>
  </div>
);

const DeliveryScheduleContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Delivery Schedule</h2>
        <p className="text-gray-500">Track and manage upcoming deliveries</p>
      </div>
      <Button className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        View Calendar
      </Button>
    </div>

    <div className="text-center py-12">
      <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Delivery schedule management will be implemented soon.</p>
    </div>
  </div>
);

const ApprovalsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Approvals</h2>
        <p className="text-gray-500">Manage approval workflows for procurement</p>
      </div>
      <Button className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4" />
        Review Pending
      </Button>
    </div>

    <div className="text-center py-12">
      <CheckSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Approval workflow management will be implemented soon.</p>
    </div>
  </div>
);

const OrderTrackingContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Order Tracking</h2>
        <p className="text-gray-500">Track status of orders and shipments</p>
      </div>
      <Button className="flex items-center gap-2">
        <Truck className="h-4 w-4" />
        Track Order
      </Button>
    </div>

    <div className="text-center py-12">
      <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Order tracking functionality will be implemented soon.</p>
    </div>
  </div>
);

const PendingItemsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Pending Items</h2>
        <p className="text-gray-500">Manage items awaiting action</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Pending items management will be implemented soon.</p>
    </div>
  </div>
);

const ItemSearchContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Item Search</h2>
        <p className="text-gray-500">Search for items across purchase orders and requisitions</p>
      </div>
      <Button variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Results
      </Button>
    </div>

    <div className="text-center py-12">
      <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Item search functionality will be implemented soon.</p>
    </div>
  </div>
);

const ReportsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Reports</h2>
        <p className="text-gray-500">Generate and view procurement reports</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Reports
      </Button>
    </div>

    <div className="text-center py-12">
      <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Procurement reporting will be implemented soon.</p>
    </div>
  </div>
);

const SettingsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Settings</h2>
        <p className="text-gray-500">Configure procurement system settings</p>
      </div>
      <Button className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Save Changes
      </Button>
    </div>

    <div className="text-center py-12">
      <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Procurement settings will be implemented soon.</p>
    </div>
  </div>
);

export default ProcurementModule;
