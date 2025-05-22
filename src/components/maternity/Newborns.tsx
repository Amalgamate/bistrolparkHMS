import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Baby,
  Plus,
  Search,
  Heart,
  AlertTriangle,
  CheckCircle,
  Stethoscope
} from 'lucide-react';
import { useMaternity, NewbornStatus } from '../../context/MaternityContext';
import { format, differenceInDays } from 'date-fns';

const Newborns: React.FC = () => {
  const { 
    newborns,
    getNewbornsByStatus
  } = useMaternity();
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter newborns based on search term and active tab
  const filteredNewborns = newborns.filter(newborn => {
    const matchesSearch = 
      (newborn.firstName && newborn.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (newborn.lastName && newborn.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      newborn.motherPatientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') {
      return matchesSearch;
    } else if (activeTab === 'healthy') {
      return matchesSearch && newborn.status === 'healthy';
    } else if (activeTab === 'observation') {
      return matchesSearch && newborn.status === 'observation';
    } else if (activeTab === 'nicu') {
      return matchesSearch && newborn.status === 'nicu';
    }
    
    return matchesSearch;
  });
  
  // Sort newborns by date of birth (newest first)
  const sortedNewborns = [...filteredNewborns].sort((a, b) => {
    return new Date(b.dateOfBirth).getTime() - new Date(a.dateOfBirth).getTime();
  });
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Calculate age in days
  const getAgeInDays = (dateOfBirth: string) => {
    return differenceInDays(new Date(), new Date(dateOfBirth));
  };
  
  // Get status badge
  const getStatusBadge = (status: NewbornStatus) => {
    const statusConfig: Record<NewbornStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      healthy: { label: 'Healthy', variant: 'default' },
      observation: { label: 'Observation', variant: 'secondary' },
      nicu: { label: 'NICU', variant: 'destructive' },
      deceased: { label: 'Deceased', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Newborns</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Newborn
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Newborns</TabsTrigger>
            <TabsTrigger value="healthy">Healthy</TabsTrigger>
            <TabsTrigger value="observation">Observation</TabsTrigger>
            <TabsTrigger value="nicu">NICU</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 ml-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search newborns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <TabsContent value={activeTab} className="space-y-4 mt-0">
        {sortedNewborns.length === 0 ? (
          <Card className="p-6 text-center">
            <Baby className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No newborns found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sortedNewborns.map(newborn => (
              <Card key={newborn.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium">
                      {newborn.firstName && newborn.lastName 
                        ? `${newborn.firstName} ${newborn.lastName}`
                        : `Baby (ID: ${newborn.id.substring(0, 6)})`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getAgeInDays(newborn.dateOfBirth)} days old • {newborn.gender.charAt(0).toUpperCase() + newborn.gender.slice(1)}
                    </p>
                  </div>
                  {getStatusBadge(newborn.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date of Birth:</span>
                    <span>{formatDate(newborn.dateOfBirth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time of Birth:</span>
                    <span>{newborn.timeOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Weight:</span>
                    <span>{newborn.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Length:</span>
                    <span>{newborn.length}cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">APGAR:</span>
                    <span>{newborn.apgarScores.oneMinute}/{newborn.apgarScores.fiveMinutes}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button size="sm">Record Checkup</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </div>
  );
};

export default Newborns;
