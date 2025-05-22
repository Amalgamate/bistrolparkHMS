import React from 'react';
import {
  Users,
  UserPlus,
  DollarSign,
  FileText,
  Briefcase,
  GraduationCap,
  Calendar,
  BarChart,
  Award,
  Clock,
  ClipboardList,
  UserCog,
  Building,
  Layers,
  MessageSquare,
  CalendarClock,
  CalendarDays
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface HRModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const HRModuleMenu: React.FC<HRModuleMenuProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'HR Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'employees', label: 'Employees', icon: <Users className="w-4 h-4" /> },
    { id: 'recruitment', label: 'Recruitment', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'onboarding', label: 'Onboarding', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'payroll', label: 'Payroll', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'shifts', label: 'Shift Management', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'leave-management', label: 'Leave Management', icon: <Calendar className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <BarChart className="w-4 h-4" /> },
    { id: 'appraisals', label: 'Appraisals', icon: <Award className="w-4 h-4" /> },
    { id: 'training', label: 'Training', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'departments', label: 'Departments', icon: <Building className="w-4 h-4" /> },
    { id: 'documents', label: 'HR Documents', icon: <FileText className="w-4 h-4" /> },
    { id: 'policies', label: 'HR Policies', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'employee-relations', label: 'Employee Relations', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'HR Settings', icon: <UserCog className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Human Resources Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`hr-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `hr-${item.id}`
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

export default HRModuleMenu;
