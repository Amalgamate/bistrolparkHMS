import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Package,
  Layers,
  AlertTriangle,
  BarChart,
  RefreshCw,
  Truck,
  Search,
  FileText,
  Plus,
  Filter,
  Download,
  Upload,
  Clipboard,
  Settings,
  ArrowUpDown,
  Calendar,
  ShoppingCart,
  Edit,
  Trash,
  Eye,
  CheckCircle,
  XCircle,
  CheckSquare,
  Mail,
  Bell,
  Cog,
  Briefcase,
  Database,
  HardDrive,
  Lock,
  Wrench,
  Server,
  Building,
  Users,
  Clock
} from 'lucide-react';
import InventoryModuleMenu from '../../../components/back-office/InventoryModuleMenu';

const InventoryModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('inventory-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'inventory-dashboard':
        return <InventoryDashboardContent />;
      case 'inventory-stock-levels':
        return <StockLevelsContent />;
      case 'inventory-batch-expiry':
        return <BatchExpiryContent />;
      case 'inventory-department-stock':
        return <DepartmentStockContent />;
      case 'inventory-requisitions':
        return <RequisitionsContent />;
      case 'inventory-purchase-vendor':
        return <PurchaseVendorContent />;
      case 'inventory-approvals':
        return <ApprovalsContent />;
      case 'inventory-inventory-check':
        return <InventoryCheckContent />;
      case 'inventory-stock-movement':
        return <StockMovementContent />;
      case 'inventory-low-stock':
        return <LowStockContent />;
      case 'inventory-receiving':
        return <ReceivingContent />;
      case 'inventory-item-search':
        return <ItemSearchContent />;
      case 'inventory-inventory-reports':
        return <InventoryReportsContent />;
      case 'inventory-inventory-settings':
        return <InventorySettingsContent />;
      default:
        return <InventoryDashboardContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <InventoryModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// Stock Levels Content
const StockLevelsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Stock Levels</h2>
          <p className="text-gray-500">Manage and monitor inventory stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search items..." className="pl-8" />
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
              <SelectItem value="medications">Medications</SelectItem>
              <SelectItem value="supplies">Medical Supplies</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Item Name</div>
          <div>Category</div>
          <div>Unit</div>
          <div>In Stock</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Paracetamol 500mg</p>
              <p className="text-xs text-gray-500">SKU: MED-001</p>
            </div>
            <div>Medications</div>
            <div>Tablet</div>
            <div>2,500</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Surgical Gloves</p>
              <p className="text-xs text-gray-500">SKU: SUP-002</p>
            </div>
            <div>Supplies</div>
            <div>Pair</div>
            <div>350</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Low Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Blood Pressure Monitor</p>
              <p className="text-xs text-gray-500">SKU: EQP-003</p>
            </div>
            <div>Equipment</div>
            <div>Unit</div>
            <div>15</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inventory Check Content
const InventoryCheckContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Check</h2>
          <p className="text-gray-500">Perform and manage inventory checks</p>
        </div>
        <Button className="flex items-center gap-2">
          <Clipboard className="h-4 w-4" />
          New Inventory Check
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Last Check</h3>
          <p className="text-lg font-medium mt-1">15 May 2023</p>
          <p className="text-xs text-gray-500 mt-1">By: John Doe</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Discrepancies</h3>
          <p className="text-lg font-medium mt-1">12 Items</p>
          <p className="text-xs text-red-500 mt-1">Requires attention</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Next Scheduled</h3>
          <p className="text-lg font-medium mt-1">15 Jun 2023</p>
          <p className="text-xs text-gray-500 mt-1">Monthly check</p>
        </Card>
      </div>

      <h3 className="text-lg font-medium mb-4">Recent Inventory Checks</h3>
      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Check ID</div>
          <div>Date</div>
          <div>Performed By</div>
          <div>Items Checked</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>IC-2023-05</div>
            <div>15 May 2023</div>
            <div>John Doe</div>
            <div>245</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending Review</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>IC-2023-04</div>
            <div>15 Apr 2023</div>
            <div>Jane Smith</div>
            <div>240</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Export</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>IC-2023-03</div>
            <div>15 Mar 2023</div>
            <div>Robert Johnson</div>
            <div>238</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Export</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stock Movement Content
const StockMovementContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Stock Movement</h2>
          <p className="text-gray-500">Track and manage inventory movement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Record Movement
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search movements..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Movement Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Reference</div>
          <div>Date</div>
          <div>Item</div>
          <div>Type</div>
          <div>Quantity</div>
          <div>Performed By</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>SM-2023-001</div>
            <div>20 May 2023</div>
            <div>Paracetamol 500mg</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Stock In</span></div>
            <div>+1,000</div>
            <div>John Doe</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>SM-2023-002</div>
            <div>18 May 2023</div>
            <div>Surgical Gloves</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Stock Out</span></div>
            <div>-50</div>
            <div>Jane Smith</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div>SM-2023-003</div>
            <div>15 May 2023</div>
            <div>Blood Pressure Monitor</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Transfer</span></div>
            <div>-2</div>
            <div>Robert Johnson</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Low Stock Content
const LowStockContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Low Stock Items</h2>
          <p className="text-gray-500">Monitor and manage items with low stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Create Purchase Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-amber-600 mt-1">Below minimum threshold</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Out of Stock</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-xs text-blue-600 mt-1">Orders in progress</p>
        </Card>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Item Name</div>
          <div>Category</div>
          <div>Current Stock</div>
          <div>Min. Level</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Surgical Gloves</p>
              <p className="text-xs text-gray-500">SKU: SUP-002</p>
            </div>
            <div>Supplies</div>
            <div>350</div>
            <div>500</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Low Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Order</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Insulin Syringes</p>
              <p className="text-xs text-gray-500">SKU: SUP-005</p>
            </div>
            <div>Supplies</div>
            <div>120</div>
            <div>200</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Low Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Order</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Amoxicillin 250mg</p>
              <p className="text-xs text-gray-500">SKU: MED-008</p>
            </div>
            <div>Medications</div>
            <div>0</div>
            <div>100</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Out of Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Order</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Receiving Content
const ReceivingContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Receiving</h2>
          <p className="text-gray-500">Manage incoming inventory shipments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Receiving
        </Button>
      </div>

      <div className="border rounded-md mb-6">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>PO Number</div>
          <div>Supplier</div>
          <div>Expected Date</div>
          <div>Items</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-001</div>
            <div>MedSupply Inc.</div>
            <div>25 May 2023</div>
            <div>15</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Receive</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>PO-2023-002</div>
            <div>PharmaCorp Ltd.</div>
            <div>28 May 2023</div>
            <div>8</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">In Transit</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">Track</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Recent Receivings</h3>
      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Reference</div>
          <div>Date</div>
          <div>Supplier</div>
          <div>Items</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>RCV-2023-001</div>
            <div>20 May 2023</div>
            <div>MedSupply Inc.</div>
            <div>12</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div>RCV-2023-002</div>
            <div>15 May 2023</div>
            <div>PharmaCorp Ltd.</div>
            <div>8</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Completed</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Item Search Content
const ItemSearchContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Item Search</h2>
          <p className="text-gray-500">Search and find inventory items</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Results
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <Input placeholder="Search by name, SKU, category..." className="pl-9 py-6 text-lg" />
            </div>
          </div>
          <Button className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Medications</Button>
          <Button variant="outline" size="sm">Supplies</Button>
          <Button variant="outline" size="sm">Equipment</Button>
          <Button variant="outline" size="sm">Low Stock</Button>
          <Button variant="outline" size="sm">Recently Added</Button>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Item Name</div>
          <div>Category</div>
          <div>Unit</div>
          <div>In Stock</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Paracetamol 500mg</p>
              <p className="text-xs text-gray-500">SKU: MED-001</p>
            </div>
            <div>Medications</div>
            <div>Tablet</div>
            <div>2,500</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">In Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Surgical Gloves</p>
              <p className="text-xs text-gray-500">SKU: SUP-002</p>
            </div>
            <div>Supplies</div>
            <div>Pair</div>
            <div>350</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Low Stock</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inventory Reports Content
const InventoryReportsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Reports</h2>
          <p className="text-gray-500">Generate and view inventory reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-blue-100 rounded-full mr-3">
              <BarChart className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium">Stock Value Report</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">View the current value of inventory by category and item.</p>
          <Button variant="outline" className="w-full">Generate Report</Button>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-green-100 rounded-full mr-3">
              <ArrowUpDown className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium">Movement Report</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">Track inventory movement over a specified time period.</p>
          <Button variant="outline" className="w-full">Generate Report</Button>
        </Card>

        <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-amber-100 rounded-full mr-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium">Low Stock Report</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">View all items that are below their minimum stock level.</p>
          <Button variant="outline" className="w-full">Generate Report</Button>
        </Card>
      </div>

      <h3 className="text-lg font-medium mb-4">Recent Reports</h3>
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div>Report Name</div>
          <div>Generated On</div>
          <div>Generated By</div>
          <div>Format</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Stock Value Report - May 2023</div>
            <div>20 May 2023</div>
            <div>John Doe</div>
            <div>PDF</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div>Movement Report - April 2023</div>
            <div>30 Apr 2023</div>
            <div>Jane Smith</div>
            <div>Excel</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inventory Settings Content
const InventorySettingsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Settings</h2>
          <p className="text-gray-500">Configure inventory system settings</p>
        </div>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="auto-reorder">Auto Reorder</Label>
                <p className="text-xs text-gray-500">Automatically create purchase orders for low stock items</p>
              </div>
              <input type="checkbox" id="auto-reorder" className="toggle" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="low-stock-alerts">Low Stock Alerts</Label>
                <p className="text-xs text-gray-500">Send notifications when items reach low stock levels</p>
              </div>
              <input type="checkbox" id="low-stock-alerts" className="toggle" checked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="expiry-alerts">Expiry Alerts</Label>
                <p className="text-xs text-gray-500">Send notifications for items approaching expiry date</p>
              </div>
              <input type="checkbox" id="expiry-alerts" className="toggle" checked />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Category Management</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Inventory Categories</Label>
                <p className="text-xs text-gray-500">Manage item categories</p>
              </div>
              <Button variant="outline" size="sm">Manage Categories</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Units of Measure</Label>
                <p className="text-xs text-gray-500">Manage measurement units</p>
              </div>
              <Button variant="outline" size="sm">Manage Units</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Locations</Label>
                <p className="text-xs text-gray-500">Manage storage locations</p>
              </div>
              <Button variant="outline" size="sm">Manage Locations</Button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Supplier Management</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Suppliers</Label>
                <p className="text-xs text-gray-500">Manage inventory suppliers</p>
              </div>
              <Button variant="outline" size="sm">Manage Suppliers</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Default Lead Time</Label>
                <p className="text-xs text-gray-500">Default lead time for new suppliers (days)</p>
              </div>
              <Input type="number" defaultValue="7" className="w-20" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">System Integration</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label>Finance Integration</Label>
                <p className="text-xs text-gray-500">Integrate with finance module</p>
              </div>
              <input type="checkbox" className="toggle" checked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Pharmacy Integration</Label>
                <p className="text-xs text-gray-500">Integrate with pharmacy module</p>
              </div>
              <input type="checkbox" className="toggle" checked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Label>Lab Integration</Label>
                <p className="text-xs text-gray-500">Integrate with laboratory module</p>
              </div>
              <input type="checkbox" className="toggle" checked />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Inventory Dashboard Content
const InventoryDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Dashboard</h2>
          <p className="text-gray-500">Overview of hospital inventory system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="text-2xl font-bold mt-1">2,547</p>
          <div className="text-xs text-green-600 mt-1">+24 this month</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <div className="text-xs text-amber-600 mt-1">Requires attention</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <div className="text-xs text-blue-600 mt-1">Awaiting review</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
          <p className="text-2xl font-bold mt-1">15</p>
          <div className="text-xs text-red-600 mt-1">Within 30 days</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Stock Value by Category</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <BarChart className="h-16 w-16 text-gray-300" />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Truck className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Stock received</p>
                <p className="text-xs text-gray-500">Paracetamol 500mg - 1,000 units</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Low stock alert</p>
                <p className="text-xs text-gray-500">Surgical Gloves - 350 pairs remaining</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <CheckSquare className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Requisition approved</p>
                <p className="text-xs text-gray-500">REQ-2023-042 - Pediatrics Department</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Department Stock Status</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Emergency Department</p>
                  <p className="text-xs text-gray-500">98% of required stock</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Surgery Department</p>
                  <p className="text-xs text-gray-500">95% of required stock</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Pediatrics Department</p>
                  <p className="text-xs text-gray-500">82% of required stock</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Details</Button>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Upcoming Expirations</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Insulin Regular</p>
                <p className="text-xs text-gray-500">Expires in 15 days</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Critical</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Epinephrine 1mg/mL</p>
                <p className="text-xs text-gray-500">Expires in 22 days</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Warning</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Lidocaine 2%</p>
                <p className="text-xs text-gray-500">Expires in 28 days</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Warning</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Batch & Expiry Management Content
const BatchExpiryContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Batch & Expiry Management</h2>
          <p className="text-gray-500">Track and manage item batches and expiration dates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Batch
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Expiring This Month</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-red-600 mt-1">Requires immediate attention</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Expiring Next Month</h3>
          <p className="text-2xl font-bold mt-1">15</p>
          <p className="text-xs text-amber-600 mt-1">Plan for replacement</p>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Active Batches</h3>
          <p className="text-2xl font-bold mt-1">124</p>
          <p className="text-xs text-blue-600 mt-1">Currently in use</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="expiring">
          <TabsList className="mb-4">
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
            <TabsTrigger value="all-batches">All Batches</TabsTrigger>
            <TabsTrigger value="expired">Expired Items</TabsTrigger>
          </TabsList>

          <TabsContent value="expiring" className="space-y-4">
            <div className="border rounded-md">
              <div className="grid grid-cols-7 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Item Name</div>
                <div>Batch Number</div>
                <div>Expiry Date</div>
                <div>Quantity</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Insulin Regular</p>
                    <p className="text-xs text-gray-500">SKU: MED-042</p>
                  </div>
                  <div>BTC-2023-042</div>
                  <div>Jun 15, 2023</div>
                  <div>45 vials</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Critical</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Epinephrine 1mg/mL</p>
                    <p className="text-xs text-gray-500">SKU: MED-056</p>
                  </div>
                  <div>BTC-2023-056</div>
                  <div>Jun 22, 2023</div>
                  <div>30 ampules</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Warning</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Lidocaine 2%</p>
                    <p className="text-xs text-gray-500">SKU: MED-078</p>
                  </div>
                  <div>BTC-2023-078</div>
                  <div>Jun 28, 2023</div>
                  <div>25 vials</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Warning</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all-batches" className="space-y-4">
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
              </div>
            </div>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">All batches view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="expired" className="space-y-4">
            <div className="text-center py-12">
              <AlertTriangle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Expired items view will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Batch Tracking Settings</h3>
          <Button variant="outline" size="sm">Configure</Button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Expiry Notifications</p>
              <p className="text-xs text-gray-500">Send alerts for items expiring soon</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">30 days before</span>
              <input type="checkbox" className="toggle" checked />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto-remove Expired Items</p>
              <p className="text-xs text-gray-500">Automatically remove expired items from available stock</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">On expiry date</span>
              <input type="checkbox" className="toggle" checked />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">FEFO Inventory Method</p>
              <p className="text-xs text-gray-500">First Expired, First Out inventory management</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Enabled</span>
              <input type="checkbox" className="toggle" checked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Department Stock Content
const DepartmentStockContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Department Stock Management</h2>
          <p className="text-gray-500">Manage inventory allocation across hospital departments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            Transfer Stock
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Departments</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-gray-500 mt-1">Active departments</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Transfers</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <p className="text-xs text-blue-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Alerts</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-amber-600 mt-1">Across departments</p>
        </Card>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Department Overview</h3>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="surgery">Surgery</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="pharmacy">Pharmacy</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-md">
          <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
            <div className="col-span-2">Department</div>
            <div>Items</div>
            <div>Stock Value</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          <div className="divide-y">
            <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
              <div className="col-span-2">
                <p className="font-medium">Emergency Department</p>
                <p className="text-xs text-gray-500">Main Hospital, 1st Floor</p>
              </div>
              <div>245</div>
              <div>$24,580</div>
              <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Optimal</span></div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Transfer</Button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
              <div className="col-span-2">
                <p className="font-medium">Surgery Department</p>
                <p className="text-xs text-gray-500">Main Hospital, 2nd Floor</p>
              </div>
              <div>312</div>
              <div>$56,780</div>
              <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Optimal</span></div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Transfer</Button>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
              <div className="col-span-2">
                <p className="font-medium">Pediatrics Department</p>
                <p className="text-xs text-gray-500">Main Hospital, 3rd Floor</p>
              </div>
              <div>186</div>
              <div>$18,450</div>
              <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Low Stock</span></div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Transfer</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Recent Transfers</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Central Store → Emergency</p>
                  <p className="text-xs text-gray-500">15 items transferred</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Pharmacy → Surgery</p>
                  <p className="text-xs text-gray-500">8 items transferred</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <ArrowUpDown className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Central Store → Laboratory</p>
                  <p className="text-xs text-gray-500">12 items transferred</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Department Stock Alerts</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Pediatrics Department</p>
                  <p className="text-xs text-gray-500">Low on antibiotics</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Resolve</Button>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Emergency Department</p>
                  <p className="text-xs text-gray-500">Low on IV fluids</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Resolve</Button>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Surgery Department</p>
                  <p className="text-xs text-gray-500">Low on surgical gloves</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Resolve</Button>
            </div>
          </div>
        </Card>
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
          <p className="text-gray-500">Manage inventory requisition requests</p>
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
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-blue-600 mt-1">Awaiting approval</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="text-2xl font-bold mt-1">15</p>
          <p className="text-xs text-green-600 mt-1">Ready for processing</p>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
          <p className="text-2xl font-bold mt-1">6</p>
          <p className="text-xs text-amber-600 mt-1">Being processed</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="text-2xl font-bold mt-1">2</p>
          <p className="text-xs text-red-600 mt-1">Requires revision</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
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
                  <div>REQ-2023-042</div>
                  <div>Pediatrics</div>
                  <div>Dr. Sarah Johnson</div>
                  <div>May 20, 2023</div>
                  <div>12</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-043</div>
                  <div>Emergency</div>
                  <div>Dr. Michael Chen</div>
                  <div>May 21, 2023</div>
                  <div>8</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>REQ-2023-044</div>
                  <div>Surgery</div>
                  <div>Dr. Robert Williams</div>
                  <div>May 22, 2023</div>
                  <div>15</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
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
              <CheckSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Approved requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="space-y-4">
            <div className="text-center py-12">
              <RefreshCw className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">In-progress requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Completed requisitions view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="text-center py-12">
              <XCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Rejected requisitions view will be implemented soon.</p>
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
              <p className="text-sm font-medium">Deliver</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>Current workflow requires approval from department head and inventory manager before processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Purchase & Vendor Management Content
const PurchaseVendorContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Purchase & Vendor Management</h2>
          <p className="text-gray-500">Manage purchase orders and vendor relationships</p>
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

      <div className="mb-6">
        <Tabs defaultValue="purchase-orders">
          <TabsList className="mb-4">
            <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="vendors">Vendors</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>

          <TabsContent value="purchase-orders" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-l-4 border-blue-500">
                <h3 className="text-sm font-medium text-gray-500">Draft</h3>
                <p className="text-2xl font-bold mt-1">3</p>
                <p className="text-xs text-blue-600 mt-1">Not yet submitted</p>
              </Card>
              <Card className="p-4 border-l-4 border-amber-500">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold mt-1">5</p>
                <p className="text-xs text-amber-600 mt-1">Awaiting vendor response</p>
              </Card>
              <Card className="p-4 border-l-4 border-green-500">
                <h3 className="text-sm font-medium text-gray-500">Confirmed</h3>
                <p className="text-2xl font-bold mt-1">8</p>
                <p className="text-xs text-green-600 mt-1">Ready for receiving</p>
              </Card>
              <Card className="p-4 border-l-4 border-purple-500">
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="text-2xl font-bold mt-1">$45,780</p>
                <p className="text-xs text-purple-600 mt-1">Total purchase value</p>
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
                  <div>PO-2023-001</div>
                  <div>MedSupply Inc.</div>
                  <div>May 15, 2023</div>
                  <div>15</div>
                  <div>$12,450</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Confirmed</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Receive</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>PO-2023-002</div>
                  <div>PharmaCorp Ltd.</div>
                  <div>May 18, 2023</div>
                  <div>8</div>
                  <div>$8,320</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Track</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>PO-2023-003</div>
                  <div>MedTech Solutions</div>
                  <div>May 20, 2023</div>
                  <div>12</div>
                  <div>$15,780</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Draft</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vendors" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search vendors..." className="pl-8" />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Vendor
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Vendor Name</div>
                <div>Contact</div>
                <div>Items Supplied</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">MedSupply Inc.</p>
                    <p className="text-xs text-gray-500">Medical supplies and equipment</p>
                  </div>
                  <div>
                    <p className="text-sm">John Smith</p>
                    <p className="text-xs text-gray-500">john@medsupply.com</p>
                  </div>
                  <div>125</div>
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
                  <div>
                    <p className="text-sm">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">sarah@pharmacorp.com</p>
                  </div>
                  <div>86</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">MedTech Solutions</p>
                    <p className="text-xs text-gray-500">Medical technology and equipment</p>
                  </div>
                  <div>
                    <p className="text-sm">Michael Chen</p>
                    <p className="text-xs text-gray-500">michael@medtech.com</p>
                  </div>
                  <div>42</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Vendor contracts management will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">Upcoming Deliveries</h3>
            <Button variant="outline" size="sm">View All</Button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">MedSupply Inc.</p>
                  <p className="text-xs text-gray-500">PO-2023-001 - 15 items</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Expected: May 25, 2023</p>
            </div>
            <div className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">PharmaCorp Ltd.</p>
                  <p className="text-xs text-gray-500">PO-2023-002 - 8 items</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Expected: May 28, 2023</p>
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
                <p className="font-medium">MedTech Solutions</p>
                <p className="text-xs text-gray-500">On-time delivery rate</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Approval Workflows Content
const ApprovalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Approval Workflows</h2>
          <p className="text-gray-500">Manage approval processes for inventory operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <p className="text-xs text-blue-600 mt-1">Awaiting your action</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Approved Today</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <p className="text-xs text-green-600 mt-1">Processed successfully</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Rejected Today</h3>
          <p className="text-2xl font-bold mt-1">2</p>
          <p className="text-xs text-red-600 mt-1">Sent back for revision</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Avg. Approval Time</h3>
          <p className="text-2xl font-bold mt-1">4.2 hrs</p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="history">Approval History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
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
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>PO-2023-003</div>
                  <div>Purchase Order</div>
                  <div>John Smith</div>
                  <div>May 21, 2023</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Medium</span></div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
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
                  <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Pending</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-4">
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">My requests view will be implemented soon.</p>
            </div>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Active Workflows</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Workflow
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-5 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div className="col-span-2">Workflow Name</div>
                <div>Type</div>
                <div>Approvers</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Requisition Approval</p>
                    <p className="text-xs text-gray-500">For all department requisitions</p>
                  </div>
                  <div>Requisition</div>
                  <div>3</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Purchase Order Approval</p>
                    <p className="text-xs text-gray-500">For orders above $5,000</p>
                  </div>
                  <div>Purchase Order</div>
                  <div>2</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="col-span-2">
                    <p className="font-medium">Stock Transfer Approval</p>
                    <p className="text-xs text-gray-500">For inter-department transfers</p>
                  </div>
                  <div>Stock Transfer</div>
                  <div>2</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">View</Button>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Approval history will be implemented soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="border rounded-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Workflow Example: Requisition Approval</h3>
          <Button variant="outline" size="sm">Edit Workflow</Button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Request</p>
              <p className="text-xs text-gray-500">Department</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mb-2">
                <CheckSquare className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Approval 1</p>
              <p className="text-xs text-gray-500">Dept. Head</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mb-2">
                <CheckSquare className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Approval 2</p>
              <p className="text-xs text-gray-500">Inventory Mgr</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center mb-2">
                <CheckSquare className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Approval 3</p>
              <p className="text-xs text-gray-500">Finance</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center mb-2">
                <CheckCircle className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Complete</p>
              <p className="text-xs text-gray-500">Processing</p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <p>This workflow requires approval from the Department Head, Inventory Manager, and Finance Department before processing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModule;
