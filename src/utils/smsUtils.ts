/**
 * SMS Notification Utility
 * 
 * This utility provides functions to send SMS notifications for various events
 * in the Bristol Park Hospital system. It supports notifications for:
 * - New patient registration
 * - Appointment creation
 * - Appointment updates (rescheduling, cancellation)
 * 
 * In a production environment, this would integrate with an actual SMS gateway
 * service like Twilio, Africa's Talking, or a local SMS provider.
 */

// SMS Templates for different notification types
const SMS_TEMPLATES = {
  // Patient registration notification
  PATIENT_REGISTRATION: (patientName: string, hospitalName: string = 'Bristol Park Hospital') => 
    `Dear ${patientName}, welcome to ${hospitalName}. Your registration is complete. Download our app or visit our website to manage your appointments and health records.`,
  
  // Appointment creation notification
  APPOINTMENT_CREATED: (patientName: string, doctorName: string, date: string, time: string, hospitalName: string = 'Bristol Park Hospital') => 
    `Dear ${patientName}, your appointment with ${doctorName} has been scheduled for ${date} at ${time} at ${hospitalName}. Reply YES to confirm or call us to reschedule.`,
  
  // Appointment rescheduled notification
  APPOINTMENT_RESCHEDULED: (patientName: string, doctorName: string, oldDate: string, oldTime: string, newDate: string, newTime: string) => 
    `Dear ${patientName}, your appointment with ${doctorName} originally scheduled for ${oldDate} at ${oldTime} has been rescheduled to ${newDate} at ${newTime}. Reply YES to confirm or call us if this doesn't work for you.`,
  
  // Appointment cancelled notification
  APPOINTMENT_CANCELLED: (patientName: string, doctorName: string, date: string, time: string) => 
    `Dear ${patientName}, your appointment with ${doctorName} scheduled for ${date} at ${time} has been cancelled. Please call us to reschedule.`,
  
  // Appointment reminder notification (sent 24 hours before)
  APPOINTMENT_REMINDER: (patientName: string, doctorName: string, date: string, time: string, hospitalName: string = 'Bristol Park Hospital') => 
    `Reminder: Dear ${patientName}, you have an appointment with ${doctorName} tomorrow, ${date} at ${time} at ${hospitalName}. Reply CONFIRM to confirm your attendance.`,
  
  // Doctor notification for new appointment
  DOCTOR_NEW_APPOINTMENT: (doctorName: string, patientName: string, date: string, time: string) => 
    `Dr. ${doctorName}, a new appointment has been scheduled with patient ${patientName} on ${date} at ${time}.`,
  
  // Doctor notification for cancelled appointment
  DOCTOR_CANCELLED_APPOINTMENT: (doctorName: string, patientName: string, date: string, time: string) => 
    `Dr. ${doctorName}, the appointment with patient ${patientName} on ${date} at ${time} has been cancelled.`,
  
  // Doctor notification for rescheduled appointment
  DOCTOR_RESCHEDULED_APPOINTMENT: (doctorName: string, patientName: string, oldDate: string, oldTime: string, newDate: string, newTime: string) => 
    `Dr. ${doctorName}, the appointment with patient ${patientName} originally scheduled for ${oldDate} at ${oldTime} has been rescheduled to ${newDate} at ${newTime}.`
};

// Interface for SMS notification options
interface SMSNotificationOptions {
  recipient: string;
  message: string;
  sender?: string;
  priority?: 'normal' | 'high';
  callbackUrl?: string;
}

/**
 * Send an SMS notification
 * @param options SMS notification options
 * @returns Promise with the result of the SMS sending operation
 */
export const sendSMS = async (options: SMSNotificationOptions): Promise<{success: boolean, messageId?: string, error?: string}> => {
  // In a real implementation, this would connect to an SMS gateway API
  console.log(`[SMS] To: ${options.recipient}, Message: ${options.message}`);
  
  // Simulate API call with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      
      if (success) {
        resolve({
          success: true,
          messageId: `msg_${Date.now()}_${Math.floor(Math.random() * 1000)}`
        });
      } else {
        resolve({
          success: false,
          error: 'Failed to send SMS. Network error or invalid recipient number.'
        });
      }
    }, 800); // Simulate network delay
  });
};

/**
 * Notify a patient about their registration
 */
export const notifyPatientRegistration = async (
  patientName: string,
  phoneNumber: string
): Promise<{success: boolean, messageId?: string, error?: string}> => {
  const message = SMS_TEMPLATES.PATIENT_REGISTRATION(patientName);
  return sendSMS({
    recipient: phoneNumber,
    message
  });
};

/**
 * Notify about a new appointment (both patient and doctor)
 */
export const notifyAppointmentCreated = async (
  patientName: string,
  patientPhone: string,
  doctorName: string,
  doctorPhone: string,
  date: string,
  time: string
): Promise<{patientNotified: boolean, doctorNotified: boolean}> => {
  // Send notification to patient
  const patientMessage = SMS_TEMPLATES.APPOINTMENT_CREATED(patientName, doctorName, date, time);
  const patientResult = await sendSMS({
    recipient: patientPhone,
    message: patientMessage
  });
  
  // Send notification to doctor
  const doctorMessage = SMS_TEMPLATES.DOCTOR_NEW_APPOINTMENT(doctorName, patientName, date, time);
  const doctorResult = await sendSMS({
    recipient: doctorPhone,
    message: doctorMessage
  });
  
  return {
    patientNotified: patientResult.success,
    doctorNotified: doctorResult.success
  };
};

/**
 * Notify about a rescheduled appointment (both patient and doctor)
 */
export const notifyAppointmentRescheduled = async (
  patientName: string,
  patientPhone: string,
  doctorName: string,
  doctorPhone: string,
  oldDate: string,
  oldTime: string,
  newDate: string,
  newTime: string
): Promise<{patientNotified: boolean, doctorNotified: boolean}> => {
  // Send notification to patient
  const patientMessage = SMS_TEMPLATES.APPOINTMENT_RESCHEDULED(
    patientName, doctorName, oldDate, oldTime, newDate, newTime
  );
  const patientResult = await sendSMS({
    recipient: patientPhone,
    message: patientMessage
  });
  
  // Send notification to doctor
  const doctorMessage = SMS_TEMPLATES.DOCTOR_RESCHEDULED_APPOINTMENT(
    doctorName, patientName, oldDate, oldTime, newDate, newTime
  );
  const doctorResult = await sendSMS({
    recipient: doctorPhone,
    message: doctorMessage
  });
  
  return {
    patientNotified: patientResult.success,
    doctorNotified: doctorResult.success
  };
};

/**
 * Notify about a cancelled appointment (both patient and doctor)
 */
export const notifyAppointmentCancelled = async (
  patientName: string,
  patientPhone: string,
  doctorName: string,
  doctorPhone: string,
  date: string,
  time: string
): Promise<{patientNotified: boolean, doctorNotified: boolean}> => {
  // Send notification to patient
  const patientMessage = SMS_TEMPLATES.APPOINTMENT_CANCELLED(patientName, doctorName, date, time);
  const patientResult = await sendSMS({
    recipient: patientPhone,
    message: patientMessage
  });
  
  // Send notification to doctor
  const doctorMessage = SMS_TEMPLATES.DOCTOR_CANCELLED_APPOINTMENT(doctorName, patientName, date, time);
  const doctorResult = await sendSMS({
    recipient: doctorPhone,
    message: doctorMessage
  });
  
  return {
    patientNotified: patientResult.success,
    doctorNotified: doctorResult.success
  };
};

/**
 * Send appointment reminder
 */
export const sendAppointmentReminder = async (
  patientName: string,
  patientPhone: string,
  doctorName: string,
  date: string,
  time: string
): Promise<{success: boolean, messageId?: string, error?: string}> => {
  const message = SMS_TEMPLATES.APPOINTMENT_REMINDER(patientName, doctorName, date, time);
  return sendSMS({
    recipient: patientPhone,
    message,
    priority: 'high'
  });
};
