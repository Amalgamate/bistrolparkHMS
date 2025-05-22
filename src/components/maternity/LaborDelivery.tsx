import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Bed,
  Plus,
  Search,
  User,
  Baby,
  Clock,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useMaternity } from '../../context/MaternityContext';

const LaborDelivery: React.FC = () => {
  const { 
    patients,
    getPatientsByStatus
  } = useMaternity();
  
  const [activeTab, setActiveTab] = useState('labor');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get patients in labor
  const patientsInLabor = getPatientsByStatus('labor');
  
  // Filter patients based on search term
  const filteredPatients = patientsInLabor.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Labor & Delivery</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Admit for Labor
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="labor">In Labor</TabsTrigger>
            <TabsTrigger value="delivery">Deliveries</TabsTrigger>
            <TabsTrigger value="rooms">Labor Rooms</TabsTrigger>
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
        </div>
      </div>
      
      <TabsContent value="labor" className="space-y-4 mt-0">
        {filteredPatients.length === 0 ? (
          <Card className="p-6 text-center">
            <Bed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No patients currently in labor.</p>
            <Button 
              variant="outline" 
              className="mt-4"
            >
              Admit Patient for Labor
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPatients.map(patient => (
              <Card key={patient.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">{patient.patientName}</h3>
                    <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                  </div>
                  <Badge variant="secondary">In Labor</Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span>{patient.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">G/P:</span>
                    <span>G{patient.gravida}P{patient.para}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gestational Age:</span>
                    <span>{patient.gestationalAge || 'Unknown'} weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Room:</span>
                    <span>{patient.assignedRoom || 'Not assigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Admitted:</span>
                    <span>
                      {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Record Progress</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="delivery" className="space-y-4 mt-0">
        <Card className="p-6 text-center">
          <Baby className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Delivery records will be implemented soon.</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="rooms" className="space-y-4 mt-0">
        <Card className="p-6 text-center">
          <Bed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Labor room management will be implemented soon.</p>
        </Card>
      </TabsContent>
    </div>
  );
};

export default LaborDelivery;
