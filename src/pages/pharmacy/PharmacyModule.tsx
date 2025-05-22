import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import {
  Package,
  RefreshCw,
  ArrowUpDown,
  Calendar,
  Clipboard,
  Box,
  Users,
  BarChart,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { usePharmacy } from '../../context/PharmacyContext';
import PharmacyModuleMenu from '../../components/pharmacy/PharmacyModuleMenu';
import StickyModuleMenu from '../../components/layout/StickyModuleMenu';
import PharmacyQuickActions from '../../components/pharmacy/PharmacyQuickActions';

const PharmacyModule: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { prescriptions } = usePharmacy();
  const [selectedBranch, setSelectedBranch] = useState(user?.branch || 'fedha');

  // Get the current active section from the URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path.includes('/queue')) return 'queue';
    if (path.includes('/inventory')) return 'inventory';
    if (path.includes('/stock-movement')) return 'stock-movement';
    if (path.includes('/expiry')) return 'expiry';
    if (path.includes('/stock-take')) return 'stock-take';
    if (path.includes('/transfers')) return 'transfers';
    if (path.includes('/reports')) return 'reports';
    if (path.includes('/settings')) return 'settings';
    return 'dashboard';
  };

  const [activeSection, setActiveSection] = useState(getCurrentSection());

  // Count of pending prescriptions for badge
  const pendingPrescriptions = prescriptions.filter(p => p.status === 'pending').length;

  // Handle menu item click
  const handleMenuItemClick = (itemId: string) => {
    setActiveSection(itemId);

    // Navigate to the corresponding route
    switch (itemId) {
      case 'dashboard':
        navigate('/pharmacy');
        break;
      case 'queue':
        navigate('/pharmacy/queue');
        break;
      case 'inventory':
        navigate('/pharmacy/inventory');
        break;
      case 'stock-movement':
        navigate('/pharmacy/stock-movement');
        break;
      case 'expiry':
        navigate('/pharmacy/expiry-report');
        break;
      case 'stock-take':
        navigate('/pharmacy/stock-take');
        break;
      case 'transfers':
        navigate('/pharmacy/transfers');
        break;
      case 'reports':
        navigate('/pharmacy/reports');
        break;
      case 'settings':
        navigate('/pharmacy/settings');
        break;
      default:
        navigate('/pharmacy');
    }
  };

  // Handle branch change
  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    showToast('info', `Switched to ${branch} branch`);
  };

  // Handle refresh
  const handleRefresh = () => {
    showToast('info', 'Refreshed pharmacy data');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pharmacy Module</h1>
        <div className="flex items-center gap-4">
          <Select value={selectedBranch} onValueChange={handleBranchChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fedha">Fedha</SelectItem>
              <SelectItem value="utawala">Utawala</SelectItem>
              <SelectItem value="machakos">Machakos</SelectItem>
              <SelectItem value="tassia">Tassia</SelectItem>
              <SelectItem value="kitengela">Kitengela</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Pharmacy Module Menu - Left Side */}
        <div className="md:w-64 flex-shrink-0">
          <StickyModuleMenu>
            <PharmacyModuleMenu
              activeItemId={activeSection}
              onItemClick={handleMenuItemClick}
              pendingPrescriptions={pendingPrescriptions}
            />
          </StickyModuleMenu>
        </div>

        {/* Main Content Area - Right Side */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <PharmacyQuickActions />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Prescription Queue</CardTitle>
                      <CardDescription>Manage patient prescriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 h-12"
                          onClick={() => navigate('/pharmacy/queue')}
                        >
                          <Users className="h-5 w-5 text-green-500" />
                          <span>View Queue</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Medication Inventory</CardTitle>
                      <CardDescription>Manage pharmacy stock</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 h-12"
                          onClick={() => navigate('/pharmacy/inventory')}
                        >
                          <Package className="h-5 w-5 text-purple-500" />
                          <span>View Inventory</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Stock Management</CardTitle>
                      <CardDescription>Track stock movements</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center gap-2 h-12"
                          onClick={() => navigate('/pharmacy/stock-movement')}
                        >
                          <ArrowUpDown className="h-5 w-5 text-blue-500" />
                          <span>Stock Movement</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            } />

            {/* Add routes for other pharmacy sections */}
            <Route path="/queue" element={<div className="bg-white p-6 rounded-lg shadow-sm">Prescription Queue Content</div>} />
            <Route path="/inventory" element={<div className="bg-white p-6 rounded-lg shadow-sm">Medication Inventory Content</div>} />
            <Route path="/stock-movement" element={<div className="bg-white p-6 rounded-lg shadow-sm">Stock Movement Content</div>} />
            <Route path="/expiry-report" element={<div className="bg-white p-6 rounded-lg shadow-sm">Expiry Management Content</div>} />
            <Route path="/stock-take" element={<div className="bg-white p-6 rounded-lg shadow-sm">Stock Take Content</div>} />
            <Route path="/transfers" element={<div className="bg-white p-6 rounded-lg shadow-sm">Internal Transfers Content</div>} />
            <Route path="/reports" element={<div className="bg-white p-6 rounded-lg shadow-sm">Reports Content</div>} />
            <Route path="/settings" element={<div className="bg-white p-6 rounded-lg shadow-sm">Settings Content</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default PharmacyModule;
