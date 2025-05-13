# Bristol Park Hospital API Documentation (New Backend)

This document provides comprehensive information for backend developers on the new Node.js/Express/PostgreSQL backend that will replace the legacy Java backend. It focuses on the API design, authentication system, and key modules.

## Table of Contents

1. [API Overview](#api-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Patient Management](#patient-management)
4. [Clinical Module](#clinical-module)
5. [Appointment Management](#appointment-management)
6. [Admission Management](#admission-management)
7. [Document Management](#document-management)
8. [Settings Module](#settings-module)
9. [Insurance Integration](#insurance-integration)
10. [Payment Processing](#payment-processing)
11. [Error Handling](#error-handling)
12. [Security Considerations](#security-considerations)
13. [Development Resources](#development-resources)

## API Overview

The Bristol Park Hospital Management System uses a RESTful API architecture built with Node.js, Express, and TypeScript. All API endpoints follow these conventions:

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

### Standard Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Optional success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Additional error details (optional)
    }
  }
}
```

## Authentication & Authorization

### Authentication Endpoints

#### Login

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "username": "john.doe",
  "password": "securePassword123",
  "branchId": "fedha"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "123",
      "username": "john.doe",
      "fullName": "John Doe",
      "role": "doctor",
      "branch": "fedha",
      "permissions": ["view_patients", "edit_patients", "view_appointments"]
    }
  }
}
```

#### Refresh Token

**Endpoint:** `POST /api/v1/auth/refresh`

**Request Headers:**
- `Authorization: Bearer {refresh_token}`

**Response:** Same as login response

### User Management Endpoints

#### Get Users

**Endpoint:** `GET /api/v1/users`

**Query Parameters:**
- `role`: Filter by role (optional)
- `branch`: Filter by branch (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "123",
        "username": "john.doe",
        "fullName": "John Doe",
        "role": "doctor",
        "branch": "fedha",
        "email": "john.doe@example.com",
        "phone": "+254700123456",
        "status": "active",
        "lastLogin": "2023-06-15T10:30:00Z"
      }
      // More users...
    ],
    "pagination": {
      "total": 150,
      "pages": 8,
      "current": 1,
      "limit": 20
    }
  }
}
```

#### Create User

**Endpoint:** `POST /api/v1/users`

**Request Body:**
```json
{
  "username": "jane.smith",
  "password": "securePassword123",
  "fullName": "Jane Smith",
  "role": "nurse",
  "branch": "fedha",
  "email": "jane.smith@example.com",
  "phone": "+254700123457",
  "permissions": ["view_patients", "edit_vitals"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "124",
    "username": "jane.smith",
    "fullName": "Jane Smith",
    "role": "nurse",
    "branch": "fedha",
    "email": "jane.smith@example.com",
    "phone": "+254700123457",
    "status": "active",
    "createdAt": "2023-06-16T09:15:00Z"
  },
  "message": "User created successfully"
}
```

## Patient Management

### Patient Endpoints

#### Get Patients

**Endpoint:** `GET /api/v1/patients`

**Query Parameters:**
- `search`: Search term for name, ID, or phone (optional)
- `status`: Filter by status (active, inactive, admitted) (optional)
- `branch`: Filter by branch (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "P12345",
        "outPatientFileNumber": "OP-12345",
        "inPatientFileNumber": "IP-5678",
        "firstName": "John",
        "middleName": "Michael",
        "lastName": "Doe",
        "gender": "male",
        "dateOfBirth": "1985-06-15",
        "phone": "+254700123456",
        "email": "john.doe@example.com",
        "address": "123 Main St",
        "residence": "Fedha Estate",
        "idNumber": "12345678",
        "shaNumber": "SHA123456",
        "registeredAt": "2023-01-15T08:30:00Z",
        "status": "active",
        "branch": "fedha"
      }
      // More patients...
    ],
    "pagination": {
      "total": 1500,
      "pages": 75,
      "current": 1,
      "limit": 20
    }
  }
}
```

#### Create Patient

**Endpoint:** `POST /api/v1/patients`

**Request Body:**
```json
{
  "outPatientFileNumber": "OP-12346",
  "inPatientFileNumber": "",
  "oldReferenceNumber": "",
  "firstName": "Jane",
  "middleName": "Elizabeth",
  "lastName": "Smith",
  "gender": "female",
  "dateOfBirth": "1990-08-22",
  "maritalStatus": "single",
  "phone": "+254700123457",
  "email": "jane.smith@example.com",
  "address": "456 Oak St",
  "residence": "Utawala Estate",
  "idNumber": "87654321",
  "insuranceCovered": true,
  "insuranceProvider": "SHA",
  "shaNumber": "SHA654321",
  "nextOfKin": {
    "name": "Robert Smith",
    "relationship": "brother",
    "phone": "+254700123458",
    "address": "456 Oak St"
  },
  "paymentType": "insurance"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "P12346",
    "outPatientFileNumber": "OP-12346",
    "firstName": "Jane",
    "lastName": "Smith",
    // All other patient fields...
    "createdAt": "2023-06-16T10:15:00Z",
    "branch": "fedha"
  },
  "message": "Patient created successfully"
}
```

## Clinical Module

### Consultation Queue Endpoints

#### Get Queue

**Endpoint:** `GET /api/v1/clinical/queue`

**Query Parameters:**
- `status`: Filter by status (registered, waiting_vitals, vitals_taken, with_doctor, lab_ordered, lab_completed, pharmacy, completed) (optional)
- `branch`: Filter by branch (optional)
- `date`: Filter by date (default: today) (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "queue": [
      {
        "id": "Q12345",
        "patientId": "P12345",
        "patientName": "John Doe",
        "tokenNumber": 5,
        "priority": "normal",
        "status": "waiting_vitals",
        "registeredAt": "2023-06-16T08:30:00Z",
        "waitTime": "00:45:12",
        "branch": "fedha"
      }
      // More queue entries...
    ]
  }
}
```

#### Record Vitals

**Endpoint:** `POST /api/v1/clinical/vitals`

**Request Body:**
```json
{
  "patientId": "P12345",
  "queueId": "Q12345",
  "vitals": {
    "temperature": 37.2,
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "pulseRate": 72,
    "respiratoryRate": 16,
    "oxygenSaturation": 98,
    "height": 175,
    "weight": 70,
    "bmi": 22.9,
    "notes": "Patient appears healthy"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "V12345",
    "patientId": "P12345",
    "queueId": "Q12345",
    "vitals": {
      // Vitals data...
    },
    "recordedBy": "Jane Smith",
    "recordedAt": "2023-06-16T09:15:00Z",
    "branch": "fedha"
  },
  "message": "Vitals recorded successfully"
}
```

## Development Resources

### API Testing

The API can be tested using Postman. A collection of API requests is available at:
- [Postman Collection](https://www.postman.com/bristolparkhospital/workspace/bristol-park-api)

### Local Development

To set up the API for local development:

1. Clone the repository:
   ```bash
   git clone https://github.com/Ricoamal/bristolparkhospital-api.git
   cd bristolparkhospital-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Install PostgreSQL
2. Create a new database:
   ```sql
   CREATE DATABASE bristol_park;
   ```
3. Run migrations:
   ```bash
   npm run migrate
   ```
4. (Optional) Seed with test data:
   ```bash
   npm run seed
   ```

### Documentation

API documentation is available at:
- Local: http://localhost:3000/api-docs
- Production: https://api.bristolparkhospital.com/api-docs
