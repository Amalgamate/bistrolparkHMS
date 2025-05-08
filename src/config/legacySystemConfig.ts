/**
 * Configuration for legacy system integration
 */

/**
 * Legacy system API endpoints
 */
export const LEGACY_API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Patients
  PATIENTS: '/patients',
  PATIENT_BY_ID: (id: string) => `/patients/${id}`,
  PATIENT_SEARCH: '/patients/search',
  
  // Insurance
  VERIFY_SHA: (shaNumber: string) => `/insurance/verify/${shaNumber}`,
  INSURANCE_CLAIMS: '/insurance/claims',
  
  // Payments
  PATIENT_PAYMENTS: (patientId: string) => `/patients/${patientId}/payments`,
  
  // Documents
  GENERATE_DOCUMENT: '/documents/generate',
  
  // Branch Management
  BRANCHES: '/branches',
  BRANCH_BY_ID: (id: string) => `/branches/${id}`,
};

/**
 * Field mappings between our system and the legacy system
 */
export const LEGACY_FIELD_MAPPINGS = {
  // Patient fields
  patient: {
    // Our field name -> Legacy field name
    outPatientFileNumber: 'outPatientFileNumber',
    oldReferenceNumber: 'oldReferenceNumber',
    inPatientFileNumber: 'inPatientFileNumber',
    firstName: 'firstName',
    middleName: 'middleName',
    lastName: 'lastName',
    dateOfBirth: 'dateOfBirth',
    birthDay: 'birthDay',
    birthMonth: 'birthMonth',
    birthYear: 'birthYear',
    gender: 'gender',
    nationalId: 'nationalId',
    phone: 'cellPhone',
    email: 'email',
    residence: 'residence',
    shaNumber: 'nhifNumber',
    nextOfKinName: 'nextOfKinName',
    nextOfKinPhone: 'nextOfKinPhone',
    paymentType: 'paymentType',
  },
  
  // Gender values
  gender: {
    // Our value -> Legacy value
    male: 'M',
    female: 'F',
    other: 'O',
  },
  
  // Payment types
  paymentType: {
    // Our value -> Legacy value
    cash: 'CASH',
    insurance: 'INSURANCE',
    mpesa: 'MPESA',
    card: 'CARD',
    credit: 'CREDIT',
    other: 'OTHER',
  },
};

/**
 * Legacy system branch codes
 */
export const LEGACY_BRANCH_CODES = {
  fedha: 'FDH',
  utawala: 'UTW',
  machakos: 'MCK',
  tassia: 'TSA',
  kitengela: 'KTG',
};

/**
 * Legacy system error codes and messages
 */
export const LEGACY_ERROR_CODES = {
  // Authentication errors
  AUTH_INVALID_CREDENTIALS: 'Invalid username or password',
  AUTH_EXPIRED_TOKEN: 'Authentication token has expired',
  AUTH_INVALID_TOKEN: 'Invalid authentication token',
  AUTH_INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  AUTH_BRANCH_ACCESS_DENIED: 'Access to this branch is denied',
  
  // Patient errors
  PATIENT_NOT_FOUND: 'Patient not found',
  PATIENT_DUPLICATE: 'Patient with this ID already exists',
  PATIENT_VALIDATION_ERROR: 'Patient data validation failed',
  
  // Insurance errors
  INSURANCE_INVALID_NUMBER: 'Invalid insurance number',
  INSURANCE_EXPIRED: 'Insurance has expired',
  INSURANCE_NOT_FOUND: 'Insurance not found',
  
  // System errors
  SYSTEM_ERROR: 'System error occurred',
  DATABASE_ERROR: 'Database error occurred',
  NETWORK_ERROR: 'Network error occurred',
};

/**
 * Legacy system configuration
 */
export const LEGACY_SYSTEM_CONFIG = {
  // API configuration
  api: {
    baseUrl: process.env.REACT_APP_LEGACY_API_URL || 'http://localhost:8080/api',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },
  
  // Authentication configuration
  auth: {
    tokenStorageKey: 'legacy_token',
    refreshTokenStorageKey: 'legacy_refresh_token',
    tokenExpiryKey: 'legacy_token_expiry',
    branchStorageKey: 'current_branch',
  },
  
  // Feature flags
  features: {
    enableLegacyIntegration: process.env.REACT_APP_ENABLE_LEGACY_INTEGRATION === 'true',
    useLegacyAuth: process.env.REACT_APP_USE_LEGACY_AUTH === 'true',
    syncPatientData: process.env.REACT_APP_SYNC_PATIENT_DATA === 'true',
    fallbackToLocalStorage: true,
  },
};
