import React from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { Users, UserCheck, Calendar, Building, Bed, Beaker, Pill, Ambulance, Stethoscope, DollarSign } from 'lucide-react';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';

const NewDashboard: React.FC = () => {
  return (
    <div className="space-y-6 relative z-10">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Beds"
          value="120"
          icon={<Bed className="w-6 h-6 text-[#0100F6]" />}
          status="Available"
          breakdown={[
            { label: 'Executive Room', value: '20' },
            { label: 'Premium Room', value: '60' },
            { label: 'Basic Room', value: '40' },
          ]}
        />

        <MetricCard
          title="Doctors"
          value="52"
          icon={<UserCheck className="w-6 h-6 text-[#0100F6]" />}
          status="Available"
          secondaryValue="8"
          secondaryStatus="Leave"
          description="Shows the current number of available doctors."
        />

        <MetricCard
          title="Patients"
          value="245"
          icon={<Users className="w-6 h-6 text-[#0100F6]" />}
          status="↑ 15%"
          statusColor="text-green-500"
          description="Displays live updates of patient numbers."
        />

        <MetricCard
          title="Appointments"
          value="78"
          icon={<Calendar className="w-6 h-6 text-[#0100F6]" />}
          status="↑ 8%"
          statusColor="text-green-500"
          description="Total patient appointments scheduled for today."
        />
      </div>

      {/* Second Row of Metrics */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Lab Tests"
          value="42"
          icon={<Beaker className="w-6 h-6 text-[#0100F6]" />}
          status="Pending"
          description="Laboratory tests waiting to be processed."
        />

        <MetricCard
          title="Pharmacy"
          value="156"
          icon={<Pill className="w-6 h-6 text-[#0100F6]" />}
          status="Prescriptions"
          description="Prescriptions filled today."
        />

        <MetricCard
          title="Emergency"
          value="12"
          icon={<Ambulance className="w-6 h-6 text-[#0100F6]" />}
          status="Active Cases"
          statusColor="text-red-500"
          description="Current emergency cases being handled."
        />

        <MetricCard
          title="Revenue"
          value="KSh 2,458,000"
          icon={<DollarSign className="w-6 h-6 text-[#0100F6]" />}
          status="↑ 12%"
          statusColor="text-green-500"
          description="Today's revenue from all departments."
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Report Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 dashboard-content">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-[#0100F6]">Patient Status</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm font-medium text-[#0100F6] bg-blue-50 rounded-md">
                Today
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#0100F6] rounded-md">
                Week
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#0100F6] rounded-md">
                Month
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-64 h-64">
              <DonutChart
                value={75}
                segments={[
                  { percent: 35, color: '#FF7F7F', label: 'Urgent' },
                  { percent: 25, color: '#F8CE6A', label: 'Moderate' },
                  { percent: 15, color: '#A5D8B5', label: 'Low' },
                  { percent: 25, color: '#E6F3F7', label: '' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-[#FF7F7F] mr-1"></span>
                <span className="text-sm font-medium text-gray-700">Urgent</span>
              </div>
              <p className="text-xs text-gray-500">35% of patients</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-[#F8CE6A] mr-1"></span>
                <span className="text-sm font-medium text-gray-700">Moderate</span>
              </div>
              <p className="text-xs text-gray-500">25% of patients</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-[#A5D8B5] mr-1"></span>
                <span className="text-sm font-medium text-gray-700">Low</span>
              </div>
              <p className="text-xs text-gray-500">15% of patients</p>
            </div>
          </div>
        </div>

        {/* Patients Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 dashboard-content">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#0100F6]">Patients Overview</h2>
          </div>

          <div className="flex items-center mb-6">
            <div className="p-2 rounded-full bg-blue-50 mr-3">
              <Users className="w-5 h-5 text-[#0100F6]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patients</h3>
              <div className="flex items-center">
                <p className="text-2xl font-semibold text-[#0100F6]">65</p>
                <span className="ml-2 text-sm text-gray-500">Discharged</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 flex flex-wrap gap-2">
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs">
              <span className="font-medium mr-1">18</span>
              <span className="text-gray-500">Executive Room</span>
            </div>
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs">
              <span className="font-medium mr-1">24</span>
              <span className="text-gray-500">Appointment</span>
            </div>
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs">
              <span className="font-medium mr-1">32</span>
              <span className="text-gray-500">Premium Room</span>
            </div>
            <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs">
              <span className="font-medium mr-1">8</span>
              <span className="text-gray-500">Emergency Room</span>
            </div>
          </div>

          <div className="mt-6 h-56">
            <LineChart
              data={[
                { label: '01-07', discharge: 35, new: 45 },
                { label: '08-12', discharge: 40, new: 38 },
                { label: '13-17', discharge: 30, new: 35 },
                { label: '18-21', discharge: 45, new: 40 },
                { label: '21-25', discharge: 50, new: 42 },
                { label: '26-31', discharge: 40, new: 35 },
              ]}
            />
          </div>

          <div className="flex justify-center mt-4 gap-6">
            <div className="flex items-center">
              <span className="w-4 h-0.5 bg-[#0100F6] mr-2"></span>
              <span className="text-sm">Discharge</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-0.5 border-b border-dashed border-gray-400 mr-2"></span>
              <span className="text-sm">New</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm dashboard-content">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <h2 className="text-lg font-medium text-[#0100F6]">
              Recent Patient Admissions
            </h2>
            <div className="flex mt-2 md:mt-0">
              <button
                className="px-3 py-1.5 text-sm font-medium bg-[#0100F6] text-white rounded-md transition-colors duration-200"
              >
                Today
              </button>
              <button
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#0100F6] rounded-md transition-colors duration-200"
              >
                Last Week
              </button>
              <button
                className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#0100F6] rounded-md transition-colors duration-200"
              >
                Last Month
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-500">{patient.age} y.o., {patient.gender}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.idNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.admissionDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.diagnosis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.room}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Urgent':
      return 'bg-red-100 text-red-800';
    case 'Moderate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Sample patient data
const patients = [
  {
    id: '1',
    name: 'David Kamau',
    age: 45,
    gender: 'Male',
    idNumber: 'BP10023456',
    admissionDate: '12 Jun 2024',
    diagnosis: 'Myocardial Infarction',
    status: 'Urgent',
    room: 'Executive Room 101'
  },
  {
    id: '2',
    name: 'Faith Wanjiku',
    age: 32,
    gender: 'Female',
    idNumber: 'BP10023457',
    admissionDate: '12 Jun 2024',
    diagnosis: 'Pneumonia',
    status: 'Moderate',
    room: 'Premium Room 205'
  },
  {
    id: '3',
    name: 'Peter Omondi',
    age: 28,
    gender: 'Male',
    idNumber: 'BP10023458',
    admissionDate: '11 Jun 2024',
    diagnosis: 'Appendicitis',
    status: 'Urgent',
    room: 'Premium Room 210'
  },
  {
    id: '4',
    name: 'Esther Muthoni',
    age: 65,
    gender: 'Female',
    idNumber: 'BP10023459',
    admissionDate: '11 Jun 2024',
    diagnosis: 'Hypertension',
    status: 'Low',
    room: 'Basic Room 315'
  },
  {
    id: '5',
    name: 'Richard Kimani',
    age: 52,
    gender: 'Male',
    idNumber: 'BP10023460',
    admissionDate: '10 Jun 2024',
    diagnosis: 'Diabetes Mellitus',
    status: 'Moderate',
    room: 'Premium Room 208'
  }
];

export default NewDashboard;
