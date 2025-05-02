import React from 'react';

interface BreakdownItem {
  label: string;
  value: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  status: string;
  statusColor?: string;
  secondaryValue?: string;
  secondaryStatus?: string;
  description?: string;
  breakdown?: BreakdownItem[];
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  status,
  statusColor = 'text-[#2B4F60]',
  secondaryValue,
  secondaryStatus,
  description,
  breakdown,
}) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 dashboard-content">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full bg-[#E6F3F7]">
            {icon}
          </div>
          <div className="ml-4">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <div className="flex items-baseline">
              <dd className="text-3xl font-semibold text-[#2B4F60]">
                {value}
              </dd>
              {status && (
                <dd className={`ml-2 text-sm font-medium ${statusColor}`}>
                  {status}
                </dd>
              )}
              {secondaryValue && (
                <div className="ml-4">
                  <dd className="text-2xl font-semibold text-[#2B4F60]">
                    {secondaryValue}
                  </dd>
                  <dd className="text-sm font-medium text-gray-500">
                    {secondaryStatus}
                  </dd>
                </div>
              )}
            </div>
          </div>
        </div>

        {breakdown && (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {breakdown.map((item, index) => (
              <div key={index} className="text-center">
                <p className="text-lg font-medium text-[#2B4F60]">{item.value}</p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {description && (
          <div className="mt-4">
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
};