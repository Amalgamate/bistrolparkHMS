import React, { useState, useEffect } from 'react';
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  FileText,
  ClipboardList
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Label } from '../ui/label';
import { useLab, ExternalPatient } from '../../context/LabContext';
import { format, parseISO } from 'date-fns';

interface WalkInPatientsProps {
  branch: string;
}

const WalkInPatients: React.FC<WalkInPatientsProps> = ({ branch }) => {
  const { externalPatients, registerExternalPatient, labRequests, createLabRequest, labTests } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(externalPatients);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isNewRequestDialogOpen, setIsNewRequestDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<ExternalPatient | null>(null);
  
  // Form state for new external patient
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as const,
    age: 0,
    phone: '',
    email: '',
    idNumber: '',
    referredBy: ''
  });

  // Form state for new lab request
  const [requestFormData, setRequestFormData] = useState({
    tests: [] as string[],
    priority: 'normal' as const,
    paymentMethod: 'cash' as const,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceApprovalCode: ''
  });

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = externalPatients;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(patient => 
        `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query) ||
        patient.phone.toLowerCase().includes(query) ||
        (patient.email && patient.email.toLowerCase().includes(query)) ||
        (patient.idNumber && patient.idNumber.toLowerCase().includes(query))
      );
    }

    setFilteredPatients(filtered);
  }, [externalPatients, searchQuery]);

  // Handle form input changes for patient registration
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseInt(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle select changes for patient registration
  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form input changes for lab request
  const handleRequestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestFormData({
      ...requestFormData,
      [name]: value
    });
  };

  // Handle select changes for lab request
  const handleRequestSelectChange = (value: string, name: string) => {
    setRequestFormData({
      ...requestFormData,
      [name]: value
    });
  };

  // Handle test selection
  const handleTestSelection = (testId: string, checked: boolean) => {
    if (checked) {
      setRequestFormData({
        ...requestFormData,
        tests: [...requestFormData.tests, testId]
      });
    } else {
      setRequestFormData({
        ...requestFormData,
        tests: requestFormData.tests.filter(id => id !== testId)
      });
    }
  };

  // Handle add new external patient
  const handleAddPatient = () => {
    registerExternalPatient(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle create new lab request
  const handleCreateRequest = () => {
    if (selectedPatient && requestFormData.tests.length > 0) {
      // Calculate total amount
      const totalAmount = requestFormData.tests.reduce((total, testId) => {
        const test = labTests.find(t => t.id === testId);
        return total + (test ? test.price : 0);
      }, 0);

      // Create test objects
      const tests = requestFormData.tests.map(testId => {
        const test = labTests.find(t => t.id === testId);
        return {
          id: `T${Math.random().toString(36).substr(2, 9)}`,
          testId,
          testName: test ? test.name : 'Unknown Test',
          status: 'pending' as const,
          requestedAt: new Date().toISOString()
        };
      });

      // Create the request
      createLabRequest({
        patientId: selectedPatient.id,
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientType: 'external',
        tests,
        priority: requestFormData.priority,
        branch: branch === 'all' ? 'Fedha' : branch, // Default to Fedha if 'all' is selected
        totalAmount,
        paymentStatus: 'pending',
        paymentMethod: requestFormData.paymentMethod as any,
        ...(requestFormData.paymentMethod === 'insurance' ? {
          insuranceProvider: requestFormData.insuranceProvider,
          insurancePolicyNumber: requestFormData.insurancePolicyNumber,
          insuranceApprovalCode: requestFormData.insuranceApprovalCode
        } : {})
      });

      setIsNewRequestDialogOpen(false);
      resetRequestForm();
      setSelectedPatient(null);
    }
  };

  // Reset patient form
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      gender: 'male',
      age: 0,
      phone: '',
      email: '',
      idNumber: '',
      referredBy: ''
    });
  };

  // Reset request form
  const resetRequestForm = () => {
    setRequestFormData({
      tests: [],
      priority: 'normal',
      paymentMethod: 'cash',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceApprovalCode: ''
    });
  };

  // Open new request dialog
  const openNewRequestDialog = (patient: ExternalPatient) => {
    setSelectedPatient(patient);
    resetRequestForm();
    setIsNewRequestDialogOpen(true);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMM yyyy');
  };

  // Get patient visit count
  const getPatientVisitCount = (patientId: string) => {
    return labRequests.filter(request => request.patientId === patientId).length;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Walk-In Patients</CardTitle>
            <CardDescription>Manage external patients who come directly for lab tests</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Register New Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New External Patient</DialogTitle>
                <DialogDescription>
                  Enter the details for the new walk-in patient.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange(value, 'gender')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idNumber">ID Number (Optional)</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="referredBy">Referred By (Optional)</Label>
                  <Input
                    id="referredBy"
                    name="referredBy"
                    value={formData.referredBy}
                    onChange={handleInputChange}
                    placeholder="Doctor or facility name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPatient}>Register Patient</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Patients Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Visit Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No external patients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map(patient => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.id}</TableCell>
                    <TableCell>
                      {patient.firstName} {patient.lastName}
                      {patient.referredBy && (
                        <div className="text-xs text-gray-500">
                          Referred by: {patient.referredBy}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{formatDate(patient.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {getPatientVisitCount(patient.id)} visits
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openNewRequestDialog(patient)}>
                            <ClipboardList className="mr-2 h-4 w-4" />
                            New Lab Request
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Patient
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* New Lab Request Dialog */}
      <Dialog open={isNewRequestDialogOpen} onOpenChange={setIsNewRequestDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>New Lab Request</DialogTitle>
            <DialogDescription>
              {selectedPatient && `Create a new lab request for ${selectedPatient.firstName} ${selectedPatient.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Tests</Label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-md p-2">
                {labTests.filter(test => test.active).map(test => (
                  <div key={test.id} className="flex items-center space-x-2 p-2 border rounded-md">
                    <input
                      type="checkbox"
                      id={`test-${test.id}`}
                      checked={requestFormData.tests.includes(test.id)}
                      onChange={(e) => handleTestSelection(test.id, e.target.checked)}
                      className="h-4 w-4"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`test-${test.id}`} className="font-medium">
                        {test.name}
                      </Label>
                      <div className="text-xs text-gray-500">
                        {test.category} • KES {test.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={requestFormData.priority}
                  onValueChange={(value) => handleRequestSelectChange(value, 'priority')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT (Emergency)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={requestFormData.paymentMethod}
                  onValueChange={(value) => handleRequestSelectChange(value, 'paymentMethod')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="mpesa">M-Pesa</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {requestFormData.paymentMethod === 'insurance' && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={requestFormData.insuranceProvider}
                    onChange={handleRequestInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      name="insurancePolicyNumber"
                      value={requestFormData.insurancePolicyNumber}
                      onChange={handleRequestInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuranceApprovalCode">Approval Code</Label>
                    <Input
                      id="insuranceApprovalCode"
                      name="insuranceApprovalCode"
                      value={requestFormData.insuranceApprovalCode}
                      onChange={handleRequestInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>KES {requestFormData.tests.reduce((total, testId) => {
                  const test = labTests.find(t => t.id === testId);
                  return total + (test ? test.price : 0);
                }, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewRequestDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRequest}
              disabled={requestFormData.tests.length === 0}
            >
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default WalkInPatients;
