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

interface LabReferralsReportProps {
  branch: string;
}

const LabReferralsReport: React.FC<LabReferralsReportProps> = ({ branch }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Lab Referrals Report</CardTitle>
            <CardDescription>Track and analyze lab test referrals</CardDescription>
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
          <h3 className="text-lg font-medium text-gray-700 mb-2">Lab Referrals Report</h3>
          <p className="text-gray-500 mb-4">
            This report will show detailed information about lab test referrals.
          </p>
          <p className="text-gray-500">
            Track referrals by doctor, facility, and test type.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabReferralsReport;
