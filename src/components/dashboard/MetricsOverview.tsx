import React from 'react';
import { MetricCard } from './MetricCard';
import { Users, UserCheck, Calendar, Building } from 'lucide-react';

export const MetricsOverview: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Beds"
        value="60"
        icon={<Building className="w-6 h-6 text-[#2B4F60]" />}
        status="Available"
        breakdown={[
          { label: 'Executive Room', value: '12' },
          { label: 'Premium Room', value: '30' },
          { label: 'Basic Room', value: '18' },
        ]}
      />
      
      <MetricCard
        title="Doctors"
        value="46"
        icon={<UserCheck className="w-6 h-6 text-[#2B4F60]" />}
        status="Available"
        secondaryValue="4"
        secondaryStatus="Leave"
        description="Shows the current number of available doctors."
      />
      
      <MetricCard
        title="Patients"
        value="212"
        icon={<Users className="w-6 h-6 text-[#2B4F60]" />}
        status="↑ 12%"
        statusColor="text-green-500"
        description="Displays live updates of patient numbers."
      />
      
      <MetricCard
        title="Appointment"
        value="50"
        icon={<Calendar className="w-6 h-6 text-[#2B4F60]" />}
        status="↓ 11%"
        statusColor="text-[#FF7F7F]"
        description="Ensures accurate and current total patient appointment at all times."
      />
    </div>
  );
};