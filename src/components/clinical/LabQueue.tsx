import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import {
  FlaskConical,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Beaker
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useClinical } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';
import { format } from 'date-fns';

const LabQueue: React.FC = () => {
  const { queue, getQueueByStatus } = useClinical();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [activeTab, setActiveTab] = useState('queue');

  // Get patients with lab orders
  const labOrderedPatients = getQueueByStatus('lab_ordered');

  // Apply search filter
  const filteredPatients = labOrderedPatients.filter(patient =>
    patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.tokenNumber.toString().includes(searchQuery)
  );

  // Handle refresh
  const handleRefresh = () => {
    showToast({
      title: "Refreshed",
      description: "Lab queue has been refreshed",
      variant: "default"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Laboratory</CardTitle>
              <CardDescription>Manage lab tests and results</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                    All Tests
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('in_progress')}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('completed')}>
                    Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="queue">Test Queue</TabsTrigger>
              <TabsTrigger value="samples">Sample Collection</TabsTrigger>
              <TabsTrigger value="results">Results Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="queue">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12">
                  <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Lab Tests</h3>
                  <p className="text-gray-500 mb-4">
                    There are no lab tests matching your filters.
                  </p>
                </div>
              ) : (
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Token</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Tests</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ordered At</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id}>
                          <TableCell className="font-medium">{patient.tokenNumber}</TableCell>
                          <TableCell>{patient.patientName}</TableCell>
                          <TableCell>{patient.doctor || 'Not assigned'}</TableCell>
                          <TableCell>{patient.labTests?.length || 0} tests</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {patient.lastUpdatedAt ? format(new Date(patient.lastUpdatedAt), 'MMM d, h:mm a') : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                showToast({
                                  title: "Lab Tests",
                                  description: `Viewing tests for ${patient.patientName}`,
                                  variant: "default"
                                });
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              View Tests
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="samples">
              <div className="text-center py-12">
                <Beaker className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Sample Collection</h3>
                <p className="text-gray-500 mb-4">
                  Manage sample collection for lab tests.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="results">
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Results Entry</h3>
                <p className="text-gray-500 mb-4">
                  Enter and manage lab test results.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LabQueue;
