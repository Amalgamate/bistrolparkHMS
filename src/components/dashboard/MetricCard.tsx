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

export const MetricCard: React.FC<MetricCardProps> = React.memo(({
  title,
  value,
  icon,
  status,
  statusColor = 'text-[#2B3990]',
  secondaryValue,
  secondaryStatus,
  description,
  breakdown,
}) => {
  // Memoize the breakdown items to prevent unnecessary re-renders
  const breakdownItems = React.useMemo(() => {
    if (!breakdown) return null;

    return (
      <div className="grid grid-cols-3 gap-2 mt-4 border-t pt-3">
        {breakdown.map((item, index) => (
          <div key={index} className="text-center">
            <p className="text-base font-medium text-gray-800">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    );
  }, [breakdown]);

  // Memoize the description element
  const descriptionElement = React.useMemo(() => {
    if (!description) return null;

    return (
      <div className="mt-3">
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    );
  }, [description]);

  return (
    <div className="overflow-hidden bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow duration-300 dashboard-content">
      <div className="px-4 py-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 p-3 rounded-full bg-[#EEF2FF]">
            {icon}
          </div>
          <div className="ml-4">
            <dt className="text-sm font-medium text-gray-700 truncate">
              {title}
            </dt>
            <div className="flex items-baseline mt-1">
              <dd className="text-xl font-semibold text-gray-800">
                {value}
              </dd>
              {status && (
                <dd className={`ml-2 text-sm font-medium ${statusColor}`}>
                  {status}
                </dd>
              )}
            </div>
            {secondaryValue && (
              <div className="mt-1">
                <div className="flex items-center">
                  <dd className="text-xl font-semibold text-gray-800">
                    {secondaryValue}
                  </dd>
                  <dd className="ml-2 text-sm font-medium text-gray-500">
                    {secondaryStatus}
                  </dd>
                </div>
              </div>
            )}
          </div>
        </div>

        {breakdownItems}
        {descriptionElement}
      </div>
    </div>
  );
});