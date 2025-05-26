import { Patient, Doctor, AppointmentData, RoomData, DepartmentData } from '../types';

// All data comes from the database API - no mock/dummy data
export const mockPatients: Patient[] = [];
export const mockDoctors: Doctor[] = [];
export const mockAppointments: AppointmentData[] = [];
export const mockRooms: RoomData[] = [];
export const mockDepartments: DepartmentData[] = [];

// Note: This file is kept for type compatibility only
// All real data is fetched from the database via API endpoints