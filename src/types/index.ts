export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  idNumber: string;
  admissionDate: string;
  diagnosis: string;
  status: 'Urgent' | 'Moderate' | 'Low';
  room: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'Available' | 'Leave' | 'Busy';
  department: string;
  patients: number;
  image?: string;
}

export interface AppointmentData {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface RoomData {
  id: string;
  name: string;
  type: 'Executive' | 'Premium' | 'Basic';
  status: 'Occupied' | 'Available' | 'Maintenance';
  patient?: string;
  admissionDate?: string;
}

export interface DepartmentData {
  id: string;
  name: string;
  head: string;
  staff: number;
  patients: number;
}

export interface UserData {
  id: string;
  name: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Staff';
  image?: string;
  status: 'Online' | 'Offline' | 'Away';
}