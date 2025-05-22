import { body, param } from 'express-validator';

// Validation for creating an appointment
export const createAppointmentValidation = [
  body('patient_id')
    .notEmpty().withMessage('Patient ID is required')
    .isInt().withMessage('Patient ID must be an integer'),
  
  body('doctor_id')
    .notEmpty().withMessage('Doctor ID is required')
    .isInt().withMessage('Doctor ID must be an integer'),
  
  body('appointment_date')
    .notEmpty().withMessage('Appointment date is required')
    .isISO8601().withMessage('Appointment date must be a valid date')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      if (date < now) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'])
    .withMessage('Status must be scheduled, confirmed, completed, cancelled, or no-show'),
  
  body('reason')
    .optional()
    .isString().withMessage('Reason must be a string'),
  
  body('notes')
    .optional()
    .isString().withMessage('Notes must be a string'),
];

// Validation for updating an appointment
export const updateAppointmentValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer'),
  
  ...createAppointmentValidation
];

// Validation for getting an appointment by ID
export const getAppointmentByIdValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer'),
];

// Validation for getting appointments by patient ID
export const getAppointmentsByPatientIdValidation = [
  param('patientId')
    .isInt().withMessage('Patient ID must be an integer'),
];

// Validation for getting appointments by doctor ID
export const getAppointmentsByDoctorIdValidation = [
  param('doctorId')
    .isInt().withMessage('Doctor ID must be an integer'),
];

// Validation for deleting an appointment
export const deleteAppointmentValidation = [
  param('id')
    .isInt().withMessage('Appointment ID must be an integer'),
];
