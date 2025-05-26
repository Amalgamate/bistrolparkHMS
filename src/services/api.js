import apiClient from './apiClient';

// Export the API client methods for backward compatibility
export const authAPI = {
  login: (credentials) => apiClient.login(credentials),
  register: (userData) => apiClient.register(userData),
};

export const patientAPI = {
  getAll: () => apiClient.getPatients(),
  getById: (id) => apiClient.getPatientById(id),
  create: (patientData) => apiClient.createPatient(patientData),
  update: (id, patientData) => apiClient.updatePatient(id, patientData),
  delete: (id) => apiClient.deletePatient(id),
};

export const appointmentAPI = {
  getAll: () => apiClient.getAppointments(),
  getById: (id) => apiClient.getAppointmentById(id),
  create: (appointmentData) => apiClient.createAppointment(appointmentData),
  update: (id, appointmentData) => apiClient.updateAppointment(id, appointmentData),
  delete: (id) => apiClient.deleteAppointment(id),
};

export const medicationAPI = {
  getAll: () => apiClient.getMedications(),
  getById: (id) => apiClient.getMedicationById(id),
  create: (medicationData) => apiClient.createMedication(medicationData),
  update: (id, medicationData) => apiClient.updateMedication(id, medicationData),
  delete: (id) => apiClient.deleteMedication(id),
};

export const prescriptionAPI = {
  getAll: () => apiClient.getPrescriptions(),
  getById: (id) => apiClient.getPrescriptionById(id),
  getByPatientId: (patientId) => apiClient.getPrescriptionsByPatientId(patientId),
  create: (prescriptionData) => apiClient.createPrescription(prescriptionData),
  updateStatus: (id, statusData) => apiClient.updatePrescriptionStatus(id, statusData),
  delete: (id) => apiClient.deletePrescription(id),
};

// Export the main API client as default
export default apiClient;
