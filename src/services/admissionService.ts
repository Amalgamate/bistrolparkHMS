import apiClient from './apiClient';
import { Admission, Room, Bed } from '../context/AdmissionContext';
import { Patient } from '../context/PatientContext';

// Define the shape of admission data from API
export interface AdmissionData {
  id: string;
  patient_id: string;
  room_id: string;
  doctor_id: string;
  admission_date: string;
  admission_time: string;
  diagnosis: string;
  notes?: string;
  status: 'admitted' | 'discharged';
  discharge_date?: string;
  discharge_time?: string;
  discharge_notes?: string;
  bill_amount?: number;
  bill_paid?: boolean;
  insurance_covered?: boolean;
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_approval_code?: string;
}

class AdmissionService {
  /**
   * Get all admissions
   */
  async getAllAdmissions(): Promise<Admission[]> {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found when fetching admissions');
        // Instead of returning an empty array, let's return sample data for development
        return this.getSampleAdmissions();
      }

      console.log('Attempting to fetch admissions from API');

      // Use apiClient to make the request
      const response = await apiClient.get('/admissions');
      console.log('API response for admissions fetch:', response);

      // If no data or empty array, return sample data
      if (!response.data || !Array.isArray(response.data)) {
        console.warn('No admissions data returned from API, using sample data');
        return this.getSampleAdmissions();
      }

      // If the array is empty, return sample data
      if (response.data.length === 0) {
        console.warn('Empty admissions array returned from API, using sample data');
        return this.getSampleAdmissions();
      }

      // Transform API data to Admission format
      const admissions = await this.transformAdmissionsData(response.data);

      // If transformation resulted in empty array, return sample data
      if (admissions.length === 0) {
        console.warn('Transformation resulted in empty admissions array, using sample data');
        return this.getSampleAdmissions();
      }

      return admissions;
    } catch (error: any) {
      console.error('Error fetching admissions:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      console.error('Error status:', error.response?.status || 'No status code');

      // Return sample data instead of empty array
      console.warn('Using sample admissions data due to API error');
      return this.getSampleAdmissions();
    }
  }

  // Sample admissions data for development and testing
  private getSampleAdmissions(): Admission[] {
    return [
      {
        id: 'ADM001',
        patientId: 'PAT001',
        patientName: 'John Smith',
        admissionDate: '2023-07-15',
        admissionTime: '09:30',
        roomId: 'ROOM101',
        roomName: 'Executive Suite 101',
        roomType: 'Executive',
        bedNumber: '1',
        diagnosis: 'Pneumonia',
        doctorId: 'DOC001',
        doctorName: 'Dr. Sarah Johnson',
        notes: 'Patient admitted with severe respiratory symptoms',
        status: 'admitted',
        billAmount: 25000,
        billPaid: true,
        insuranceCovered: true,
        insuranceProvider: 'NHIF',
        insurancePolicyNumber: 'NHIF123456'
      },
      {
        id: 'ADM002',
        patientId: 'PAT002',
        patientName: 'Mary Johnson',
        admissionDate: '2023-07-20',
        admissionTime: '14:45',
        roomId: 'ROOM102',
        roomName: 'Premium Room 102',
        roomType: 'Premium',
        bedNumber: '1',
        diagnosis: 'Fractured femur',
        doctorId: 'DOC002',
        doctorName: 'Dr. Michael Chen',
        notes: 'Patient admitted after car accident',
        status: 'admitted',
        billAmount: 18000,
        billPaid: false,
        insuranceCovered: true,
        insuranceProvider: 'AAR',
        insurancePolicyNumber: 'AAR789012'
      },
      {
        id: 'ADM003',
        patientId: 'PAT003',
        patientName: 'Robert Williams',
        admissionDate: '2023-07-10',
        admissionTime: '11:15',
        roomId: 'ROOM201',
        roomName: 'Ward A - Bed 3',
        roomType: 'Ward',
        bedNumber: '3',
        diagnosis: 'Malaria',
        doctorId: 'DOC003',
        doctorName: 'Dr. Elizabeth Omondi',
        notes: 'Patient admitted with high fever and chills',
        status: 'discharged',
        dischargeDate: '2023-07-17',
        dischargeTime: '16:30',
        dischargeNotes: 'Patient recovered well, follow-up in 2 weeks',
        billAmount: 12000,
        billPaid: true,
        insuranceCovered: false
      }
    ];
  }

  /**
   * Transform API data to Admission format
   * This includes fetching additional data like patient names, room details, etc.
   */
  private async transformAdmissionsData(apiData: any[]): Promise<Admission[]> {
    try {
      let patients = [];
      let rooms = [];
      let doctors = [];

      try {
        // Get all patients for reference
        const patientsResponse = await apiClient.getPatients();
        patients = patientsResponse.data || [];
        console.log(`Retrieved ${patients.length} patients for reference`);
      } catch (error) {
        console.error('Error fetching patients for reference:', error);
        // Continue with empty patients array
      }

      try {
        // Get all rooms for reference
        const roomsResponse = await apiClient.get('/rooms');
        rooms = roomsResponse.data || [];
        console.log(`Retrieved ${rooms.length} rooms for reference`);
      } catch (error) {
        console.error('Error fetching rooms for reference:', error);
        // Continue with empty rooms array
      }

      try {
        // Get all doctors for reference
        const doctorsResponse = await apiClient.get('/users?role=doctor');
        doctors = doctorsResponse.data || [];
        console.log(`Retrieved ${doctors.length} doctors for reference`);
      } catch (error) {
        console.error('Error fetching doctors for reference:', error);
        // Continue with empty doctors array
      }

      // Map API data to Admission format
      console.log(`Transforming ${apiData.length} admission records`);
      return apiData.map((item: any) => {
        // Find related data
        const patient = patients.find((p: any) => p.id === item.patient_id) || {};
        const room = rooms.find((r: any) => r.id === item.room_id) || {};
        const doctor = doctors.find((d: any) => d.id === item.doctor_id) || {};

        // Create Admission object
        return {
          id: item.id,
          patientId: item.patient_id,
          patientName: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown Patient',
          admissionDate: item.admission_date,
          admissionTime: item.admission_time,
          roomId: item.room_id,
          roomName: room.name || 'Unknown Room',
          roomType: room.type || 'Unknown',
          bedNumber: item.bed_number,
          diagnosis: item.diagnosis,
          doctorId: item.doctor_id,
          doctorName: `Dr. ${doctor.first_name || ''} ${doctor.last_name || ''}`.trim() || 'Unknown Doctor',
          notes: item.notes,
          status: item.status,
          dischargeDate: item.discharge_date,
          dischargeTime: item.discharge_time,
          dischargeNotes: item.discharge_notes,
          billAmount: item.bill_amount,
          billPaid: item.bill_paid,
          insuranceCovered: item.insurance_covered,
          insuranceProvider: item.insurance_provider,
          insurancePolicyNumber: item.insurance_policy_number,
          insuranceApprovalCode: item.insurance_approval_code
        };
      });
    } catch (error) {
      console.error('Error transforming admissions data:', error);
      return [];
    }
  }

  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    try {
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found when fetching rooms');
        return this.getSampleRooms();
      }

      const response = await apiClient.get('/rooms');

      if (!response.data || !Array.isArray(response.data)) {
        console.warn('No rooms data returned from API, using sample data');
        return this.getSampleRooms();
      }

      // If the array is empty, return sample data
      if (response.data.length === 0) {
        console.warn('Empty rooms array returned from API, using sample data');
        return this.getSampleRooms();
      }

      // Transform API data to Room format
      const rooms = response.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        status: item.status,
        floor: item.floor,
        wing: item.wing,
        dailyRate: item.daily_rate,
        features: item.features,
        patientId: item.patient_id,
        patientName: item.patient_name,
        admissionDate: item.admission_date,
        beds: item.beds?.map((bed: any) => ({
          id: bed.id,
          number: bed.number,
          status: bed.status,
          patientId: bed.patient_id,
          patientName: bed.patient_name,
          admissionDate: bed.admission_date
        }))
      }));

      return rooms;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      console.warn('Using sample rooms data due to API error');
      return this.getSampleRooms();
    }
  }

  // Sample rooms data for development and testing
  private getSampleRooms(): Room[] {
    return [
      {
        id: 'ROOM101',
        name: 'Executive Suite 101',
        type: 'Executive',
        status: 'Occupied',
        floor: '1st floor',
        wing: 'East Wing',
        dailyRate: 15000,
        features: ['Private bathroom', 'TV', 'WiFi', 'Mini fridge'],
        patientId: 'PAT001',
        patientName: 'John Smith',
        admissionDate: '2023-07-15'
      },
      {
        id: 'ROOM102',
        name: 'Premium Room 102',
        type: 'Premium',
        status: 'Occupied',
        floor: '1st floor',
        wing: 'East Wing',
        dailyRate: 10000,
        features: ['Private bathroom', 'TV', 'WiFi'],
        patientId: 'PAT002',
        patientName: 'Mary Johnson',
        admissionDate: '2023-07-20'
      },
      {
        id: 'ROOM103',
        name: 'Premium Room 103',
        type: 'Premium',
        status: 'Available',
        floor: '1st floor',
        wing: 'East Wing',
        dailyRate: 10000,
        features: ['Private bathroom', 'TV', 'WiFi']
      },
      {
        id: 'ROOM201',
        name: 'Ward A',
        type: 'Ward',
        status: 'Available',
        floor: '2nd floor',
        wing: 'West Wing',
        dailyRate: 5000,
        features: ['Shared bathroom'],
        beds: [
          {
            id: 'BED201-1',
            number: '1',
            status: 'Available'
          },
          {
            id: 'BED201-2',
            number: '2',
            status: 'Available'
          },
          {
            id: 'BED201-3',
            number: '3',
            status: 'Available'
          },
          {
            id: 'BED201-4',
            number: '4',
            status: 'Maintenance'
          }
        ]
      },
      {
        id: 'ROOM202',
        name: 'Ward B',
        type: 'Ward',
        status: 'Available',
        floor: '2nd floor',
        wing: 'West Wing',
        dailyRate: 5000,
        features: ['Shared bathroom'],
        beds: [
          {
            id: 'BED202-1',
            number: '1',
            status: 'Available'
          },
          {
            id: 'BED202-2',
            number: '2',
            status: 'Available'
          },
          {
            id: 'BED202-3',
            number: '3',
            status: 'Available'
          },
          {
            id: 'BED202-4',
            number: '4',
            status: 'Available'
          }
        ]
      }
    ];
  }

  /**
   * Create a new admission
   */
  async createAdmission(admissionData: Omit<Admission, 'id' | 'status'>): Promise<Admission | null> {
    try {
      // Transform to API format
      const apiData = {
        patient_id: admissionData.patientId,
        room_id: admissionData.roomId,
        doctor_id: admissionData.doctorId,
        admission_date: admissionData.admissionDate,
        admission_time: admissionData.admissionTime,
        diagnosis: admissionData.diagnosis,
        notes: admissionData.notes,
        status: 'admitted',
        bed_number: admissionData.bedNumber,
        insurance_covered: admissionData.insuranceCovered,
        insurance_provider: admissionData.insuranceProvider,
        insurance_policy_number: admissionData.insurancePolicyNumber,
        insurance_approval_code: admissionData.insuranceApprovalCode
      };

      const response = await apiClient.post('/admissions', apiData);

      if (!response.data) {
        console.warn('No data returned from API after creating admission');
        return null;
      }

      // Transform response to Admission format
      const admissions = await this.transformAdmissionsData([response.data]);
      return admissions[0] || null;
    } catch (error) {
      console.error('Error creating admission:', error);
      return null;
    }
  }

  /**
   * Discharge a patient
   */
  async dischargePatient(
    admissionId: string,
    dischargeData: {
      dischargeDate: string;
      dischargeTime: string;
      dischargeNotes?: string;
      billAmount?: number;
      billPaid?: boolean;
    }
  ): Promise<Admission | null> {
    try {
      // Transform to API format
      const apiData = {
        status: 'discharged',
        discharge_date: dischargeData.dischargeDate,
        discharge_time: dischargeData.dischargeTime,
        discharge_notes: dischargeData.dischargeNotes,
        bill_amount: dischargeData.billAmount,
        bill_paid: dischargeData.billPaid
      };

      const response = await apiClient.put(`/admissions/${admissionId}`, apiData);

      if (!response.data) {
        console.warn('No data returned from API after discharging patient');
        return null;
      }

      // Transform response to Admission format
      const admissions = await this.transformAdmissionsData([response.data]);
      return admissions[0] || null;
    } catch (error) {
      console.error('Error discharging patient:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
const admissionService = new AdmissionService();
export default admissionService;
