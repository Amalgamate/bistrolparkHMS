import React, { ReactNode } from 'react';

export interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (value: any, row: any) => ReactNode;
  hideOnMobile?: boolean;
  priority?: number; // Lower numbers are higher priority (shown first on mobile)
}

interface ResponsiveTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  columns,
  data,
  keyField,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  isLoading = false,
  loadingMessage = 'Loading data...'
}) => {
  // Sort columns by priority for mobile view
  const sortedColumns = [...columns].sort((a, b) => {
    const priorityA = a.priority !== undefined ? a.priority : 999;
    const priorityB = b.priority !== undefined ? b.priority : 999;
    return priorityA - priorityB;
  });

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2B3990] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-w-full bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={row[keyField]} 
                className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((column) => (
                  <td key={`${row[keyField]}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {data.map((row, rowIndex) => (
          <div 
            key={row[keyField]} 
            className={`border-b ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors p-4`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            style={onRowClick ? { cursor: 'pointer' } : undefined}
          >
            {sortedColumns.map((column) => (
              !column.hideOnMobile && (
                <div key={`${row[keyField]}-${column.key}`} className="mb-2 last:mb-0">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-1">{column.header}</div>
                  <div>
                    {column.render 
                      ? column.render(row[column.key], row) 
                      : row[column.key]}
                  </div>
                </div>
              )
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTable;
