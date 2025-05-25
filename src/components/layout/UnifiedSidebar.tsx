import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import {
  Home,
  User,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Building2,
  Shield,
  Calendar,
  Clock,
  Bed,
  Users,
  CheckCircle,
  CheckSquare,
  LogOut,
  Activity,
  Thermometer,
  Clipboard,
  Pill,
  Beaker,
  Scan,
  DollarSign,
  CreditCard,
  BarChart,
  Inbox,
  Briefcase,
  UserCog,
  BookOpen,
  Palette,
  HardDrive,
  Truck,
  HeartPulse,
  Stethoscope,
  Ambulance,
  Droplet,
  Heart,
  Landmark,
  Receipt,
  LineChart,
  BadgePercent,
  GraduationCap,
  Wrench,
  HelpCircle,
  Scissors,
  Baby,
  AlertTriangle,
  Droplets,
  Siren,
  Package,
  ShieldCheck,
  Database,
  MessageSquare,
  Code,
  Lock,
  Server
} from 'lucide-react';
import PermissionNavSection from './PermissionNavSection';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

interface NavItemProps {
  icon: LucideIcon;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: string;
  collapsed?: boolean;
  iconColor?: ColorVariant;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  text,
  isActive = false,
  onClick,
  to,
  collapsed = false,
  iconColor
}) => {
  const navigate = useNavigate();

  // Determine icon color based on module type
  const getIconColor = (): ColorVariant => {
    if (iconColor) return iconColor;

    // Default color mapping based on module type
    switch(text) {
      case "Dashboard": return "blue";
      case "Patients":
      case "Patients Register": return "green";
      case "Clinical":
      case "Clinical/Nursing": return "purple";
      case "Pharmacy": return "orange";
      case "Laboratory": return "teal";
      case "Radiology": return "indigo";
      case "Appointments": return "pink";
      case "Admissions": return "amber";
      case "Settings":
      case "Branch Settings":
      case "User Management":
      case "General Settings": return "gray";
      case "Physiotherapy": return "green";
      case "Maternity": return "pink";
      case "Procedures": return "purple";
      case "Emergency":
      case "Ambulance":
      case "Emergency Services": return "red";
      case "Blood Bank": return "red";
      default: return "gray";
    }
  };

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        if (to) navigate(to);
      }}
      className={`flex ${collapsed ? 'justify-center' : 'items-center justify-start'} px-3 py-2 my-1 text-sm font-medium rounded-md group transition-all duration-150 ease-in-out relative ${
        isActive
          ? 'bg-[#F5B800] text-black font-semibold'
          : 'text-gray-300 hover:text-white hover:bg-[#0000c7] hover:bg-opacity-50'
      }`}
      title={collapsed ? text : ''}
    >
      {!collapsed && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full bg-[#F5B800]"></div>
      )}
      <div className="ml-1 w-8 flex justify-center">
        <ColoredIcon
          icon={Icon}
          color={getIconColor()}
          size="xs"
          variant={isActive ? "solid" : "outline"}
          whiteBackground={true}
        />
      </div>
      {!collapsed && <span>{text}</span>}
    </a>
  );
};

interface CollapsibleNavItemProps {
  icon: LucideIcon;
  text: string;
  children: React.ReactNode;
  isActive?: boolean;
  defaultOpen?: boolean;
  collapsed?: boolean;
  iconColor?: ColorVariant;
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  icon: Icon,
  text,
  children,
  isActive = false,
  defaultOpen = false,
  collapsed = false,
  iconColor
}) => {
  const [isOpen, setIsOpen] = useState(isActive || defaultOpen);

  // Determine icon color based on module type
  const getIconColor = (): ColorVariant => {
    if (iconColor) return iconColor;

    // Default color mapping based on module type
    switch(text) {
      case "Dashboard": return "blue";
      case "Patients":
      case "Patients Register": return "green";
      case "Clinical":
      case "Clinical/Nursing": return "purple";
      case "Pharmacy": return "orange";
      case "Laboratory": return "teal";
      case "Radiology": return "indigo";
      case "Appointments": return "pink";
      case "Admissions": return "amber";
      case "Settings":
      case "Branch Settings":
      case "User Management":
      case "General Settings": return "gray";
      case "Physiotherapy": return "green";
      case "Maternity": return "pink";
      case "Procedures": return "purple";
      case "Emergency":
      case "Ambulance":
      case "Emergency Services": return "red";
      case "Blood Bank": return "red";
      default: return "gray";
    }
  };

  if (collapsed) {
    return (
      <div className="my-1 relative group">
        <a
          href="#"
          className={`flex justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
            isActive
              ? 'bg-[#F5B800] text-black font-semibold'
              : 'text-gray-300 hover:text-white hover:bg-[#0000c7] hover:bg-opacity-50'
          }`}
          title={text}
        >
          <div className="w-8 flex justify-center">
            <ColoredIcon
              icon={Icon}
              color={getIconColor()}
              size="xs"
              variant={isActive ? "solid" : "outline"}
              whiteBackground={true}
            />
          </div>
        </a>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#0100f6] rounded-md shadow-lg py-2 w-48">
          <div className="px-3 py-1 text-xs font-semibold text-gray-300 uppercase">{text}</div>
          <div className="mt-1">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-1">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
          isActive
            ? 'bg-[#F5B800] text-black font-semibold'
            : 'text-gray-300 hover:text-white hover:bg-[#0000c7] hover:bg-opacity-50'
        }`}
      >
        <div className="flex items-center">
          <div className="ml-1 w-8 flex justify-center">
            <ColoredIcon
              icon={Icon}
              color={getIconColor()}
              size="xs"
              variant={isActive ? "solid" : "outline"}
              whiteBackground={true}
            />
          </div>
          {text}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </a>
      {isOpen && (
        <div className="ml-4 pl-2 relative mt-1">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#0000c7]"></div>
          <div className="pl-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
  defaultOpen?: boolean;
  collapsed?: boolean;
  abbreviation?: string;
  iconColor?: ColorVariant;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  icon: Icon,
  defaultOpen = false,
  collapsed = false,
  abbreviation,
  iconColor
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Generate abbreviation if not provided
  const abbr = React.useMemo(() => {
    if (abbreviation) return abbreviation;

    // Generate abbreviation from title (e.g., "Clinical Modules" -> "CM")
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  }, [abbreviation, title]);

  // Determine icon color based on section type
  const getIconColor = (): ColorVariant => {
    if (iconColor) return iconColor;

    // Default color mapping based on section type
    switch(title) {
      case "Hospital Modules": return "blue";
      case "Back Office Modules": return "amber";
      case "Emergency Services": return "red";
      case "Settings": return "gray";
      default: return "blue";
    }
  };

  if (collapsed) {
    return (
      <div className="mt-4 relative group">
        <div className="flex flex-col items-center">
          <div className="w-8 flex justify-center">
            <ColoredIcon
              icon={Icon}
              color={getIconColor()}
              size="sm"
              variant="solid"
              className="rounded-md"
              whiteBackground={true}
            />
          </div>
          <div className="text-[10px] mt-1 font-semibold text-gray-300">
            {abbr}
          </div>
        </div>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#0100f6] rounded-md shadow-lg py-2 w-48">
          <div className="px-3 py-1 text-xs font-semibold text-gray-300 uppercase">{title}</div>
          <div className="mt-1">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { collapsed: true } as any);
              }
              return child;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-wider uppercase focus:outline-none transition-all duration-150 text-gray-300 hover:text-white"
      >
        <div className="flex items-center">
          <div className="ml-1 w-8 flex justify-center">
            <ColoredIcon
              icon={Icon}
              color={getIconColor()}
              size="xs"
              variant="solid"
              whiteBackground={true}
            />
          </div>
          {title}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <nav className="space-y-1 mt-2 relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#0000c7]"></div>
          <div className="pl-4">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { collapsed: false } as any);
              }
              return child;
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

export const UnifiedSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, className }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 ease-out' : 'opacity-0 ease-in pointer-events-none'
        } md:hidden`}
        onClick={() => setIsOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-30 ${collapsed ? 'w-20' : 'w-64'} bg-[#0100f6] text-white shadow-lg transform transition-all duration-300 ease-in-out md:static md:h-full md:z-0 ${className ? className + ' ' : ''}${
          isOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
        }`}
      >
        <div className={`flex items-center justify-between ${collapsed ? 'h-20 px-2' : 'h-24 px-4'} border-b border-[#0000c7] transition-all duration-300`}>
          <div className="flex items-center">
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-white text-xl font-bold tracking-wide">BRISTOL PARK</h1>
                <p className="text-gray-300 text-xs">HMIS V.2.0</p>
              </div>
            )}
            {collapsed && (
              <div className="flex flex-col items-center justify-center w-full">
                <h1 className="text-white text-xl font-bold">BP</h1>
                <p className="text-gray-300 text-[8px]">v2.0</p>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-white hover:text-blue-300 focus:outline-none hidden md:block"
            >
              {collapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-white hover:text-blue-300 md:hidden focus:outline-none"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={`${collapsed ? 'p-2' : 'p-4'} overflow-y-auto h-[calc(100vh-6rem)] pb-20 transition-all duration-300`}>
          <NavItem
            icon={Home}
            text="Dashboard"
            to="/dashboard"
            isActive={currentPath === '/' || currentPath === '/dashboard'}
            collapsed={collapsed}
            iconColor="blue"
          />

          {/* 1. Hospital Modules */}
          <CollapsibleSection
            title="Hospital Modules"
            icon={HeartPulse}
            collapsed={collapsed}
            abbreviation="HM"
            defaultOpen={true}
            iconColor="blue"
          >
            {/* Clinical/Nursing - Active (First item) */}
            <PermissionNavSection requiredPermission="view_patients">
              <NavItem
                icon={Activity}
                text="Clinical/Nursing"
                to="/clinical"
                isActive={currentPath.includes('/clinical')}
                collapsed={collapsed}
                iconColor="purple"
              />
            </PermissionNavSection>

            {/* Patients - Active (Second item) */}
            <PermissionNavSection requiredPermission="view_patients">
              <NavItem
                icon={User}
                text="Patients"
                to="/patients"
                isActive={currentPath.includes('/patients')}
                collapsed={collapsed}
                iconColor="green"
              />
            </PermissionNavSection>

            {/* Admissions - Active (Third item) */}
            <PermissionNavSection requiredPermission="view_admitted_patients">
              <NavItem
                icon={Bed}
                text="Admissions"
                to="/admissions"
                isActive={currentPath.includes('/admissions')}
                collapsed={collapsed}
                iconColor="amber"
              />
            </PermissionNavSection>



            {/* Appointments - Active (Fourth item) */}
            <PermissionNavSection requiredPermission="view_appointments">
              <NavItem
                icon={Calendar}
                text="Appointments"
                to="/appointments/management"
                isActive={currentPath.includes('/appointments')}
                collapsed={collapsed}
                iconColor="pink"
              />
            </PermissionNavSection>

            {/* Laboratory - Active (Fifth item) */}
            <PermissionNavSection requiredPermission="view_waiting_patients_for_lab">
              <NavItem
                icon={Beaker}
                text="Laboratory"
                to="/lab"
                isActive={currentPath.includes('/lab')}
                collapsed={collapsed}
                iconColor="teal"
              />
            </PermissionNavSection>

            {/* Pharmacy (Sixth item) */}
            <PermissionNavSection requiredPermission="view_waiting_patients_for_pharmacy">
              <NavItem
                icon={Pill}
                text="Pharmacy"
                to="/pharmacy"
                isActive={currentPath.includes('/pharmacy')}
                collapsed={collapsed}
                iconColor="orange"
              />
            </PermissionNavSection>

            {/* Physiotherapy (Seventh item) */}
            <PermissionNavSection requiredPermission="view_physiotherapy_stock">
              <NavItem
                icon={Activity}
                text="Physiotherapy"
                to="/physiotherapy"
                isActive={currentPath.includes('/physiotherapy')}
                collapsed={collapsed}
                iconColor="green"
              />
            </PermissionNavSection>

            {/* Maternity (Eighth item) */}
            <PermissionNavSection requiredPermission="maternity">
              <NavItem
                icon={Baby}
                text="Maternity"
                to="/maternity"
                isActive={currentPath.includes('/maternity')}
                collapsed={collapsed}
                iconColor="pink"
              />
            </PermissionNavSection>

            {/* Radiology */}
            <PermissionNavSection requiredPermission="view_waiting_patients_for_radiology">
              <NavItem
                icon={Scan}
                text="Radiology"
                to="/radiology"
                isActive={currentPath.includes('/radiology')}
                collapsed={collapsed}
                iconColor="indigo"
              />
            </PermissionNavSection>

            {/* Procedures */}
            <PermissionNavSection requiredPermission="view_patients">
              <NavItem
                icon={Scissors}
                text="Procedures"
                to="/procedures"
                isActive={currentPath.includes('/procedures')}
                collapsed={collapsed}
                iconColor="purple"
              />
            </PermissionNavSection>

            {/* Emergency Services Group */}
            <PermissionNavSection requiredPermission="view_patients">
              <CollapsibleNavItem
                icon={Siren}
                text="Emergency Services"
                collapsed={collapsed}
                isActive={
                  currentPath.includes('/emergency') ||
                  currentPath.includes('/blood-bank') ||
                  currentPath.includes('/ambulance')
                }
                iconColor="red"
              >
                <NavItem
                  icon={AlertTriangle}
                  text="Emergency"
                  to="/emergency"
                  isActive={currentPath.includes('/emergency')}
                  iconColor="red"
                />
                <NavItem
                  icon={Droplets}
                  text="Blood Bank"
                  to="/blood-bank"
                  isActive={currentPath.includes('/blood-bank')}
                  iconColor="red"
                />
                <NavItem
                  icon={Truck}
                  text="Ambulance"
                  to="/ambulance"
                  isActive={currentPath.includes('/ambulance')}
                  iconColor="red"
                />
              </CollapsibleNavItem>
            </PermissionNavSection>

            {/* Mortuary (Last item) */}
            <PermissionNavSection requiredPermission="mortuary">
              <NavItem
                icon={Bed}
                text="Mortuary"
                to="/mortuary"
                isActive={currentPath.includes('/mortuary')}
                collapsed={collapsed}
                iconColor="gray"
              />
            </PermissionNavSection>
          </CollapsibleSection>

          {/* Back Office Modules */}
          <PermissionNavSection requiredPermission="handle_payroll">
            <CollapsibleSection
              title="Back Office Modules"
              icon={Briefcase}
              collapsed={collapsed}
              abbreviation="BO"
              defaultOpen={currentPath.includes('/back-office')}
              iconColor="amber"
            >
              {/* Back Office Dashboard */}
              <NavItem
                icon={BarChart}
                text="Dashboard"
                to="/back-office"
                isActive={currentPath === '/back-office'}
                collapsed={collapsed}
                iconColor="blue"
              />

              {/* Human Resources */}
              <PermissionNavSection requiredPermission="handle_payroll">
                <NavItem
                  icon={Users}
                  text="Human Resources"
                  to="/back-office/hr"
                  isActive={currentPath.includes('/back-office/hr')}
                  collapsed={collapsed}
                  iconColor="green"
                />
              </PermissionNavSection>

              {/* Finance */}
              <PermissionNavSection requiredPermission="chart_of_accounts">
                <NavItem
                  icon={DollarSign}
                  text="Finance"
                  to="/back-office/finance"
                  isActive={currentPath.includes('/back-office/finance')}
                  collapsed={collapsed}
                  iconColor="amber"
                />
              </PermissionNavSection>

              {/* Administration */}
              <PermissionNavSection requiredPermission="manage_basic_settings">
                <NavItem
                  icon={Building2}
                  text="Administration"
                  to="/back-office/administration"
                  isActive={currentPath.includes('/back-office/administration')}
                  collapsed={collapsed}
                  iconColor="gray"
                />
              </PermissionNavSection>

              {/* Inventory */}
              <PermissionNavSection requiredPermission="stores">
                <NavItem
                  icon={Package}
                  text="Inventory"
                  to="/back-office/inventory"
                  isActive={currentPath.includes('/back-office/inventory')}
                  collapsed={collapsed}
                  iconColor="indigo"
                />
              </PermissionNavSection>

              {/* Procurement */}
              <PermissionNavSection requiredPermission="create_and_view_purchase_orders">
                <NavItem
                  icon={Truck}
                  text="Procurement"
                  to="/back-office/procurement"
                  isActive={currentPath.includes('/back-office/procurement')}
                  collapsed={collapsed}
                  iconColor="orange"
                />
              </PermissionNavSection>

              {/* Contracts */}
              <PermissionNavSection requiredPermission="view_patients">
                <NavItem
                  icon={FileText}
                  text="Contracts"
                  to="/back-office/contracts"
                  isActive={currentPath.includes('/back-office/contracts')}
                  collapsed={collapsed}
                  iconColor="blue"
                />
              </PermissionNavSection>

              {/* Compliance */}
              <PermissionNavSection requiredPermission="view_patients">
                <NavItem
                  icon={ShieldCheck}
                  text="Compliance"
                  to="/back-office/compliance"
                  isActive={currentPath.includes('/back-office/compliance')}
                  collapsed={collapsed}
                  iconColor="green"
                />
              </PermissionNavSection>

              {/* Reports */}
              <PermissionNavSection requiredPermission="view_accounting_reports">
                <NavItem
                  icon={Clipboard}
                  text="Reports"
                  to="/back-office/reports"
                  isActive={currentPath.includes('/back-office/reports')}
                  collapsed={collapsed}
                  iconColor="teal"
                />
              </PermissionNavSection>

              {/* Analytics */}
              <PermissionNavSection requiredPermission="view_management_reports">
                <NavItem
                  icon={LineChart}
                  text="Analytics"
                  to="/back-office/analytics"
                  isActive={currentPath.includes('/back-office/analytics')}
                  collapsed={collapsed}
                  iconColor="indigo"
                />
              </PermissionNavSection>

              {/* Audit */}
              <PermissionNavSection requiredPermission="view_audit_logs">
                <NavItem
                  icon={AlertTriangle}
                  text="Audit"
                  to="/back-office/audit"
                  isActive={currentPath.includes('/back-office/audit')}
                  collapsed={collapsed}
                  iconColor="red"
                />
              </PermissionNavSection>

              {/* Approvals */}
              <PermissionNavSection requiredPermission="view_patients">
                <NavItem
                  icon={CheckSquare}
                  text="Approvals"
                  to="/approvals"
                  isActive={currentPath.includes('/approvals')}
                  collapsed={collapsed}
                  iconColor="green"
                />
              </PermissionNavSection>

              {/* Scheduling */}
              <PermissionNavSection requiredPermission="leave_management">
                <NavItem
                  icon={Calendar}
                  text="Scheduling"
                  to="/back-office/scheduling"
                  isActive={currentPath.includes('/back-office/scheduling')}
                  collapsed={collapsed}
                  iconColor="pink"
                />
              </PermissionNavSection>

              {/* Database */}
              <PermissionNavSection requiredPermission="manage_database">
                <NavItem
                  icon={Database}
                  text="Database"
                  to="/back-office/database"
                  isActive={currentPath.includes('/back-office/database')}
                  collapsed={collapsed}
                  iconColor="gray"
                />
              </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* 3. Administration Modules */}
          <PermissionNavSection requiredPermission="manage_basic_settings">
            <CollapsibleSection
              title="Administration"
              icon={Shield}
              collapsed={collapsed}
              abbreviation="ADM"
              defaultOpen={currentPath.includes('/admin') || currentPath.includes('/users') || currentPath.includes('/settings')}
              iconColor="red"
            >
            {/* User Management */}
            <PermissionNavSection requiredPermission="manage_hospital_users">
              <NavItem
                icon={UserCog}
                text="User Management"
                to="/users"
                isActive={currentPath.includes('/users')}
                collapsed={collapsed}
                iconColor="blue"
              />
            </PermissionNavSection>

            {/* Role & Permissions */}
            <PermissionNavSection requiredPermission="manage_hospital_users">
              <NavItem
                icon={Users}
                text="Role & Permissions"
                to="/admin/roles"
                isActive={currentPath.includes('/admin/roles')}
                collapsed={collapsed}
                iconColor="purple"
              />
            </PermissionNavSection>

            {/* System Settings */}
            <PermissionNavSection requiredPermission="manage_basic_settings">
              <NavItem
                icon={Settings}
                text="System Settings"
                to="/settings"
                isActive={currentPath.includes('/settings')}
                collapsed={collapsed}
                iconColor="gray"
              />
            </PermissionNavSection>

            {/* Database Management */}
            <PermissionNavSection requiredPermission="manage_database">
              <NavItem
                icon={Database}
                text="Database Management"
                to="/admin/database"
                isActive={currentPath.includes('/admin/database')}
                collapsed={collapsed}
                iconColor="green"
              />
            </PermissionNavSection>

            {/* Service Management */}
            <PermissionNavSection requiredPermission="access_service_management">
              <NavItem
                icon={Server}
                text="Service Management"
                to="/admin/services"
                isActive={currentPath.includes('/admin/services')}
                collapsed={collapsed}
                iconColor="blue"
              />
            </PermissionNavSection>

            {/* Audit Logs */}
            <PermissionNavSection requiredPermission="view_audit_logs">
              <NavItem
                icon={FileText}
                text="Audit Logs"
                to="/admin/audit"
                isActive={currentPath.includes('/admin/audit')}
                collapsed={collapsed}
                iconColor="orange"
              />
            </PermissionNavSection>

            {/* Security Settings */}
            <PermissionNavSection requiredPermission="manage_security_settings">
              <NavItem
                icon={Lock}
                text="Security Settings"
                to="/admin/security"
                isActive={currentPath.includes('/admin/security')}
                collapsed={collapsed}
                iconColor="red"
              />
            </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* 4. Development Tools */}
          <CollapsibleSection
            title="Development"
            icon={Code}
            collapsed={collapsed}
            abbreviation="DEV"
            defaultOpen={currentPath.includes('/design-system')}
            iconColor="pink"
          >
            {/* Design System - For development only */}
            <NavItem
              icon={Palette}
              text="Design System"
              to="/design-system"
              isActive={currentPath.includes('/design-system')}
              collapsed={collapsed}
              iconColor="pink"
            />
          </CollapsibleSection>

          {/* Document Center */}
          <PermissionNavSection requiredPermission="view_documents">
            <NavItem
              icon={FileText}
              text="Document Center"
              to="/document-center"
              isActive={currentPath.includes('/document-center')}
              collapsed={collapsed}
              iconColor="blue"
            />
          </PermissionNavSection>

          {/* Messages/Chat */}
          <NavItem
            icon={MessageSquare}
            text="Messages"
            to="/messages"
            isActive={currentPath.includes('/messages')}
            collapsed={collapsed}
            iconColor="indigo"
          />
        </div>
      </div>
    </>
  );
};
