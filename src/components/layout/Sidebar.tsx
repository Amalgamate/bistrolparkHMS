import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Home, Inbox, UserCog, User, Layers, Calendar, FileText, Users, CreditCard, Box, Settings, Shield, HelpCircle, LogOut, ChevronDown, ChevronRight, ChevronLeft, Heart, Brain, Stethoscope, Skull, Baby, Pill, Microscope, Syringe, Scissors, Building2, DollarSign, Briefcase, ShoppingCart, ClipboardList, BookOpen, Truck, Coffee, FolderOpen, File, Image, FileText as FileTextIcon, Table, Archive, Share2, CheckCircle, Bed, Ambulance, Activity, Thermometer, Clipboard, Beaker, Edit, Utensils, Video, BarChart, Cog, CheckSquare, MessageSquare, Smartphone, Link, UserCheck, Clock, Settings as ToolIcon, Zap, Map, TrendingDown, Trash, TrendingUp, PieChart, Bell, AlertTriangle, Mail, AlertCircle, Scan, Landmark, Calculator, Gift } from 'lucide-react';

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
      className={`flex ${collapsed ? 'justify-center' : 'items-center justify-start'} px-3 py-2 my-1 text-sm font-medium rounded-md group transition-all duration-150 ease-in-out ${
        isActive
          ? 'bg-[#F5B800] text-black font-semibold'
          : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
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
            isActive ? 'bg-[#F5B800] text-black font-semibold' : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
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
          isActive ? 'bg-[#F5B800] text-black font-semibold' : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
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
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5B800] text-black">
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
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold tracking-wider text-gray-300 uppercase hover:text-white focus:outline-none transition-all duration-150"
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

// Keep the original NavSection for backward compatibility
const NavSection: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div className="mt-6">
      <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
        {title}
      </div>
      <nav className="space-y-1">{children}</nav>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, className }) => {
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
                <h1 className="text-white text-xl font-bold tracking-wide">BISTRO PARK</h1>
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

        <div className={`${collapsed ? 'p-2' : 'p-4'} overflow-y-auto h-[calc(100vh-4rem)] transition-all duration-300`}>
          <NavItem
            icon={<Home className="w-5 h-5" />}
            text="Home"
            to="/dashboard"
            isActive={currentPath === '/' || currentPath === '/dashboard'}
            collapsed={collapsed}
          />
          <NavItem
            icon={<Inbox className="w-5 h-5" />}
            text="Inbox"
            collapsed={collapsed}
          />

          {/* Patients */}
          <CollapsibleSection
            title="Patients"
            icon={<User className="w-4 h-4" />}
            defaultOpen={currentPath.includes('/patients') || currentPath.includes('/patient-module')}
            collapsed={collapsed}
          >
            <NavItem
              icon={<User className="w-4 h-4" />}
              text="Patients Register"
              to="/patient-module"
              isActive={currentPath.includes('/patient-module')}
            />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Medical History" />
            <NavItem icon={<Bed className="w-4 h-4" />} text="Admission History" />
            <NavItem icon={<Clock className="w-4 h-4" />} text="Walk-in History" />
            <NavItem icon={<BarChart className="w-4 h-4" />} text="Patient Reports" />
          </CollapsibleSection>

          {/* Appointments */}
          <CollapsibleSection
            title="Appointments"
            icon={<Calendar className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<CheckCircle className="w-4 h-4" />} text="Book Appointments" />
            <NavItem icon={<Clock className="w-4 h-4" />} text="Manage Waiting Patients" />
            <NavItem icon={<Users className="w-4 h-4" />} text="Patient Queue" />
            <NavItem icon={<UserCheck className="w-4 h-4" />} text="Walk-in Appointments" />
            <NavItem icon={<BarChart className="w-4 h-4" />} text="Appointment Reports" />
          </CollapsibleSection>

          {/* Admissions */}
          <CollapsibleSection
            title="Admissions"
            icon={<Bed className="w-4 h-4" />}
            collapsed={collapsed}
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
          </CollapsibleSection>

          {/* Laboratory */}
          <CollapsibleSection
            title="Laboratory"
            icon={<Beaker className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<ClipboardList className="w-4 h-4" />} text="Lab Test Requests" />
            <NavItem icon={<Clock className="w-4 h-4" />} text="Waiting Patients for Lab" />
            <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Lab Visits" />
            <NavItem icon={<Users className="w-4 h-4" />} text="External Patient Lab Visits" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Lab Reports" />
          </CollapsibleSection>

          {/* Radiology */}
          <CollapsibleSection
            title="Radiology"
            icon={<Scan className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<ClipboardList className="w-4 h-4" />} text="Radiology Requests" />
            <NavItem icon={<Clock className="w-4 h-4" />} text="Waiting Patients for Radiology" />
            <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Radiology Visits" />
            <NavItem icon={<Users className="w-4 h-4" />} text="External Patient Radiology Visits" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Radiology Reports" />
          </CollapsibleSection>

          {/* Nursing Station */}
          <CollapsibleSection
            title="Nursing Station"
            icon={<Activity className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Thermometer className="w-4 h-4" />} text="Vital Signs & Allergies" />
            <NavItem icon={<CheckCircle className="w-4 h-4" />} text="Triaged Patients" />
            <NavItem icon={<Clipboard className="w-4 h-4" />} text="Monitoring Notes" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Appointment Files" />
            <NavItem icon={<Pill className="w-4 h-4" />} text="Pharmacy Procedure Requests" />
            <NavItem icon={<CheckSquare className="w-4 h-4" />} text="Mark Procedures" />
          </CollapsibleSection>

          {/* Procedures */}
          <CollapsibleSection
            title="Procedures"
            icon={<Clipboard className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Settings className="w-4 h-4" />} text="Procedure Management" />
            <NavItem icon={<Layers className="w-4 h-4" />} text="Procedure Groups" />
            <NavItem icon={<DollarSign className="w-4 h-4" />} text="Procedure Pricing" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Procedure Reports" />
          </CollapsibleSection>

          {/* Pharmacy */}
          <CollapsibleSection
            title="Pharmacy"
            icon={<Pill className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Clipboard className="w-4 h-4" />} text="Medication Dispensing" />
            <NavItem icon={<Box className="w-4 h-4" />} text="Inventory Management" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Prescription Management" />
            <NavItem icon={<Truck className="w-4 h-4" />} text="Medication Returns" />
            <NavItem icon={<BarChart className="w-4 h-4" />} text="Stock Reports" />
            <NavItem icon={<Calendar className="w-4 h-4" />} text="Batch Expiry Reports" />
          </CollapsibleSection>

          {/* Maternity */}
          <CollapsibleSection
            title="Maternity"
            icon={<Baby className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<User className="w-4 h-4" />} text="Maternal Profiles" />
            <NavItem icon={<Clipboard className="w-4 h-4" />} text="Maternity Services" />
          </CollapsibleSection>

          {/* Mortuary */}
          <CollapsibleSection
            title="Mortuary"
            icon={<Skull className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<User className="w-4 h-4" />} text="Mortuary Profiles" />
            <NavItem icon={<DollarSign className="w-4 h-4" />} text="Storage Fees" />
            <NavItem icon={<CreditCard className="w-4 h-4" />} text="Miscellaneous Fees" />
          </CollapsibleSection>

          {/* Physiotherapy */}
          <CollapsibleSection
            title="Physiotherapy"
            icon={<Activity className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Clipboard className="w-4 h-4" />} text="Physiotherapy Services" />
            <NavItem icon={<Box className="w-4 h-4" />} text="Dispensing Physiotherapy Items" />
          </CollapsibleSection>

          {/* Reports */}
          <CollapsibleSection
            title="Reports"
            icon={<BarChart className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<DollarSign className="w-4 h-4" />} text="Financial Reports" />
            <NavItem icon={<Clipboard className="w-4 h-4" />} text="Clinical Reports" />
            <NavItem icon={<Building2 className="w-4 h-4" />} text="Administrative Reports" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Ministry of Health Reports" />
          </CollapsibleSection>

          {/* HRM and Payroll */}
          <CollapsibleSection
            title="HRM and Payroll"
            icon={<Users className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<User className="w-4 h-4" />} text="Employee Management" />
            <NavItem icon={<DollarSign className="w-4 h-4" />} text="Payroll Processing" />
            <NavItem icon={<Calculator className="w-4 h-4" />} text="Tax Management" />
            <NavItem icon={<Gift className="w-4 h-4" />} text="Benefits Management" />
            <NavItem icon={<Calendar className="w-4 h-4" />} text="Leave Management" />
            <NavItem icon={<BarChart className="w-4 h-4" />} text="Performance Management" />
          </CollapsibleSection>

          {/* Accounting */}
          <CollapsibleSection
            title="Accounting"
            icon={<Landmark className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<CreditCard className="w-4 h-4" />} text="Charges Management" />
            <NavItem icon={<FileText className="w-4 h-4" />} text="Invoicing" />
            <NavItem icon={<DollarSign className="w-4 h-4" />} text="Insurance Payments" />
            <NavItem icon={<Landmark className="w-4 h-4" />} text="Banking" />
            <NavItem icon={<BookOpen className="w-4 h-4" />} text="General Ledger" />
            <NavItem icon={<Box className="w-4 h-4" />} text="Assets Management" />
          </CollapsibleSection>

          {/* Requisitions */}
          <CollapsibleSection
            title="Requisitions"
            icon={<ClipboardList className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Box className="w-4 h-4" />} text="Stores Management" />
          </CollapsibleSection>

          {/* Administration */}
          <CollapsibleSection
            title="Administration"
            icon={<Settings className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<User className="w-4 h-4" />} text="User Management" />
            <NavItem icon={<UserCheck className="w-4 h-4" />} text="Role Management" />
            <NavItem icon={<Shield className="w-4 h-4" />} text="Permissions" />
            <NavItem icon={<Settings className="w-4 h-4" />} text="System Configuration" />
            <NavItem icon={<Building2 className="w-4 h-4" />} text="Hospital Settings" />
          </CollapsibleSection>
        </div>
      </div>
    </>
  );
};