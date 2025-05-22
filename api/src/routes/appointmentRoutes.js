import express from 'express';
const router = express.Router();
import * as appointmentController from '../controllers/appointmentController.js';

// GET all appointments
router.get('/', appointmentController.getAllAppointments);

// GET appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// GET appointments by patient ID
router.get('/patient/:patientId', appointmentController.getAppointmentsByPatientId);

// GET appointments by doctor ID
router.get('/doctor/:doctorId', appointmentController.getAppointmentsByDoctorId);

// POST create new appointment
router.post('/', appointmentController.createAppointment);

// PUT update appointment
router.put('/:id', appointmentController.updateAppointment);

// DELETE appointment
router.delete('/:id', appointmentController.deleteAppointment);

export default router;
