import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  Pill,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  RefreshCw,
  FileText,
  ShoppingBag,
  Clipboard
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { usePharmacy, MedicationStatus } from '../../context/PharmacyContext';
import { useToast } from '../../context/ToastContext';
import { format, formatDistanceToNow } from 'date-fns';

const PharmacyQueue: React.FC = () => {
  const { prescriptions, getPrescriptionsByStatus } = usePharmacy();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MedicationStatus | 'all'>('pending');
  const [activeTab, setActiveTab] = useState('queue');

  // Get filtered prescriptions
  const filteredPrescriptions = statusFilter === 'all'
    ? prescriptions
    : getPrescriptionsByStatus(statusFilter);

  // Apply search filter
  const searchedPrescriptions = filteredPrescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prescription.tokenNumber.toString().includes(searchQuery) ||
    prescription.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusBadge = (status: MedicationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'dispensed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Dispensed</Badge>;
      case 'partially_dispensed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partially Dispensed</Badge>;
      case 'out_of_stock':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    // In a real app, this would fetch the latest data from the server
    showToast({
      title: "Refreshed",
      description: "Prescription queue has been refreshed",
      variant: "default"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Pharmacy</CardTitle>
              <CardDescription>Manage prescriptions and medications</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search prescriptions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Prescriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('partially_dispensed')}>
                    Partially Dispensed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('dispensed')}>
                    Dispensed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('out_of_stock')}>
                    Out of Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="queue">Prescription Queue</TabsTrigger>
              <TabsTrigger value="dispensing">Dispensing</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              {searchedPrescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Pill className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Prescriptions</h3>
                  <p className="text-gray-500 mb-4">
                    There are no prescriptions matching your filters.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Token</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Medications</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchedPrescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">{prescription.tokenNumber}</TableCell>
                          <TableCell>{prescription.patientName}</TableCell>
                          <TableCell>{prescription.doctorName}</TableCell>
                          <TableCell>{prescription.medications.length} items</TableCell>
                          <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1 text-gray-500" />
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(prescription.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // This would navigate to the prescription details page
                                showToast({
                                  title: "Prescription",
                                  description: `Viewing prescription for ${prescription.patientName}`,
                                  variant: "default"
                                });
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="dispensing">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="text-md font-medium text-blue-800 mb-2 flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Active Dispensing
                  </h3>
                  <p className="text-sm text-blue-700">
                    Select a prescription from the queue to begin dispensing medications.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Ready for Dispensing</CardTitle>
                      <CardDescription>Prescriptions ready to be dispensed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredPrescriptions.filter(p => p.status === 'pending').length > 0 ? (
                        <div className="space-y-3">
                          {filteredPrescriptions
                            .filter(p => p.status === 'pending')
                            .slice(0, 3)
                            .map(prescription => (
                              <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                <div>
                                  <div className="font-medium">{prescription.patientName}</div>
                                  <div className="text-sm text-gray-500">
                                    {prescription.medications.length} medications
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    showToast({
                                      title: "Dispensing",
                                      description: `Preparing to dispense medications for ${prescription.patientName}`,
                                      variant: "default"
                                    });
                                  }}
                                >
                                  Dispense
                                </Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No prescriptions waiting for dispensing
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Recently Dispensed</CardTitle>
                      <CardDescription>Recently completed prescriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredPrescriptions.filter(p => p.status === 'dispensed').length > 0 ? (
                        <div className="space-y-3">
                          {filteredPrescriptions
                            .filter(p => p.status === 'dispensed')
                            .slice(0, 3)
                            .map(prescription => (
                              <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                                <div>
                                  <div className="font-medium">{prescription.patientName}</div>
                                  <div className="text-sm text-gray-500">
                                    Dispensed {formatDistanceToNow(new Date(prescription.updatedAt), { addSuffix: true })}
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                  Completed
                                </Badge>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          No recently dispensed prescriptions
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Medication Dispensing Form</CardTitle>
                    <CardDescription>Dispense medications for selected prescription</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Prescription Selected</h3>
                      <p className="text-gray-500 mb-4">
                        Select a prescription from the queue to begin dispensing medications.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="inventory">
              <div className="space-y-6">
                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                  <h3 className="text-md font-medium text-yellow-800 mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Inventory Alerts
                  </h3>
                  <div className="flex space-x-4">
                    <div className="text-sm text-yellow-700">
                      <span className="font-medium">3</span> medications below reorder level
                    </div>
                    <div className="text-sm text-yellow-700">
                      <span className="font-medium">5</span> medications expiring within 30 days
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Medications</p>
                          <h3 className="text-2xl font-bold">247</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Pill className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
                          <h3 className="text-2xl font-bold">3</h3>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-yellow-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                          <h3 className="text-2xl font-bold">5</h3>
                        </div>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Clock className="h-6 w-6 text-red-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-md">Medication Inventory</CardTitle>
                        <CardDescription>Current stock levels and details</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Package className="h-4 w-4 mr-1" />
                          New Stock
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clipboard className="h-4 w-4 mr-1" />
                          Stock Take
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Medication</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Current Stock</TableHead>
                            <TableHead>Reorder Level</TableHead>
                            <TableHead>Expiry Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">Amoxicillin 500mg</TableCell>
                            <TableCell>Antibiotics</TableCell>
                            <TableCell>125</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>Dec 15, 2024</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                In Stock
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Paracetamol 500mg</TableCell>
                            <TableCell>Analgesics</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell>50</TableCell>
                            <TableCell>Nov 30, 2024</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Low Stock
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Metformin 850mg</TableCell>
                            <TableCell>Antidiabetics</TableCell>
                            <TableCell>78</TableCell>
                            <TableCell>30</TableCell>
                            <TableCell>Aug 10, 2024</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                Expiring Soon
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyQueue;
