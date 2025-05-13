import { Patient, Doctor, AppointmentData, RoomData, DepartmentData } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sabrina Carpenter',
    age: 39,
    gender: 'Female',
    idNumber: 'BR263585643',
    admissionDate: '6 Jan 2024',
    diagnosis: 'Bruised Rib',
    status: 'Urgent',
    room: 'Tulip Room'
  },
  {
    id: '2',
    name: 'Andrea Tea',
    age: 22,
    gender: 'Female',
    idNumber: 'PN386419007',
    admissionDate: '6 Jan 2024',
    diagnosis: 'Pneumonia',
    status: 'Moderate',
    room: 'Rose Room'
  },
  {
    id: '3',
    name: 'Mark Johnson',
    age: 45,
    gender: 'Male',
    idNumber: 'MJ294651328',
    admissionDate: '5 Jan 2024',
    diagnosis: 'Fractured Leg',
    status: 'Moderate',
    room: 'Daisy Room'
  },
  {
    id: '4',
    name: 'Emily Parker',
    age: 32,
    gender: 'Female',
    idNumber: 'EP418573902',
    admissionDate: '4 Jan 2024',
    diagnosis: 'Appendicitis',
    status: 'Urgent',
    room: 'Orchid Room'
  },
  {
    id: '5',
    name: 'James Wilson',
    age: 56,
    gender: 'Male',
    idNumber: 'JW529384756',
    admissionDate: '3 Jan 2024',
    diagnosis: 'Hypertension',
    status: 'Low',
    room: 'Lily Room'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Williams',
    specialty: 'Cardiology',
    status: 'Available',
    department: 'Cardiology',
    patients: 12,
    image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=50'
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    status: 'Busy',
    department: 'Neurology',
    patients: 8,
    image: 'https://images.pexels.com/photos/5214949/pexels-photo-5214949.jpeg?auto=compress&cs=tinysrgb&w=50'
  },
  {
    id: '3',
    name: 'Dr. Amelia Rodriguez',
    specialty: 'Pediatrics',
    status: 'Leave',
    department: 'Pediatrics',
    patients: 0,
    image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=50'
  },
  {
    id: '4',
    name: 'Dr. David Thompson',
    specialty: 'Orthopedics',
    status: 'Available',
    department: 'Orthopedics',
    patients: 15,
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=50'
  }
];

export const mockAppointments: AppointmentData[] = [
  {
    id: '1',
    patientName: 'David Kamau',
    doctorName: 'Dr. Sarah Williams',
    date: '15 Jun 2024',
    time: '09:00 AM',
    status: 'Scheduled'
  },
  {
    id: '2',
    patientName: 'Faith Wanjiku',
    doctorName: 'Dr. Michael Chen',
    date: '20 Jun 2024',
    time: '10:30 AM',
    status: 'Scheduled'
  },
  {
    id: '3',
    patientName: 'Peter Omondi',
    doctorName: 'Dr. David Thompson',
    date: '10 Jun 2024',
    time: '02:00 PM',
    status: 'Completed'
  },
  {
    id: '4',
    patientName: 'Esther Muthoni',
    doctorName: 'Dr. Sarah Williams',
    date: '25 Jul 2024',
    time: '11:15 AM',
    status: 'Cancelled'
  },
  {
    id: '5',
    patientName: 'John Njoroge',
    doctorName: 'Dr. John Mwangi',
    date: '20 Jun 2024',
    time: '01:45 PM',
    status: 'Scheduled'
  }
];

export const mockRooms: RoomData[] = [
  {
    id: '1',
    name: 'Tulip Room',
    type: 'Executive',
    status: 'Occupied',
    patient: 'Sabrina Carpenter',
    admissionDate: '6 Jan 2024'
  },
  {
    id: '2',
    name: 'Rose Room',
    type: 'Premium',
    status: 'Occupied',
    patient: 'Andrea Tea',
    admissionDate: '6 Jan 2024'
  },
  {
    id: '3',
    name: 'Daisy Room',
    type: 'Premium',
    status: 'Occupied',
    patient: 'Mark Johnson',
    admissionDate: '5 Jan 2024'
  },
  {
    id: '4',
    name: 'Orchid Room',
    type: 'Premium',
    status: 'Occupied',
    patient: 'Emily Parker',
    admissionDate: '4 Jan 2024'
  },
  {
    id: '5',
    name: 'Lily Room',
    type: 'Basic',
    status: 'Occupied',
    patient: 'James Wilson',
    admissionDate: '3 Jan 2024'
  },
  {
    id: '6',
    name: 'Violet Room',
    type: 'Executive',
    status: 'Available'
  },
  {
    id: '7',
    name: 'Jasmine Room',
    type: 'Premium',
    status: 'Maintenance'
  }
];

export const mockDepartments: DepartmentData[] = [
  {
    id: '1',
    name: 'Cardiology',
    head: 'Dr. Sarah Williams',
    staff: 15,
    patients: 28
  },
  {
    id: '2',
    name: 'Neurology',
    head: 'Dr. Michael Chen',
    staff: 12,
    patients: 22
  },
  {
    id: '3',
    name: 'Pediatrics',
    head: 'Dr. Amelia Rodriguez',
    staff: 18,
    patients: 35
  },
  {
    id: '4',
    name: 'Orthopedics',
    head: 'Dr. David Thompson',
    staff: 14,
    patients: 26
  },
  {
    id: '5',
    name: 'Emergency',
    head: 'Dr. Robert Garcia',
    staff: 22,
    patients: 45
  }
];