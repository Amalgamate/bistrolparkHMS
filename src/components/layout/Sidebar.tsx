import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PermissionNavSection from './PermissionNavSection';
import { X, Home, Inbox, UserCog, User, Layers, Calendar, FileText, Users, CreditCard, Box, Settings, Shield, HelpCircle, LogOut, ChevronDown, ChevronRight, ChevronLeft, Heart, Brain, Stethoscope, Skull, Baby, Pill, Microscope, Syringe, Scissors, Building2, DollarSign, Briefcase, ShoppingCart, ClipboardList, BookOpen, Truck, Coffee, FolderOpen, File, Image, FileText as FileTextIcon, Table, Archive, Share2, CheckCircle, Bed, Ambulance, Activity, Thermometer, Clipboard, Beaker, Edit, Utensils, Video, BarChart, Cog, CheckSquare, MessageSquare, Smartphone, Link, UserCheck, Clock, Settings as ToolIcon, Zap, Map, TrendingDown, Trash, TrendingUp, PieChart, Bell, AlertTriangle, Mail, AlertCircle, Scan, Landmark, Calculator, Gift, Key } from 'lucide-react';

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
      className={`flex ${collapsed ? 'justify-center' : 'items-center justify-start'} px-3 py-2 my-1 text-sm font-medium rounded-md group transition-all duration-150 ease-in-out relative ${
        isActive
          ? 'bg-[#F5B800] text-black font-semibold'
          : 'text-gray-300 hover:text-white hover:bg-[#78DCE8] hover:bg-opacity-20'
      }`}
      title={collapsed ? text : ''}
    >
      {!collapsed && (
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
  abbreviation?: string; // Add abbreviation prop
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  icon,
  defaultOpen = false,
  collapsed = false,
  abbreviation,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Generate abbreviation if not provided
  const getAbbreviation = () => {
    if (abbreviation) return abbreviation;

    // Generate abbreviation from title (e.g., "Clinical Modules" -> "CM")
    return title
      .split(' ')
      .map(word => word.charAt(0))
      .join('');
  };

  if (collapsed) {
    return (
      <div className="mt-4 relative group">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 flex items-center justify-center rounded-md bg-[#F5B800] text-black">
            {icon}
          </div>
          <div className="text-[10px] text-gray-300 mt-1 font-semibold">
            {getAbbreviation()}
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

          {/* CLINICAL MODULES */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] py-2 rounded">
                Clinical Modules
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] rounded">
                  CM
                </div>
              </div>
            )}
          </div>

          {/* Patients */}
          <PermissionNavSection requiredPermission="view_patients">
            <CollapsibleSection
              title="Patients"
              icon={<User className="w-4 h-4" />}
              defaultOpen={currentPath.includes('/patients') || currentPath.includes('/patient-module')}
              collapsed={collapsed}
            >
              <PermissionNavSection requiredPermission="register_patient">
                <NavItem
                  icon={<User className="w-4 h-4" />}
                  text="Patients Register"
                  to="/patient-module"
                  isActive={currentPath.includes('/patient-module')}
                />
              </PermissionNavSection>
              <NavItem icon={<FileText className="w-4 h-4" />} text="Medical History" />
              <PermissionNavSection requiredPermission="view_admitted_patients">
                <NavItem icon={<Bed className="w-4 h-4" />} text="Admission History" />
              </PermissionNavSection>
              <NavItem icon={<Clock className="w-4 h-4" />} text="Walk-in History" />
              <NavItem icon={<BarChart className="w-4 h-4" />} text="Patient Reports" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Appointments */}
          <PermissionNavSection requiredPermission="view_appointments">
            <CollapsibleSection
              title="Appointments"
              icon={<Calendar className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<CheckCircle className="w-4 h-4" />} text="Book Appointments" />
              <PermissionNavSection requiredPermission="view_waiting_patients">
                <NavItem icon={<Clock className="w-4 h-4" />} text="Manage Waiting Patients" />
              </PermissionNavSection>
              <NavItem icon={<Users className="w-4 h-4" />} text="Patient Queue" />
              <NavItem icon={<UserCheck className="w-4 h-4" />} text="Walk-in Appointments" />
              <NavItem icon={<BarChart className="w-4 h-4" />} text="Appointment Reports" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Admissions */}
          <PermissionNavSection requiredPermission="view_admitted_patients">
            <CollapsibleSection
              title="Admissions"
              icon={<Bed className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <PermissionNavSection requiredPermission="register_inpatient">
                <NavItem
                  icon={<CheckCircle className="w-4 h-4" />}
                  text="Admit Patients"
                  to="/patients/admission"
                  isActive={currentPath.includes('/patients/admission')}
                />
              </PermissionNavSection>
              <NavItem icon={<Users className="w-4 h-4" />} text="Manage Admitted Patients" />
              <PermissionNavSection requiredPermission="discharge_patient">
                <NavItem icon={<LogOut className="w-4 h-4" />} text="Discharge Patients" />
              </PermissionNavSection>
              <NavItem icon={<FileText className="w-4 h-4" />} text="Admission Reports" />
              <NavItem icon={<Layers className="w-4 h-4" />} text="Bed Management" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Nursing Station */}
          <PermissionNavSection requiredPermission="record_vital_signs">
            <CollapsibleSection
              title="Nursing Station"
              icon={<Activity className="w-4 h-4" />}
              collapsed={collapsed}
              abbreviation="NS"
            >
              <NavItem icon={<Thermometer className="w-4 h-4" />} text="Vital Signs & Allergies" />
              <NavItem icon={<CheckCircle className="w-4 h-4" />} text="Triaged Patients" />
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Monitoring Notes" />
              <PermissionNavSection requiredPermission="upload_appointment_files">
                <NavItem icon={<FileText className="w-4 h-4" />} text="Appointment Files" />
              </PermissionNavSection>
              <NavItem icon={<Pill className="w-4 h-4" />} text="Pharmacy Procedure Requests" />
              <NavItem icon={<CheckSquare className="w-4 h-4" />} text="Mark Procedures" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* DIAGNOSTIC MODULES */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] py-2 rounded">
                Diagnostic Services
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] rounded">
                  DS
                </div>
              </div>
            )}
          </div>

          {/* Laboratory */}
          <PermissionNavSection requiredPermission="view_waiting_patients_for_lab">
            <CollapsibleSection
              title="Laboratory"
              icon={<Beaker className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<ClipboardList className="w-4 h-4" />} text="Lab Test Requests" />
              <NavItem icon={<Clock className="w-4 h-4" />} text="Waiting Patients for Lab" />
              <PermissionNavSection requiredPermission="view_patient_visits_on_lab">
                <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Lab Visits" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="view_external_patient_visits_on_lab">
                <NavItem icon={<Users className="w-4 h-4" />} text="External Patient Lab Visits" />
              </PermissionNavSection>
              <NavItem icon={<FileText className="w-4 h-4" />} text="Lab Reports" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Radiology */}
          <PermissionNavSection requiredPermission="view_waiting_patients_for_radiology">
            <CollapsibleSection
              title="Radiology"
              icon={<Scan className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<ClipboardList className="w-4 h-4" />} text="Radiology Requests" />
              <NavItem icon={<Clock className="w-4 h-4" />} text="Waiting Patients for Radiology" />
              <PermissionNavSection requiredPermission="view_patient_visits_on_radiology">
                <NavItem icon={<User className="w-4 h-4" />} text="Internal Patient Radiology Visits" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="view_external_patient_visits_on_radiology">
                <NavItem icon={<Users className="w-4 h-4" />} text="External Patient Radiology Visits" />
              </PermissionNavSection>
              <NavItem icon={<FileText className="w-4 h-4" />} text="Radiology Reports" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* SPECIALIZED SERVICES */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] py-2 rounded">
                Specialized Services
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] rounded">
                  SS
                </div>
              </div>
            )}
          </div>

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
          <PermissionNavSection requiredPermission="view_waiting_patients_for_pharmacy">
            <CollapsibleSection
              title="Pharmacy"
              icon={<Pill className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Medication Dispensing" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Inventory Management" />
              <NavItem icon={<FileText className="w-4 h-4" />} text="Prescription Management" />
              <PermissionNavSection requiredPermission="drugs_dispensed_reversal">
                <NavItem icon={<Truck className="w-4 h-4" />} text="Medication Returns" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="medicine_stock_report">
                <NavItem icon={<BarChart className="w-4 h-4" />} text="Stock Reports" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="medicine_batch_expiry_report">
                <NavItem icon={<Calendar className="w-4 h-4" />} text="Batch Expiry Reports" />
              </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Maternity */}
          <PermissionNavSection requiredPermission="maternity">
            <CollapsibleSection
              title="Maternity"
              icon={<Baby className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Maternal Profiles" />
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Maternity Services" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Physiotherapy */}
          <PermissionNavSection requiredPermission="view_physiotherapy_stock">
            <CollapsibleSection
              title="Physiotherapy"
              icon={<Activity className="w-4 h-4" />}
              collapsed={collapsed}
              abbreviation="PT"
            >
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Physiotherapy Services" />
              <NavItem icon={<Box className="w-4 h-4" />} text="Dispensing Physiotherapy Items" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Mortuary */}
          <PermissionNavSection requiredPermission="mortuary">
            <CollapsibleSection
              title="Mortuary"
              icon={<Skull className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Mortuary Profiles" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Storage Fees" />
              <NavItem icon={<CreditCard className="w-4 h-4" />} text="Miscellaneous Fees" />
            </CollapsibleSection>
          </PermissionNavSection>

          {/* ADMINISTRATIVE MODULES */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] py-2 rounded">
                Administrative Modules
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] rounded">
                  AM
                </div>
              </div>
            )}
          </div>

          {/* Reports */}
          <PermissionNavSection requiredPermission="daily_cash_reports">
            <CollapsibleSection
              title="Reports"
              icon={<BarChart className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <PermissionNavSection requiredPermission="daily_cash_reports">
                <NavItem icon={<DollarSign className="w-4 h-4" />} text="Financial Reports" />
              </PermissionNavSection>
              <NavItem icon={<Clipboard className="w-4 h-4" />} text="Clinical Reports" />
              <NavItem icon={<Building2 className="w-4 h-4" />} text="Administrative Reports" />
              <PermissionNavSection requiredPermission="view_ministry_of_health_reports">
                <NavItem icon={<FileText className="w-4 h-4" />} text="Ministry of Health Reports" />
              </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* HRM and Payroll */}
          <PermissionNavSection requiredPermission="handle_payroll">
            <CollapsibleSection
              title="HRM and Payroll"
              icon={<Users className="w-4 h-4" />}
              collapsed={collapsed}
              abbreviation="HR"
            >
              <NavItem icon={<User className="w-4 h-4" />} text="Employee Management" />
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Payroll Processing" />
              <NavItem icon={<Calculator className="w-4 h-4" />} text="Tax Management" />
              <NavItem icon={<Gift className="w-4 h-4" />} text="Benefits Management" />
              <PermissionNavSection requiredPermission="leave_management">
                <NavItem icon={<Calendar className="w-4 h-4" />} text="Leave Management" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="employee_performance_management">
                <NavItem icon={<BarChart className="w-4 h-4" />} text="Performance Management" />
              </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Accounting */}
          <PermissionNavSection requiredPermission="chart_of_accounts">
            <CollapsibleSection
              title="Accounting"
              icon={<Landmark className="w-4 h-4" />}
              collapsed={collapsed}
            >
              <PermissionNavSection requiredPermission="view_patient_charges">
                <NavItem icon={<CreditCard className="w-4 h-4" />} text="Charges Management" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="view_invoices">
                <NavItem icon={<FileText className="w-4 h-4" />} text="Invoicing" />
              </PermissionNavSection>
              <NavItem icon={<DollarSign className="w-4 h-4" />} text="Insurance Payments" />
              <PermissionNavSection requiredPermission="banking">
                <NavItem icon={<Landmark className="w-4 h-4" />} text="Banking" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="general_journal">
                <NavItem icon={<BookOpen className="w-4 h-4" />} text="General Ledger" />
              </PermissionNavSection>
              <PermissionNavSection requiredPermission="assets">
                <NavItem icon={<Box className="w-4 h-4" />} text="Assets Management" />
              </PermissionNavSection>
            </CollapsibleSection>
          </PermissionNavSection>

          {/* Requisitions */}
          <CollapsibleSection
            title="Requisitions"
            icon={<ClipboardList className="w-4 h-4" />}
            collapsed={collapsed}
          >
            <NavItem icon={<Box className="w-4 h-4" />} text="Stores Management" />
          </CollapsibleSection>

          {/* SYSTEM SETTINGS */}
          <div className="mt-6">
            {!collapsed ? (
              <div className="px-3 mb-2 text-xs font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] py-2 rounded">
                System Settings
              </div>
            ) : (
              <div className="flex justify-center mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-gray-300 uppercase bg-[#1E2A6B] rounded">
                  SS
                </div>
              </div>
            )}
          </div>

          {/* Administration */}
          <CollapsibleSection
            title="Administration"
            icon={<Settings className="w-4 h-4" />}
            collapsed={collapsed}
            abbreviation="ADM"
          >
            <PermissionNavSection requiredPermission="register_user">
              <NavItem
                icon={<User className="w-4 h-4" />}
                text="User Management"
                to="/users"
                isActive={currentPath.includes('/users')}
              />
            </PermissionNavSection>
            <NavItem icon={<UserCheck className="w-4 h-4" />} text="Role Management" />
            <NavItem
              icon={<Shield className="w-4 h-4" />}
              text="Permissions"
              to="/permissions"
              isActive={currentPath.includes('/permissions')}
            />
            <NavItem icon={<Settings className="w-4 h-4" />} text="System Configuration" />
            <PermissionNavSection requiredPermission="upload_hospital_logo">
              <NavItem
                icon={<Building2 className="w-4 h-4" />}
                text="Branch Settings"
                to="/settings"
                isActive={currentPath.includes('/settings')}
              />
            </PermissionNavSection>
            <NavItem
              icon={<Layers className="w-4 h-4" />}
              text="Design System"
              to="/design-system"
              isActive={currentPath.includes('/design-system')}
            />
            <NavItem
              icon={<Key className="w-4 h-4" />}
              text="Login Credentials"
              to="/login-credentials"
              isActive={currentPath.includes('/login-credentials')}
            />
          </CollapsibleSection>

          {/* Inbox at the bottom */}
          <div className="mt-6 border-t border-gray-700 pt-4">
            <NavItem
              icon={<Inbox className="w-5 h-5" />}
              text="Inbox"
              collapsed={collapsed}
            />
          </div>
        </div>
      </div>
    </>
  );
};