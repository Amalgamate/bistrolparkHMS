import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X, ChevronDown, ChevronRight, ChevronLeft, Home, Inbox,
  Heart, User, FileText, Calendar, Clipboard, CheckCircle, Bed, Ambulance, Activity,
  Thermometer, UserCog, Beaker, Pill, Edit, Utensils, Video, Layers, Brain, Stethoscope,
  Baby, Scissors, Microscope, Syringe, Skull, Building2, DollarSign, Briefcase, ShoppingCart,
  Link, Map, Box, ToolIcon, Trash, FolderOpen, FileText as FileTextIcon, Table, Image, Archive,
  Share2, BarChart, Cog, CheckSquare, MessageSquare, Mail, Smartphone, UserCheck, Clock, Settings,
  Zap, TrendingDown, TrendingUp, PieChart, Bell, AlertCircle, Shield, CreditCard, Users, HelpCircle,
  LogOut, Landmark, Calculator, Receipt, BookOpen, Stethoscope as StethoscopeIcon, Droplet, Lungs,
  Bone, Dna, Leaf, Radiation, Heartbeat, Bandage, Wheelchair, Vial, Virus, Crosshair, Scan, Printer,
  Truck, Repeat, Loader, Cpu, Database, Server, GitBranch, GitMerge, GitPullRequest, GitCommit,
  GitFork, GitCompare, GitBranch as GitBranchIcon, GitMerge as GitMergeIcon, GitPullRequest as GitPullRequestIcon
} from 'lucide-react';

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

const NavItem: React.FC<NavItemProps> = ({ icon, text, isActive = false, onClick, to, collapsed = false }) => {
  const navigate = useNavigate();
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) onClick();
        if (to) navigate(to);
      }}
      className={`flex ${collapsed ? 'justify-center' : 'items-center'} px-3 py-2 my-1 text-sm font-medium rounded-md group transition-all duration-150 ease-in-out ${
        isActive
          ? 'text-white bg-[#205295]'
          : 'text-gray-300 hover:text-white hover:bg-[#144272]'
      }`}
      title={collapsed ? text : ''}
    >
      <div className={collapsed ? '' : 'mr-3'}>{icon}</div>
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

const CollapsibleNavItem: React.FC<CollapsibleNavItemProps> = ({
  icon,
  text,
  children,
  isActive = false,
  defaultOpen = false,
  collapsed = false
}) => {
  const [isOpen, setIsOpen] = useState(isActive || defaultOpen);

  if (collapsed) {
    return (
      <div className="my-1 relative group">
        <a
          href="#"
          className={`flex justify-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out ${
            isActive ? 'text-white bg-[#205295]' : 'text-gray-300 hover:text-white hover:bg-[#144272]'
          }`}
          title={text}
        >
          <div>{icon}</div>
        </a>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#0100F6] rounded-md shadow-lg py-2 w-48">
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
          isActive ? 'text-white bg-[#205295]' : 'text-gray-300 hover:text-white hover:bg-[#144272]'
        }`}
      >
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          {text}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </a>
      {isOpen && (
        <div className="ml-4 pl-2 border-l border-[#144272] mt-1">
          {children}
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
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  icon,
  defaultOpen = false,
  collapsed = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (collapsed) {
    return (
      <div className="mt-4 relative group">
        <div className="flex justify-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#144272] text-white">
            {icon}
          </div>
        </div>
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 bg-[#0100F6] rounded-md shadow-lg py-2 w-48">
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
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wider text-gray-300 uppercase hover:text-white focus:outline-none transition-all duration-150"
      >
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          {title}
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <nav className="space-y-1 mt-2">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { collapsed: false } as any);
            }
            return child;
          })}
        </nav>
      )}
    </div>
  );
};

export const NewSidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, className }) => {
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
        className={`fixed inset-y-0 left-0 z-30 ${collapsed ? 'w-20' : 'w-64'} bg-[#0100F6] text-white shadow-lg transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:h-full md:z-0 ${className ? className + ' ' : ''}${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex items-center justify-between ${collapsed ? 'h-20 px-2' : 'h-24 px-4'} border-b border-[#144272] transition-all duration-300`}>
          <div className="flex items-center">
            {!collapsed && (
              <div className="flex flex-col">
                <h1 className="text-white text-xl font-bold tracking-wide">NAIROBI CENTRAL</h1>
                <p className="text-gray-300 text-xs">HMIS V.2.0</p>
              </div>
            )}
            {collapsed && (
              <div className="flex flex-col items-center justify-center w-full">
                <h1 className="text-white text-xl font-bold">NC</h1>
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

        <div className={`${collapsed ? 'p-2' : 'p-4'} overflow-y-auto h-[calc(100vh-4rem)] transition-all duration-300`}>
          <NavItem
            icon={<Home className="w-5 h-5" />}
            text="Dashboard"
            to="/dashboard"
            isActive={currentPath === '/' || currentPath === '/dashboard'}
            collapsed={collapsed}
          />
          <NavItem
            icon={<Inbox className="w-5 h-5" />}
            text="Inbox"
            collapsed={collapsed}
          />

          {/* Hospital Modules Section */}
          <CollapsibleSection
            title="Hospital Modules"
            icon={<Building2 className="w-4 h-4" />}
            defaultOpen={currentPath.includes('/patients')}
            collapsed={collapsed}
          >
            {/* Patient Management */}
            <CollapsibleNavItem
              icon={<User className="w-5 h-5" />}
              text="Patient Management"
              isActive={currentPath.includes('/patients')}
            >
              <NavItem
                icon={<FileText className="w-4 h-4" />}
                text="Patient Registration"
                to="/patients/registration"
                isActive={currentPath.includes('/patients/registration')}
              />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Medical History" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Admission History" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Walk-in History" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Patient Reports" />
            </CollapsibleNavItem>

            {/* Appointment Management */}
            <CollapsibleNavItem
              icon={<Calendar className="w-5 h-5" />}
              text="Appointment Management"
            >
              <NavItem icon={<Calendar className="w-4 h-4" />} text="Book Appointments" />
              <NavItem icon={<Users className="w-4 h-4" />} text="Waiting Patients" />
              <NavItem icon={<Layers className="w-4 h-4" />} text="Patient Queue" />
              <NavItem icon={<UserCheck className="w-4 h-4" />} text="Walk-in Appointments" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Appointment Reports" />
            </CollapsibleNavItem>

            {/* Admissions */}
            <CollapsibleNavItem
              icon={<Bed className="w-5 h-5" />}
              text="Admissions"
              isActive={currentPath.includes('/patients/admission')}
            >
              <NavItem
                icon={<CheckCircle className="w-4 h-4" />}
                text="Admit Patients"
                to="/patients/admission"
                isActive={currentPath.includes('/patients/admission')}
              />
              <NavItem icon={<Users className="w-4 h-4" />} text="Manage Admitted Patients" />
              <NavItem icon={<LogOut className="w-4 h-4" />} text="Discharge Patients" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Admission Reports" />
              <NavItem icon={<Layers className="w-4 h-4" />} text="Bed Management" />
            </CollapsibleNavItem>

            {/* Laboratory */}
            <CollapsibleNavItem
              icon={<Beaker className="w-5 h-5" />}
              text="Laboratory"
            >
              <NavItem icon={<FileText className="w-4 h-4" />} text="Lab Test Requests" />
              <NavItem icon={<Users className="w-4 h-4" />} text="Waiting Patients for Lab" />
              <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Lab Visits" />
              <NavItem icon={<User className="w-4 h-4" />} text="External Patient Lab Visits" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Lab Reports" />
            </CollapsibleNavItem>

            {/* Radiology */}
            <CollapsibleNavItem
              icon={<Scan className="w-5 h-5" />}
              text="Radiology"
            >
              <NavItem icon={<FileText className="w-4 h-4" />} text="Radiology Requests" />
              <NavItem icon={<Users className="w-4 h-4" />} text="Waiting Patients for Radiology" />
              <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Radiology Visits" />
              <NavItem icon={<User className="w-4 h-4" />} text="External Patient Radiology Visits" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Radiology Reports" />
            </CollapsibleNavItem>

            {/* Nursing Station */}
            <CollapsibleNavItem
              icon={<Thermometer className="w-5 h-5" />}
              text="Nursing Station"
            >
              <NavItem icon={<Activity className="w-4 h-4" />} text="Vital Signs and Allergies" />
              <NavItem icon={<Users className="w-4 h-4" />} text="Triaged Patients" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Monitoring Notes" />
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Appointment Files" />
              <NavItem icon={<Pill className="w-4 h-4" />} text="Pharmacy Procedure Requests" />
              <NavItem icon={<CheckCircle className="w-4 h-4" />} text="Mark Procedures" />
            </CollapsibleNavItem>

            {/* Procedures */}
            <CollapsibleNavItem
              icon={<Clipboard className="w-5 h-5" />}
              text="Procedures"
            >
              <NavItem icon={<Settings className="w-4 h-4" />} text="Procedure Management" />
              <NavItem icon={<Layers className="w-4 h-4" />} text="Procedure Groups" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Procedure Pricing" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Procedure Reports" />
            </CollapsibleNavItem>

            {/* Pharmacy */}
            <CollapsibleNavItem
              icon={<Pill className="w-5 h-5" />}
              text="Pharmacy"
            >
              <NavItem icon={<Pill className="w-4 h-4" />} text="Medication Dispensing" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Inventory Management" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Prescription Management" />
              <NavItem icon={<Repeat className="w-4 h-4" />} text="Medication Returns" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Stock Reports" />
              <NavItem icon={<Calendar className="w-4 h-4" />} text="Batch Expiry Reports" />
            </CollapsibleNavItem>

            {/* Maternity */}
            <CollapsibleNavItem
              icon={<Baby className="w-5 h-5" />}
              text="Maternity"
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Maternal Profiles" />
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Maternity Services" />
            </CollapsibleNavItem>

            {/* Mortuary */}
            <CollapsibleNavItem
              icon={<Skull className="w-5 h-5" />}
              text="Mortuary"
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Mortuary Profiles" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Storage Fees" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Miscellaneous Fees" />
            </CollapsibleNavItem>

            {/* Physiotherapy */}
            <CollapsibleNavItem
              icon={<Activity className="w-5 h-5" />}
              text="Physiotherapy"
            >
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Physiotherapy Services" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Dispensing Physiotherapy Items" />
            </CollapsibleNavItem>

            {/* Reports */}
            <CollapsibleNavItem
              icon={<FileText className="w-5 h-5" />}
              text="Reports"
            >
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Financial Reports" />
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Clinical Reports" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Administrative Reports" />
              <NavItem icon={<Building2 className="w-4 h-4" />} text="Ministry of Health Reports" />
            </CollapsibleNavItem>
          </CollapsibleSection>

          {/* Back Office Modules Section */}
          <CollapsibleSection
            title="Back Office Modules"
            icon={<Briefcase className="w-4 h-4" />}
            collapsed={collapsed}
          >
            {/* HRM and Payroll */}
            <CollapsibleNavItem
              icon={<Users className="w-5 h-5" />}
              text="HRM and Payroll"
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Employee Management" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Payroll Processing" />
              <NavItem icon={<Calculator className="w-4 h-4" />} text="Tax Management" />
              <NavItem icon={<Gift className="w-4 h-4" />} text="Benefits Management" />
              <NavItem icon={<Calendar className="w-4 h-4" />} text="Leave Management" />
              <NavItem icon={<BarChart className="w-4 h-4" />} text="Performance Management" />
            </CollapsibleNavItem>

            {/* Accounting */}
            <CollapsibleNavItem
              icon={<DollarSign className="w-5 h-5" />}
              text="Accounting"
            >
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Charges Management" />
              <NavItem icon={<Receipt className="w-4 h-4" />} text="Invoicing" />
              <NavItem icon={<CreditCard className="w-4 h-4" />} text="Insurance Payments" />
              <NavItem icon={<Landmark className="w-4 h-4" />} text="Banking" />
              <NavItem icon={<BookOpen className="w-4 h-4" />} text="General Ledger" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Assets Management" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Requisitions" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Stores Management" />
            </CollapsibleNavItem>

            {/* Administration */}
            <CollapsibleNavItem
              icon={<Settings className="w-5 h-5" />}
              text="Administration"
            >
              <NavItem icon={<User className="w-4 h-4" />} text="User Management" />
              <NavItem icon={<UserCheck className="w-4 h-4" />} text="Role Management" />
              <NavItem icon={<Shield className="w-4 h-4" />} text="Permissions" />
              <NavItem icon={<Settings className="w-4 h-4" />} text="System Configuration" />
              <NavItem icon={<Building2 className="w-4 h-4" />} text="Hospital Settings" />
            </CollapsibleNavItem>
          </CollapsibleSection>

          <NavItem icon={<HelpCircle className="w-5 h-5" />} text="Help" collapsed={collapsed} />
          <NavItem icon={<LogOut className="w-5 h-5" />} text="Log Out" collapsed={collapsed} />
        </div>
      </div>
    </>
  );
};

function Gift(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </svg>
  );
}
