import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { FlaskConical } from 'lucide-react';

const LabQueue: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Laboratory</CardTitle>
              <CardDescription>Manage lab tests and results</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Laboratory Module</h3>
            <p className="text-gray-500 mb-4">
              This module will be implemented next to manage lab tests, sample collection, and results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabQueue;
