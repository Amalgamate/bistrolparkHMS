import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Activity,
  Stethoscope,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  ArrowUp,
  ArrowDown,
  Bell,
  CheckCircle2,
  XCircle,
  Ticket
} from 'lucide-react';
import { useClinical, QueueEntry, PatientStatus, Priority } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';
import { format, formatDistanceToNow } from 'date-fns';
import TokenDisplay from './TokenDisplay';
import TokenBoard from './TokenBoard';

interface ConsultationQueueProps {
  view: string;
  onChangeView: (view: string) => void;
  onSelectForVitals: (patientId: string) => void;
  onSelectForConsultation: (patientId: string) => void;
}

const ConsultationQueue: React.FC<ConsultationQueueProps> = ({
  view,
  onChangeView,
  onSelectForVitals,
  onSelectForConsultation
}) => {
  const { queue, updatePatientStatus, updatePriority, notifyPatient } = useClinical();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter queue based on view and search query
  const filteredQueue = queue.filter(entry => {
    // First filter by view
    const viewFilter =
      view === 'all' ? true :
      view === 'registered' ? entry.status === 'registered' :
      view === 'waiting_vitals' ? entry.status === 'waiting_vitals' :
      view === 'vitals_taken' ? entry.status === 'vitals_taken' :
      view === 'with_doctor' ? entry.status === 'with_doctor' :
      false;

    // Then filter by search query
    const searchFilter = searchQuery
      ? entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tokenNumber.toString().includes(searchQuery)
      : true;

    return viewFilter && searchFilter;
  });

  // Sort queue by priority and then by token number
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    // First sort by priority
    const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then sort by token number
    return a.tokenNumber - b.tokenNumber;
  });

  // Handle status change
  const handleStatusChange = (queueId: string, newStatus: PatientStatus) => {
    updatePatientStatus(queueId, newStatus);
    showToast('success', `Patient status updated to ${newStatus.replace('_', ' ')}`);
  };

  // Handle priority change
  const handlePriorityChange = (queueId: string, newPriority: Priority) => {
    updatePriority(queueId, newPriority);
    showToast('success', `Patient priority updated to ${newPriority}`);
  };

  // Handle patient notification
  const handleNotifyPatient = (queueId: string, patientName: string) => {
    notifyPatient(queueId, 'Your turn is coming up next. Please be ready.');
    showToast('info', `Notification sent to ${patientName}`);
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: PatientStatus) => {
    switch (status) {
      case 'registered':
        return 'default';
      case 'waiting_vitals':
        return 'warning';
      case 'vitals_taken':
        return 'success';
      case 'with_doctor':
        return 'secondary';
      case 'lab_ordered':
        return 'info';
      case 'lab_completed':
        return 'success';
      case 'pharmacy':
        return 'info';
      case 'admission':
        return 'secondary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: Priority) => {
    switch (priority) {
      case 'emergency':
        return 'destructive';
      case 'urgent':
        return 'warning';
      case 'normal':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  // Format status for display
  const formatStatus = (status: PatientStatus) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {/* Header with Search and Queue Filter */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Consultation Queue</h2>
          <p className="text-sm text-gray-600">Manage patient queue and workflow</p>
        </div>
        <div className="flex gap-4 items-center">
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

          <div className="flex items-center gap-2">
            <label htmlFor="queue-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Select Queue:
            </label>
            <select
              id="queue-filter"
              value={view}
              onChange={(e) => onChangeView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
            >
              <option value="all">All Patients</option>
              <option value="registered">Registered Only</option>
              <option value="waiting_vitals">Waiting for Vitals</option>
              <option value="vitals_taken">Ready for Doctor</option>
              <option value="with_doctor">With Doctor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Direct Table - No Card Wrapper */}
      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Token</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Wait Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
                    {sortedQueue.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No patients in queue
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedQueue.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800">
                              {entry.tokenNumber}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <div className="font-medium">{entry.patientName}</div>
                                <div className="text-xs text-gray-500">{entry.patientId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(entry.status)}>
                              {formatStatus(entry.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getPriorityBadgeVariant(entry.priority)}>
                              {entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span className="text-sm">
                                {formatDistanceToNow(new Date(entry.registeredAt), { addSuffix: true })}
                              </span>
                            </div>
                            {entry.estimatedWaitTime !== undefined && (
                              <div className="text-xs text-gray-500">
                                Est. wait: {entry.estimatedWaitTime} min
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {entry.status === 'registered' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStatusChange(entry.id, 'waiting_vitals')}
                                >
                                  Send to Vitals
                                </Button>
                              )}

                              {entry.status === 'waiting_vitals' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onSelectForVitals(entry.id)}
                                >
                                  <Activity className="h-4 w-4 mr-1" />
                                  Capture Vitals
                                </Button>
                              )}

                              {entry.status === 'vitals_taken' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onSelectForConsultation(entry.id)}
                                >
                                  <Stethoscope className="h-4 w-4 mr-1" />
                                  Start Consultation
                                </Button>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleNotifyPatient(entry.id, entry.patientName)}>
                                    <Bell className="h-4 w-4 mr-2" />
                                    Notify Patient
                                  </DropdownMenuItem>

                                  {entry.priority !== 'emergency' && (
                                    <DropdownMenuItem onClick={() => handlePriorityChange(entry.id, 'emergency')}>
                                      <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                                      Mark as Emergency
                                    </DropdownMenuItem>
                                  )}

                                  {entry.priority !== 'urgent' && entry.priority !== 'emergency' && (
                                    <DropdownMenuItem onClick={() => handlePriorityChange(entry.id, 'urgent')}>
                                      <ArrowUp className="h-4 w-4 mr-2 text-amber-500" />
                                      Increase Priority
                                    </DropdownMenuItem>
                                  )}

                                  {entry.priority !== 'normal' && (
                                    <DropdownMenuItem onClick={() => handlePriorityChange(entry.id, 'normal')}>
                                      <ArrowDown className="h-4 w-4 mr-2 text-gray-500" />
                                      Decrease Priority
                                    </DropdownMenuItem>
                                  )}

                                  <DropdownMenuItem onClick={() => handleStatusChange(entry.id, 'cancelled')}>
                                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                    Cancel Visit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ConsultationQueue;
