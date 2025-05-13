import React, { useState } from 'react';
import { X, Mail, Share2, Copy, Calendar, MessageSquare, Phone, MessageCircle } from 'lucide-react';

interface AppointmentShareProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
}

const AppointmentShare: React.FC<AppointmentShareProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !appointment) return null;

  // Format appointment details for sharing
  const formatAppointmentDetails = () => {
    const { patientName, date, time, doctorName, department, notes } = appointment;

    return `
Appointment Details:
-------------------
Patient: ${patientName}
Date: ${new Date(date).toLocaleDateString()}
Time: ${time}
Doctor: ${doctorName}
Department: ${department}
${notes ? `Notes: ${notes}` : ''}
    `.trim();
  };

  // Generate calendar event URL (iCal format)
  const generateCalendarUrl = () => {
    const { patientName, date, time, doctorName, department, notes } = appointment;

    // Parse date and time
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1); // Assume 1 hour appointment

    // Format dates for iCal
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const event = {
      title: `Medical Appointment with ${doctorName}`,
      description: notes || `Appointment with ${doctorName} in ${department}`,
      location: `${department} Department, Bristol Park Hospital`,
      start: formatDate(startDate),
      end: formatDate(endDate)
    };

    const url = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${encodeURIComponent(event.title)}
DESCRIPTION:${encodeURIComponent(event.description)}
LOCATION:${encodeURIComponent(event.location)}
DTSTART:${event.start}
DTEND:${event.end}
END:VEVENT
END:VCALENDAR`;

    return url;
  };

  // Handle email sharing
  const handleEmailShare = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would send the email via an API
    // For now, we'll just simulate it
    window.open(`mailto:${email}?subject=Appointment Details&body=${encodeURIComponent(formatAppointmentDetails() + '\n\n' + message)}`);

    // Show success message
    alert('Email sharing initiated!');
    onClose();
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(formatAppointmentDetails());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Google Calendar integration
  const handleAddToGoogleCalendar = () => {
    const { patientName, date, time, doctorName, department, notes } = appointment;

    // Parse date and time
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1); // Assume 1 hour appointment

    // Format dates for Google Calendar
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Medical Appointment with ${doctorName}`)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(notes || `Appointment with ${doctorName} in ${department}`)}&location=${encodeURIComponent(`${department} Department, Bristol Park Hospital`)}`;

    window.open(url, '_blank');
  };

  // Handle download as iCal
  const handleDownloadIcal = () => {
    const link = document.createElement('a');
    link.href = generateCalendarUrl();
    link.download = `appointment_${appointment.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto my-8">
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Share Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Appointment Details</h3>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="mb-1"><strong>Patient:</strong> {appointment.patientName}</p>
              <p className="mb-1"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Time:</strong> {appointment.time}</p>
              <p className="mb-1"><strong>Doctor:</strong> {appointment.doctorName}</p>
              <p className="mb-1"><strong>Department:</strong> {appointment.department}</p>
              {appointment.notes && <p className="mb-1"><strong>Notes:</strong> {appointment.notes}</p>}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Share Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCopyToClipboard}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Copy size={16} className="mr-2" />
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>

              <button
                onClick={handleAddToGoogleCalendar}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Calendar size={16} className="mr-2" />
                Add to Google Calendar
              </button>

              <button
                onClick={handleDownloadIcal}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Calendar size={16} className="mr-2" />
                Download iCal
              </button>

              <a
                href={`sms:?body=${encodeURIComponent(`Appointment with ${appointment.doctorName} on ${new Date(appointment.date).toLocaleDateString()} at ${appointment.time}`)}`}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <MessageSquare size={16} className="mr-2" />
                Send as SMS
              </a>

              {/* WhatsApp sharing - greyed out as placeholder */}
              <button
                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                title="Not available in the current system"
              >
                <MessageCircle size={16} className="mr-2" />
                Share via WhatsApp
              </button>

              {/* Phone call - greyed out as placeholder */}
              <button
                className="flex items-center justify-center px-4 py-2 border border-gray-200 rounded-md shadow-sm text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                title="Not available in the current system"
              >
                <Phone size={16} className="mr-2" />
                Call Patient
              </button>
            </div>
          </div>

          <form onSubmit={handleEmailShare}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Share via Email</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3">
              <button
                type="submit"
                className="w-full mb-2 sm:mb-0 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Mail size={16} className="mr-2" />
                Send Email
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentShare;
