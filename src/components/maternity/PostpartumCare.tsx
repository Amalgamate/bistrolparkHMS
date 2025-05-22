import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Heart,
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useMaternity } from '../../context/MaternityContext';
import { format, differenceInDays } from 'date-fns';

const PostpartumCare: React.FC = () => {
  const { 
    patients,
    getPatientsByStatus
  } = useMaternity();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get postpartum patients
  const postpartumPatients = getPatientsByStatus('postpartum');
  
  // Filter patients based on search term
  const filteredPatients = postpartumPatients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Sort patients by delivery date (most recent first)
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    // This is a placeholder sort since we don't have delivery date in the patient object
    // In a real implementation, we would sort by the actual delivery date
    return 0;
  });
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Postpartum Care</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Record Checkup
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="today">Today's Checkups</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
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
      
      <TabsContent value={activeTab} className="space-y-4 mt-0">
        {sortedPatients.length === 0 ? (
          <Card className="p-6 text-center">
            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No postpartum patients found.</p>
          </Card>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 font-medium text-sm">
              <div>Patient Name</div>
              <div>ID</div>
              <div>Delivery Date</div>
              <div>Days Postpartum</div>
              <div>Last Checkup</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {sortedPatients.map(patient => (
                <div key={patient.id} className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="font-medium">{patient.patientName}</div>
                  <div className="text-sm">{patient.patientId}</div>
                  <div className="text-sm">
                    {/* Placeholder for delivery date */}
                    Not available
                  </div>
                  <div className="text-sm">
                    {/* Placeholder for days postpartum */}
                    Not available
                  </div>
                  <div className="text-sm">
                    {/* Placeholder for last checkup */}
                    Not available
                  </div>
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
                      Record Checkup
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="today" className="space-y-4 mt-0">
        <Card className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Today's checkups will be implemented soon.</p>
        </Card>
      </TabsContent>
      
      <TabsContent value="scheduled" className="space-y-4 mt-0">
        <Card className="p-6 text-center">
          <Clock className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Scheduled checkups will be implemented soon.</p>
        </Card>
      </TabsContent>
    </div>
  );
};

export default PostpartumCare;
