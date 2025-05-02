import React from 'react';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ReportSection } from '../components/dashboard/ReportSection';
import { PatientsOverview } from '../components/dashboard/PatientsOverview';
import { PatientsTable } from '../components/dashboard/PatientsTable';
import { BranchOverview } from '../components/dashboard/BranchOverview';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const branch = user?.branch || 'Fedha';

  return (
    <div className="space-y-6 relative z-10">
      {/* Branch Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0100F6] to-[#0d6fe8] text-white p-4 rounded-lg shadow-sm">
        <h1 className="text-xl font-semibold">Welcome to Bristol Hospital - {branch} Branch</h1>
        <p className="text-sm opacity-90">Dashboard overview and key metrics for your branch</p>
      </div>

      <MetricsOverview />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BranchOverview />
        <PatientsOverview />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ReportSection />
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold text-[#2B4F60] mb-4">Branch Performance</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Patient Satisfaction</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Staff Efficiency</span>
              <span className="text-sm font-medium">87%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resource Utilization</span>
              <span className="text-sm font-medium">78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>

      <PatientsTable />
    </div>
  );
};

export default Dashboard;