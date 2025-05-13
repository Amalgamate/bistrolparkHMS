import React, { useState } from 'react';
import { Calendar, Clock, Edit, Trash2, Plus, Search, Filter, Share2, Eye, X, Phone, MessageCircle, MessageSquare, Bell, XCircle } from 'lucide-react';
import AppointmentForm from '../../components/appointments/management/AppointmentForm';
import AppointmentCalendar from '../../components/appointments/management/AppointmentCalendar';
import AppointmentShare from '../../components/appointments/management/AppointmentShare';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';

// Sample appointment data matching patients from PatientModuleDemo
const sampleAppointments = [
  {
    id: '1',
    patientName: 'David Kamau',
    patientId: 'BP10023456',
    date: '2025-05-10',
    time: '09:00',
    doctorName: 'Dr. Smith',
    department: 'Cardiology',
    status: 'scheduled',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    patientName: 'Faith Wanjiku',
    patientId: 'BP10023457',
    date: '2025-05-10',
    time: '10:30',
    doctorName: 'Dr. Johnson',
    department: 'Neurology',
    status: 'confirmed',
    notes: 'Follow-up appointment'
  },
  {
    id: '3',
    patientName: 'Peter Omondi',
    patientId: 'BP10023458',
    date: '2025-05-10',
    time: '14:00',
    doctorName: 'Dr. Williams',
    department: 'Orthopedics',
    status: 'completed',
    notes: 'Post-surgery checkup'
  },
  {
    id: '4',
    patientName: 'Esther Muthoni',
    patientId: 'BP10023459',
    date: '2025-05-11',
    time: '11:15',
    doctorName: 'Dr. Smith',
    department: 'Cardiology',
    status: 'scheduled',
    notes: 'New patient consultation'
  },
  {
    id: '5',
    patientName: 'John Njoroge',
    patientId: 'BP10023460',
    date: '2025-05-11',
    time: '15:45',
    doctorName: 'Dr. Johnson',
    department: 'Neurology',
    status: 'cancelled',
    notes: 'Patient requested cancellation'
  }
];

// Wrap the main component with NotificationProvider
const AppointmentManagementWithNotifications: React.FC = () => {
  return (
    <NotificationProvider>
      <AppointmentManagement />
    </NotificationProvider>
  );
};

const AppointmentManagement: React.FC = () => {
  const { showNotification } = useNotification();
  const [appointments, setAppointments] = useState(sampleAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Enhanced filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    doctorId: '',
    departmentId: '',
    appointmentType: '',
    patientId: ''
  });

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle search
  const handleSearch = () => {
    if (!searchQuery.trim() && !hasActiveFilters()) {
      setAppointments(sampleAppointments);
      return;
    }

    let filteredAppointments = [...sampleAppointments];

    // Apply text search
    if (searchQuery.trim()) {
      filteredAppointments = filteredAppointments.filter(
        appointment =>
          appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (appointment.notes && appointment.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply filters
    if (filters.startDate) {
      filteredAppointments = filteredAppointments.filter(
        appointment => new Date(appointment.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredAppointments = filteredAppointments.filter(
        appointment => new Date(appointment.date) <= new Date(filters.endDate)
      );
    }

    if (filters.status) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.status === filters.status
      );
    }

    if (filters.doctorId) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.doctorName.includes(filters.doctorId)
      );
    }

    if (filters.departmentId) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.department === filters.departmentId
      );
    }

    if (filters.appointmentType) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.notes.toLowerCase().includes(filters.appointmentType.toLowerCase())
      );
    }

    if (filters.patientId) {
      filteredAppointments = filteredAppointments.filter(
        appointment => appointment.patientId === filters.patientId
      );
    }

    setAppointments(filteredAppointments);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '');
  };

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      doctorId: '',
      departmentId: '',
      appointmentType: '',
      patientId: ''
    });

    if (!searchQuery.trim()) {
      setAppointments(sampleAppointments);
    }
  };

  // Function to open the form for creating a new appointment
  const handleNewAppointment = () => {
    setCurrentAppointment(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Function to open the form for editing an existing appointment
  const handleEditAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Function to handle saving an appointment (create or update)
  const handleSaveAppointment = (appointmentData: any) => {
    if (isEditing) {
      // Update existing appointment
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === appointmentData.id ? appointmentData : appointment
      );
      setAppointments(updatedAppointments);
      showNotification('success', 'Appointment Updated', 'The appointment has been updated successfully.');

      // Handle Google Calendar integration if selected
      if (appointmentData.addToGoogleCalendar) {
        handleAddToGoogleCalendar(appointmentData);
      }

      // Handle reminders if selected
      if (appointmentData.sendReminder) {
        showNotification('info', 'Reminder Set', `A reminder will be sent ${getReminderTimeText(appointmentData.reminderTime)} before the appointment.`);
      }
    } else {
      // Add new appointment
      setAppointments([...appointments, appointmentData]);
      showNotification('success', 'Appointment Created', 'The appointment has been created successfully.');

      // Handle Google Calendar integration if selected
      if (appointmentData.addToGoogleCalendar) {
        handleAddToGoogleCalendar(appointmentData);
      }

      // Handle reminders if selected
      if (appointmentData.sendReminder) {
        showNotification('info', 'Reminder Set', `A reminder will be sent ${getReminderTimeText(appointmentData.reminderTime)} before the appointment.`);
      }
    }

    setIsFormOpen(false);
  };

  // Function to get reminder time text
  const getReminderTimeText = (reminderTime: string) => {
    switch (reminderTime) {
      case '15min':
        return '15 minutes';
      case '30min':
        return '30 minutes';
      case '1hour':
        return '1 hour';
      case '2hours':
        return '2 hours';
      case '1day':
        return '1 day';
      default:
        return reminderTime;
    }
  };

  // Function to handle Google Calendar integration
  const handleAddToGoogleCalendar = (appointment: any) => {
    const { date, time, doctorName, department, notes } = appointment;

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
    showNotification('info', 'Google Calendar', 'Opening Google Calendar in a new tab.');
  };

  // Function to handle sharing an appointment
  const handleShareAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsShareOpen(true);
  };

  // Function to handle deleting an appointment
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
      setAppointments(updatedAppointments);
      showNotification('warning', 'Appointment Deleted', 'The appointment has been deleted.');
    }
  };

  // Function to handle viewing an appointment
  const handleViewAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsViewOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>

        <button
          onClick={handleNewAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus size={16} className="mr-2" />
          New Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:items-center">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search appointments..."
                className="border rounded-md pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSearch}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex-grow sm:flex-grow-0"
              >
                Search
              </button>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`${hasActiveFilters() ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 px-3 py-2 rounded-md flex items-center flex-grow sm:flex-grow-0`}
              >
                <Filter size={16} className="mr-1" />
                Filters {hasActiveFilters() && <span className="ml-1 bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">{Object.values(filters).filter(v => v !== '').length}</span>}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md flex items-center w-full justify-center sm:w-auto"
            >
              <Calendar size={16} className="mr-1" />
              Calendar View
            </button>
          </div>
        </div>

        {/* Enhanced Filter Panel */}
        {isFilterOpen && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Appointments</h3>
              <p className="text-xs text-gray-500">Use the filters below to narrow down the appointment list</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor
                </label>
                <select
                  value={filters.doctorId}
                  onChange={(e) => handleFilterChange('doctorId', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Doctors</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="Dr. Johnson">Dr. Johnson</option>
                  <option value="Dr. Williams">Dr. Williams</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={filters.departmentId}
                  onChange={(e) => handleFilterChange('departmentId', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Departments</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment Type
                </label>
                <select
                  value={filters.appointmentType}
                  onChange={(e) => handleFilterChange('appointmentType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="regular">Regular</option>
                  <option value="follow-up">Follow-up</option>
                  <option value="emergency">Emergency</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  handleSearch();
                  setIsFilterOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                    <div className="text-sm text-gray-500">ID: {appointment.patientId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewAppointment(appointment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      title="View Appointment"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="Edit Appointment"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleShareAppointment(appointment)}
                      className="text-green-600 hover:text-green-900 mr-2"
                      title="Share Appointment"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {appointments.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No appointments found matching your search criteria.
          </div>
        )}

        <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {appointments.length} appointments
          </div>
          <div className="flex items-center">
            <button className="px-3 py-1 border rounded-md text-sm text-gray-600 mr-2 hover:bg-gray-100">
              Previous
            </button>
            <button className="px-3 py-1 border rounded-md text-sm text-gray-600 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Appointment Form Modal */}
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAppointment}
        appointment={currentAppointment}
        isEditing={isEditing}
      />

      {/* Appointment Calendar Modal */}
      {isCalendarOpen && (
        <AppointmentCalendar
          appointments={appointments}
          onAppointmentClick={handleEditAppointment}
          onCreateAppointment={(date) => {
            setCurrentAppointment({ date });
            setIsEditing(false);
            setIsFormOpen(true);
            setIsCalendarOpen(false);
          }}
          onClose={() => setIsCalendarOpen(false)}
          allowCreate={true}
        />
      )}

      {/* Appointment Share Modal */}
      {isShareOpen && (
        <AppointmentShare
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          appointment={currentAppointment}
        />
      )}

      {/* View Appointment Modal */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient</p>
                  <p className="text-base">{currentAppointment.patientName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base">{formatDate(currentAppointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-base">{currentAppointment.time}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Doctor</p>
                  <p className="text-base">{currentAppointment.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-base">{currentAppointment.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p className="text-base">{currentAppointment.status}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-base">{currentAppointment.notes || "No notes available"}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    window.open(`tel:${currentAppointment.patientPhone || ''}`, '_blank');
                    showNotification('info', 'Initiating Call', 'Opening phone app to call patient...');
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={!currentAppointment.patientPhone}
                >
                  <Phone size={16} className="mr-2" />
                  Call Patient
                </button>

                <button
                  onClick={() => {
                    const message = `Reminder: You have an appointment with ${currentAppointment.doctorName} on ${formatDate(currentAppointment.date)} at ${currentAppointment.time}`;
                    window.open(`https://wa.me/${currentAppointment.patientPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                    showNotification('info', 'Opening WhatsApp', 'Redirecting to WhatsApp to message patient...');
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={!currentAppointment.patientPhone}
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp
                </button>

                <button
                  onClick={() => {
                    const message = `Reminder: You have an appointment with ${currentAppointment.doctorName} on ${formatDate(currentAppointment.date)} at ${currentAppointment.time}`;
                    window.open(`sms:${currentAppointment.patientPhone || ''}?body=${encodeURIComponent(message)}`, '_blank');
                    showNotification('info', 'Opening SMS', 'Opening SMS app to message patient...');
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={!currentAppointment.patientPhone}
                >
                  <MessageSquare size={16} className="mr-2" />
                  SMS
                </button>

                <button
                  onClick={() => {
                    showNotification('success', 'Reminder Sent', `A reminder has been sent to ${currentAppointment.patientName} for their appointment.`);
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Bell size={16} className="mr-2" />
                  Send Reminder
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to cancel this appointment with ${currentAppointment.patientName}?`)) {
                      // Update appointment status to cancelled
                      const updatedAppointments = appointments.map(appointment =>
                        appointment.id === currentAppointment.id
                          ? {...appointment, status: 'cancelled'}
                          : appointment
                      );
                      setAppointments(updatedAppointments);
                      showNotification('success', 'Appointment Cancelled', 'The appointment has been cancelled successfully.');
                      setIsViewOpen(false);
                    }
                  }}
                  className="flex items-center justify-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                >
                  <XCircle size={16} className="mr-2" />
                  Cancel Appointment
                </button>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManagementWithNotifications;



