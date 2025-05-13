import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  HelpCircle
} from 'lucide-react';
import PermissionNavSection from './PermissionNavSection';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  className?: string;
}

interface NavItemProps {
  icon: React.ReactNode;
  text: string;
  isActive?: boolean;
  onClick?: () => void;
  to?: string;
  collapsed?: boolean;
}

const NavItem: React.FC<NavItemProps & { disabled?: boolean }> = ({
  icon,
  text,
  isActive = false,
  onClick,
  to,
  collapsed = false,
  disabled = false
}) => {
  const navigate = useNavigate();

  // Define active modules - only Patients, Admissions, Appointments, Clinical, Laboratory, and Settings modules are active
  const isActiveModule =
    text === "Patients" ||
    text === "Patients Register" ||
    text === "Admissions" ||
    text === "Appointments" ||
    text === "Clinical" ||
    text === "Clinical/Nursing" ||
    text === "Laboratory" ||
    text === "Patient Queue" ||
    text === "Appointment Management" ||
    text === "Visit Records" ||
    text === "Reports" ||
    text === "Branch Settings" ||
    text === "User Management" ||
    text === "General Settings" ||
    text === "Dashboard" ||
    text === "Design System" ||
    text === "Document Center";

  // Apply disabled styling if the module is not active
  const isDisabled = disabled || (!isActiveModule && !["Dashboard"].includes(text));

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (isDisabled) return; // Prevent navigation for disabled items
        if (onClick) onClick();
        if (to) navigate(to);
      }}
      className={`flex ${collapsed ? 'justify-center' : 'items-center justify-start'} px-3 py-2 my-1 text-sm font-medium rounded-md group transition-all duration-150 ease-in-out relative ${
        isActive
          ? 'bg-[#F5B800] text-black font-semibold'
          : isDisabled
            ? 'text-gray-500 cursor-not-allowed opacity-70'
            : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
      }`}
      title={collapsed ? text : ''}
    >
      {!collapsed && !isDisabled && (
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 rounded-full bg-[#F5B800]"></div>
      )}
      <div className={collapsed ? '' : 'mr-3 ml-3'}>{icon}</div>
      {!collapsed && <span>{text}</span>}
    </a>
  );
};

interface CollapsibleNavItemProps {
  icon: React.ReactNode;
  text: string;
  children: React.ReactNode;
  isActive?: boolean;
  defaultOpen?: boolean;
  collapsed?: boolean;
}

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps & { disabled?: boolean }> = ({
  icon,
  text,
  children,
  isActive = false,
  defaultOpen = false,
  collapsed = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(isActive || defaultOpen);

  // Define active modules - only Patients, Admissions, Appointments, Clinical, Laboratory, and Settings modules are active
  const isActiveModule =
    text === "Patients" ||
    text === "Admissions" ||
    text === "Appointments" ||
    text === "Clinical" ||
    text === "Clinical/Nursing" ||
    text === "Laboratory" ||
    text === "Settings";

  // Apply disabled styling if the module is not active
  const isDisabled = disabled || (!isActiveModule && !["Dashboard"].includes(text));

  if (collapsed) {
    return (
      <div className="my-1 relative group">
        <a
          href="#"
          className={`flex justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
            isActive
              ? 'bg-[#F5B800] text-black font-semibold'
              : isDisabled
                ? 'text-gray-500 cursor-pointer opacity-70'
                : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
          }`}
          title={text}
        >
          <div>{icon}</div>
        </a>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#2B3990] rounded-md shadow-lg py-2 w-48">
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
          // Allow toggling even for disabled items
          setIsOpen(!isOpen);
        }}
        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
          isActive
            ? 'bg-[#F5B800] text-black font-semibold'
            : isDisabled
              ? 'text-gray-500 cursor-pointer opacity-70'
              : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
        }`}
      >
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          {text}
        </div>
        {isOpen ? (
          <ChevronDown className={`w-4 h-4 ${isDisabled ? 'text-gray-500' : ''}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${isDisabled ? 'text-gray-500' : ''}`} />
        )}
      </a>
      {isOpen && (
        <div className="ml-4 pl-2 relative mt-1">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#144272]"></div>
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
  icon: React.ReactNode;
  defaultOpen?: boolean;
  collapsed?: boolean;
  abbreviation?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps & { disabled?: boolean }> = ({
  title,
  children,
  icon,
  defaultOpen = false,
  collapsed = false,
  abbreviation,
  disabled = false
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

  // Define active modules - only Patients, Admissions, Appointments, Clinical, and Settings modules are active
  const isActiveModule =
    title === "Patients" ||
    title === "Admissions" ||
    title === "Appointments" ||
    title === "Clinical" ||
    title === "Settings" ||
    title === "Hospital Modules";

  // Apply disabled styling if the module is not active
  const isDisabled = disabled || (!isActiveModule && !["Dashboard"].includes(title));

  if (collapsed) {
    return (
      <div className="mt-4 relative group">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 flex items-center justify-center rounded-md ${
            isDisabled
              ? 'bg-gray-500 text-gray-300 opacity-70 cursor-pointer'
              : 'bg-[#F5B800] text-black'
          }`}>
            {icon}
          </div>
          <div className={`text-[10px] mt-1 font-semibold ${
            isDisabled ? 'text-gray-500 opacity-70' : 'text-gray-300'
          }`}>
            {abbr}
          </div>
        </div>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#2B3990] rounded-md shadow-lg py-2 w-48">
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
          // Allow toggling even for disabled items
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-wider uppercase focus:outline-none transition-all duration-150 ${
          isDisabled
            ? 'text-gray-500 opacity-70 cursor-pointer'
            : 'text-gray-300 hover:text-white'
        }`}
      >
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          {title}
        </div>
        {isOpen ? (
          <ChevronDown className={`w-4 h-4 ${isDisabled ? 'text-gray-500' : ''}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${isDisabled ? 'text-gray-500' : ''}`} />
        )}
      </button>
      {isOpen && (
        <nav className="space-y-1 mt-2 relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#144272]"></div>
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
        className={`fixed inset-y-0 left-0 z-30 ${collapsed ? 'w-20' : 'w-64'} bg-[#2B3990] text-white shadow-lg transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:h-full md:z-0 ${className ? className + ' ' : ''}${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex items-center justify-between ${collapsed ? 'h-20 px-2' : 'h-24 px-4'} border-b border-[#144272] transition-all duration-300`}>
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
            icon={<Home className="w-5 h-5" />}
            text="Dashboard"
            to="/dashboard"
            isActive={currentPath === '/' || currentPath === '/dashboard'}
            collapsed={collapsed}
          />

          {/* 1. Hospital Modules */}
          <CollapsibleSection
            title="Hospital Modules"
            icon={<HeartPulse className="w-4 h-4" />}
            collapsed={collapsed}
            abbreviation="HM"
            defaultOpen={true}
          >
            {/* Clinical/Nursing - Active (Moved to top) */}
            <PermissionNavSection requiredPermission="view_patients">
              <NavItem
                icon={<Activity className="w-4 h-4" />}
                text="Clinical/Nursing"
                to="/clinical"
                isActive={currentPath.includes('/clinical')}
                collapsed={collapsed}
              />
            </PermissionNavSection>

            {/* Patients - Active */}
            <PermissionNavSection requiredPermission="view_patients">
              <NavItem
                icon={<User className="w-4 h-4" />}
                text="Patients"
                to="/patient-module"
                isActive={currentPath.includes('/patients') || currentPath.includes('/patient-module')}
                collapsed={collapsed}
              />
            </PermissionNavSection>

            {/* Admissions - Active */}
            <PermissionNavSection requiredPermission="view_admitted_patients">
              <NavItem
                icon={<Bed className="w-4 h-4" />}
                text="Admissions"
                to="/admissions"
                isActive={currentPath.includes('/admissions')}
                collapsed={collapsed}
              />
            </PermissionNavSection>

            {/* Appointments - Active */}
            <PermissionNavSection requiredPermission="view_appointments">
              <NavItem
                icon={<Calendar className="w-4 h-4" />}
                text="Appointments"
                to="/appointments/management"
                isActive={currentPath.includes('/appointments')}
                collapsed={collapsed}
              />
            </PermissionNavSection>

            {/* Pharmacy */}
            <NavItem
              icon={<Pill className="w-4 h-4" />}
              text="Pharmacy"
              to="/pharmacy"
              isActive={currentPath.includes('/pharmacy')}
            />

            {/* Laboratory - Active */}
            <PermissionNavSection requiredPermission="view_waiting_patients_for_lab">
              <NavItem
                icon={<Beaker className="w-4 h-4" />}
                text="Laboratory"
                to="/lab"
                isActive={currentPath.includes('/lab')}
                collapsed={collapsed}
              />
            </PermissionNavSection>

            {/* Radiology */}
            <NavItem
              icon={<Scan className="w-4 h-4" />}
              text="Radiology"
              to="/radiology"
              isActive={currentPath.includes('/radiology')}
            />

            {/* Emergency */}
            <NavItem
              icon={<Heart className="w-4 h-4" />}
              text="Emergency"
              to="/emergency"
              isActive={currentPath.includes('/emergency')}
            />

            {/* Ambulance */}
            <NavItem
              icon={<Ambulance className="w-4 h-4" />}
              text="Ambulance"
              to="/ambulance"
              isActive={currentPath.includes('/ambulance')}
            />

            {/* Blood Bank */}
            <NavItem
              icon={<Droplet className="w-4 h-4" />}
              text="Blood Bank"
              to="/blood-bank"
              isActive={currentPath.includes('/blood-bank')}
            />
          </CollapsibleSection>

          {/* 2. Back Office Modules */}
          <CollapsibleSection
            title="Back Office Modules"
            icon={<Briefcase className="w-4 h-4" />}
            collapsed={collapsed}
            abbreviation="BO"
          >
            {/* Financial */}
            <CollapsibleNavItem
              icon={<DollarSign className="w-4 h-4" />}
              text="Financial"
              collapsed={collapsed}
            >
              <NavItem
                icon={<CreditCard className="w-4 h-4" />}
                text="Billing"
                to="/billing"
                isActive={currentPath.includes('/billing')}
              />
              <NavItem
                icon={<Shield className="w-4 h-4" />}
                text="Insurance"
                to="/insurance"
                isActive={currentPath.includes('/insurance')}
              />
              <NavItem
                icon={<BarChart className="w-4 h-4" />}
                text="Financial Reports"
                to="/financial-reports"
                isActive={currentPath.includes('/financial-reports')}
              />
              <NavItem
                icon={<Receipt className="w-4 h-4" />}
                text="Invoicing"
                to="/invoicing"
                isActive={currentPath.includes('/invoicing')}
              />
              <NavItem
                icon={<LineChart className="w-4 h-4" />}
                text="Accounting"
                to="/accounting"
                isActive={currentPath.includes('/accounting')}
              />
            </CollapsibleNavItem>

            {/* HR */}
            <CollapsibleNavItem
              icon={<Users className="w-4 h-4" />}
              text="HR"
              collapsed={collapsed}
            >
              <NavItem
                icon={<Users className="w-4 h-4" />}
                text="Staff Management"
                to="/staff"
                isActive={currentPath.includes('/staff')}
              />
              <NavItem
                icon={<BadgePercent className="w-4 h-4" />}
                text="Payroll"
                to="/payroll"
                isActive={currentPath.includes('/payroll')}
              />
              <NavItem
                icon={<GraduationCap className="w-4 h-4" />}
                text="Training"
                to="/training"
                isActive={currentPath.includes('/training')}
              />
            </CollapsibleNavItem>

            {/* Procurement */}
            <NavItem
              icon={<Truck className="w-4 h-4" />}
              text="Procurement"
              to="/procurement"
              isActive={currentPath.includes('/procurement')}
            />

            {/* Assets */}
            <NavItem
              icon={<HardDrive className="w-4 h-4" />}
              text="Assets Management"
              to="/assets"
              isActive={currentPath.includes('/assets')}
            />

            {/* Reports */}
            <NavItem
              icon={<BarChart className="w-4 h-4" />}
              text="Reports"
              to="/reports"
              isActive={currentPath.includes('/reports')}
            />
          </CollapsibleSection>

          {/* 3. Settings */}
          <CollapsibleSection
            title="Settings"
            icon={<Settings className="w-4 h-4" />}
            collapsed={collapsed}
            abbreviation="SET"
            defaultOpen={currentPath.includes('/settings') || currentPath.includes('/users')}
          >
            {/* User Management - Active */}
            <PermissionNavSection requiredPermission="register_user">
              <NavItem
                icon={<UserCog className="w-4 h-4" />}
                text="User Management"
                to="/users"
                isActive={currentPath.includes('/users')}
              />
            </PermissionNavSection>

            {/* General Settings - Active */}
            <PermissionNavSection requiredPermission="upload_hospital_logo">
              <NavItem
                icon={<Building2 className="w-4 h-4" />}
                text="General Settings"
                to="/settings"
                isActive={currentPath.includes('/settings')}
              />
            </PermissionNavSection>

            {/* Design System - For development only */}
            <NavItem
              icon={<Palette className="w-4 h-4" />}
              text="Design System"
              to="/design-system"
              isActive={currentPath.includes('/design-system')}
            />
          </CollapsibleSection>

          {/* Document Center */}
          <PermissionNavSection requiredPermission="view_documents">
            <NavItem
              icon={<FileText className="w-5 h-5" />}
              text="Document Center"
              to="/document-center"
              isActive={currentPath.includes('/document-center')}
              collapsed={collapsed}
            />
          </PermissionNavSection>

          {/* Inbox removed as requested */}
        </div>
      </div>
    </>
  );
};
