import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AppointmentCalendarProps {
  appointments: any[];
  onAppointmentClick: (appointment: any) => void;
  onCreateAppointment?: (date: string) => void;
  onClose: () => void;
  allowCreate?: boolean;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onAppointmentClick,
  onCreateAppointment,
  onClose,
  allowCreate = true
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Get the number of days in the month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get the month name
  const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Group appointments by date
  const appointmentsByDate: Record<string, any[]> = {};

  appointments.forEach(appointment => {
    if (!appointmentsByDate[appointment.date]) {
      appointmentsByDate[appointment.date] = [];
    }
    appointmentsByDate[appointment.date].push(appointment);
  });

  // Function to get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointmentsByDate[date] || [];
  };

  // Function to handle double-click on a day to create a new appointment
  const handleDayDoubleClick = (day: number) => {
    if (!allowCreate || !onCreateAppointment) return;

    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onCreateAppointment(date);
  };

  // Function to navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Function to navigate to the next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Appointment Calendar
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-medium">
              {monthName} {currentYear}
            </h3>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-24 bg-gray-50 rounded-md"></div>;
              }

              const dayAppointments = getAppointmentsForDay(day);
              const hasAppointments = dayAppointments.length > 0;

              return (
                <div
                  key={`day-${day}`}
                  className={`h-24 border rounded-md p-1 overflow-y-auto ${
                    hasAppointments ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  } ${allowCreate ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onDoubleClick={() => handleDayDoubleClick(day)}
                  title={allowCreate ? "Double-click to create appointment" : ""}
                >
                  <div className="text-right text-sm font-medium mb-1">
                    {day}
                  </div>

                  {dayAppointments.map(appointment => (
                    <div
                      key={appointment.id}
                      onClick={() => onAppointmentClick(appointment)}
                      className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                        appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : appointment.status === 'completed'
                            ? 'bg-purple-100 text-purple-800'
                            : appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {appointment.time} - {appointment.patientName}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
