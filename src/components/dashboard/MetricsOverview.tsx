import React from 'react';
import { MetricCard } from './MetricCard';
import { Users, UserCheck, Calendar, Building } from 'lucide-react';

export const MetricsOverview: React.FC = React.memo(() => {
  // Memoize the icons to prevent unnecessary re-renders
  const buildingIcon = React.useMemo(() => <Building className="w-5 h-5 text-blue-800" />, []);
  const doctorIcon = React.useMemo(() => <UserCheck className="w-5 h-5 text-blue-800" />, []);
  const patientIcon = React.useMemo(() => <Users className="w-5 h-5 text-blue-800" />, []);
  const appointmentIcon = React.useMemo(() => <Calendar className="w-5 h-5 text-blue-800" />, []);

  // Memoize the breakdown data
  const bedsBreakdown = React.useMemo(() => [
    { label: 'Executive Room', value: '-' },
    { label: 'Premium Room', value: '-' },
    { label: 'Basic Room', value: '-' },
  ], []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Beds"
        value="-"
        icon={buildingIcon}
        status="Available"
        statusColor="text-blue-700 font-semibold"
        breakdown={bedsBreakdown}
      />

      <MetricCard
        title="Doctors"
        value="-"
        icon={doctorIcon}
        status="Available"
        statusColor="text-blue-700 font-semibold"
        secondaryValue="-"
        secondaryStatus="Leave"
        description="Shows the current number of available doctors."
      />

      <MetricCard
        title="Patients"
        value="-"
        icon={patientIcon}
        status="-"
        description="Displays live updates of patient numbers."
      />

      <MetricCard
        title="Appointment"
        value="-"
        icon={appointmentIcon}
        status="-"
        description="Ensures accurate and current total patient appointment at all times."
      />
    </div>
  );
});