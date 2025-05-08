# Legacy System Integration Guide

This document provides instructions for integrating the new React frontend with the existing Java backend system.

## Overview

The Bristol Park Hospital system has been updated with a new React frontend while maintaining the existing Java backend. This guide explains how to integrate the two systems, focusing on the patient registration module.

## Key Integration Points

### 1. Patient Registration Fields

The patient registration form has been updated to include all fields from the legacy system:

- **File Numbers**
  - Out-Patient File Number
  - Old Reference Number
  - In-Patient File Number

- **Personal Information**
  - First Name*
  - Middle Name
  - Last Name*
  - Date of Birth* (both as a single field and as separate Day/Month/Year fields)
  - Gender*
  - National ID/Passport Number*

- **Contact Information**
  - Email*
  - Cell Phone Number*
  - Residence*

- **Medical Information**
  - SHA Number (formerly NHIF)
  - Payment Type*

- **Next of Kin**
  - Next of Kin Name*
  - Next of Kin Phone Number*

Fields marked with * are required.

### 2. Integration Utilities

Several utilities have been created to facilitate integration:

- **Legacy System Utils** (`src/utils/legacySystemUtils.ts`): Contains functions for converting data between the new and legacy systems, including date format conversion and field mapping.

- **Legacy API Service** (`src/services/legacyApiService.ts`): Provides methods for interacting with the legacy API endpoints.

- **Legacy API Hook** (`src/hooks/useLegacyApi.ts`): A React hook that wraps the API service for easy use in components.

- **Legacy System Config** (`src/config/legacySystemConfig.ts`): Contains configuration settings for the legacy system integration, including API endpoints, field mappings, and error codes.

### 3. Environment Configuration

To enable integration with the legacy system, set the following environment variables:

```
REACT_APP_LEGACY_API_URL=http://your-legacy-api-url
REACT_APP_ENABLE_LEGACY_INTEGRATION=true
REACT_APP_USE_LEGACY_AUTH=true
REACT_APP_SYNC_PATIENT_DATA=true
```

## Integration Steps

### 1. Authentication Integration

The legacy system uses JWT authentication. The integration flow is:

1. User logs in through the new frontend
2. Frontend sends credentials to legacy backend
3. Backend validates credentials and returns a JWT token
4. Frontend stores the token and includes it in subsequent API requests

Implementation:

```typescript
// Example login integration
import { legacyLogin } from '../services/legacyApiService';

const handleLogin = async (username, password, branchId) => {
  try {
    const response = await legacyLogin(username, password, branchId);
    // Handle successful login
  } catch (error) {
    // Handle login error
  }
};
```

### 2. Patient Registration Integration

The patient registration form is already set up to collect all required fields. To integrate with the legacy system:

1. Uncomment the legacy integration code in `src/components/patients/PatientRegistration.tsx`
2. Ensure the legacy API endpoint is correctly configured

```typescript
// Example patient creation integration
import { createLegacyPatient } from '../services/legacyApiService';

const handleSubmit = async (patientData) => {
  try {
    const createdPatient = await createLegacyPatient(patientData);
    // Handle successful patient creation
  } catch (error) {
    // Handle error
  }
};
```

### 3. Data Synchronization

For a smooth transition, you may want to implement data synchronization between the new and legacy systems:

```typescript
// Example data synchronization
import { getLegacyPatients } from '../services/legacyApiService';

const syncPatients = async () => {
  try {
    const legacyPatients = await getLegacyPatients();
    // Update local storage or state with legacy patients
  } catch (error) {
    // Handle error
  }
};
```

## Field Mapping Reference

The following table shows how fields map between the new and legacy systems:

| New System Field      | Legacy System Field   | Notes                           |
|-----------------------|-----------------------|---------------------------------|
| outPatientFileNumber  | outPatientFileNumber  |                                 |
| oldReferenceNumber    | oldReferenceNumber    |                                 |
| inPatientFileNumber   | inPatientFileNumber   |                                 |
| firstName             | firstName             | Required                        |
| middleName            | middleName            |                                 |
| lastName              | lastName              | Required                        |
| dateOfBirth           | dateOfBirth           | Format: YYYY-MM-DD vs DD/MM/YYYY|
| birthDay              | birthDay              |                                 |
| birthMonth            | birthMonth            |                                 |
| birthYear             | birthYear             |                                 |
| gender                | gender                | Values: male/female/other vs M/F/O |
| nationalId            | nationalId            |                                 |
| phone                 | cellPhone             | Required                        |
| email                 | email                 | Required                        |
| residence             | residence             | Required                        |
| shaNumber             | nhifNumber            | SHA (formerly NHIF)             |
| nextOfKinName         | nextOfKinName         | Required                        |
| nextOfKinPhone        | nextOfKinPhone        | Required                        |
| paymentType           | paymentType           | Values: lowercase vs uppercase  |

## Error Handling

The legacy system returns specific error codes. These are mapped to user-friendly messages in `src/config/legacySystemConfig.ts`.

## Testing Integration

To test the integration:

1. Ensure the legacy system is running
2. Set the environment variables
3. Try creating a new patient
4. Verify the patient appears in both systems
5. Test updating and retrieving patient information

## Troubleshooting

Common issues and solutions:

- **Authentication Failures**: Check that the correct credentials and branch ID are being used.
- **Field Validation Errors**: Ensure all required fields are filled and in the correct format.
- **Date Format Issues**: Check that dates are being converted correctly between systems.
- **CORS Errors**: Ensure the legacy backend allows requests from the frontend domain.

## Support

For any questions or issues related to the legacy system integration, please contact the development team at dev@bristolparkhospital.com.
