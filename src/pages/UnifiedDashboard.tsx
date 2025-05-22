import React, { useState, useEffect } from 'react';
import { MetricsOverview } from '../components/dashboard/MetricsOverview';
import { ReportSection } from '../components/dashboard/ReportSection';
import { PatientsOverview } from '../components/dashboard/PatientsOverview';
import { PatientsTable } from '../components/dashboard/PatientsTable';
import { BranchOverview } from '../components/dashboard/BranchOverview';
import { SimpleModuleGrid } from '../components/dashboard/SimpleModuleGrid';
import DashboardTabs from '../components/dashboard/DashboardTabs';
import TabContent from '../components/dashboard/TabContent';
import QueueSystem from '../components/dashboard/QueueSystem';
import { useAuth } from '../context/AuthContext';
import { Building2, BarChart, DollarSign, Grid, User, PieChart, Plus, Calendar, Heart, Clock } from 'lucide-react';
import { APP_VERSION } from '../utils/cacheUtils';

// Dashboard-specific version - should match APP_VERSION
const DASHBOARD_VERSION = APP_VERSION;

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const branch = user?.branch || 'Fedha';
  const [activeTab, setActiveTab] = useState('queues');

  // Load saved tab if available
  useEffect(() => {
    const savedTab = localStorage.getItem('dashboard_active_tab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('dashboard_active_tab', value);
  };

  return (
    <div className="space-y-4 relative z-10">
      {/* Tabbed Dashboard Sections */}
      <div className={`${activeTab === 'queues' ? 'bg-black' : 'bg-white'} rounded-lg p-4`}>
        <DashboardTabs activeTab={activeTab} onChange={handleTabChange} />

          {/* Queues Tab */}
          <TabContent id="queues" activeTab={activeTab} className="space-y-6">
            <QueueSystem />
          </TabContent>

          {/* Quick Access Tab */}
          <TabContent id="quick-access" activeTab={activeTab} className="space-y-6">
            <SimpleModuleGrid />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Report Section */}
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Report</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Everything</span>
                    <button className="text-blue-600 flex items-center text-sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Report
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div className="text-blue-800 font-medium">Patients</div>
                      <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-sm">
                        <User size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800 mt-2">128</div>
                    <div className="text-xs text-blue-600 mt-1 flex items-center">
                      <span className="inline-block mr-1 text-blue-500">↑</span>
                      +12 today
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div className="text-green-800 font-medium">Appointments</div>
                      <div className="bg-green-500 text-white p-1.5 rounded-full shadow-sm">
                        <Calendar size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-800 mt-2">42</div>
                    <div className="text-xs text-green-600 mt-1 flex items-center">
                      <span className="inline-block mr-1 text-green-500">↑</span>
                      +8 today
                    </div>
                  </div>
                </div>
              </div>

              {/* Branch Performance */}
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Branch Performance</h2>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  Daily Performance Statistics
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div className="text-purple-800 font-medium">Revenue</div>
                      <div className="bg-purple-500 text-white p-1.5 rounded-full shadow-sm">
                        <DollarSign size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-800 mt-2">KES 245,890</div>
                    <div className="text-xs text-purple-600 mt-1 flex items-center">
                      <span className="inline-block mr-1 text-purple-500">↑</span>
                      +15% this week
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div className="text-amber-800 font-medium">Satisfaction</div>
                      <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-sm">
                        <Heart size={16} />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-800 mt-2">92%</div>
                    <div className="text-xs text-amber-600 mt-1 flex items-center">
                      <span className="inline-block mr-1 text-amber-500">↑</span>
                      +3% this month
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabContent>

          {/* Hospital Overview Tab */}
          <TabContent id="hospital-overview" activeTab={activeTab} className="space-y-4">
            {/* Metrics Overview */}
            <div className="mb-4">
              <MetricsOverview />
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Patient Satisfaction</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">85%</span>
                  <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Staff Efficiency</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-blue-600">78%</span>
                  <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">+3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-1">Resource Utilization</h3>
                <div className="flex items-center mb-2">
                  <span className="text-2xl font-bold text-purple-600">92%</span>
                  <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">+7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>

            {/* Branch and Patients Overview */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <BranchOverview />
              <PatientsOverview />
            </div>
          </TabContent>

          {/* Financial Reports Tab */}
          <TabContent id="financial-reports" activeTab={activeTab} className="space-y-4">
            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Revenue</h3>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold mb-1">KES 1,245,890</div>
                <div className="flex items-center text-xs bg-white bg-opacity-20 rounded-full px-2 py-0.5 w-fit">
                  <span className="mr-1">+12.5%</span>
                  <span>this month</span>
                </div>
              </div>

              <div className="bg-red-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Expenses</h3>
                  <BarChart className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold mb-1">KES 876,450</div>
                <div className="flex items-center text-xs bg-white bg-opacity-20 rounded-full px-2 py-0.5 w-fit">
                  <span className="mr-1">+5.2%</span>
                  <span>this month</span>
                </div>
              </div>

              <div className="bg-blue-500 rounded-lg p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Net Profit</h3>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold mb-1">KES 369,440</div>
                <div className="flex items-center text-xs bg-white bg-opacity-20 rounded-full px-2 py-0.5 w-fit">
                  <span className="mr-1">29.7%</span>
                  <span>profit margin</span>
                </div>
              </div>
            </div>

            {/* Revenue by Department */}
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Revenue by Department</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Outpatient Services</span>
                    </div>
                    <span className="text-sm font-medium">KES 485,230</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '39%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Laboratory</span>
                    </div>
                    <span className="text-sm font-medium">KES 312,450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Pharmacy</span>
                    </div>
                    <span className="text-sm font-medium">KES 298,760</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm text-gray-600">Radiology</span>
                    </div>
                    <span className="text-sm font-medium">KES 149,450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </TabContent>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
