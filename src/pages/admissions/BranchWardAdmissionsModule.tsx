import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Building2,
  Bed,
  Users,
  Activity,
  Search,
  ArrowRightLeft,
  MapPin,
  Phone,
  User,
  Stethoscope,
  Clock,
  Baby,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { ColoredIcon } from '../../components/ui/colored-icon';

interface BranchCapacity {
  branch_id: number;
  branch_name: string;
  location: string;
  total_wards: number;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  overall_occupancy_percentage: number;
  current_patients: number;
}

interface WardOverview {
  branch_id: number;
  branch_name: string;
  ward_id: number;
  ward_name: string;
  ward_type: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_percentage: number;
  current_patients: number;
}

interface BedDetail {
  branch_id: number;
  branch_name: string;
  ward_id: number;
  ward_name: string;
  ward_type: string;
  bed_id: number;
  bed_number: string;
  bed_status: string;
  current_patient_id?: number;
  current_patient_name?: string;
  patient_gender?: string;
  admission_date?: string;
  current_admission_id?: number;
  daily_rate: number;
  diagnosis?: string;
  doctor_admitting?: string;
}

interface TransferablePatient {
  admission_id: number;
  patient_id: number;
  patient_name: string;
  patient_gender: string;
  current_ward_id: number;
  current_ward_name: string;
  current_bed_id: number;
  current_bed_number: string;
  current_branch_id: number;
  current_branch_name: string;
  diagnosis?: string;
  doctor_admitting?: string;
  admission_category_description?: string;
  length_of_stay: number;
}

const BranchWardAdmissionsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [branchCapacities, setBranchCapacities] = useState<BranchCapacity[]>([]);
  const [wardOverviews, setWardOverviews] = useState<WardOverview[]>([]);
  const [bedDetails, setBedDetails] = useState<BedDetail[]>([]);
  const [transferablePatients, setTransferablePatients] = useState<TransferablePatient[]>([]);
  const [availableBeds, setAvailableBeds] = useState<WardOverview[]>([]);

  // Transfer dialog state
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<TransferablePatient | null>(null);
  const [transferData, setTransferData] = useState({
    newBranchId: '',
    newWardId: '',
    newBedId: '',
    transferReason: '',
    transferredBy: '',
    transferNotes: ''
  });

  const API_BASE = '/api/admissions';

  // Fetch functions
  const fetchBranchCapacities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/branches/capacity`);
      const data = await response.json();
      if (data.success) {
        setBranchCapacities(data.data);
      }
    } catch (err) {
      setError('Failed to fetch branch capacities');
    } finally {
      setLoading(false);
    }
  };

  const fetchWardOverviews = async (branchId?: number) => {
    try {
      setLoading(true);
      const url = branchId ? `${API_BASE}/branches/${branchId}/wards` : `${API_BASE}/wards/statistics`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setWardOverviews(data.data);
      }
    } catch (err) {
      setError('Failed to fetch ward overviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchBedDetails = async (branchId?: number, wardId?: number) => {
    try {
      setLoading(true);
      let url = `${API_BASE}/beds/occupancy`;
      if (branchId && wardId) {
        url = `${API_BASE}/branches/${branchId}/wards/${wardId}/beds`;
      } else if (branchId) {
        url = `${API_BASE}/branches/${branchId}/beds`;
      }

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setBedDetails(data.data);
      }
    } catch (err) {
      setError('Failed to fetch bed details');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransferablePatients = async (branchId?: number, wardId?: number) => {
    try {
      setLoading(true);
      let url = `${API_BASE}/patients/transferable`;
      const params = new URLSearchParams();
      if (branchId) params.append('branchId', branchId.toString());
      if (wardId) params.append('wardId', wardId.toString());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setTransferablePatients(data.data);
      }
    } catch (err) {
      setError('Failed to fetch transferable patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBeds = async (wardType?: string, excludeBranchId?: number, excludeWardId?: number) => {
    try {
      let url = `${API_BASE}/beds/available-for-transfer`;
      const params = new URLSearchParams();
      if (wardType) params.append('wardType', wardType);
      if (excludeBranchId) params.append('excludeBranchId', excludeBranchId.toString());
      if (excludeWardId) params.append('excludeWardId', excludeWardId.toString());
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setAvailableBeds(data.data);
      }
    } catch (err) {
      setError('Failed to fetch available beds');
    }
  };

  const handleTransferPatient = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/patients/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admissionId: selectedPatient?.admission_id,
          newBranchId: parseInt(transferData.newBranchId),
          newWardId: parseInt(transferData.newWardId),
          newBedId: parseInt(transferData.newBedId),
          transferReason: transferData.transferReason,
          transferredBy: transferData.transferredBy,
          transferNotes: transferData.transferNotes
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTransferDialogOpen(false);
        setSelectedPatient(null);
        setTransferData({
          newBranchId: '',
          newWardId: '',
          newBedId: '',
          transferReason: '',
          transferredBy: '',
          transferNotes: ''
        });
        // Refresh data
        await refreshAllData();
        alert('Patient transferred successfully!');
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to transfer patient');
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchBranchCapacities(),
      fetchWardOverviews(selectedBranch || undefined),
      fetchBedDetails(selectedBranch || undefined, selectedWard || undefined),
      fetchTransferablePatients(selectedBranch || undefined, selectedWard || undefined)
    ]);
  };

  // Initialize data
  useEffect(() => {
    refreshAllData();
  }, []);

  // Update data when selections change
  useEffect(() => {
    if (selectedBranch) {
      fetchWardOverviews(selectedBranch);
      fetchBedDetails(selectedBranch, selectedWard || undefined);
      fetchTransferablePatients(selectedBranch, selectedWard || undefined);
    }
  }, [selectedBranch, selectedWard]);

  const getBedStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Occupied':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Maintenance':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatGender = (gender: string) => {
    return gender === '0' ? 'Male' : gender === '1' ? 'Female' : gender;
  };

  // Filter functions
  const filteredWards = wardOverviews.filter(ward =>
    searchQuery === '' ||
    ward.ward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.ward_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBeds = bedDetails.filter(bed =>
    searchQuery === '' ||
    bed.bed_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bed.current_patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bed.ward_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPatients = transferablePatients.filter(patient =>
    searchQuery === '' ||
    patient.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.current_ward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Branch & Ward Management</h1>
          <p className="text-gray-600">Real-time bed occupancy overview and patient transfer management</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedBranch?.toString() || ''} onValueChange={(value) => setSelectedBranch(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Hospital Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Branches</SelectItem>
              {branchCapacities.map((branch) => (
                <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                  {branch.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={refreshAllData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Branch Capacity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {branchCapacities.map((branch) => (
          <Card key={branch.branch_id} className={`cursor-pointer transition-all ${selectedBranch === branch.branch_id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setSelectedBranch(branch.branch_id)}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ColoredIcon icon={Building2} color="blue" size="sm" />
                {branch.branch_name}
              </CardTitle>
              <CardDescription>{branch.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{branch.total_beds}</p>
                  <p className="text-sm text-gray-600">Total Beds</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{branch.total_wards}</p>
                  <p className="text-sm text-gray-600">Wards</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{branch.occupied_beds}</p>
                  <p className="text-sm text-gray-600">Occupied</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{branch.available_beds}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Occupancy Rate</span>
                  <span className={`text-sm font-bold ${getOccupancyColor(branch.overall_occupancy_percentage)}`}>
                    {branch.overall_occupancy_percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full ${branch.overall_occupancy_percentage >= 90 ? 'bg-red-500' : branch.overall_occupancy_percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${Math.min(branch.overall_occupancy_percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Ward Overview</TabsTrigger>
          <TabsTrigger value="beds">Bed Details</TabsTrigger>
          <TabsTrigger value="transfers">Patient Transfers</TabsTrigger>
          <TabsTrigger value="availability">Bed Availability</TabsTrigger>
        </TabsList>

        {/* Ward Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search wards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWards.map((ward) => (
              <Card key={`${ward.branch_id}-${ward.ward_id}`} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedWard(ward.ward_id)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>{ward.ward_name}</span>
                    <Badge variant="outline">{ward.ward_type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bed Occupancy</span>
                      <span className="font-medium">{ward.occupied_beds}/{ward.total_beds}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Occupancy Rate</span>
                      <span className={`font-medium ${getOccupancyColor(ward.occupancy_percentage)}`}>
                        {ward.occupancy_percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Available Beds</span>
                      <span className="font-medium text-green-600">{ward.available_beds}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${ward.occupancy_percentage >= 90 ? 'bg-red-500' : ward.occupancy_percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min(ward.occupancy_percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Bed Details Tab */}
        <TabsContent value="beds" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search beds, patients, or wards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedWard?.toString() || ''} onValueChange={(value) => setSelectedWard(value ? parseInt(value) : null)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Wards</SelectItem>
                {wardOverviews.map((ward) => (
                  <SelectItem key={ward.ward_id} value={ward.ward_id.toString()}>
                    {ward.ward_name} ({ward.ward_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bed</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Daily Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBeds.map((bed) => (
                    <TableRow key={`${bed.branch_id}-${bed.ward_id}-${bed.bed_id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getBedStatusIcon(bed.bed_status)}
                          {bed.bed_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bed.ward_name}</p>
                          <p className="text-sm text-gray-600">{bed.ward_type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={bed.bed_status === 'Available' ? 'outline' : 'default'}>
                          {bed.bed_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {bed.current_patient_name ? (
                          <div>
                            <p className="font-medium">{bed.current_patient_name}</p>
                            <p className="text-sm text-gray-600">ID: {bed.current_patient_id}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">No patient</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {bed.patient_gender ? formatGender(bed.patient_gender) : '-'}
                      </TableCell>
                      <TableCell>
                        {bed.admission_date ? new Date(bed.admission_date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{bed.diagnosis || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{bed.doctor_admitting || '-'}</span>
                      </TableCell>
                      <TableCell>
                        KSh {bed.daily_rate.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients for transfer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => fetchAvailableBeds()}>
              <Bed className="h-4 w-4 mr-2" />
              Check Available Beds
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transferable Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ColoredIcon icon={Users} color="blue" size="sm" />
                  Transferable Patients ({filteredPatients.length})
                </CardTitle>
                <CardDescription>Active patients that can be transferred</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div key={patient.admission_id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{patient.patient_name}</h4>
                        <p className="text-sm text-gray-600">
                          {formatGender(patient.patient_gender)} • {patient.length_of_stay} days
                        </p>
                        <p className="text-sm text-gray-600">
                          {patient.current_ward_name} • {patient.current_bed_number}
                        </p>
                        <p className="text-sm text-blue-600">{patient.admission_category_description}</p>
                        {patient.diagnosis && (
                          <p className="text-sm text-gray-500 mt-1">{patient.diagnosis}</p>
                        )}
                      </div>
                      <Dialog open={transferDialogOpen && selectedPatient?.admission_id === patient.admission_id} onOpenChange={setTransferDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedPatient(patient);
                              fetchAvailableBeds(patient.admission_category_description, patient.current_branch_id, patient.current_ward_id);
                            }}
                          >
                            <ArrowRightLeft className="h-4 w-4 mr-1" />
                            Transfer
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Transfer Patient</DialogTitle>
                            <DialogDescription>
                              Transfer {patient.patient_name} to a new ward/bed
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="transferReason">Transfer Reason</Label>
                              <Input
                                id="transferReason"
                                value={transferData.transferReason}
                                onChange={(e) => setTransferData({...transferData, transferReason: e.target.value})}
                                placeholder="Medical necessity, bed availability, etc."
                              />
                            </div>
                            <div>
                              <Label htmlFor="transferredBy">Transferred By</Label>
                              <Input
                                id="transferredBy"
                                value={transferData.transferredBy}
                                onChange={(e) => setTransferData({...transferData, transferredBy: e.target.value})}
                                placeholder="Doctor/Nurse name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="newWard">New Ward</Label>
                              <Select value={transferData.newWardId} onValueChange={(value) => setTransferData({...transferData, newWardId: value})}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select new ward" />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableBeds.map((ward) => (
                                    <SelectItem key={`${ward.branch_id}-${ward.ward_id}`} value={ward.ward_id.toString()}>
                                      {ward.ward_name} ({ward.ward_type}) - {ward.available_beds} available
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="transferNotes">Transfer Notes</Label>
                              <Textarea
                                id="transferNotes"
                                value={transferData.transferNotes}
                                onChange={(e) => setTransferData({...transferData, transferNotes: e.target.value})}
                                placeholder="Additional notes about the transfer"
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleTransferPatient} disabled={!transferData.newWardId || !transferData.transferReason}>
                                Confirm Transfer
                              </Button>
                              <Button variant="outline" onClick={() => setTransferDialogOpen(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Available Beds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ColoredIcon icon={Bed} color="green" size="sm" />
                  Available Beds ({availableBeds.length})
                </CardTitle>
                <CardDescription>Wards with available beds for transfers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {availableBeds.map((ward) => (
                  <div key={`${ward.branch_id}-${ward.ward_id}`} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{ward.ward_name}</h4>
                        <p className="text-sm text-gray-600">{ward.ward_type}</p>
                        <p className="text-sm text-gray-600">{ward.branch_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">{ward.available_beds}</p>
                        <p className="text-sm text-gray-600">available</p>
                        <p className="text-sm text-gray-500">{ward.occupancy_percentage}% occupied</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Bed Availability Tab */}
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ColoredIcon icon={Activity} color="purple" size="sm" />
                Bed Availability Overview
              </CardTitle>
              <CardDescription>Real-time bed availability across all branches and wards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wardOverviews.map((ward) => (
                  <div key={`${ward.branch_id}-${ward.ward_id}`} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{ward.ward_name}</h4>
                        <p className="text-sm text-gray-600">{ward.ward_type}</p>
                      </div>
                      <Badge variant={ward.available_beds > 0 ? 'default' : 'destructive'}>
                        {ward.available_beds > 0 ? 'Available' : 'Full'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Beds:</span>
                        <span className="font-medium">{ward.total_beds}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Occupied:</span>
                        <span className="font-medium text-red-600">{ward.occupied_beds}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium text-green-600">{ward.available_beds}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Occupancy:</span>
                        <span className={`font-medium ${getOccupancyColor(ward.occupancy_percentage)}`}>
                          {ward.occupancy_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${ward.occupancy_percentage >= 90 ? 'bg-red-500' : ward.occupancy_percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(ward.occupancy_percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading branch and ward data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default BranchWardAdmissionsModule;
