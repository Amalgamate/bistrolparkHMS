import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  User,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  Heart,
  Baby,
  Bed,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useMaternity, PregnancyStatus } from '../../context/MaternityContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { format, differenceInWeeks, addWeeks } from 'date-fns';

const MaternityPatients: React.FC = () => {
  const { 
    patients
  } = useMaternity();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PregnancyStatus | 'all'>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter patients based on search term and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || patient.pregnancyStatus === filterStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort patients by name
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    return a.patientName.localeCompare(b.patientName);
  });
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status badge
  const getStatusBadge = (status: PregnancyStatus) => {
    const statusConfig: Record<PregnancyStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      prenatal: { label: 'Prenatal', variant: 'outline' },
      labor: { label: 'In Labor', variant: 'secondary' },
      delivered: { label: 'Delivered', variant: 'default' },
      postpartum: { label: 'Postpartum', variant: 'secondary' },
      discharged: { label: 'Discharged', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get status icon
  const getStatusIcon = (status: PregnancyStatus) => {
    const icons = {
      prenatal: <Calendar className="h-4 w-4 text-blue-500" />,
      labor: <Bed className="h-4 w-4 text-amber-500" />,
      delivered: <Baby className="h-4 w-4 text-green-500" />,
      postpartum: <Heart className="h-4 w-4 text-pink-500" />,
      discharged: <CheckCircle className="h-4 w-4 text-gray-500" />
    };
    
    return icons[status];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Maternity Patients</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Register New Patient
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="discharged">Discharged</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="prenatal">Prenatal</SelectItem>
              <SelectItem value="labor">In Labor</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="postpartum">Postpartum</SelectItem>
              <SelectItem value="discharged">Discharged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <TabsContent value={activeTab} className="space-y-4 mt-0">
        {sortedPatients.length === 0 ? (
          <Card className="p-6 text-center">
            <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No patients found matching your criteria.</p>
          </Card>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
              <div>Patient Name</div>
              <div>ID</div>
              <div>Age</div>
              <div>G/P</div>
              <div>EDD</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {sortedPatients.map(patient => (
                <div key={patient.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="font-medium flex items-center gap-2">
                    {getStatusIcon(patient.pregnancyStatus)}
                    {patient.patientName}
                  </div>
                  <div className="text-sm">{patient.patientId}</div>
                  <div className="text-sm">{patient.age} years</div>
                  <div className="text-sm">G{patient.gravida}P{patient.para}</div>
                  <div className="text-sm">
                    {patient.edd ? formatDate(patient.edd) : 'Not recorded'}
                  </div>
                  <div>{getStatusBadge(patient.pregnancyStatus)}</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      View
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                    >
                      {patient.pregnancyStatus === 'prenatal' ? 'Add Visit' : 
                       patient.pregnancyStatus === 'labor' ? 'Record Progress' :
                       patient.pregnancyStatus === 'delivered' ? 'Postpartum Care' :
                       patient.pregnancyStatus === 'postpartum' ? 'Checkup' : 'View History'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default MaternityPatients;
