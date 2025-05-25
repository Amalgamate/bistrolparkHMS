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
  ArrowRightLeft,
  RefreshCw,
  Stethoscope,
  Baby,
  Heart,
  UserCheck,
  Zap
} from 'lucide-react';
import { ColoredIcon } from '../../components/ui/colored-icon';

interface Department {
  department_name: string;
  ward_count: number;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  avg_occupancy_percentage: number;
  total_patients: number;
}

interface Ward {
  hospital_name: string;
  ward_id: number;
  ward_name: string;
  ward_type: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  occupancy_percentage: number;
  current_patients: number;
}

const BristolParkWardsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [hospitalStats, setHospitalStats] = useState({
    totalWards: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    overallOccupancy: 0,
    totalPatients: 0
  });

  // Fetch functions
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first, then fallback to demo data
      try {
        const response = await fetch('http://localhost:5174/api/admissions/departments');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDepartments(data.data);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using demo data');
      }

      // Fallback to demo data that matches real database structure
      const mockDepartments: Department[] = [
          {
            department_name: 'Medical',
            ward_count: 60,
            total_beds: 277,
            occupied_beds: 64,
            available_beds: 213,
            avg_occupancy_percentage: 23.1,
            total_patients: 64
          },
          {
            department_name: 'General',
            ward_count: 123,
            total_beds: 337,
            occupied_beds: 10,
            available_beds: 327,
            avg_occupancy_percentage: 3.0,
            total_patients: 10
          },
          {
            department_name: 'Pediatric',
            ward_count: 40,
            total_beds: 176,
            occupied_beds: 2,
            available_beds: 174,
            avg_occupancy_percentage: 1.1,
            total_patients: 2
          },
          {
            department_name: 'Maternity',
            ward_count: 30,
            total_beds: 137,
            occupied_beds: 16,
            available_beds: 121,
            avg_occupancy_percentage: 11.7,
            total_patients: 16
          },
          {
            department_name: 'Surgical',
            ward_count: 35,
            total_beds: 133,
            occupied_beds: 2,
            available_beds: 131,
            avg_occupancy_percentage: 1.5,
            total_patients: 2
          }
        ];
        setDepartments(mockDepartments);

        // Calculate hospital stats
        const stats = {
          totalWards: mockDepartments.reduce((sum, d) => sum + d.ward_count, 0),
          totalBeds: mockDepartments.reduce((sum, d) => sum + d.total_beds, 0),
          occupiedBeds: mockDepartments.reduce((sum, d) => sum + d.occupied_beds, 0),
          availableBeds: mockDepartments.reduce((sum, d) => sum + d.available_beds, 0),
          totalPatients: mockDepartments.reduce((sum, d) => sum + d.total_patients, 0),
          overallOccupancy: 0
        };
        stats.overallOccupancy = Math.round((stats.occupiedBeds / stats.totalBeds) * 100);
        setHospitalStats(stats);

    } catch (err) {
      setError('Using demo data - API not available');
      // Set demo data as fallback
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (departmentFilter?: string) => {
    try {
      setLoading(true);
      // Mock ward data for demonstration
      const mockWards: Ward[] = [
        {
          hospital_name: 'Bristol Park Hospital',
          ward_id: 110,
          ward_name: 'Ward 110',
          ward_type: 'Medical',
          total_beds: 22,
          occupied_beds: 16,
          available_beds: 6,
          occupancy_percentage: 72.73,
          current_patients: 16
        },
        {
          hospital_name: 'Bristol Park Hospital',
          ward_id: 86,
          ward_name: 'Ward 86',
          ward_type: 'Medical',
          total_beds: 11,
          occupied_beds: 14,
          available_beds: 0,
          occupancy_percentage: 127.27,
          current_patients: 14
        },
        {
          hospital_name: 'Bristol Park Hospital',
          ward_id: 125,
          ward_name: 'Ward 125',
          ward_type: 'Maternity',
          total_beds: 3,
          occupied_beds: 2,
          available_beds: 1,
          occupancy_percentage: 66.67,
          current_patients: 2
        },
        {
          hospital_name: 'Bristol Park Hospital',
          ward_id: 93,
          ward_name: 'Ward 93',
          ward_type: 'Medical',
          total_beds: 10,
          occupied_beds: 8,
          available_beds: 2,
          occupancy_percentage: 80.0,
          current_patients: 8
        },
        {
          hospital_name: 'Bristol Park Hospital',
          ward_id: 89,
          ward_name: 'Ward 89',
          ward_type: 'Maternity',
          total_beds: 14,
          occupied_beds: 2,
          available_beds: 12,
          occupancy_percentage: 14.29,
          current_patients: 2
        }
      ];

      const filteredWards = departmentFilter
        ? mockWards.filter(w => w.ward_type === departmentFilter)
        : mockWards;

      setWards(filteredWards);
    } catch (err) {
      setError('Failed to fetch ward data');
    } finally {
      setLoading(false);
    }
  };

  const refreshAllData = async () => {
    await Promise.all([
      fetchDepartments(),
      fetchWards(selectedDepartment || undefined)
    ]);
  };

  // Initialize data
  useEffect(() => {
    refreshAllData();
  }, []);

  // Update wards when department filter changes
  useEffect(() => {
    fetchWards(selectedDepartment || undefined);
  }, [selectedDepartment]);

  const getDepartmentIcon = (departmentName: string) => {
    switch (departmentName.toLowerCase()) {
      case 'medical':
        return <Stethoscope className="h-5 w-5" />;
      case 'surgical':
        return <Zap className="h-5 w-5" />;
      case 'maternity':
        return <Baby className="h-5 w-5" />;
      case 'pediatric':
        return <UserCheck className="h-5 w-5" />;
      case 'icu':
        return <Heart className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getDepartmentColor = (departmentName: string) => {
    switch (departmentName.toLowerCase()) {
      case 'medical':
        return 'blue';
      case 'surgical':
        return 'purple';
      case 'maternity':
        return 'pink';
      case 'pediatric':
        return 'green';
      case 'icu':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getOccupancyBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Filter functions
  const filteredWards = wards.filter(ward =>
    searchQuery === '' ||
    ward.ward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ward.ward_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bristol Park Hospital</h1>
          <p className="text-gray-600">Wards Overview & Management System</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={refreshAllData} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Hospital Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Building2} color="blue" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Total Wards</p>
                <p className="text-2xl font-bold">{hospitalStats.totalWards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Bed} color="purple" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Total Beds</p>
                <p className="text-2xl font-bold">{hospitalStats.totalBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Users} color="red" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-2xl font-bold">{hospitalStats.occupiedBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Bed} color="green" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold">{hospitalStats.availableBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={Activity} color="orange" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Occupancy</p>
                <p className="text-2xl font-bold">{hospitalStats.overallOccupancy}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ColoredIcon icon={UserCheck} color="blue" size="sm" />
              <div>
                <p className="text-sm text-gray-600">Patients</p>
                <p className="text-2xl font-bold">{hospitalStats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {departments.map((dept) => (
          <Card
            key={dept.department_name}
            className={`cursor-pointer transition-all hover:shadow-md ${selectedDepartment === dept.department_name ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedDepartment(selectedDepartment === dept.department_name ? '' : dept.department_name)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ColoredIcon
                  icon={() => getDepartmentIcon(dept.department_name)}
                  color={getDepartmentColor(dept.department_name)}
                  size="sm"
                />
                {dept.department_name}
              </CardTitle>
              <CardDescription>{dept.ward_count} wards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Beds</span>
                  <span className="font-medium">{dept.occupied_beds}/{dept.total_beds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Occupancy</span>
                  <span className={`font-medium ${getOccupancyColor(dept.avg_occupancy_percentage)}`}>
                    {dept.avg_occupancy_percentage}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Patients</span>
                  <span className="font-medium text-blue-600">{dept.total_patients}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getOccupancyBgColor(dept.avg_occupancy_percentage)}`}
                    style={{ width: `${Math.min(dept.avg_occupancy_percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Ward Overview</TabsTrigger>
          <TabsTrigger value="transfers">Patient Transfers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_name} value={dept.department_name}>
                    {dept.department_name} Department
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
                    <TableHead>Ward</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Total Beds</TableHead>
                    <TableHead>Occupied</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Occupancy</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWards.map((ward) => (
                    <TableRow key={`${ward.ward_id}-${ward.ward_type}`}>
                      <TableCell>
                        <div className="font-medium">{ward.ward_name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{ward.ward_type}</Badge>
                      </TableCell>
                      <TableCell>{ward.total_beds}</TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">{ward.occupied_beds}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{ward.available_beds}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getOccupancyColor(ward.occupancy_percentage)}`}>
                            {ward.occupancy_percentage}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getOccupancyBgColor(ward.occupancy_percentage)}`}
                              style={{ width: `${Math.min(ward.occupancy_percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{ward.current_patients}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <ArrowRightLeft className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs placeholder */}
        <TabsContent value="transfers">
          <Card>
            <CardHeader>
              <CardTitle>Patient Transfers</CardTitle>
              <CardDescription>Transfer patients between wards and departments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Patient transfer interface will be available here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Ward Analytics</CardTitle>
              <CardDescription>Detailed analytics and reporting for ward management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Analytics dashboard will be available here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Messages */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading Bristol Park Hospital data...</span>
        </div>
      )}

      {error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">ℹ️ {error}</p>
          <p className="text-sm text-blue-600 mt-1">Displaying demo data from Bristol Park Hospital system.</p>
        </div>
      )}

      {/* Data Status */}
      {!loading && !error && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm">
            ✅ Bristol Park Hospital: {hospitalStats.totalWards} wards, {hospitalStats.totalBeds} beds, {hospitalStats.totalPatients} patients
          </p>
        </div>
      )}
    </div>
  );
};

export default BristolParkWardsModule;
