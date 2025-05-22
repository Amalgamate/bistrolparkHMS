import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    param: string;
    msg: string;
  }>;
}

// Create API client class
class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          // Set the token in both header formats to ensure compatibility with different API implementations
          // Some APIs expect x-auth-token
          config.headers['x-auth-token'] = token;
          // Others expect Authorization: Bearer token format
          config.headers['Authorization'] = `Bearer ${token}`;

          // Log the headers for debugging (only in development)
          if (process.env.NODE_ENV === 'development') {
            console.log('API request headers:', {
              url: config.url,
              method: config.method,
              headers: {
                'x-auth-token': 'present',
                'Authorization': 'present',
                'Content-Type': config.headers['Content-Type']
              }
            });
          }
        } else {
          console.warn('No token found in localStorage for API request');
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          // Clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.request<T>(config);
  }

  // GET method
  public async get<T>(url: string, params?: any): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
    });
  }

  // POST method
  public async post<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
    });
  }

  // PUT method
  public async put<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
    });
  }

  // PATCH method
  public async patch<T>(url: string, data?: any): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
    });
  }

  // DELETE method
  public async delete<T>(url: string): Promise<AxiosResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
    });
  }

  // Auth API
  public async login(credentials: { username: string; password: string }): Promise<AxiosResponse<any>> {
    return this.post('/users/login', credentials);
  }

  public async register(userData: any): Promise<AxiosResponse<any>> {
    return this.post('/users/register', userData);
  }

  // Patients API
  public async getPatients(): Promise<AxiosResponse<any>> {
    return this.get('/patients');
  }

  public async getPatientById(id: string | number): Promise<AxiosResponse<any>> {
    return this.get(`/patients/${id}`);
  }

  public async createPatient(patientData: any): Promise<AxiosResponse<any>> {
    return this.post('/patients', patientData);
  }

  public async updatePatient(id: string | number, patientData: any): Promise<AxiosResponse<any>> {
    return this.put(`/patients/${id}`, patientData);
  }

  public async deletePatient(id: string | number): Promise<AxiosResponse<any>> {
    return this.delete(`/patients/${id}`);
  }

  // Appointments API
  public async getAppointments(): Promise<AxiosResponse<any>> {
    return this.get('/appointments');
  }

  public async getAppointmentById(id: string | number): Promise<AxiosResponse<any>> {
    return this.get(`/appointments/${id}`);
  }

  public async getAppointmentsByPatientId(patientId: string | number): Promise<AxiosResponse<any>> {
    return this.get(`/appointments/patient/${patientId}`);
  }

  public async createAppointment(appointmentData: any): Promise<AxiosResponse<any>> {
    return this.post('/appointments', appointmentData);
  }

  public async updateAppointment(id: string | number, appointmentData: any): Promise<AxiosResponse<any>> {
    return this.put(`/appointments/${id}`, appointmentData);
  }

  public async deleteAppointment(id: string | number): Promise<AxiosResponse<any>> {
    return this.delete(`/appointments/${id}`);
  }

  // Prescriptions API
  public async getPrescriptions(): Promise<AxiosResponse<any>> {
    return this.get('/prescriptions');
  }

  public async getPrescriptionById(id: string | number): Promise<AxiosResponse<any>> {
    return this.get(`/prescriptions/${id}`);
  }

  public async getPrescriptionsByPatientId(patientId: string | number): Promise<AxiosResponse<any>> {
    return this.get(`/prescriptions/patient/${patientId}`);
  }

  public async createPrescription(prescriptionData: any): Promise<AxiosResponse<any>> {
    return this.post('/prescriptions', prescriptionData);
  }

  public async updatePrescriptionStatus(id: string | number, statusData: any): Promise<AxiosResponse<any>> {
    return this.patch(`/prescriptions/${id}/status`, statusData);
  }

  public async deletePrescription(id: string | number): Promise<AxiosResponse<any>> {
    return this.delete(`/prescriptions/${id}`);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
