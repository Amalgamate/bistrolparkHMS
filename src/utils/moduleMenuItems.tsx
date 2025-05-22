import React from 'react';
import {
  Clipboard,
  User,
  MonitorSmartphone,
  FileText,
  DollarSign,
  PlusCircle,
  Users,
  Settings,
  Home,
  BarChart,
  Calendar,
  Activity,
  Pill,
  Beaker,
  Scan,
  Bed,
  Stethoscope,
  Ambulance,
  Heart,
  Baby,
  Scissors,
  AlertTriangle,
  Droplets,
  Truck,
  Map
} from 'lucide-react';

// Clinical Module Menu Items (First)
export const clinicalMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/clinical'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Patient Registration',
    path: '/clinical/registration'
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Queue Management',
    path: '/clinical/queue'
  },
  {
    icon: <Activity className="h-4 w-4" />,
    label: 'Vitals Capture',
    path: '/clinical/vitals'
  },
  {
    icon: <Stethoscope className="h-4 w-4" />,
    label: 'Consultation',
    path: '/clinical/consultation'
  },
  {
    icon: <Beaker className="h-4 w-4" />,
    label: 'Lab Orders',
    path: '/clinical/lab-orders'
  },
  {
    icon: <Scan className="h-4 w-4" />,
    label: 'Radiology Orders',
    path: '/clinical/radiology-orders'
  },
  {
    icon: <Pill className="h-4 w-4" />,
    label: 'Prescriptions',
    path: '/clinical/prescriptions'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/clinical/settings'
  }
];

// Patients Module Menu Items (Second)
export const patientsMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/patient-module'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Patient Registration',
    path: '/patient-module/register'
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Patient List',
    path: '/patient-module/list'
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: 'Patient Records',
    path: '/patient-module/records'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/patient-module/settings'
  }
];

// Admissions Module Menu Items (Third)
export const admissionsMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/admissions'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Admission Register',
    path: '/admissions/register'
  },
  {
    icon: <Bed className="h-4 w-4" />,
    label: 'Bed Management',
    path: '/admissions/beds'
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: 'Discharge Management',
    path: '/admissions/discharge'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Reports',
    path: '/admissions/reports'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/admissions/settings'
  }
];

// Laboratory Module Menu Items (Fourth)
export const labMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/lab'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Lab Requests',
    path: '/lab/requests'
  },
  {
    icon: <Beaker className="h-4 w-4" />,
    label: 'Sample Collection',
    path: '/lab/samples'
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: 'Results Entry',
    path: '/lab/results'
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'External Patients',
    path: '/lab/external'
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Test Prices',
    path: '/lab/prices'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/lab/settings'
  }
];

// Pharmacy Module Menu Items (Fifth)
export const pharmacyMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/pharmacy'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Prescription Queue',
    path: '/pharmacy/queue'
  },
  {
    icon: <Pill className="h-4 w-4" />,
    label: 'Inventory',
    path: '/pharmacy/inventory'
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Walk-In Patients',
    path: '/pharmacy/walkin'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Stock Movement',
    path: '/pharmacy/stock-movement'
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: 'Expiry Report',
    path: '/pharmacy/expiry-report'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/pharmacy/settings'
  }
];
// Physiotherapy Module Menu Items (Sixth)
export const physiotherapyMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/physiotherapy'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Patient Assessment',
    path: '/physiotherapy/assessment'
  },
  {
    icon: <Activity className="h-4 w-4" />,
    label: 'Treatment Plans',
    path: '/physiotherapy/treatment'
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: 'Appointments',
    path: '/physiotherapy/appointments'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Reports',
    path: '/physiotherapy/reports'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/physiotherapy/settings'
  }
];

// Maternity Module Menu Items (Seventh)
export const maternityMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/maternity'
  },
  {
    icon: <Baby className="h-4 w-4" />,
    label: 'Antenatal Care',
    path: '/maternity/antenatal'
  },
  {
    icon: <Bed className="h-4 w-4" />,
    label: 'Labor & Delivery',
    path: '/maternity/delivery'
  },
  {
    icon: <Heart className="h-4 w-4" />,
    label: 'Postnatal Care',
    path: '/maternity/postnatal'
  },
  {
    icon: <Stethoscope className="h-4 w-4" />,
    label: 'NICU',
    path: '/maternity/nicu'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Reports',
    path: '/maternity/reports'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/maternity/settings'
  }
];

// Radiology Module Menu Items (Eighth)
export const radiologyMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/radiology'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Radiology Requests',
    path: '/radiology/requests'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Internal Patient Visits',
    path: '/radiology/internal-visits'
  },
  {
    icon: <MonitorSmartphone className="h-4 w-4" />,
    label: 'External Patient Visits',
    path: '/radiology/external-visits'
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: 'Visit Reports',
    path: '/radiology/visit-report'
  },
  {
    icon: <FileText className="h-4 w-4" />,
    label: 'Patient Reports',
    path: '/radiology/patient-report'
  },
  {
    icon: <DollarSign className="h-4 w-4" />,
    label: 'Test Prices',
    path: '/radiology/test-prices'
  },
  {
    icon: <PlusCircle className="h-4 w-4" />,
    label: 'Post New Requests',
    path: '/radiology/post-requests'
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: 'Walk-In Patients',
    path: '/radiology/walkin'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/radiology/settings'
  }
];

// Procedures Module Menu Items (Ninth)
export const proceduresMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/procedures'
  },
  {
    icon: <Scissors className="h-4 w-4" />,
    label: 'Surgical Procedures',
    path: '/procedures/surgical'
  },
  {
    icon: <Stethoscope className="h-4 w-4" />,
    label: 'Non-Surgical Procedures',
    path: '/procedures/non-surgical'
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: 'Schedule',
    path: '/procedures/schedule'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Reports',
    path: '/procedures/reports'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/procedures/settings'
  }
];

// Emergency Services Module Menu Items (Tenth)
export const emergencyMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/emergency'
  },
  {
    icon: <AlertTriangle className="h-4 w-4" />,
    label: 'Triage',
    path: '/emergency/triage'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Patient Management',
    path: '/emergency/patients'
  },
  {
    icon: <Bed className="h-4 w-4" />,
    label: 'Bed Management',
    path: '/emergency/beds'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/emergency/settings'
  }
];

// Blood Bank Module Menu Items
export const bloodBankMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/blood-bank'
  },
  {
    icon: <Droplets className="h-4 w-4" />,
    label: 'Donations',
    path: '/blood-bank/donations'
  },
  {
    icon: <User className="h-4 w-4" />,
    label: 'Donors',
    path: '/blood-bank/donors'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Requests',
    path: '/blood-bank/requests'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/blood-bank/settings'
  }
];

// Ambulance Module Menu Items
export const ambulanceMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/ambulance'
  },
  {
    icon: <Truck className="h-4 w-4" />,
    label: 'Fleet Management',
    path: '/ambulance/fleet'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Dispatch Requests',
    path: '/ambulance/dispatch'
  },
  {
    icon: <Map className="h-4 w-4" />,
    label: 'Tracking',
    path: '/ambulance/tracking'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/ambulance/settings'
  }
];

// Mortuary Module Menu Items (Last)
export const mortuaryMenuItems = [
  {
    icon: <Home className="h-4 w-4" />,
    label: 'Dashboard',
    path: '/mortuary'
  },
  {
    icon: <Clipboard className="h-4 w-4" />,
    label: 'Admissions',
    path: '/mortuary/admissions'
  },
  {
    icon: <Calendar className="h-4 w-4" />,
    label: 'Release Management',
    path: '/mortuary/release'
  },
  {
    icon: <BarChart className="h-4 w-4" />,
    label: 'Reports',
    path: '/mortuary/reports'
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: 'Settings',
    path: '/mortuary/settings'
  }
];
