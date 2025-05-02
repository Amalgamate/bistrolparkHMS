import React, { useState } from 'react';
import { Calendar, Download, Printer, BarChart, PieChart, Users, FileText, Filter, RefreshCw } from 'lucide-react';

export const NewPatientReports: React.FC = () => {
  const [reportType, setReportType] = useState('registration');
  const [dateRange, setDateRange] = useState('this-month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Handle report generation
  const generateReport = () => {
    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 1500);
  };

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);

    // Set appropriate date values based on range
    const today = new Date();
    let start = new Date();
    let end = new Date();

    switch (range) {
      case 'today':
        start = today;
        end = today;
        break;
      case 'this-week':
        start = new Date(today.setDate(today.getDate() - today.getDay()));
        end = new Date();
        break;
      case 'this-month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date();
        break;
      case 'last-month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'this-year':
        start = new Date(today.getFullYear(), 0, 1);
        end = new Date();
        break;
      case 'custom':
        // Keep existing custom dates
        return;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-[#0100F6] mb-4">Generate Patient Report</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Type */}
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              >
                <option value="registration">Patient Registration</option>
                <option value="admission">Patient Admission</option>
                <option value="discharge">Patient Discharge</option>
                <option value="walkin">Walk-in Visits</option>
                <option value="demographics">Patient Demographics</option>
                <option value="diagnosis">Diagnosis Distribution</option>
              </select>
            </div>
          </div>

          {/* Date Range Selector */}
          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <>
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                />
              </div>
            </>
          )}

          {/* Additional Filters */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="department"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              >
                <option value="">All Departments</option>
                <option value="general">General Medicine</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">
              Output Format
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="format"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={generateReport}
            disabled={isGenerating}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0100F6] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] disabled:opacity-50 flex items-center"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BarChart className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Preview */}
      {reportGenerated && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-[#0100F6]">
              {getReportTitle(reportType)} - {getDateRangeText(dateRange, startDate, endDate)}
            </h3>
            <div className="flex space-x-2">
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] flex items-center"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] flex items-center"
              >
                <Printer className="h-4 w-4 mr-1" />
                Print
              </button>
            </div>
          </div>

          {/* Report Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 mr-3">
                  <Users className="h-5 w-5 text-[#0100F6]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Patients</p>
                  <p className="text-xl font-semibold text-[#0100F6]">{getReportSummary(reportType).total}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 mr-3">
                  <BarChart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{getReportSummary(reportType).secondaryLabel}</p>
                  <p className="text-xl font-semibold text-green-600">{getReportSummary(reportType).secondary}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 mr-3">
                  <PieChart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{getReportSummary(reportType).tertiaryLabel}</p>
                  <p className="text-xl font-semibold text-purple-600">{getReportSummary(reportType).tertiary}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Visualization */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Visualization</h4>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              {reportType === 'demographics' || reportType === 'diagnosis' ? (
                <div className="text-center">
                  <PieChart className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Distribution Chart</p>
                </div>
              ) : (
                <div className="text-center">
                  <BarChart className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Trend Analysis</p>
                </div>
              )}
            </div>
          </div>

          {/* Report Data Table */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Detailed Data</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {getReportColumns(reportType).map((column, index) => (
                      <th
                        key={index}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getReportData(reportType).map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getReportTitle = (reportType: string) => {
  switch (reportType) {
    case 'registration':
      return 'Patient Registration Report';
    case 'admission':
      return 'Patient Admission Report';
    case 'discharge':
      return 'Patient Discharge Report';
    case 'walkin':
      return 'Walk-in Visits Report';
    case 'demographics':
      return 'Patient Demographics Report';
    case 'diagnosis':
      return 'Diagnosis Distribution Report';
    default:
      return 'Patient Report';
  }
};

const getDateRangeText = (range: string, startDate: string, endDate: string) => {
  switch (range) {
    case 'today':
      return 'Today';
    case 'this-week':
      return 'This Week';
    case 'this-month':
      return 'This Month';
    case 'last-month':
      return 'Last Month';
    case 'this-year':
      return 'This Year';
    case 'custom':
      return `${startDate} to ${endDate}`;
    default:
      return '';
  }
};

const getReportSummary = (reportType: string) => {
  switch (reportType) {
    case 'registration':
      return {
        total: '245',
        secondaryLabel: 'New Patients',
        secondary: '78',
        tertiaryLabel: 'Average Age',
        tertiary: '42'
      };
    case 'admission':
      return {
        total: '120',
        secondaryLabel: 'Occupancy Rate',
        secondary: '85%',
        tertiaryLabel: 'Avg. Length of Stay',
        tertiary: '4.2 days'
      };
    case 'discharge':
      return {
        total: '98',
        secondaryLabel: 'Readmission Rate',
        secondary: '3.5%',
        tertiaryLabel: 'Avg. Length of Stay',
        tertiary: '3.8 days'
      };
    case 'walkin':
      return {
        total: '156',
        secondaryLabel: 'Conversion Rate',
        secondary: '22%',
        tertiaryLabel: 'Avg. Wait Time',
        tertiary: '24 min'
      };
    case 'demographics':
      return {
        total: '1,245',
        secondaryLabel: 'Gender Ratio (M:F)',
        secondary: '1:1.2',
        tertiaryLabel: 'Most Common Age',
        tertiary: '30-45'
      };
    case 'diagnosis':
      return {
        total: '320',
        secondaryLabel: 'Top Diagnosis',
        secondary: 'Hypertension',
        tertiaryLabel: 'Chronic Conditions',
        tertiary: '42%'
      };
    default:
      return {
        total: '0',
        secondaryLabel: 'Secondary',
        secondary: '0',
        tertiaryLabel: 'Tertiary',
        tertiary: '0'
      };
  }
};

const getReportColumns = (reportType: string) => {
  switch (reportType) {
    case 'registration':
      return ['Patient ID', 'Name', 'Age', 'Gender', 'Registration Date', 'Contact'];
    case 'admission':
      return ['Patient ID', 'Name', 'Admission Date', 'Room', 'Diagnosis', 'Doctor'];
    case 'discharge':
      return ['Patient ID', 'Name', 'Admission Date', 'Discharge Date', 'Length of Stay', 'Diagnosis'];
    case 'walkin':
      return ['Patient ID', 'Name', 'Visit Date', 'Purpose', 'Status', 'Wait Time'];
    case 'demographics':
      return ['Age Group', 'Male', 'Female', 'Other', 'Total', 'Percentage'];
    case 'diagnosis':
      return ['Diagnosis', 'Count', 'Percentage', 'Avg. Age', 'Gender Ratio', 'Trend'];
    default:
      return ['Column 1', 'Column 2', 'Column 3', 'Column 4', 'Column 5'];
  }
};

const getReportData = (reportType: string) => {
  switch (reportType) {
    case 'registration':
      return [
        ['BP10023456', 'David Kamau', '45', 'Male', '2024-06-10', '0712 345 678'],
        ['BP10023457', 'Faith Wanjiku', '32', 'Female', '2024-06-10', '0723 456 789'],
        ['BP10023458', 'Peter Omondi', '28', 'Male', '2024-06-11', '0734 567 890'],
        ['BP10023459', 'Esther Muthoni', '65', 'Female', '2024-06-11', '0745 678 901'],
        ['BP10023460', 'Richard Kimani', '52', 'Male', '2024-06-12', '0756 789 012']
      ];
    case 'admission':
      return [
        ['BP10023456', 'David Kamau', '2024-06-10', 'Executive 101', 'Myocardial Infarction', 'Dr. Mwangi'],
        ['BP10023457', 'Faith Wanjiku', '2024-06-10', 'Premium 205', 'Pneumonia', 'Dr. Akinyi'],
        ['BP10023458', 'Peter Omondi', '2024-06-11', 'Premium 210', 'Appendicitis', 'Dr. Kipchoge'],
        ['BP10023459', 'Esther Muthoni', '2024-06-11', 'Basic 315', 'Hypertension', 'Dr. Otieno'],
        ['BP10023460', 'Richard Kimani', '2024-06-12', 'Premium 208', 'Diabetes Mellitus', 'Dr. Njeri']
      ];
    case 'discharge':
      return [
        ['BP10023401', 'Agnes Wambui', '2024-06-01', '2024-06-05', '4 days', 'Pneumonia'],
        ['BP10023402', 'James Kariuki', '2024-06-02', '2024-06-07', '5 days', 'Cholecystitis'],
        ['BP10023403', 'Mary Atieno', '2024-06-03', '2024-06-06', '3 days', 'Cellulitis'],
        ['BP10023404', 'Daniel Kiprono', '2024-06-05', '2024-06-08', '3 days', 'Kidney Stones'],
        ['BP10023405', 'Lucy Wairimu', '2024-06-07', '2024-06-12', '5 days', 'Diverticulitis']
      ];
    case 'walkin':
      return [
        ['BP10023456', 'David Kamau', '2024-06-12', 'General Checkup', 'Completed', '15 min'],
        ['BP10023457', 'Faith Wanjiku', '2024-06-12', 'Follow-up', 'Completed', '20 min'],
        ['BP10023458', 'Peter Omondi', '2024-06-12', 'Lab Results', 'Completed', '10 min'],
        ['BP10023459', 'Esther Muthoni', '2024-06-12', 'Vaccination', 'No Show', 'N/A'],
        ['BP10023460', 'Richard Kimani', '2024-06-12', 'Prescription Refill', 'In Progress', '25 min']
      ];
    case 'demographics':
      return [
        ['0-18', '120', '135', '5', '260', '20.9%'],
        ['19-35', '145', '168', '7', '320', '25.7%'],
        ['36-50', '132', '154', '4', '290', '23.3%'],
        ['51-65', '98', '112', '3', '213', '17.1%'],
        ['65+', '72', '86', '4', '162', '13.0%']
      ];
    case 'diagnosis':
      return [
        ['Hypertension', '68', '21.3%', '58', '1:0.9', 'Stable'],
        ['Diabetes Mellitus', '52', '16.3%', '55', '1:1.1', 'Increasing'],
        ['Respiratory Infection', '45', '14.1%', '42', '1:1.3', 'Seasonal'],
        ['Musculoskeletal Pain', '38', '11.9%', '47', '1:1.5', 'Stable'],
        ['Anxiety/Depression', '32', '10.0%', '39', '1:2.1', 'Increasing']
      ];
    default:
      return [
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'],
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5'],
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5']
      ];
  }
};
