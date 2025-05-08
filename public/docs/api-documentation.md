# Bristol Park Hospital API Documentation

This document provides comprehensive information for backend developers on how to integrate the React frontend with the existing Java backend. It focuses on the location-based login system, patients module, and settings module integration.

## Table of Contents

1. [API Overview](#api-overview)
2. [Patient Flow](#patient-flow)
3. [Authentication & Location-Based Access](#authentication--location-based-access)
4. [Branch Management](#branch-management)
5. [Patient Management](#patient-management)
6. [Settings Module](#settings-module)
7. [Document Management](#document-management)
8. [Insurance Integration](#insurance-integration)
9. [Payment Processing](#payment-processing)
10. [Error Handling](#error-handling)
11. [Security Considerations](#security-considerations)
12. [Need Help?](#need-help)

## API Overview

The Bristol Park Hospital Management System uses a RESTful API architecture for communication between the React frontend and the Java backend. All API endpoints follow these conventions:

- **Base URL**: `/api/v1`
- **Authentication**: JWT token-based authentication with branch-specific access control
- **Response Format**: JSON
- **Error Handling**: Standard HTTP status codes with descriptive error messages
- **Branch Context**: All requests include branch context either in the JWT token or as a request parameter

### API Versioning

The API uses versioning to ensure backward compatibility:

- Current version: `v1`
- Version is specified in the URL path: `/api/v1/...`
- Future versions will be available at `/api/v2/...`, etc.

## Patient Flow

This section outlines the typical patient journey through the Bristol Park Hospital system, highlighting the API endpoints involved at each stage. Understanding this flow helps developers integrate the system components effectively.

### Patient Journey Overview

The following diagram illustrates the high-level patient flow through the Bristol Park Hospital system:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Registration   │     │     Triage      │     │    Doctor       │
│  & Check-In     │────▶│  & Vital Signs  │────▶│  Consultation   │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Follow-Up     │     │    Billing      │     │   Pharmacy      │
│  & Discharge    │◀────│   & Payment     │◀────│      and/or     │
└─────────────────┘     └─────────────────┘     │   Laboratory    │
                                                └─────────────────┘
```

Each stage in the patient journey involves specific API endpoints that handle the data flow between the frontend and backend systems. The location-based access control ensures that patient data is only accessible within the appropriate branch context.

### 1. Registration & Check-In

**New Patient Registration:**
1. Patient arrives at the hospital and provides personal information
2. Front desk staff creates a new patient record using `POST /api/v1/patients`
3. System generates a unique patient ID
4. If the patient has insurance, staff verifies coverage using `GET /api/v1/insurance/verify/:insuranceNumber`
5. System creates a patient file and generates a patient card using `POST /api/v1/documents/generate`

**Returning Patient Check-In:**
1. Patient provides their patient ID or identifying information
2. Staff searches for the patient using `GET /api/v1/patients?search=...`
3. System retrieves patient details using `GET /api/v1/patients/:id`
4. Staff updates any changed information using `PUT /api/v1/patients/:id`
5. System records the visit using `POST /api/v1/patients/:id/visits`

### 2. Triage & Vital Signs

1. Nurse calls the patient and records vital signs
2. System updates the patient's current visit using `PUT /api/v1/patients/:id/visits/:visitId`
3. Based on the triage assessment, patient is assigned a priority level
4. System updates the queue management using `PUT /api/v1/queue/update`

### 3. Doctor Consultation

1. Doctor retrieves patient information using `GET /api/v1/patients/:id`
2. Doctor reviews patient history, including:
   - Previous visits: `GET /api/v1/patients/:id/visits`
   - Medical history: `GET /api/v1/patients/:id/medical-history`
   - Lab results: `GET /api/v1/patients/:id/lab-results`
3. Doctor records diagnosis and treatment plan using `PUT /api/v1/patients/:id/visits/:visitId`
4. Doctor may:
   - Prescribe medication: `POST /api/v1/patients/:id/prescriptions`
   - Order lab tests: `POST /api/v1/patients/:id/lab-requests`
   - Refer to specialist: `POST /api/v1/patients/:id/referrals`
   - Admit patient: `POST /api/v1/patients/:id/admissions`
5. System generates necessary documents using `POST /api/v1/documents/generate`

### 4. Pharmacy & Medication

1. If medications are prescribed:
   - Pharmacist retrieves prescription using `GET /api/v1/prescriptions/:id`
   - System checks medication inventory using `GET /api/v1/inventory/medications`
   - Pharmacist dispenses medication and updates prescription status using `PUT /api/v1/prescriptions/:id`
   - System updates inventory using `PUT /api/v1/inventory/update`

### 5. Laboratory & Diagnostics

1. If lab tests are ordered:
   - Lab technician retrieves test requests using `GET /api/v1/lab-requests?status=pending`
   - Lab technician collects samples and updates request status using `PUT /api/v1/lab-requests/:id`
   - Lab technician records results using `POST /api/v1/lab-requests/:id/results`
   - System notifies doctor of completed results using notifications API
   - Doctor reviews results using `GET /api/v1/lab-requests/:id/results`

### 6. Billing & Payment

1. System calculates charges based on services provided using `POST /api/v1/billing/calculate`
2. For insured patients:
   - System verifies coverage for specific services using `GET /api/v1/insurance/verify-coverage`
   - System submits claim to insurance provider using `POST /api/v1/insurance/claims`
   - System calculates patient responsibility using `GET /api/v1/billing/patient-responsibility`
3. Cashier generates invoice using `POST /api/v1/billing/invoices`
4. Patient makes payment:
   - Cash payment: `POST /api/v1/payments/cash`
   - M-Pesa payment: `POST /api/v1/payments/mpesa/initiate`
   - Card payment: `POST /api/v1/payments/card`
5. System generates receipt using `POST /api/v1/documents/generate`

### 7. Follow-Up & Discharge

1. For outpatients:
   - Doctor schedules follow-up appointment using `POST /api/v1/appointments`
   - System sends appointment reminder using notifications API
   - Visit is marked as completed using `PUT /api/v1/patients/:id/visits/:visitId`
2. For inpatients:
   - Doctor records daily progress using `POST /api/v1/patients/:id/progress-notes`
   - When ready, doctor initiates discharge using `POST /api/v1/patients/:id/discharge`
   - System generates discharge summary using `POST /api/v1/documents/generate`
   - Billing finalizes all charges using `PUT /api/v1/billing/invoices/:id/finalize`

### 8. Reporting & Analytics

1. System records all patient interactions for reporting
2. Administrators can generate reports:
   - Patient statistics: `GET /api/v1/reports/patients`
   - Financial reports: `GET /api/v1/reports/financial`
   - Operational metrics: `GET /api/v1/reports/operations`
3. Data is used for quality improvement and resource planning

### Branch-Specific Patient Flow

The patient flow may vary slightly between branches based on:
- Available services at each branch
- Staffing levels and specialties
- Local procedures and protocols

The API handles these variations through branch-specific configurations retrieved from `GET /api/v1/settings/branches/:branchId`.

## Authentication & Location-Based Access

The system implements a location-based login process that requires users to authenticate with their credentials and branch information.

### Login Process

The location-based login process follows these steps:

1. User enters credentials (email/job ID and password)
2. System validates credentials
3. System checks if user has access to multiple branches
   - If user has access to only one branch, they are automatically logged in to that branch
   - If user has access to multiple branches, they must select a branch
4. System can optionally use geolocation to suggest the nearest branch
5. After branch selection, user is granted a JWT token with branch-specific permissions

### Login Endpoint

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "identifier": "username or email",
  "password": "user password",
  "branchId": "fedha",  // Optional, required if user has access to multiple branches
  "geoLocation": {      // Optional, for location-based branch suggestion
    "latitude": 1.2345,
    "longitude": 36.7890
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@bristolparkhospital.com",
    "role": "Admin",
    "branch": "fedha",
    "allowedBranches": ["fedha", "utawala", "machakos", "tassia", "kitengela"],
    "permissions": ["read:patients", "write:patients", "read:settings", "write:settings"]
  }
}
```

**Response (Multiple Branches):**
```json
{
  "success": false,
  "requiresBranchSelection": true,
  "allowedBranches": ["fedha", "utawala", "machakos"],
  "suggestedBranch": "fedha",  // Based on geolocation if provided
  "message": "Please select a branch"
}
```

### Branch Selection Endpoint

**Endpoint:** `POST /api/v1/auth/select-branch`

**Request Headers:**
- `Authorization: Bearer TEMP_TOKEN` (Temporary token from login response)

**Request Body:**
```json
{
  "branchId": "fedha"
}
```

**Response:**
```json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@bristolparkhospital.com",
    "role": "Admin",
    "branch": "fedha",
    "permissions": ["read:patients", "write:patients", "read:settings", "write:settings"]
  }
}
```

### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Response:**
```json
{
  "success": true,
  "token": "NEW_JWT_TOKEN"
}
```

### Remote Access Authorization

For users requiring remote access (outside hospital premises):

**Endpoint:** `POST /api/v1/auth/remote-access`

**Request Headers:**
- `Authorization: Bearer JWT_TOKEN`

**Request Body:**
```json
{
  "reason": "Emergency patient consultation",
  "duration": 24,  // Hours
  "branchId": "fedha"
}
```

**Response:**
```json
{
  "success": true,
  "remoteAccessToken": "REMOTE_ACCESS_TOKEN",
  "expiresAt": "2023-06-16T14:30:00Z"
}
```

## Branch Management

The branch management module allows for managing multiple hospital branches and their specific settings.

### Get Available Branches

**Endpoint:** `GET /api/v1/branches`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "fedha",
      "name": "Fedha Branch",
      "address": "123 Fedha Road, Nairobi",
      "phone": "+254700123456",
      "email": "fedha@bristolparkhospital.com",
      "location": {
        "latitude": 1.2345,
        "longitude": 36.7890
      },
      "services": ["general", "pediatrics", "obstetrics", "laboratory", "pharmacy"]
    },
    {
      "id": "utawala",
      "name": "Utawala Branch",
      "address": "456 Utawala Road, Nairobi",
      "phone": "+254700123457",
      "email": "utawala@bristolparkhospital.com",
      "location": {
        "latitude": 1.3456,
        "longitude": 36.8901
      },
      "services": ["general", "pediatrics", "laboratory", "pharmacy"]
    }
    // Additional branches...
  ]
}
```

### Get Branch Details

**Endpoint:** `GET /api/v1/branches/:branchId`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "fedha",
    "name": "Fedha Branch",
    "address": "123 Fedha Road, Nairobi",
    "phone": "+254700123456",
    "email": "fedha@bristolparkhospital.com",
    "location": {
      "latitude": 1.2345,
      "longitude": 36.7890
    },
    "services": ["general", "pediatrics", "obstetrics", "laboratory", "pharmacy"],
    "operatingHours": {
      "monday": { "open": "08:00", "close": "20:00" },
      "tuesday": { "open": "08:00", "close": "20:00" },
      "wednesday": { "open": "08:00", "close": "20:00" },
      "thursday": { "open": "08:00", "close": "20:00" },
      "friday": { "open": "08:00", "close": "20:00" },
      "saturday": { "open": "09:00", "close": "17:00" },
      "sunday": { "open": "10:00", "close": "15:00" }
    },
    "staff": {
      "doctors": 12,
      "nurses": 25,
      "administrative": 8,
      "other": 15
    }
  }
}
```

## Patient Management

The patient management module is a core component of the system, allowing for comprehensive patient data management across all branches.

### Get Patients List

**Endpoint:** `GET /api/v1/patients`

**Query Parameters:**
- `search`: Search term for patient name, ID, or phone
- `status`: Filter by patient status (active, inactive, admitted, cleared)
- `branch`: Filter by branch (defaults to user's current branch)
- `startDate`: Filter by registration date (ISO format)
- `endDate`: Filter by registration date (ISO format)
- `insuranceProvider`: Filter by insurance provider
- `page`: Page number for pagination (default: 1)
- `limit`: Number of records per page (default: 20)
- `sort`: Field to sort by (default: "registrationDate")
- `order`: Sort order (asc, desc) (default: "desc")

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "P12345",
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "age": 33,
        "phone": "+254700123456",
        "email": "john.doe@example.com",
        "status": "Active",
        "registrationDate": "2023-01-01T10:00:00Z",
        "lastVisit": "2023-06-15T14:30:00Z",
        "branch": "fedha",
        "insuranceProvider": "SHA",
        "hasOutstandingBalance": false
      }
      // Additional patients...
    ],
    "pagination": {
      "total": 128,
      "page": 1,
      "limit": 20,
      "pages": 7
    }
  }
}
```

### Export Patient Register

**Endpoint:** `GET /api/v1/patients/export`

**Query Parameters:**
- Same as Get Patients List
- `format`: Export format (pdf, excel, csv) (default: "pdf")
- `template`: Template ID for PDF export (default: system default template)

**Response:**
- For PDF: Binary file with Content-Type: application/pdf
- For Excel: Binary file with Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
- For CSV: Text file with Content-Type: text/csv

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "P12345",
        "firstName": "John",
        "lastName": "Doe",
        "gender": "Male",
        "dateOfBirth": "1990-01-01",
        "phone": "+254700123456",
        "email": "john.doe@example.com",
        "nationalId": "12345678",
        "address": "123 Main St, Nairobi",
        "status": "Active",
        "registrationDate": "2023-01-01T10:00:00Z",
        "lastVisit": "2023-06-15T14:30:00Z",
        "insuranceProvider": "SHA",
        "insuranceNumber": "INS12345",
        "branch": "fedha"
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

### Get Patient Details

**Endpoint:** `GET /api/v1/patients/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "P12345",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "age": 33,
    "phone": "+254700123456",
    "email": "john.doe@example.com",
    "nationalId": "12345678",
    "address": "123 Main St, Nairobi",
    "status": "Active",
    "registrationDate": "2023-01-01T10:00:00Z",
    "lastVisit": "2023-06-15T14:30:00Z",
    "branch": "fedha",
    "registeredBy": "user-id",
    "insuranceProvider": "SHA",
    "insuranceNumber": "INS12345",
    "insuranceExpiryDate": "2024-01-01",
    "medicalHistory": [
      {
        "id": "MH12345",
        "date": "2023-01-01T10:00:00Z",
        "condition": "Hypertension",
        "notes": "Diagnosed with hypertension",
        "doctor": "Dr. Sarah Johnson"
      }
      // Additional medical history...
    ],
    "visits": [
      {
        "id": "V12345",
        "date": "2023-06-15T14:30:00Z",
        "reason": "Follow-up",
        "doctor": "Dr. Sarah Johnson",
        "branch": "fedha",
        "status": "Completed",
        "notes": "Patient is responding well to treatment"
      }
      // Additional visits...
    ],
    "prescriptions": [
      {
        "id": "RX12345",
        "date": "2023-06-15T14:30:00Z",
        "doctor": "Dr. Sarah Johnson",
        "medications": [
          {
            "name": "Lisinopril",
            "dosage": "10mg",
            "frequency": "Once daily",
            "duration": "30 days",
            "quantity": 30
          }
          // Additional medications...
        ],
        "status": "Dispensed",
        "notes": "Take with food"
      }
      // Additional prescriptions...
    ],
    "labTests": [
      {
        "id": "LT12345",
        "date": "2023-06-15T14:30:00Z",
        "type": "Blood Test",
        "requestedBy": "Dr. Sarah Johnson",
        "status": "Completed",
        "results": [
          {
            "name": "Hemoglobin",
            "value": "14.5",
            "unit": "g/dL",
            "referenceRange": "13.5-17.5",
            "flag": "Normal"
          }
          // Additional results...
        ]
      }
      // Additional lab tests...
    ],
    "billingHistory": [
      {
        "id": "INV12345",
        "date": "2023-06-15T14:30:00Z",
        "amount": 5000,
        "currency": "KES",
        "status": "Paid",
        "paymentMethod": "M-Pesa",
        "paymentReference": "MPESA12345",
        "items": [
          {
            "description": "Consultation",
            "quantity": 1,
            "unitPrice": 2000,
            "total": 2000
          },
          {
            "description": "Blood Test",
            "quantity": 1,
            "unitPrice": 3000,
            "total": 3000
          }
        ],
        "insuranceCoverage": 4000,
        "patientResponsibility": 1000
      }
      // Additional billing history...
    ]
  }
}
```

### Create Patient

**Endpoint:** `POST /api/v1/patients`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1990-01-01",
  "phone": "+254700123456",
  "email": "john.doe@example.com",
  "nationalId": "12345678",
  "address": "123 Main St, Nairobi",
  "insuranceProvider": "SHA",
  "insuranceNumber": "INS12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "P12345",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-01-01",
    "phone": "+254700123456",
    "email": "john.doe@example.com",
    "nationalId": "12345678",
    "address": "123 Main St, Nairobi",
    "status": "Active",
    "registrationDate": "2023-01-01T10:00:00Z",
    "insuranceProvider": "SHA",
    "insuranceNumber": "INS12345",
    "branch": "fedha"
  }
}
```

## Settings Module

The settings module allows for configuration of system-wide and branch-specific settings.

### Get System Settings

**Endpoint:** `GET /api/v1/settings`

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "hospitalName": "Bristol Park Hospital",
      "logo": "https://example.com/logo.png",
      "contactEmail": "info@bristolparkhospital.com",
      "contactPhone": "+254700123456",
      "website": "https://bristolparkhospital.com",
      "currency": "KES",
      "dateFormat": "MM/DD/YYYY",
      "timeFormat": "12h"
    },
    "security": {
      "sessionTimeout": 30,
      "passwordPolicy": {
        "minLength": 8,
        "requireUppercase": true,
        "requireLowercase": true,
        "requireNumbers": true,
        "requireSpecialChars": true,
        "expiryDays": 90
      },
      "allowRemoteAccess": true,
      "remoteAccessApproval": "admin"
    },
    "notifications": {
      "email": {
        "enabled": true,
        "server": "smtp.example.com",
        "port": 587,
        "username": "notifications@bristolparkhospital.com",
        "senderName": "Bristol Park Hospital",
        "templates": {
          "appointment": "template-id",
          "prescription": "template-id",
          "labResults": "template-id"
        }
      },
      "sms": {
        "enabled": true,
        "provider": "AfricasTalking",
        "senderId": "BristolPH",
        "templates": {
          "appointment": "template-id",
          "prescription": "template-id",
          "labResults": "template-id"
        }
      }
    },
    "integrations": {
      "insurance": {
        "sha": {
          "enabled": true,
          "apiUrl": "https://api.sha.example.com",
          "apiKey": "********",
          "providerId": "BPH001"
        }
      },
      "payments": {
        "mpesa": {
          "enabled": true,
          "shortCode": "123456",
          "consumerKey": "********",
          "consumerSecret": "********",
          "passkey": "********",
          "callbackUrl": "https://bristolparkhospital.com/api/v1/payments/mpesa/callback"
        }
      }
    }
  }
}
```

### Get Branch Settings

**Endpoint:** `GET /api/v1/settings/branches/:branchId`

**Response:**
```json
{
  "success": true,
  "data": {
    "general": {
      "name": "Fedha Branch",
      "address": "123 Fedha Road, Nairobi",
      "phone": "+254700123456",
      "email": "fedha@bristolparkhospital.com",
      "operatingHours": {
        "monday": { "open": "08:00", "close": "20:00" },
        "tuesday": { "open": "08:00", "close": "20:00" },
        "wednesday": { "open": "08:00", "close": "20:00" },
        "thursday": { "open": "08:00", "close": "20:00" },
        "friday": { "open": "08:00", "close": "20:00" },
        "saturday": { "open": "09:00", "close": "17:00" },
        "sunday": { "open": "10:00", "close": "15:00" }
      }
    },
    "services": ["general", "pediatrics", "obstetrics", "laboratory", "pharmacy"],
    "departments": [
      {
        "id": "dept-001",
        "name": "General Practice",
        "head": "Dr. Sarah Johnson"
      },
      {
        "id": "dept-002",
        "name": "Pediatrics",
        "head": "Dr. Michael Chen"
      }
      // Additional departments...
    ],
    "documentTemplates": {
      "patient": "template-id",
      "prescription": "template-id",
      "labResults": "template-id",
      "invoice": "template-id",
      "register": "template-id"
    },
    "billing": {
      "taxRate": 16,
      "defaultPaymentMethod": "M-Pesa",
      "acceptedPaymentMethods": ["Cash", "M-Pesa", "Card", "Insurance"],
      "defaultInsuranceProvider": "SHA"
    }
  }
}
```

## Document Management

The document management module handles all document-related operations, including templates and generation.

### Get Document Templates

**Endpoint:** `GET /api/v1/documents/templates`

**Query Parameters:**
- `type`: Filter by template type (patient, prescription, labResults, invoice, register)
- `branch`: Filter by branch (defaults to user's current branch)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "template-001",
      "name": "Patient Medical Record",
      "type": "patient",
      "isDefault": true,
      "branch": "fedha",
      "previewUrl": "/document-templates/patient-record.svg"
    },
    {
      "id": "template-002",
      "name": "Detailed Invoice",
      "type": "invoice",
      "isDefault": true,
      "branch": "fedha",
      "previewUrl": "/document-templates/invoice.svg"
    },
    {
      "id": "template-003",
      "name": "Prescription Form",
      "type": "prescription",
      "isDefault": true,
      "branch": "fedha",
      "previewUrl": "/document-templates/prescription.svg"
    },
    {
      "id": "template-004",
      "name": "Laboratory Results",
      "type": "labResults",
      "isDefault": false,
      "branch": "fedha",
      "previewUrl": "/document-templates/lab-results.svg"
    },
    {
      "id": "template-005",
      "name": "Patient Register",
      "type": "register",
      "isDefault": true,
      "branch": "fedha",
      "previewUrl": "/document-templates/patient-register.svg"
    }
  ]
}
```

### Generate Document

**Endpoint:** `POST /api/v1/documents/generate`

**Request Body:**
```json
{
  "templateId": "template-001",
  "type": "patient",
  "data": {
    "patientId": "P12345",
    "includeVisits": true,
    "includeMedicalHistory": true,
    "includeInsurance": true
  },
  "format": "pdf"
}
```

**Response:**
- Binary file with Content-Type: application/pdf

### Get Documents List

**Endpoint:** `GET /api/v1/documents`

**Query Parameters:**
- `patientId`: Filter by patient ID
- `type`: Filter by document type (medical, lab, imaging, consent, insurance, identification)
- `status`: Filter by document status (active, archived)
- `search`: Search term for document name or tags
- `branch`: Filter by branch (defaults to user's current branch)
- `page`: Page number for pagination
- `limit`: Number of records per page

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "DOC12345",
        "name": "Patient Consent Form",
        "type": "consent",
        "patientId": "P12345",
        "patientName": "John Doe",
        "uploadedBy": "Dr. Sarah Johnson",
        "uploadDate": "2023-11-15T10:00:00Z",
        "fileType": "pdf",
        "fileSize": "1.2 MB",
        "status": "active",
        "tags": ["consent", "surgery", "admission"],
        "url": "/documents/consent-form-001.pdf",
        "branch": "fedha",
        "serialNumber": "FDH-DOC-12345"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

## Insurance Integration

The system integrates with SHA (Strategis Health Africa) insurance API for patient verification and claims processing.

### Verify Patient Insurance

**Endpoint:** `GET /api/v1/insurance/verify/:insuranceNumber`

**Response:**
```json
{
  "success": true,
  "data": {
    "insuranceNumber": "INS12345",
    "provider": "SHA",
    "memberName": "John Doe",
    "membershipStatus": "Active",
    "expiryDate": "2024-01-01",
    "coverageType": "Comprehensive",
    "coverageLimit": 1000000,
    "coverageUsed": 250000,
    "coverageRemaining": 750000,
    "dependents": [
      {
        "name": "Jane Doe",
        "relationship": "Spouse",
        "dateOfBirth": "1992-05-15"
      },
      {
        "name": "Baby Doe",
        "relationship": "Child",
        "dateOfBirth": "2020-10-20"
      }
    ],
    "benefits": [
      {
        "name": "Outpatient",
        "limit": 100000,
        "used": 25000,
        "remaining": 75000
      },
      {
        "name": "Inpatient",
        "limit": 500000,
        "used": 0,
        "remaining": 500000
      },
      {
        "name": "Maternity",
        "limit": 100000,
        "used": 0,
        "remaining": 100000
      },
      {
        "name": "Dental",
        "limit": 50000,
        "used": 0,
        "remaining": 50000
      },
      {
        "name": "Optical",
        "limit": 50000,
        "used": 0,
        "remaining": 50000
      }
    ]
  }
}
```

### Submit Insurance Claim

**Endpoint:** `POST /api/v1/insurance/claims`

**Request Body:**
```json
{
  "patientId": "P12345",
  "insuranceNumber": "INS12345",
  "provider": "SHA",
  "visitId": "V12345",
  "claimAmount": 5000,
  "services": [
    {
      "description": "Consultation",
      "code": "CONS001",
      "quantity": 1,
      "unitPrice": 2000,
      "total": 2000
    },
    {
      "description": "Blood Test",
      "code": "LAB001",
      "quantity": 1,
      "unitPrice": 3000,
      "total": 3000
    }
  ],
  "diagnosis": "Hypertension",
  "diagnosisCode": "I10",
  "treatmentNotes": "Patient prescribed Lisinopril 10mg",
  "attachments": [
    {
      "name": "prescription.pdf",
      "contentType": "application/pdf",
      "content": "base64-encoded-content"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "claimId": "CL12345",
    "status": "Submitted",
    "submissionDate": "2023-06-15T14:30:00Z",
    "approvedAmount": null,
    "rejectedAmount": null,
    "patientResponsibility": null,
    "message": "Claim submitted successfully"
  }
}
```

## Payment Processing

The system integrates with M-Pesa for mobile payments.

### Initiate M-Pesa Payment

**Endpoint:** `POST /api/v1/payments/mpesa/initiate`

**Request Body:**
```json
{
  "phoneNumber": "254700123456",
  "amount": 1000,
  "accountReference": "INV12345",
  "description": "Payment for invoice INV12345"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_15062023143012345",
    "merchantRequestId": "12345-67890-1",
    "responseCode": "0",
    "responseDescription": "Success. Request accepted for processing",
    "customerMessage": "Success. Request accepted for processing"
  }
}
```

### Check M-Pesa Payment Status

**Endpoint:** `GET /api/v1/payments/mpesa/status/:checkoutRequestId`

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_15062023143012345",
    "merchantRequestId": "12345-67890-1",
    "resultCode": "0",
    "resultDesc": "The service request is processed successfully.",
    "amount": 1000,
    "mpesaReceiptNumber": "LHG31AA5TX",
    "transactionDate": "20230615143012",
    "phoneNumber": "254700123456",
    "status": "Completed"
  }
}
```

## Error Handling

All API responses include a `success` boolean flag and appropriate HTTP status codes. Error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "details": {
      "field": "password",
      "reason": "Incorrect password"
    }
  }
}
```

Common error codes:

- `INVALID_CREDENTIALS`: Authentication failed
- `INVALID_TOKEN`: JWT token is invalid or expired
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RESOURCE_NOT_FOUND`: Requested resource not found
- `VALIDATION_ERROR`: Request validation failed
- `BRANCH_ACCESS_DENIED`: User does not have access to the specified branch
- `REMOTE_ACCESS_DENIED`: Remote access not authorized
- `INTEGRATION_ERROR`: Error with third-party integration (insurance, payment)
- `SERVER_ERROR`: Internal server error

## Security Considerations

1. **Authentication**: All API requests (except login) must include the JWT token in the Authorization header.

2. **Branch Access Control**: All data is scoped to the user's current branch unless explicitly requested otherwise and the user has cross-branch access permissions.

3. **Remote Access**: Remote access (outside hospital premises) requires special authorization and is time-limited.

4. **Data Encryption**: All sensitive data is encrypted in transit (HTTPS) and at rest.

5. **Audit Logging**: All API requests are logged for audit purposes, including user, timestamp, IP address, and branch context.

## Need Help?

### Support Resources

If you need assistance with the API integration or have questions about the implementation, the following resources are available:

1. **Development Team Contact**
   - Email: dev@bristolparkhospital.com
   - Response time: Within 24 business hours

2. **API Documentation Repository**
   - GitHub: https://github.com/Ricoamal/bristolparkhospital/docs
   - Contains the latest version of this documentation and code examples

3. **Developer Portal**
   - URL: https://developer.bristolparkhospital.com
   - Access to sandbox environment for testing
   - API key management
   - Usage metrics and logs

4. **Knowledge Base**
   - Common integration issues and solutions
   - Best practices for performance optimization
   - Security guidelines

### Reporting Issues

When reporting an issue, please include the following information:

- Detailed description of the problem
- API endpoint(s) involved
- Request and response data (with sensitive information redacted)
- Error messages or codes received
- Steps to reproduce the issue
- Branch context (if applicable)
- Your contact information

### Integration Support

The development team offers the following support services:

- Technical consultation for integration planning
- Code review for integration implementations
- Performance optimization recommendations
- Security assessment for API usage
- Branch-specific configuration assistance

### Service Level Agreement

- Critical issues: Response within 2 hours, resolution target within 24 hours
- Major issues: Response within 8 hours, resolution target within 48 hours
- Minor issues: Response within 24 hours, resolution target within 5 business days
- Feature requests: Initial response within 48 hours, evaluation within 10 business days

### Upcoming Features

Stay informed about upcoming API features and changes by subscribing to our developer newsletter at developer-updates@bristolparkhospital.com.
