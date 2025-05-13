import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Calendar, FileText, CreditCard, Clock } from 'lucide-react';
import PatientAppointments from '../components/patients/PatientAppointments';
import PatientAppointmentButton from '../components/patients/PatientAppointmentButton';
import { NotificationProvider } from '../context/NotificationContext';

const PatientDetailsDemo: React.FC = () => {
  const [hasUpcomingAppointment, setHasUpcomingAppointment] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<any>(null);

  // Sample patient data
  const patient = {
    id: 'P001',
    name: 'John Doe',
    gender: 'Male',
    birthDate: '1985-06-15',
    age: 38,
    phone: '+254 700 123 456',
    email: 'john.doe@example.com',
    address: '123 Main St, Nairobi',
    idNumber: 'ID12345678',
    insuranceProvider: 'SHA Insurance',
    insuranceNumber: 'SHA-987654321',
    nextOfKin: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+254 700 987 654'
    }
  };

  // Check for upcoming appointments
  useEffect(() => {
    // Simulate fetching appointment data
    setTimeout(() => {
      // This would normally be an API call to get appointments for this patient
      const upcomingAppointment = {
        date: '2025-05-15',
        time: '09:00',
        doctorName: 'Dr. Sarah Williams',
        department: 'Cardiology'
      };
      
      setNextAppointment(upcomingAppointment);
      setHasUpcomingAppointment(true);
    }, 1000);
  }, [patient.id]);

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Patient Details</h1>
          
          <div className="flex space-x-2">
            <PatientAppointmentButton 
              patient={{ id: patient.id, name: patient.name }}
              variant="outline"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
              <FileText size={16} className="mr-2" />
              Medical Records
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patient Information Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800">Patient Information</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.gender}, {patient.age} years</p>
                </div>
                
                {/* Appointment indicator */}
                {hasUpcomingAppointment && (
                  <div className="ml-auto">
                    <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock size={12} className="mr-1" />
                      Upcoming Appointment
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm">{patient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{patient.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Address</p>
                    <p className="text-sm">{patient.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Insurance</p>
                    <p className="text-sm">{patient.insuranceProvider} - {patient.insuranceNumber}</p>
                  </div>
                </div>
                
                {/* Next appointment details */}
                {nextAppointment && (
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Next Appointment</p>
                      <p className="text-sm">
                        {new Date(nextAppointment.date).toLocaleDateString()} at {nextAppointment.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        {nextAppointment.doctorName} - {nextAppointment.department}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium mb-2">Next of Kin</p>
                  <p className="text-sm">{patient.nextOfKin.name} ({patient.nextOfKin.relationship})</p>
                  <p className="text-sm">{patient.nextOfKin.phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Patient Appointments */}
          <div className="md:col-span-2">
            <PatientAppointments patient={{ id: patient.id, name: patient.name }} />
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default PatientDetailsDemo;

