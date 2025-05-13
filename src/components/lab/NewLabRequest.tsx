import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { useLab } from '../../context/LabContext';
import { usePatient } from '../../context/PatientContext';
import { Badge } from '../ui/badge';

interface NewLabRequestProps {
  branch: string;
}

const NewLabRequest: React.FC<NewLabRequestProps> = ({ branch }) => {
  const { labTests, createLabRequest } = useLab();
  const { patients } = usePatient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [requestType, setRequestType] = useState<'internal' | 'external'>('internal');
  
  // Form state
  const [formData, setFormData] = useState({
    priority: 'normal' as const,
    paymentMethod: 'cash' as const,
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceApprovalCode: '',
    referredBy: '',
    notes: ''
  });

  // External patient form
  const [externalPatientForm, setExternalPatientForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as const,
    age: 0,
    phone: '',
    email: '',
    idNumber: ''
  });

  // Apply filters when dependencies change
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPatients(
        patients.filter(patient => 
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
          patient.id.toString().includes(query) ||
          (patient.phone && patient.phone.toLowerCase().includes(query)) ||
          (patient.email && patient.email.toLowerCase().includes(query))
        )
      );
    } else {
      setFilteredPatients(patients);
    }
  }, [patients, searchQuery]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle external patient form changes
  const handleExternalPatientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setExternalPatientForm({
        ...externalPatientForm,
        [name]: parseInt(value) || 0
      });
    } else {
      setExternalPatientForm({
        ...externalPatientForm,
        [name]: value
      });
    }
  };

  // Handle external patient select changes
  const handleExternalPatientSelectChange = (value: string, name: string) => {
    setExternalPatientForm({
      ...externalPatientForm,
      [name]: value
    });
  };

  // Handle test selection
  const handleTestSelection = (testId: string, checked: boolean) => {
    if (checked) {
      setSelectedTests([...selectedTests, testId]);
    } else {
      setSelectedTests(selectedTests.filter(id => id !== testId));
    }
  };

  // Handle patient selection
  const handlePatientSelection = (patient: typeof patients[0]) => {
    setSelectedPatient(patient);
  };

  // Calculate total amount
  const calculateTotal = () => {
    return selectedTests.reduce((total, testId) => {
      const test = labTests.find(t => t.id === testId);
      return total + (test ? test.price : 0);
    }, 0);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedPatient && requestType === 'internal') {
      alert('Please select a patient');
      return;
    }

    if (requestType === 'external' && (!externalPatientForm.firstName || !externalPatientForm.lastName || !externalPatientForm.phone)) {
      alert('Please fill in all required fields for the external patient');
      return;
    }

    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    // Create test objects
    const tests = selectedTests.map(testId => {
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
    if (requestType === 'internal' && selectedPatient) {
      createLabRequest({
        patientId: selectedPatient.id.toString(),
        patientName: `${selectedPatient.firstName} ${selectedPatient.lastName}`,
        patientType: 'internal',
        tests,
        priority: formData.priority,
        branch: branch === 'all' ? 'Fedha' : branch, // Default to Fedha if 'all' is selected
        totalAmount: calculateTotal(),
        paymentStatus: 'pending',
        paymentMethod: formData.paymentMethod as any,
        ...(formData.paymentMethod === 'insurance' ? {
          insuranceProvider: formData.insuranceProvider,
          insurancePolicyNumber: formData.insurancePolicyNumber,
          insuranceApprovalCode: formData.insuranceApprovalCode
        } : {})
      });
    } else if (requestType === 'external') {
      // In a real app, we would first register the external patient
      // For this demo, we'll just create the request with the external patient info
      createLabRequest({
        patientId: `EP${Math.random().toString(36).substr(2, 9)}`,
        patientName: `${externalPatientForm.firstName} ${externalPatientForm.lastName}`,
        patientType: 'external',
        tests,
        priority: formData.priority,
        branch: branch === 'all' ? 'Fedha' : branch,
        totalAmount: calculateTotal(),
        paymentStatus: 'pending',
        paymentMethod: formData.paymentMethod as any,
        ...(formData.paymentMethod === 'insurance' ? {
          insuranceProvider: formData.insuranceProvider,
          insurancePolicyNumber: formData.insurancePolicyNumber,
          insuranceApprovalCode: formData.insuranceApprovalCode
        } : {})
      });
    }

    // Reset form
    setSelectedPatient(null);
    setSelectedTests([]);
    setSearchQuery('');
    setFormData({
      priority: 'normal',
      paymentMethod: 'cash',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceApprovalCode: '',
      referredBy: '',
      notes: ''
    });
    setExternalPatientForm({
      firstName: '',
      lastName: '',
      gender: 'male',
      age: 0,
      phone: '',
      email: '',
      idNumber: ''
    });

    alert('Lab request created successfully!');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">New Lab Request</CardTitle>
            <CardDescription>Create a new laboratory test request</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="internal" value={requestType} onValueChange={(value) => setRequestType(value as 'internal' | 'external')}>
          <TabsList className="mb-4">
            <TabsTrigger value="internal">
              <User className="mr-2 h-4 w-4" />
              Registered Patient
            </TabsTrigger>
            <TabsTrigger value="external">
              <UserPlus className="mr-2 h-4 w-4" />
              Walk-In Patient
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="internal">
            <div className="grid gap-6">
              {/* Patient Selection */}
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-medium mb-4">Select Patient</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search patients by name, ID, phone..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {filteredPatients.length === 0 ? (
                    <div className="col-span-2 text-center py-4 text-gray-500">
                      No patients found
                    </div>
                  ) : (
                    filteredPatients.map(patient => (
                      <div
                        key={patient.id}
                        className={`border rounded-md p-3 cursor-pointer ${
                          selectedPatient?.id === patient.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => handlePatientSelection(patient)}
                      >
                        <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {patient.id}</div>
                        <div className="text-sm text-gray-500">
                          {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                        </div>
                        {patient.phone && (
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="external">
            <div className="border rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium mb-4">External Patient Information</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={externalPatientForm.firstName}
                      onChange={handleExternalPatientChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={externalPatientForm.lastName}
                      onChange={handleExternalPatientChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select
                      value={externalPatientForm.gender}
                      onValueChange={(value) => handleExternalPatientSelectChange(value, 'gender')}
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
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={externalPatientForm.age || ''}
                      onChange={handleExternalPatientChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={externalPatientForm.phone}
                    onChange={handleExternalPatientChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={externalPatientForm.email}
                      onChange={handleExternalPatientChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="idNumber">ID Number (Optional)</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      value={externalPatientForm.idNumber}
                      onChange={handleExternalPatientChange}
                    />
                  </div>
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
            </div>
          </TabsContent>
        </Tabs>

        {/* Test Selection */}
        <div className="border rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Select Tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {labTests.filter(test => test.active).map(test => (
              <div key={test.id} className="flex items-center space-x-2 p-3 border rounded-md">
                <input
                  type="checkbox"
                  id={`test-${test.id}`}
                  checked={selectedTests.includes(test.id)}
                  onChange={(e) => handleTestSelection(test.id, e.target.checked)}
                  className="h-4 w-4"
                />
                <div className="flex-1">
                  <Label htmlFor={`test-${test.id}`} className="font-medium">
                    {test.name}
                  </Label>
                  <div className="text-xs text-gray-500">
                    {test.category} • KES {test.price.toLocaleString()}
                    {test.requiresFasting && (
                      <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px]">
                        Fasting
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Details */}
        <div className="border rounded-md p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">Request Details</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange(value, 'priority')}
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
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleSelectChange(value, 'paymentMethod')}
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
            
            {formData.paymentMethod === 'insurance' && (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    name="insuranceProvider"
                    value={formData.insuranceProvider}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
                    <Input
                      id="insurancePolicyNumber"
                      name="insurancePolicyNumber"
                      value={formData.insurancePolicyNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="insuranceApprovalCode">Approval Code</Label>
                    <Input
                      id="insuranceApprovalCode"
                      name="insuranceApprovalCode"
                      value={formData.insuranceApprovalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional information about this request"
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium mb-2">Request Summary</h3>
          <div className="grid gap-2">
            <div className="flex justify-between">
              <span>Patient:</span>
              <span className="font-medium">
                {requestType === 'internal' 
                  ? (selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Not selected')
                  : (externalPatientForm.firstName && externalPatientForm.lastName 
                      ? `${externalPatientForm.firstName} ${externalPatientForm.lastName} (External)`
                      : 'Not provided')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tests Selected:</span>
              <span className="font-medium">{selectedTests.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Priority:</span>
              <span className="font-medium">{formData.priority}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="font-medium">{formData.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
              <span>Total Amount:</span>
              <span>KES {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={
              (requestType === 'internal' && !selectedPatient) ||
              (requestType === 'external' && (!externalPatientForm.firstName || !externalPatientForm.lastName || !externalPatientForm.phone)) ||
              selectedTests.length === 0
            }
            className="w-full md:w-auto"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Create Lab Request
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewLabRequest;
