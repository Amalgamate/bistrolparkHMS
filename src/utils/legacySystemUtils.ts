/**
 * Utility functions for integrating with the legacy Java backend system
 */

/**
 * Converts a date from the legacy system format (DD/MM/YYYY) to ISO format (YYYY-MM-DD)
 * @param legacyDate Date string in DD/MM/YYYY format
 * @returns Date string in YYYY-MM-DD format
 */
export const convertLegacyDateToISO = (legacyDate: string): string => {
  if (!legacyDate) return '';
  
  // Handle different legacy date formats
  let parts: string[] = [];
  
  if (legacyDate.includes('/')) {
    parts = legacyDate.split('/');
  } else if (legacyDate.includes('-')) {
    parts = legacyDate.split('-');
  } else if (legacyDate.includes('.')) {
    parts = legacyDate.split('.');
  } else {
    return '';
  }
  
  if (parts.length !== 3) return '';
  
  // Determine if the format is DD/MM/YYYY or MM/DD/YYYY
  // In the legacy system, it's likely DD/MM/YYYY
  const day = parts[0].padStart(2, '0');
  const month = parts[1].padStart(2, '0');
  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
  
  return `${year}-${month}-${day}`;
};

/**
 * Converts a date from ISO format (YYYY-MM-DD) to legacy system format (DD/MM/YYYY)
 * @param isoDate Date string in YYYY-MM-DD format
 * @returns Date string in DD/MM/YYYY format
 */
export const convertISOToLegacyDate = (isoDate: string): string => {
  if (!isoDate) return '';
  
  const parts = isoDate.split('-');
  if (parts.length !== 3) return '';
  
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  
  return `${day}/${month}/${year}`;
};

/**
 * Combines separate day, month, and year values into an ISO date string
 * @param day Day of birth
 * @param month Month of birth
 * @param year Year of birth
 * @returns Date string in YYYY-MM-DD format
 */
export const combineDateParts = (day?: string, month?: string, year?: string): string => {
  if (!day || !month || !year) return '';
  
  const dayStr = day.padStart(2, '0');
  const monthStr = month.padStart(2, '0');
  const yearStr = year.length === 2 ? `20${year}` : year;
  
  return `${yearStr}-${monthStr}-${dayStr}`;
};

/**
 * Splits an ISO date string into separate day, month, and year values
 * @param isoDate Date string in YYYY-MM-DD format
 * @returns Object with day, month, and year properties
 */
export const splitISODate = (isoDate: string): { day: string, month: string, year: string } => {
  if (!isoDate) return { day: '', month: '', year: '' };
  
  const parts = isoDate.split('-');
  if (parts.length !== 3) return { day: '', month: '', year: '' };
  
  return {
    year: parts[0],
    month: parts[1],
    day: parts[2]
  };
};

/**
 * Maps a legacy system gender value to our system's gender value
 * @param legacyGender Gender value from legacy system
 * @returns Standardized gender value for our system
 */
export const mapLegacyGender = (legacyGender: string): string => {
  const gender = legacyGender.toLowerCase().trim();
  
  if (gender === 'm' || gender === 'male' || gender === '1') {
    return 'male';
  } else if (gender === 'f' || gender === 'female' || gender === '2') {
    return 'female';
  } else {
    return 'other';
  }
};

/**
 * Maps our system's gender value to legacy system gender value
 * @param gender Gender value from our system
 * @returns Gender value for legacy system
 */
export const mapGenderToLegacy = (gender: string): string => {
  const genderLower = gender.toLowerCase().trim();
  
  if (genderLower === 'male') {
    return 'M';
  } else if (genderLower === 'female') {
    return 'F';
  } else {
    return 'O';
  }
};

/**
 * Converts a patient object from the legacy system format to our system format
 * @param legacyPatient Patient data from legacy system
 * @returns Patient data in our system format
 */
export const convertLegacyPatient = (legacyPatient: any): any => {
  return {
    // File Numbers
    outPatientFileNumber: legacyPatient.outPatientFileNumber || '',
    oldReferenceNumber: legacyPatient.oldReferenceNumber || '',
    inPatientFileNumber: legacyPatient.inPatientFileNumber || '',
    
    // Personal Information
    firstName: legacyPatient.firstName || '',
    middleName: legacyPatient.middleName || '',
    lastName: legacyPatient.lastName || '',
    dateOfBirth: convertLegacyDateToISO(legacyPatient.dateOfBirth) || '',
    birthDay: legacyPatient.birthDay || '',
    birthMonth: legacyPatient.birthMonth || '',
    birthYear: legacyPatient.birthYear || '',
    gender: mapLegacyGender(legacyPatient.gender),
    nationalId: legacyPatient.nationalId || legacyPatient.passportNumber || '',
    
    // Contact Information
    email: legacyPatient.email || '',
    phone: legacyPatient.cellPhone || '',
    residence: legacyPatient.residence || '',
    
    // SHA Information
    shaNumber: legacyPatient.nhifNumber || '',
    
    // Next of Kin
    nextOfKinName: legacyPatient.nextOfKinName || '',
    nextOfKinPhone: legacyPatient.nextOfKinPhone || '',
    
    // Payment Type
    paymentType: legacyPatient.paymentType?.toLowerCase() || 'cash'
  };
};

/**
 * Converts a patient object from our system format to the legacy system format
 * @param patient Patient data from our system
 * @returns Patient data in legacy system format
 */
export const convertPatientToLegacy = (patient: any): any => {
  // Split the date of birth into day, month, year if not already provided
  let birthDay = patient.birthDay;
  let birthMonth = patient.birthMonth;
  let birthYear = patient.birthYear;
  
  if ((!birthDay || !birthMonth || !birthYear) && patient.dateOfBirth) {
    const dateParts = splitISODate(patient.dateOfBirth);
    birthDay = dateParts.day;
    birthMonth = dateParts.month;
    birthYear = dateParts.year;
  }
  
  return {
    outPatientFileNumber: patient.outPatientFileNumber || '',
    oldReferenceNumber: patient.oldReferenceNumber || '',
    inPatientFileNumber: patient.inPatientFileNumber || '',
    firstName: patient.firstName || '',
    middleName: patient.middleName || '',
    lastName: patient.lastName || '',
    dateOfBirth: convertISOToLegacyDate(patient.dateOfBirth) || '',
    birthDay: birthDay || '',
    birthMonth: birthMonth || '',
    birthYear: birthYear || '',
    gender: mapGenderToLegacy(patient.gender),
    nationalId: patient.nationalId || '',
    cellPhone: patient.phone || '',
    nhifNumber: patient.shaNumber || '',
    email: patient.email || '',
    residence: patient.residence || '',
    nextOfKinName: patient.nextOfKinName || '',
    nextOfKinPhone: patient.nextOfKinPhone || '',
    paymentType: patient.paymentType?.toUpperCase() || 'CASH'
  };
};
