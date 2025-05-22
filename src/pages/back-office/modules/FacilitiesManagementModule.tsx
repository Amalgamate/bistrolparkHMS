import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Home,
  Building,
  Trash2,
  Shirt,
  Wrench,
  Hammer,
  Thermometer,
  Bed,
  Warehouse,
  Truck,
  FileText,
  Settings,
  BarChart,
  Calendar,
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Search,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Eye,
  Edit,
  RefreshCw,
  Upload
} from 'lucide-react';
import FacilitiesManagementModuleMenu from '../../../components/back-office/FacilitiesManagementModuleMenu';

const FacilitiesManagementModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('facilities-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'facilities-dashboard':
        return <FacilitiesDashboardContent />;
      case 'facilities-buildings':
        return <BuildingsContent />;
      case 'facilities-waste-management':
        return <WasteManagementContent />;
      case 'facilities-laundry':
        return <LaundryServicesContent />;
      case 'facilities-maintenance':
        return <MaintenanceRequestsContent />;
      case 'facilities-equipment':
        return <EquipmentManagementContent />;
      case 'facilities-hvac':
        return <HVACSystemsContent />;
      case 'facilities-beds':
        return <BedManagementContent />;
      case 'facilities-storage':
        return <StorageAreasContent />;
      case 'facilities-transport':
        return <TransportServicesContent />;
      case 'facilities-contracts':
        return <ServiceContractsContent />;
      case 'facilities-schedules':
        return <MaintenanceSchedulesContent />;
      case 'facilities-incidents':
        return <IncidentReportsContent />;
      case 'facilities-reports':
        return <FacilitiesReportsContent />;
      case 'facilities-settings':
        return <FacilitiesSettingsContent />;
      default:
        return <FacilitiesDashboardContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <FacilitiesManagementModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// Facilities Dashboard Content
const FacilitiesDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Facilities Dashboard</h2>
          <p className="text-gray-500">Overview of facilities management activities</p>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Maintenance Requests</h3>
          <p className="text-2xl font-bold mt-1">24</p>
          <div className="text-xs text-amber-600 mt-1">8 pending approval</div>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Critical Issues</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <div className="text-xs text-red-600 mt-1">Require immediate attention</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <div className="text-xs text-green-600 mt-1">Tasks completed</div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Scheduled Maintenance</h3>
          <p className="text-2xl font-bold mt-1">7</p>
          <div className="text-xs text-blue-600 mt-1">For next 7 days</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">HVAC Maintenance Completed</p>
                <p className="text-xs text-gray-500">Building A - 3rd Floor</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Wrench className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New Maintenance Request</p>
                <p className="text-xs text-gray-500">Plumbing Issue - Radiology Department</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Shirt className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Laundry Batch Processed</p>
                <p className="text-xs text-gray-500">250 kg - Ward Linens</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Upcoming Maintenance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Elevator Inspection</p>
                <p className="text-xs text-gray-500">Building B - Main Elevator</p>
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Tomorrow</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Generator Testing</p>
                <p className="text-xs text-gray-500">Main Power System</p>
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Jun 22, 2023</span>
              </div>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div>
                <p className="font-medium">Fire Alarm Testing</p>
                <p className="text-xs text-gray-500">All Buildings</p>
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Jun 25, 2023</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Trash2 className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="font-medium">Waste Management</h3>
          <p className="text-sm text-gray-500 mt-1">Next collection: Today</p>
          <Button variant="outline" size="sm" className="mt-3">View Details</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Shirt className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Laundry Services</h3>
          <p className="text-sm text-gray-500 mt-1">Processing: 180kg</p>
          <Button variant="outline" size="sm" className="mt-3">View Details</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Bed className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">Bed Management</h3>
          <p className="text-sm text-gray-500 mt-1">Available: 42 beds</p>
          <Button variant="outline" size="sm" className="mt-3">View Details</Button>
        </Card>
      </div>
    </div>
  );
};

// Waste Management Content
const WasteManagementContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Waste Management</h2>
          <p className="text-gray-500">Track and manage hospital waste disposal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Biohazard Waste</h3>
          <p className="text-2xl font-bold mt-1">120 kg</p>
          <div className="text-xs text-red-600 mt-1">This week</div>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <h3 className="text-sm font-medium text-gray-500">Pharmaceutical</h3>
          <p className="text-2xl font-bold mt-1">45 kg</p>
          <div className="text-xs text-yellow-600 mt-1">This week</div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">General Waste</h3>
          <p className="text-2xl font-bold mt-1">350 kg</p>
          <div className="text-xs text-blue-600 mt-1">This week</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Recycled</h3>
          <p className="text-2xl font-bold mt-1">85 kg</p>
          <div className="text-xs text-green-600 mt-1">This week</div>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="collection">
          <TabsList className="mb-4">
            <TabsTrigger value="collection">Collection Schedule</TabsTrigger>
            <TabsTrigger value="disposal">Disposal Records</TabsTrigger>
            <TabsTrigger value="categories">Waste Categories</TabsTrigger>
            <TabsTrigger value="vendors">Disposal Vendors</TabsTrigger>
          </TabsList>

          <TabsContent value="collection" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search schedule..." className="pl-8" />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Schedule
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Waste Type</div>
                <div>Department</div>
                <div>Collection Day</div>
                <div>Time</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Biohazard</div>
                  <div>All Clinical Areas</div>
                  <div>Monday, Wednesday, Friday</div>
                  <div>08:00 AM</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Pharmaceutical</div>
                  <div>Pharmacy</div>
                  <div>Tuesday</div>
                  <div>10:00 AM</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>General Waste</div>
                  <div>All Departments</div>
                  <div>Daily</div>
                  <div>06:00 AM, 06:00 PM</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="disposal" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Disposal records will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="text-center py-12">
              <Trash2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Waste categories management will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <div className="text-center py-12">
              <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Disposal vendors management will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Laundry Services Content
const LaundryServicesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Laundry Services</h2>
          <p className="text-gray-500">Manage hospital laundry operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Processing</h3>
          <p className="text-2xl font-bold mt-1">180 kg</p>
          <div className="text-xs text-blue-600 mt-1">Current batch</div>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-1">250 kg</p>
          <div className="text-xs text-amber-600 mt-1">Awaiting processing</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Completed Today</h3>
          <p className="text-2xl font-bold mt-1">420 kg</p>
          <div className="text-xs text-green-600 mt-1">Ready for delivery</div>
        </Card>
        <Card className="p-4 border-l-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-500">Linen Inventory</h3>
          <p className="text-2xl font-bold mt-1">1,250</p>
          <div className="text-xs text-purple-600 mt-1">Items in circulation</div>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="batches">
          <TabsList className="mb-4">
            <TabsTrigger value="batches">Laundry Batches</TabsTrigger>
            <TabsTrigger value="inventory">Linen Inventory</TabsTrigger>
            <TabsTrigger value="requests">Department Requests</TabsTrigger>
            <TabsTrigger value="schedule">Processing Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="batches" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search batches..." className="pl-8" />
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
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Batch ID</div>
                <div>Source</div>
                <div>Type</div>
                <div>Weight (kg)</div>
                <div>Received</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>LB-2023-042</div>
                  <div>Ward A</div>
                  <div>Bed Linens</div>
                  <div>85</div>
                  <div>Jun 18, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Processing</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>LB-2023-041</div>
                  <div>Surgery</div>
                  <div>Scrubs</div>
                  <div>45</div>
                  <div>Jun 18, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>LB-2023-040</div>
                  <div>Ward B</div>
                  <div>Towels</div>
                  <div>35</div>
                  <div>Jun 17, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Deliver</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="text-center py-12">
              <Shirt className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Linen inventory management will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Department requests will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Processing schedule will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Maintenance Requests Content
const MaintenanceRequestsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Maintenance Requests</h2>
          <p className="text-gray-500">Manage facility maintenance requests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Critical</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <div className="text-xs text-red-600 mt-1">Urgent attention needed</div>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-1">18</p>
          <div className="text-xs text-amber-600 mt-1">Awaiting assignment</div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
          <p className="text-2xl font-bold mt-1">7</p>
          <div className="text-xs text-blue-600 mt-1">Currently being addressed</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-2xl font-bold mt-1">42</p>
          <div className="text-xs text-green-600 mt-1">This month</div>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search requests..." className="pl-8" />
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
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="structural">Structural</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Request ID</div>
                <div>Type</div>
                <div>Location</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>MR-2023-056</div>
                  <div>Plumbing</div>
                  <div>Radiology - Room 3</div>
                  <div>Dr. Sarah Johnson</div>
                  <div>Jun 18, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Critical</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Assign</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>MR-2023-055</div>
                  <div>Electrical</div>
                  <div>Ward B - Room 12</div>
                  <div>Nurse John Smith</div>
                  <div>Jun 17, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">In Progress</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>MR-2023-054</div>
                  <div>HVAC</div>
                  <div>Laboratory</div>
                  <div>Lab Manager</div>
                  <div>Jun 16, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Assign</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Pending requests view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="text-center py-12">
              <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">In-progress requests view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Completed requests view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Placeholder components for remaining sections
const BuildingsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Buildings & Floors</h2>
        <p className="text-gray-500">Manage hospital buildings and floor plans</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Building
      </Button>
    </div>

    <div className="text-center py-12">
      <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Buildings management will be implemented soon.</p>
    </div>
  </div>
);

const EquipmentManagementContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Equipment Management</h2>
        <p className="text-gray-500">Track and manage hospital equipment</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Equipment
      </Button>
    </div>

    <div className="text-center py-12">
      <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Equipment management will be implemented soon.</p>
    </div>
  </div>
);

const HVACSystemsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">HVAC Systems</h2>
        <p className="text-gray-500">Monitor and manage heating, ventilation, and air conditioning</p>
      </div>
      <Button className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
    </div>

    <div className="text-center py-12">
      <Thermometer className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">HVAC systems management will be implemented soon.</p>
    </div>
  </div>
);

const BedManagementContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Bed Management</h2>
        <p className="text-gray-500">Manage hospital beds and assignments</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Bed
      </Button>
    </div>

    <div className="text-center py-12">
      <Bed className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Bed management will be implemented soon.</p>
    </div>
  </div>
);

const StorageAreasContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Storage Areas</h2>
        <p className="text-gray-500">Manage hospital storage spaces</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Storage
      </Button>
    </div>

    <div className="text-center py-12">
      <Warehouse className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Storage areas management will be implemented soon.</p>
    </div>
  </div>
);

const TransportServicesContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Transport Services</h2>
        <p className="text-gray-500">Manage hospital transport and logistics</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Transport
      </Button>
    </div>

    <div className="text-center py-12">
      <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Transport services will be implemented soon.</p>
    </div>
  </div>
);

const ServiceContractsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Service Contracts</h2>
        <p className="text-gray-500">Manage facility service contracts</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Contract
      </Button>
    </div>

    <div className="text-center py-12">
      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Service contracts management will be implemented soon.</p>
    </div>
  </div>
);

const MaintenanceSchedulesContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Maintenance Schedules</h2>
        <p className="text-gray-500">Manage preventive maintenance schedules</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Schedule
      </Button>
    </div>

    <div className="text-center py-12">
      <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Maintenance schedules will be implemented soon.</p>
    </div>
  </div>
);

const IncidentReportsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Incident Reports</h2>
        <p className="text-gray-500">Manage facility incident reports</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Report
      </Button>
    </div>

    <div className="text-center py-12">
      <AlertTriangle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Incident reports will be implemented soon.</p>
    </div>
  </div>
);

const FacilitiesReportsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Facilities Reports</h2>
        <p className="text-gray-500">Generate and view facilities reports</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Reports
      </Button>
    </div>

    <div className="text-center py-12">
      <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Facilities reporting will be implemented soon.</p>
    </div>
  </div>
);

const FacilitiesSettingsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Facilities Settings</h2>
        <p className="text-gray-500">Configure facilities management settings</p>
      </div>
      <Button className="flex items-center gap-2">
        <Settings className="h-4 w-4" />
        Save Changes
      </Button>
    </div>

    <div className="text-center py-12">
      <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Facilities settings will be implemented soon.</p>
    </div>
  </div>
);

export default FacilitiesManagementModule;
