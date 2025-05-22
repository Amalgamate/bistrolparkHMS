import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Users,
  UserPlus,
  DollarSign,
  FileText,
  Calendar,
  Award,
  BookOpen,
  Clock,
  GraduationCap,
  Briefcase,
  Search,
  Filter,
  Building,
  Layers,
  ClipboardList,
  UserCog,
  MessageSquare,
  BarChart,
  Plus,
  Download,
  Upload,
  CalendarClock,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import HRModuleMenu from '../../../components/back-office/HRModuleMenu';

const HumanResourcesModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('hr-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'hr-dashboard':
        return <HRDashboardContent />;
      case 'hr-employees':
        return <EmployeesContent />;
      case 'hr-recruitment':
        return <RecruitmentContent />;
      case 'hr-onboarding':
        return <OnboardingContent />;
      case 'hr-payroll':
        return <PayrollContent />;
      case 'hr-shifts':
        return <ShiftsManagementContent />;
      case 'hr-leave-management':
        return <LeaveManagementContent />;
      case 'hr-attendance':
        return <AttendanceContent />;
      case 'hr-performance':
        return <PerformanceContent />;
      case 'hr-appraisals':
        return <AppraisalsContent />;
      case 'hr-training':
        return <TrainingContent />;
      case 'hr-departments':
        return <DepartmentsContent />;
      case 'hr-documents':
        return <DocumentsContent />;
      case 'hr-policies':
        return <PoliciesContent />;
      case 'hr-employee-relations':
        return <EmployeeRelationsContent />;
      case 'hr-settings':
        return <HRSettingsContent />;
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Human Resources</h2>
            <p className="text-gray-500">Please select an option from the menu.</p>
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="md:col-span-1">
        <HRModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// HR Dashboard Content
const HRDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">HR Dashboard</h2>
          <p className="text-gray-500">Overview of HR metrics and activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Employees</h3>
          <p className="text-2xl font-bold mt-1">156</p>
          <div className="text-xs text-green-600 mt-1">+12 this month</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Open Positions</h3>
          <p className="text-2xl font-bold mt-1">8</p>
          <div className="text-xs text-gray-500 mt-1">3 in final stage</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Leave Requests</h3>
          <p className="text-2xl font-bold mt-1">12</p>
          <div className="text-xs text-orange-600 mt-1">5 pending approval</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Department Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <BarChart className="h-16 w-16 text-gray-300" />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <UserPlus className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New employee onboarded</p>
                <p className="text-xs text-gray-500">Dr. Sarah Johnson - Pediatrics</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Leave request approved</p>
                <p className="text-xs text-gray-500">James Wilson - Radiology</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Award className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Performance review completed</p>
                <p className="text-xs text-gray-500">Nursing Department</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Employees Content
const EmployeesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Employees</h2>
          <p className="text-gray-500">Manage hospital staff</p>
        </div>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search employees..." className="pl-8" />
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
              <SelectItem value="nursing">Nursing</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
              <SelectItem value="support">Support Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Name</div>
          <div>Department</div>
          <div>Position</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">JD</div>
              <div>
                <p className="font-medium">Dr. John Doe</p>
                <p className="text-xs text-gray-500">john.doe@hospital.com</p>
              </div>
            </div>
            <div>Medical</div>
            <div>Cardiologist</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">JS</div>
              <div>
                <p className="font-medium">Jane Smith</p>
                <p className="text-xs text-gray-500">jane.smith@hospital.com</p>
              </div>
            </div>
            <div>Nursing</div>
            <div>Head Nurse</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">RJ</div>
              <div>
                <p className="font-medium">Robert Johnson</p>
                <p className="text-xs text-gray-500">robert.j@hospital.com</p>
              </div>
            </div>
            <div>Administration</div>
            <div>HR Manager</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
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

// Recruitment Content
const RecruitmentContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Recruitment</h2>
          <p className="text-gray-500">Manage job openings and applications</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Post New Job
        </Button>
      </div>

      <Tabs defaultValue="openings">
        <TabsList className="mb-4">
          <TabsTrigger value="openings">Job Openings</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="openings" className="space-y-4">
          <div className="border rounded-md">
            <div className="grid grid-cols-5 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
              <div className="col-span-2">Position</div>
              <div>Department</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="col-span-2">
                  <p className="font-medium">Senior Nurse</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                </div>
                <div>Nursing</div>
                <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="col-span-2">
                  <p className="font-medium">Pediatrician</p>
                  <p className="text-xs text-gray-500">Full-time</p>
                </div>
                <div>Medical</div>
                <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="col-span-2">
                  <p className="font-medium">Lab Technician</p>
                  <p className="text-xs text-gray-500">Part-time</p>
                </div>
                <div>Laboratory</div>
                <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Draft</span></div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">View</Button>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Applications management will be implemented soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Interview scheduling will be implemented soon.</p>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Offer management will be implemented soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Onboarding Content
const OnboardingContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Onboarding</h2>
          <p className="text-gray-500">Manage employee onboarding process</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Onboarding
        </Button>
      </div>

      <div className="text-center py-12">
        <ClipboardList className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Onboarding management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include onboarding checklists, document collection, and orientation scheduling.</p>
      </div>
    </div>
  );
};

// Payroll Content
const PayrollContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Payroll</h2>
          <p className="text-gray-500">Manage employee compensation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Run Payroll
          </Button>
        </div>
      </div>

      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Payroll management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include salary processing, tax calculations, and payment records.</p>
      </div>
    </div>
  );
};

// Leave Management Content
const LeaveManagementContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Leave Management</h2>
          <p className="text-gray-500">Manage employee leave requests and balances</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Leave Request
        </Button>
      </div>

      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Leave management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include leave requests, approvals, and leave balance tracking.</p>
      </div>
    </div>
  );
};

// Attendance Content
const AttendanceContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Attendance</h2>
          <p className="text-gray-500">Track employee attendance and time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Attendance tracking will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include time tracking, shift management, and attendance reports.</p>
      </div>
    </div>
  );
};

// Performance Content
const PerformanceContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Performance Management</h2>
          <p className="text-gray-500">Track and evaluate employee performance</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Evaluation
        </Button>
      </div>

      <div className="text-center py-12">
        <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Performance management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include performance metrics, evaluations, and improvement plans.</p>
      </div>
    </div>
  );
};

// Appraisals Content
const AppraisalsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Appraisals</h2>
          <p className="text-gray-500">Manage employee appraisals and reviews</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Appraisal
        </Button>
      </div>

      <div className="text-center py-12">
        <Award className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Appraisal management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include performance reviews, feedback collection, and rating systems.</p>
      </div>
    </div>
  );
};

// Shifts Management Content
const ShiftsManagementContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Shift Management</h2>
          <p className="text-gray-500">Manage staff shifts and schedules</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Schedule
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Shift
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-l-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-500">Active Shifts</h3>
          <p className="text-2xl font-bold mt-1">24</p>
          <div className="text-xs text-blue-600 mt-1">Currently active</div>
        </Card>
        <Card className="p-4 border-l-4 border-amber-500">
          <h3 className="text-sm font-medium text-gray-500">Pending Swaps</h3>
          <p className="text-2xl font-bold mt-1">5</p>
          <div className="text-xs text-amber-600 mt-1">Awaiting approval</div>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <h3 className="text-sm font-medium text-gray-500">Understaffed</h3>
          <p className="text-2xl font-bold mt-1">3</p>
          <div className="text-xs text-red-600 mt-1">Shifts need attention</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-500">Staff on Duty</h3>
          <p className="text-2xl font-bold mt-1">42</p>
          <div className="text-xs text-green-600 mt-1">Currently working</div>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="schedule">
          <TabsList className="mb-4">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="shifts">Shift Types</TabsTrigger>
            <TabsTrigger value="swaps">Shift Swaps</TabsTrigger>
            <TabsTrigger value="templates">Schedule Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ChevronLeft className="h-4 w-4" />
                  Previous Week
                </Button>
                <div className="font-medium">June 19 - June 25, 2023</div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  Next Week
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="nursing">Nursing</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Staff</th>
                    <th className="px-4 py-3 text-center">Mon (19)</th>
                    <th className="px-4 py-3 text-center">Tue (20)</th>
                    <th className="px-4 py-3 text-center">Wed (21)</th>
                    <th className="px-4 py-3 text-center">Thu (22)</th>
                    <th className="px-4 py-3 text-center">Fri (23)</th>
                    <th className="px-4 py-3 text-center">Sat (24)</th>
                    <th className="px-4 py-3 text-center">Sun (25)</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-sm">
                  <tr>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-2">JD</div>
                        <div>
                          <div className="font-medium">Dr. John Doe</div>
                          <div className="text-xs text-gray-500">Cardiologist</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Morning</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Morning</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Afternoon</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Afternoon</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Off</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Off</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">On Call</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium mr-2">JS</div>
                        <div>
                          <div className="font-medium">Jane Smith</div>
                          <div className="text-xs text-gray-500">Head Nurse</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Afternoon</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Afternoon</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Off</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">Off</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Night</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Night</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Night</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="shifts" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search shift types..." className="pl-8" />
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Shift Type
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
                <div>Name</div>
                <div>Start Time</div>
                <div>End Time</div>
                <div>Duration</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Morning Shift</div>
                  <div>07:00 AM</div>
                  <div>03:00 PM</div>
                  <div>8 hours</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Afternoon Shift</div>
                  <div>03:00 PM</div>
                  <div>11:00 PM</div>
                  <div>8 hours</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>Night Shift</div>
                  <div>11:00 PM</div>
                  <div>07:00 AM</div>
                  <div>8 hours</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div>On-Call Shift</div>
                  <div>Varies</div>
                  <div>Varies</div>
                  <div>24 hours</div>
                  <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-4">
            <div className="text-center py-12">
              <CalendarDays className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Shift swap management will be implemented soon.</p>
              <p className="text-sm text-gray-400 mt-2">This feature will allow staff to request and approve shift swaps.</p>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="text-center py-12">
              <CalendarClock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Schedule templates will be implemented soon.</p>
              <p className="text-sm text-gray-400 mt-2">This feature will allow creating reusable schedule templates.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Training Content
const TrainingContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Training</h2>
          <p className="text-gray-500">Manage employee training and development</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Training
        </Button>
      </div>

      <div className="text-center py-12">
        <GraduationCap className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Training management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include training programs, course management, and certification tracking.</p>
      </div>
    </div>
  );
};

// Departments Content
const DepartmentsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Departments</h2>
          <p className="text-gray-500">Manage hospital departments and structure</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="text-center py-12">
        <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Department management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include department structure, staffing, and organizational hierarchy.</p>
      </div>
    </div>
  );
};

// Documents Content
const DocumentsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">HR Documents</h2>
          <p className="text-gray-500">Manage employee documents and records</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Document management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include document storage, categorization, and access control.</p>
      </div>
    </div>
  );
};

// Policies Content
const PoliciesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">HR Policies</h2>
          <p className="text-gray-500">Manage hospital policies and procedures</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Policy
        </Button>
      </div>

      <div className="text-center py-12">
        <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Policy management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include policy creation, distribution, and acknowledgment tracking.</p>
      </div>
    </div>
  );
};

// Employee Relations Content
const EmployeeRelationsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Employee Relations</h2>
          <p className="text-gray-500">Manage employee concerns and communications</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>

      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Employee relations management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include case management, conflict resolution, and employee engagement.</p>
      </div>
    </div>
  );
};

// HR Settings Content
const HRSettingsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">HR Settings</h2>
          <p className="text-gray-500">Configure HR module settings</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <UserCog className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="text-center py-12">
        <UserCog className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">HR settings will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include system configuration, permissions, and workflow settings.</p>
      </div>
    </div>
  );
};

export default HumanResourcesModule;
