import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
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
  Plus,
  Filter,
  Calendar,
  MapPin,
  Phone,
  User,
  Stethoscope,
  Clock,
  Baby
} from 'lucide-react';
import { ColoredIcon } from '../../components/ui/colored-icon';
import { useEnhancedAdmission } from '../../context/EnhancedAdmissionContext';

const EnhancedAdmissionsModule: React.FC = () => {
  const {
    branches,
    wards,
    beds,
    admissions,
    maternityAdmissions,
    metadata,
    selectedBranch,
    loading,
    error,
    setSelectedBranch,
    fetchBranches,
    fetchWards,
    fetchBeds,
    fetchAdmissions,
    fetchMaternityAdmissions,
    fetchMetadata,
    refreshData
  } = useEnhancedAdmission();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Filter admissions based on search and filters
  const filteredAdmissions = admissions.filter(admission => {
    const matchesSearch = searchQuery === '' ||
      `${admission.first_name} ${admission.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admission.patient_id.toString().includes(searchQuery) ||
      admission.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWard = selectedWard === '' || admission.ward_id.toString() === selectedWard;
    const matchesCategory = selectedCategory === '' || admission.admission_category_description === selectedCategory;

    return matchesSearch && matchesWard && matchesCategory;
  });

  // Calculate real statistics from actual data
  const stats = {
    totalBeds: beds.length,
    occupiedBeds: beds.filter(bed => bed.status === 'Occupied').length,
    availableBeds: beds.filter(bed => bed.status === 'Available').length,
    totalAdmissions: admissions.length,
    activeAdmissions: admissions.filter(admission => admission.admission_status === 'Active').length,
    maternityAdmissions: maternityAdmissions.length,
    occupancyRate: beds.length > 0 ? Math.round((beds.filter(bed => bed.status === 'Occupied').length / beds.length) * 100) : 0
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Active': 'default',
      'Discharged': 'secondary',
      'Transferred': 'outline'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getBedStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Available': 'outline',
      'Occupied': 'default',
      'Maintenance': 'destructive',
      'Reserved': 'secondary'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const formatGender = (gender: string) => {
    return gender === '0' ? 'Male' : gender === '1' ? 'Female' : gender;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admissions Management</h1>
          <p className="text-gray-600">Comprehensive patient admission and bed management system</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedBranch?.toString() || ''} onValueChange={(value) => setSelectedBranch(value ? parseInt(value) : null)}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select Hospital Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.branch_id} value={branch.branch_id.toString()}>
                  {branch.branch_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={refreshData} disabled={loading}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Bed} color="blue" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Total Beds</p>
                <p className="text-2xl font-bold">{stats.totalBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Users} color="green" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold">{stats.occupiedBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Bed} color="gray" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{stats.availableBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Activity} color="purple" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={User} color="orange" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Total Admissions</p>
                <p className="text-2xl font-bold">{stats.totalAdmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Baby} color="pink" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Maternity</p>
                <p className="text-2xl font-bold">{stats.maternityAdmissions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admissions">Active Admissions</TabsTrigger>
          <TabsTrigger value="beds">Bed Management</TabsTrigger>
          <TabsTrigger value="wards">Ward Statistics</TabsTrigger>
          <TabsTrigger value="maternity">Maternity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Admissions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ColoredIcon icon={Users} color="blue" size="sm" />
                  Recent Admissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {admissions.slice(0, 5).map((admission) => (
                    <div key={admission.admission_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{admission.first_name} {admission.last_name}</p>
                        <p className="text-sm text-gray-600">{admission.admission_category_description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatDate(admission.admission_date)}</p>
                        {getStatusBadge(admission.admission_status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ward Occupancy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ColoredIcon icon={Building2} color="green" size="sm" />
                  Ward Occupancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {wards.slice(0, 5).map((ward) => (
                    <div key={ward.ward_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{ward.ward_name}</p>
                        <p className="text-sm text-gray-600">{ward.ward_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{ward.occupied_beds}/{ward.total_beds} beds</p>
                        <p className="text-sm text-gray-600">{ward.occupancy_percentage}% occupied</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Admissions Tab */}
        <TabsContent value="admissions" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients, ID, or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedWard} onValueChange={setSelectedWard}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Wards</SelectItem>
                {wards.map((ward) => (
                  <SelectItem key={ward.ward_id} value={ward.ward_id.toString()}>
                    {ward.ward_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {metadata?.categories.map((category) => (
                  <SelectItem key={category.admission_category_id} value={category.admission_category_description}>
                    {category.admission_category_description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Admissions Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Ward/Bed</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Length of Stay</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmissions.map((admission) => (
                    <TableRow key={admission.admission_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{admission.first_name} {admission.last_name}</p>
                          <p className="text-sm text-gray-600">ID: {admission.patient_id}</p>
                          {admission.cell_phone && (
                            <p className="text-sm text-gray-600">{admission.cell_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatGender(admission.patient_gender)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{admission.admission_category_description}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Ward {admission.ward_id}</p>
                          <p className="text-sm text-gray-600">Bed {admission.bed_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(admission.admission_date)}</TableCell>
                      <TableCell>{admission.length_of_stay} days</TableCell>
                      <TableCell>{admission.doctor_admitting || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(admission.admission_status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="beds">
          <Card>
            <CardHeader>
              <CardTitle>Bed Management</CardTitle>
              <CardDescription>Real-time bed availability and occupancy status</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Bed management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wards">
          <Card>
            <CardHeader>
              <CardTitle>Ward Statistics</CardTitle>
              <CardDescription>Ward capacity and occupancy analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Ward statistics interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maternity">
          <Card>
            <CardHeader>
              <CardTitle>Maternity Admissions</CardTitle>
              <CardDescription>Specialized maternity ward management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Maternity management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading real admissions data from database...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading real data: {error}</p>
          <p className="text-sm text-red-600 mt-1">Please check your API server is running and database is accessible.</p>
        </div>
      )}

      {/* Data Status Indicator */}
      {!loading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">
            ✅ Real data loaded: {stats.totalAdmissions} admissions, {stats.totalBeds} beds, {wards.length} wards, {stats.maternityAdmissions} maternity cases
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedAdmissionsModule;
