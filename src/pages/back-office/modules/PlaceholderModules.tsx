import React from 'react';
import {
  Briefcase,
  ShieldCheck,
  FileText,
  BarChart,
  Clipboard,
  Calendar,
  Database,
  Settings
} from 'lucide-react';

// Contracts Module
export const ContractsModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Contracts Management</h2>
      <div className="text-center py-8">
        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Contracts management functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Compliance Module
export const ComplianceModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Compliance Management</h2>
      <div className="text-center py-8">
        <ShieldCheck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Compliance management functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Reports Module
export const ReportsModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Reports</h2>
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Reports functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Analytics Module
export const AnalyticsModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Analytics</h2>
      <div className="text-center py-8">
        <BarChart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Analytics functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Audit Module
export const AuditModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Audit Logs</h2>
      <div className="text-center py-8">
        <Clipboard className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Audit logs functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Scheduling Module
export const SchedulingModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Scheduling</h2>
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Scheduling functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Database Module
export const DatabaseModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Database Management</h2>
      <div className="text-center py-8">
        <Database className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Database management functionality will be implemented soon.</p>
      </div>
    </div>
  );
};

// Back Office Settings Module
export const BackOfficeSettingsModule: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-3">Back Office Settings</h2>
      <div className="text-center py-8">
        <Settings className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">Back office settings functionality will be implemented soon.</p>
      </div>
    </div>
  );
};
