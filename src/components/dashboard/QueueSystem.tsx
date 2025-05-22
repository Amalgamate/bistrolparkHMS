import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  RefreshCw,
  Settings,
  ArrowRight,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../context/ToastContext';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';

// Types
interface QueueEntry {
  id: string;
  tokenNumber: number;
  patientName: string;
  patientId: string;
  department: string;
  priority: 'normal' | 'urgent' | 'emergency';
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'no-show';
  createdAt: string;
  estimatedWaitTime?: number;
  counterNumber?: number;
}

interface Department {
  id: string;
  name: string;
  description: string;
  counters: number[];
}

// Mock data
const initialDepartments: Department[] = [
  { id: 'reception', name: 'Reception', description: 'Front desk services', counters: [1, 2, 3] },
  { id: 'consultation', name: 'Consultation', description: 'Doctor consultations', counters: [4, 5, 6, 7] },
  { id: 'pharmacy', name: 'Pharmacy', description: 'Medication dispensing', counters: [8, 9] },
  { id: 'lab', name: 'Laboratory', description: 'Medical tests', counters: [10, 11] },
  { id: 'radiology', name: 'Radiology', description: 'Imaging services', counters: [12, 13] },
  { id: 'billing', name: 'Billing', description: 'Payment services', counters: [14, 15] },
];

const initialQueue: QueueEntry[] = [
  {
    id: '1',
    tokenNumber: 101,
    patientName: 'John Doe',
    patientId: 'P001',
    department: 'consultation',
    priority: 'normal',
    status: 'waiting',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    estimatedWaitTime: 15,
  },
  {
    id: '2',
    tokenNumber: 102,
    patientName: 'Jane Smith',
    patientId: 'P002',
    department: 'pharmacy',
    priority: 'normal',
    status: 'waiting',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    estimatedWaitTime: 10,
  },
  {
    id: '3',
    tokenNumber: 103,
    patientName: 'Robert Johnson',
    patientId: 'P003',
    department: 'lab',
    priority: 'urgent',
    status: 'waiting',
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    estimatedWaitTime: 5,
  },
  {
    id: '4',
    tokenNumber: 104,
    patientName: 'Emily Davis',
    patientId: 'P004',
    department: 'consultation',
    priority: 'emergency',
    status: 'called',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedWaitTime: 0,
    counterNumber: 4,
  },
  {
    id: '5',
    tokenNumber: 105,
    patientName: 'Michael Wilson',
    patientId: 'P005',
    department: 'reception',
    priority: 'normal',
    status: 'serving',
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
    counterNumber: 1,
  },
];

const QueueSystem: React.FC = () => {
  const [queue, setQueue] = useState<QueueEntry[]>(initialQueue);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [newTokenForm, setNewTokenForm] = useState({
    patientName: '',
    patientId: '',
    department: '',
    priority: 'normal' as 'normal' | 'urgent' | 'emergency',
  });
  const [currentlyServing, setCurrentlyServing] = useState<QueueEntry[]>([]);
  const [upNext, setUpNext] = useState<QueueEntry[]>([]);

  const { toast } = useToast();
  const { notifyTokenCalled } = useRealTimeNotification();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesisRef.current = new SpeechSynthesisUtterance();
      speechSynthesisRef.current.lang = 'en-US';
      speechSynthesisRef.current.rate = 0.9;
      speechSynthesisRef.current.pitch = 1;
    }

    // Initialize audio element
    audioRef.current = new Audio('/sounds/token-called.mp3');

    return () => {
      if (speechSynthesisRef.current && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Update currently serving and up next lists
  useEffect(() => {
    setCurrentlyServing(
      queue.filter(entry => entry.status === 'called' || entry.status === 'serving')
        .sort((a, b) => {
          // Sort by priority first
          const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;

          // Then by status (called before serving)
          if (a.status !== b.status) {
            return a.status === 'called' ? -1 : 1;
          }

          // Then by token number
          return a.tokenNumber - b.tokenNumber;
        })
    );

    setUpNext(
      queue.filter(entry => entry.status === 'waiting')
        .sort((a, b) => {
          // Sort by priority first
          const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
          const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (priorityDiff !== 0) return priorityDiff;

          // Then by token number
          return a.tokenNumber - b.tokenNumber;
        })
        .slice(0, 5)
    );
  }, [queue]);

  // Function to announce token
  const announceToken = (token: QueueEntry) => {
    if (!audioEnabled) return;

    const counterText = token.counterNumber ? ` to counter ${token.counterNumber}` : '';
    const departmentName = departments.find(d => d.id === token.department)?.name || token.department;
    const message = `Token number ${token.tokenNumber}, ${token.patientName}, please proceed to ${departmentName}${counterText}`;

    // Play chime sound
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Use speech synthesis for announcement
    if (speechSynthesisRef.current) {
      // Wait for chime to finish
      setTimeout(() => {
        if (speechSynthesisRef.current) {
          speechSynthesisRef.current.text = message;
          window.speechSynthesis.speak(speechSynthesisRef.current);
        }
      }, 1000);
    }
  };

  // Function to call next token
  const callNextToken = (departmentId: string, counterNumber: number) => {
    // Find next waiting token for this department
    const nextToken = queue.find(
      entry => entry.department === departmentId && entry.status === 'waiting'
    );

    if (!nextToken) {
      toast({
        title: "No waiting tokens",
        description: `No patients waiting for ${departments.find(d => d.id === departmentId)?.name}`,
        variant: "default",
      });
      return;
    }

    // Update token status
    const updatedQueue = queue.map(entry => {
      if (entry.id === nextToken.id) {
        return {
          ...entry,
          status: 'called',
          counterNumber,
        };
      }
      return entry;
    });

    setQueue(updatedQueue);

    // Announce token
    announceToken({
      ...nextToken,
      status: 'called',
      counterNumber,
    });

    // Send notification
    notifyTokenCalled(
      nextToken.patientId,
      nextToken.patientName,
      nextToken.tokenNumber,
      `${departments.find(d => d.id === departmentId)?.name} Counter ${counterNumber}`
    );

    toast({
      title: "Token Called",
      description: `Token #${nextToken.tokenNumber} called to counter ${counterNumber}`,
      variant: "default",
    });
  };

  // Function to add new token
  const addNewToken = () => {
    if (!newTokenForm.patientName || !newTokenForm.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate token number
    const lastToken = queue.length > 0
      ? Math.max(...queue.map(entry => entry.tokenNumber))
      : 100;

    const newToken: QueueEntry = {
      id: Date.now().toString(),
      tokenNumber: lastToken + 1,
      patientName: newTokenForm.patientName,
      patientId: newTokenForm.patientId || `P${Date.now().toString().slice(-6)}`,
      department: newTokenForm.department,
      priority: newTokenForm.priority,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      estimatedWaitTime: newTokenForm.priority === 'emergency' ? 0 :
                        newTokenForm.priority === 'urgent' ? 10 : 20,
    };

    setQueue([...queue, newToken]);

    // Reset form
    setNewTokenForm({
      patientName: '',
      patientId: '',
      department: '',
      priority: 'normal',
    });

    toast({
      title: "Token Created",
      description: `Token #${newToken.tokenNumber} created for ${newToken.patientName}`,
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-white">Token Queue System</h2>
          <Badge variant="outline" className="bg-black text-white border-gray-700">
            {queue.filter(t => t.status === 'waiting').length} Waiting
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
            {audioEnabled ? 'Audio On' : 'Audio Off'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Now Serving */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Now Serving</h3>
            </div>
            <div className="p-4 space-y-3">
              {currentlyServing.length > 0 ? (
                currentlyServing.map(token => (
                  <div
                    key={token.id}
                    className={`
                      rounded-lg border-l-4 p-4 shadow-sm transition-all duration-300
                      ${token.priority === 'emergency' ? 'border-red-500 bg-red-900/20' :
                        token.priority === 'urgent' ? 'border-amber-500 bg-amber-900/20' :
                        'border-green-500 bg-green-900/20'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-white">{token.tokenNumber}</span>
                          {token.priority === 'emergency' && (
                            <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-300 mt-1">{token.patientName}</h3>
                        <div className="mt-1 text-xs text-gray-400">
                          {departments.find(d => d.id === token.department)?.name} - Counter {token.counterNumber}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${token.status === 'called' ? 'bg-blue-900/50 text-blue-300' : 'bg-green-900/50 text-green-300'}
                        `}>
                          {token.status === 'called' ? 'Called' : 'Serving'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 text-xs"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tokens currently being served</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Middle column - Up Next */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Up Next</h3>
            </div>
            <div className="p-4 space-y-3">
              {upNext.length > 0 ? (
                upNext.map(token => (
                  <div
                    key={token.id}
                    className={`
                      rounded-lg border-l-4 p-4 shadow-sm transition-all duration-300
                      ${token.priority === 'emergency' ? 'border-red-500 bg-red-900/20' :
                        token.priority === 'urgent' ? 'border-amber-500 bg-amber-900/20' :
                        'border-green-500 bg-green-900/20'}
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-white">{token.tokenNumber}</span>
                          {token.priority === 'emergency' && (
                            <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-gray-300 mt-1">{token.patientName}</h3>
                        <div className="mt-1 text-xs text-gray-400">
                          {departments.find(d => d.id === token.department)?.name}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                          Waiting
                        </span>

                        {token.estimatedWaitTime !== undefined && (
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>~{token.estimatedWaitTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center"
                        onClick={() => callNextToken(token.department, departments.find(d => d.id === token.department)?.counters[0] || 1)}
                      >
                        Call Token
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tokens in queue</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right column - Add New Token */}
        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Add New Token</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName" className="text-gray-300">Patient Name</Label>
                <Input
                  id="patientName"
                  placeholder="Enter patient name"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTokenForm.patientName}
                  onChange={(e) => setNewTokenForm({...newTokenForm, patientName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientId" className="text-gray-300">Patient ID (Optional)</Label>
                <Input
                  id="patientId"
                  placeholder="Enter patient ID"
                  className="bg-gray-800 border-gray-700 text-white"
                  value={newTokenForm.patientId}
                  onChange={(e) => setNewTokenForm({...newTokenForm, patientId: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-300">Department</Label>
                <Select
                  value={newTokenForm.department}
                  onValueChange={(value) => setNewTokenForm({...newTokenForm, department: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                <Select
                  value={newTokenForm.priority}
                  onValueChange={(value: 'normal' | 'urgent' | 'emergency') =>
                    setNewTokenForm({...newTokenForm, priority: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                onClick={addNewToken}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Token
              </Button>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">Call by Department</h3>
            </div>
            <div className="p-4 space-y-3">
              {departments.map(dept => (
                <div key={dept.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-white">{dept.name}</h4>
                    <p className="text-xs text-gray-400">
                      {queue.filter(t => t.department === dept.id && t.status === 'waiting').length} waiting
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {dept.counters.slice(0, 3).map(counter => (
                      <Button
                        key={counter}
                        size="sm"
                        variant="outline"
                        className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600 text-xs"
                        onClick={() => callNextToken(dept.id, counter)}
                      >
                        Counter {counter}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QueueSystem;
