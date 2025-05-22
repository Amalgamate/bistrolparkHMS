import {
  UserPlus,
  Users,
  Stethoscope,
  Activity,
  FlaskConical,
  Pill,
  FileText,
  DollarSign,
  Package,
  Truck,
  Building,
  Calendar,
  Clipboard,
  MonitorSmartphone,
  Scissors,
  Heart,
  Baby,
  Bed,
  Clock,
  Droplets,
  Search,
  Phone,
  Wrench,
  AlertTriangle,
  Dumbbell,
  RotateCcw,
  Home,
  BarChart,
  FolderPlus,
  Folder,
  UserCheck,
  Ambulance as AmbulanceIcon,
  BookOpen,
  Skull
} from 'lucide-react';
import { Module } from '../context/ModuleQuickActionsContext';

// Define quick actions for each module
export const moduleQuickActions: Module[] = [
  {
    id: 'clinical',
    name: 'Clinical',
    quickActions: [
      {
        id: 'new-patient',
        label: 'New Patient',
        icon: UserPlus,
        path: '/clinical?tab=registration',
        description: 'Register a new patient'
      },
      {
        id: 'consultation-queue',
        label: 'Consultation Queue',
        icon: Users,
        path: '/clinical?tab=queue',
        description: 'View waiting patients'
      },
      {
        id: 'vitals-capture',
        label: 'Vitals Capture',
        icon: Activity,
        path: '/clinical?tab=vitals',
        description: 'Record patient vitals'
      },
      {
        id: 'doctor-consultation',
        label: 'Doctor Consultation',
        icon: Stethoscope,
        path: '/clinical?tab=consultation',
        description: 'Start patient consultation'
      }
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    quickActions: [
      {
        id: 'patient-medication-profile',
        label: 'Patient Medication Profile',
        icon: Users,
        path: '/pharmacy/patient-profile',
        description: 'View complete patient medication profile'
      },
      {
        id: 'drug-information',
        label: 'Drug Information',
        icon: FileText,
        path: '/pharmacy/drug-info',
        description: 'Access detailed drug information'
      },
      {
        id: 'pharmacy-analytics',
        label: 'Pharmacy Analytics',
        icon: BarChart,
        path: '/pharmacy/analytics',
        description: 'View pharmacy performance metrics'
      }
    ]
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    quickActions: [
      {
        id: 'view-lab-requests',
        label: 'View Lab Requests',
        icon: FlaskConical,
        path: '/laboratory/requests',
        description: 'View pending lab requests'
      },
      {
        id: 'new-lab-request',
        label: 'New Lab Request',
        icon: Clipboard,
        path: '/laboratory/new',
        description: 'Create a new lab request'
      },
      {
        id: 'register-walk-in',
        label: 'Register Walk-In',
        icon: UserPlus,
        path: '/laboratory/walkin',
        description: 'Register walk-in patient'
      },
      {
        id: 'manage-test-prices',
        label: 'Manage Test Prices',
        icon: DollarSign,
        path: '/laboratory/prices',
        description: 'Update lab test prices'
      }
    ]
  },
  {
    id: 'radiology',
    name: 'Radiology',
    quickActions: [
      {
        id: 'view-radiology-requests',
        label: 'View Requests',
        icon: Clipboard,
        path: '/radiology/requests',
        description: 'View pending radiology requests'
      },
      {
        id: 'new-radiology-request',
        label: 'New Request',
        icon: FileText,
        path: '/radiology/post-requests',
        description: 'Create a new radiology request'
      },
      {
        id: 'walk-in-patients',
        label: 'Walk-In Patients',
        icon: Users,
        path: '/radiology/walkin',
        description: 'Register walk-in patients'
      },
      {
        id: 'view-reports',
        label: 'View Reports',
        icon: MonitorSmartphone,
        path: '/radiology/visit-report',
        description: 'View radiology reports'
      }
    ]
  },
  {
    id: 'back-office',
    name: 'Back Office',
    quickActions: [
      {
        id: 'add-employee',
        label: 'Add Employee',
        icon: UserPlus,
        path: '/back-office/hr/add-employee',
        description: 'Add a new employee'
      },
      {
        id: 'new-transaction',
        label: 'New Transaction',
        icon: DollarSign,
        path: '/back-office/finance/new-transaction',
        description: 'Record a new financial transaction'
      },
      {
        id: 'inventory-check',
        label: 'Inventory Check',
        icon: Package,
        path: '/back-office/inventory/check',
        description: 'Perform inventory check'
      },
      {
        id: 'new-purchase-order',
        label: 'New Purchase Order',
        icon: Truck,
        path: '/back-office/procurement/new-order',
        description: 'Create a new purchase order'
      },
      {
        id: 'facility-management',
        label: 'Facility Management',
        icon: Building,
        path: '/back-office/administration/facility',
        description: 'Manage facility resources'
      }
    ]
  },
  {
    id: 'physiotherapy',
    name: 'Physiotherapy',
    quickActions: [
      {
        id: 'manage-patients',
        label: 'Manage Patients',
        icon: Users,
        path: '/physiotherapy/patients',
        description: 'View and manage patients'
      },
      {
        id: 'schedule-appointment',
        label: 'Schedule Appointment',
        icon: Calendar,
        path: '/physiotherapy/appointments',
        description: 'Schedule a new appointment'
      },
      {
        id: 'view-treatments',
        label: 'View Treatments',
        icon: Clipboard,
        path: '/physiotherapy/treatments',
        description: 'View ongoing treatments'
      },
      {
        id: 'exercise-library',
        label: 'Exercise Library',
        icon: Dumbbell,
        path: '/physiotherapy/exercises',
        description: 'Browse exercise library'
      }
    ]
  },
  // Add more modules as needed
  {
    id: 'maternity',
    name: 'Maternity',
    quickActions: [
      {
        id: 'antenatal-appointments',
        label: 'Antenatal Appointments',
        icon: Calendar,
        path: '/maternity/antenatal',
        description: 'Manage antenatal appointments'
      },
      {
        id: 'labor-ward-status',
        label: 'Labor Ward Status',
        icon: Heart,
        path: '/maternity/labor',
        description: 'View labor ward status'
      },
      {
        id: 'postnatal-checkups',
        label: 'Postnatal Checkups',
        icon: Baby,
        path: '/maternity/postnatal',
        description: 'Schedule postnatal checkups'
      }
    ]
  },
  {
    id: 'procedures',
    name: 'Procedures',
    quickActions: [
      {
        id: 'surgical-procedures',
        label: 'Surgical Procedures',
        icon: Scissors,
        path: '/procedures/surgical',
        description: 'Manage surgical procedures'
      },
      {
        id: 'non-surgical-procedures',
        label: 'Non-Surgical Procedures',
        icon: Stethoscope,
        path: '/procedures/non-surgical',
        description: 'Manage non-surgical procedures'
      },
      {
        id: 'schedule-procedure',
        label: 'Schedule Procedure',
        icon: Calendar,
        path: '/procedures/schedule',
        description: 'Schedule a new procedure'
      }
    ]
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    quickActions: [
      {
        id: 'view-analytics',
        label: 'View Analytics',
        icon: BarChart,
        path: '/dashboard?tab=analytics',
        description: 'View hospital analytics'
      },
      {
        id: 'quick-patient-search',
        label: 'Patient Search',
        icon: Search,
        path: '/dashboard?tab=search',
        description: 'Search for a patient'
      },
      {
        id: 'today-appointments',
        label: 'Today\'s Appointments',
        icon: Calendar,
        path: '/dashboard?tab=appointments',
        description: 'View today\'s appointments'
      },
      {
        id: 'hospital-status',
        label: 'Hospital Status',
        icon: Building,
        path: '/dashboard?tab=status',
        description: 'View hospital status'
      }
    ]
  },
  {
    id: 'patients',
    name: 'Patients',
    quickActions: [
      {
        id: 'register-patient',
        label: 'Register Patient',
        icon: UserPlus,
        path: '/patients/register',
        description: 'Register a new patient'
      },
      {
        id: 'search-patients',
        label: 'Search Patients',
        icon: Search,
        path: '/patients/search',
        description: 'Search for patients'
      },
      {
        id: 'patient-records',
        label: 'Patient Records',
        icon: Folder,
        path: '/patients/records',
        description: 'View patient records'
      },
      {
        id: 'patient-billing',
        label: 'Patient Billing',
        icon: DollarSign,
        path: '/patients/billing',
        description: 'Manage patient billing'
      }
    ]
  },
  {
    id: 'admissions',
    name: 'Admissions',
    quickActions: [
      {
        id: 'new-admission',
        label: 'New Admission',
        icon: Bed,
        path: '/admissions/new',
        description: 'Admit a new patient'
      },
      {
        id: 'view-admitted',
        label: 'View Admitted',
        icon: Users,
        path: '/admissions/view',
        description: 'View admitted patients'
      },
      {
        id: 'discharge-patient',
        label: 'Discharge Patient',
        icon: UserCheck,
        path: '/admissions/discharge',
        description: 'Discharge a patient'
      },
      {
        id: 'bed-management',
        label: 'Bed Management',
        icon: Bed,
        path: '/admissions/beds',
        description: 'Manage hospital beds'
      }
    ]
  },
  {
    id: 'appointments',
    name: 'Appointments',
    quickActions: [
      {
        id: 'new-appointment',
        label: 'New Appointment',
        icon: Calendar,
        path: '/appointments/management?action=new',
        description: 'Schedule a new appointment'
      },
      {
        id: 'appointment-queue',
        label: 'Appointment Queue',
        icon: Clock,
        path: '/appointments/queue',
        description: 'View appointment queue'
      },
      {
        id: 'visit-records',
        label: 'Visit Records',
        icon: FileText,
        path: '/appointments/visits',
        description: 'View visit records'
      },
      {
        id: 'appointment-reports',
        label: 'Appointment Reports',
        icon: BarChart,
        path: '/appointments/reports',
        description: 'View appointment reports'
      }
    ]
  },
  {
    id: 'document-center',
    name: 'Document Center',
    quickActions: [
      {
        id: 'upload-document',
        label: 'Upload Document',
        icon: FolderPlus,
        path: '/document-center?action=upload',
        description: 'Upload a new document'
      },
      {
        id: 'view-documents',
        label: 'View Documents',
        icon: Folder,
        path: '/document-center?action=view',
        description: 'View all documents'
      },
      {
        id: 'search-documents',
        label: 'Search Documents',
        icon: Search,
        path: '/document-center?action=search',
        description: 'Search for documents'
      },
      {
        id: 'document-templates',
        label: 'Document Templates',
        icon: FileText,
        path: '/document-center?action=templates',
        description: 'Manage document templates'
      }
    ]
  },
  {
    id: 'mortuary',
    name: 'Mortuary',
    quickActions: [
      {
        id: 'new-admission',
        label: 'New Admission',
        icon: Skull,
        path: '/mortuary/admission',
        description: 'Register a new admission'
      },
      {
        id: 'view-records',
        label: 'View Records',
        icon: BookOpen,
        path: '/mortuary/records',
        description: 'View mortuary records'
      },
      {
        id: 'release-management',
        label: 'Release Management',
        icon: FileText,
        path: '/mortuary/release',
        description: 'Manage body releases'
      },
      {
        id: 'mortuary-reports',
        label: 'Mortuary Reports',
        icon: BarChart,
        path: '/mortuary/reports',
        description: 'View mortuary reports'
      }
    ]
  },
  {
    id: 'emergency',
    name: 'Emergency',
    quickActions: [
      {
        id: 'triage-patient',
        label: 'Triage Patient',
        icon: AlertTriangle,
        path: '/emergency/triage',
        description: 'Triage a new patient'
      },
      {
        id: 'view-patients',
        label: 'View Patients',
        icon: Users,
        path: '/emergency/patients',
        description: 'View emergency patients'
      },
      {
        id: 'trauma-center',
        label: 'Trauma Center',
        icon: Heart,
        path: '/emergency/trauma',
        description: 'Access trauma center'
      },
      {
        id: 'emergency-reports',
        label: 'Emergency Reports',
        icon: FileText,
        path: '/emergency/reports',
        description: 'View emergency reports'
      }
    ]
  },
  {
    id: 'blood-bank',
    name: 'Blood Bank',
    quickActions: [
      {
        id: 'blood-donation',
        label: 'Blood Donation',
        icon: Droplets,
        path: '/blood-bank/donation',
        description: 'Register a blood donation'
      },
      {
        id: 'blood-inventory',
        label: 'Blood Inventory',
        icon: Package,
        path: '/blood-bank/inventory',
        description: 'View blood inventory'
      },
      {
        id: 'blood-request',
        label: 'Blood Request',
        icon: FileText,
        path: '/blood-bank/request',
        description: 'Create a blood request'
      },
      {
        id: 'donor-management',
        label: 'Donor Management',
        icon: Users,
        path: '/blood-bank/donors',
        description: 'Manage blood donors'
      }
    ]
  },
  {
    id: 'ambulance',
    name: 'Ambulance',
    quickActions: [
      {
        id: 'dispatch-ambulance',
        label: 'Dispatch Ambulance',
        icon: AmbulanceIcon,
        path: '/ambulance/dispatch',
        description: 'Dispatch an ambulance'
      },
      {
        id: 'track-ambulance',
        label: 'Track Ambulance',
        icon: Search,
        path: '/ambulance/track',
        description: 'Track ambulance location'
      },
      {
        id: 'ambulance-maintenance',
        label: 'Ambulance Maintenance',
        icon: Wrench,
        path: '/ambulance/maintenance',
        description: 'Manage ambulance maintenance'
      },
      {
        id: 'emergency-calls',
        label: 'Emergency Calls',
        icon: Phone,
        path: '/ambulance/calls',
        description: 'View emergency calls'
      }
    ]
  }
];

export default moduleQuickActions;
