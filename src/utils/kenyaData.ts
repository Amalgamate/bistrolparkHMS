/**
 * Kenya-specific data and utilities
 */

// Kenya Counties
export const KENYA_COUNTIES = [
  { id: 1, name: 'Mombasa' },
  { id: 2, name: 'Kwale' },
  { id: 3, name: 'Kilifi' },
  { id: 4, name: 'Tana River' },
  { id: 5, name: 'Lamu' },
  { id: 6, name: 'Taita-Taveta' },
  { id: 7, name: 'Garissa' },
  { id: 8, name: 'Wajir' },
  { id: 9, name: 'Mandera' },
  { id: 10, name: 'Marsabit' },
  { id: 11, name: 'Isiolo' },
  { id: 12, name: 'Meru' },
  { id: 13, name: 'Tharaka-Nithi' },
  { id: 14, name: 'Embu' },
  { id: 15, name: 'Kitui' },
  { id: 16, name: 'Machakos' },
  { id: 17, name: 'Makueni' },
  { id: 18, name: 'Nyandarua' },
  { id: 19, name: 'Nyeri' },
  { id: 20, name: 'Kirinyaga' },
  { id: 21, name: 'Murang\'a' },
  { id: 22, name: 'Kiambu' },
  { id: 23, name: 'Turkana' },
  { id: 24, name: 'West Pokot' },
  { id: 25, name: 'Samburu' },
  { id: 26, name: 'Trans-Nzoia' },
  { id: 27, name: 'Uasin Gishu' },
  { id: 28, name: 'Elgeyo-Marakwet' },
  { id: 29, name: 'Nandi' },
  { id: 30, name: 'Baringo' },
  { id: 31, name: 'Laikipia' },
  { id: 32, name: 'Nakuru' },
  { id: 33, name: 'Narok' },
  { id: 34, name: 'Kajiado' },
  { id: 35, name: 'Kericho' },
  { id: 36, name: 'Bomet' },
  { id: 37, name: 'Kakamega' },
  { id: 38, name: 'Vihiga' },
  { id: 39, name: 'Bungoma' },
  { id: 40, name: 'Busia' },
  { id: 41, name: 'Siaya' },
  { id: 42, name: 'Kisumu' },
  { id: 43, name: 'Homa Bay' },
  { id: 44, name: 'Migori' },
  { id: 45, name: 'Kisii' },
  { id: 46, name: 'Nyamira' },
  { id: 47, name: 'Nairobi' }
];

// Common countries for foreigners in Kenya
export const COMMON_COUNTRIES = [
  { code: 'KE', name: 'Kenya' },
  { code: 'UG', name: 'Uganda' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'BI', name: 'Burundi' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'SO', name: 'Somalia' },
  { code: 'CD', name: 'DR Congo' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'CN', name: 'China' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'OTHER', name: 'Other' }
];

// Relationships for next of kin
export const RELATIONSHIPS = [
  'Spouse',
  'Parent',
  'Child',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Aunt/Uncle',
  'Niece/Nephew',
  'Cousin',
  'Friend',
  'Guardian',
  'Other'
];

// Blood groups
export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Unknown'
];

// Helper function to validate Kenyan phone numbers
export const isValidKenyanPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Kenyan phone numbers can be in formats like:
  // +254 7XX XXX XXX, 07XX XXX XXX, 254 7XX XXX XXX
  const kenyanPhoneRegex = /^(?:\+254|254|0)7\d{8}$/;
  
  // Remove spaces, dashes, and parentheses for validation
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  
  return kenyanPhoneRegex.test(cleanedPhone);
};

// Format phone number to standard Kenyan format
export const formatKenyanPhone = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check if it's a valid Kenyan number
  if (digits.length === 10 && digits.startsWith('07')) {
    // Format as 07XX XXX XXX
    return `${digits.substring(0, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
  } else if (digits.length === 12 && digits.startsWith('2547')) {
    // Format as +254 7XX XXX XXX
    return `+${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6, 9)} ${digits.substring(9)}`;
  } else if (digits.length === 9 && digits.startsWith('7')) {
    // Format as 07XX XXX XXX
    return `0${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  
  // Return original if not matching known formats
  return phone;
};

// Helper function to validate Kenyan National ID
export const isValidKenyanID = (id: string): boolean => {
  if (!id) return false;
  
  // Kenyan IDs are typically 8 digits, but can be 7-9 digits
  const kenyanIDRegex = /^\d{7,9}$/;
  
  return kenyanIDRegex.test(id);
};

// Helper function to validate Kenyan passport
export const isValidKenyanPassport = (passport: string): boolean => {
  if (!passport) return false;
  
  // Kenyan passports typically start with A followed by 7 digits
  const kenyanPassportRegex = /^[A-Z]\d{7}$/;
  
  return kenyanPassportRegex.test(passport);
};

// Helper function to validate email
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email);
};

// Helper function to validate KRA PIN
export const isValidKraPin = (pin: string): boolean => {
  if (!pin) return false;
  
  // KRA PIN format: A123456789B (1 letter, 9 digits, 1 letter)
  const kraPinRegex = /^[A-Z]\d{9}[A-Z]$/;
  
  return kraPinRegex.test(pin);
};
