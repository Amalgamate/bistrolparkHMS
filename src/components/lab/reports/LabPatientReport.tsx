import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../ui/card';
import { Button } from '../../ui/button';
import { FileText, Download, Printer } from 'lucide-react';

interface LabPatientReportProps {
  branch: string;
}

const LabPatientReport: React.FC<LabPatientReportProps> = ({ branch }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Lab Visit Report (Per Patient)</CardTitle>
            <CardDescription>View lab test history for individual patients</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">Patient Lab Report</h3>
          <p className="text-gray-500 mb-4">
            This report will show detailed lab test history for individual patients.
          </p>
          <p className="text-gray-500">
            Select a patient to view their complete lab test history.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabPatientReport;
