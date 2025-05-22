import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../context/ToastContext';
import { usePharmacy, StockTake } from '../../context/PharmacyContext';
import { ArrowLeft, Save, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

const StockTakeEntryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { getStockTake, updateStockTake, medicationInventory } = usePharmacy();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockTake, setStockTake] = useState<StockTake | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actualCounts, setActualCounts] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Load stock take data
  useEffect(() => {
    if (id) {
      const stockTakeData = getStockTake(id);
      if (stockTakeData) {
        setStockTake(stockTakeData);
        
        // Initialize actual counts with expected quantities
        const counts: Record<string, number> = {};
        stockTakeData.items.forEach(item => {
          counts[item.medicationId] = item.actualQuantity || item.expectedQuantity;
        });
        setActualCounts(counts);
      } else {
        showToast('error', 'Stock take not found');
        navigate('/pharmacy/stock-take');
      }
    } else {
      showToast('error', 'No stock take ID provided');
      navigate('/pharmacy/stock-take');
    }
  }, [id, getStockTake, navigate, showToast]);

  // Handle count change
  const handleCountChange = (medicationId: string, value: string) => {
    const count = parseInt(value) || 0;
    setActualCounts(prev => ({
      ...prev,
      [medicationId]: count
    }));
    setHasChanges(true);
  };

  // Calculate discrepancy
  const calculateDiscrepancy = (medicationId: string, expectedQuantity: number) => {
    const actualQuantity = actualCounts[medicationId] || 0;
    return actualQuantity - expectedQuantity;
  };

  // Filter items based on search query
  const filteredItems = stockTake?.items.filter(item => 
    item.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Handle form submission
  const handleSubmit = () => {
    if (!stockTake) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate discrepancies and update items
      const updatedItems = stockTake.items.map(item => ({
        ...item,
        actualQuantity: actualCounts[item.medicationId] || 0,
        discrepancy: calculateDiscrepancy(item.medicationId, item.expectedQuantity)
      }));
      
      // Update stock take
      updateStockTake(stockTake.id, {
        items: updatedItems,
        status: 'in_progress'
      });
      
      showToast('success', 'Stock take entries saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('Error updating stock take:', error);
      showToast('error', 'Failed to save stock take entries');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle completion
  const handleComplete = () => {
    if (!stockTake) return;
    
    setIsSubmitting(true);
    
    try {
      // Calculate discrepancies and update items
      const updatedItems = stockTake.items.map(item => ({
        ...item,
        actualQuantity: actualCounts[item.medicationId] || 0,
        discrepancy: calculateDiscrepancy(item.medicationId, item.expectedQuantity)
      }));
      
      // Update stock take
      updateStockTake(stockTake.id, {
        items: updatedItems,
        status: 'completed',
        endDate: new Date().toISOString()
      });
      
      showToast('success', 'Stock take completed successfully');
      navigate('/pharmacy/stock-take');
    } catch (error) {
      console.error('Error completing stock take:', error);
      showToast('error', 'Failed to complete stock take');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stockTake) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading stock take data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/pharmacy/stock-take')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stock Take
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{stockTake.name}</CardTitle>
              <CardDescription>
                Started on {format(new Date(stockTake.startDate), 'PPP')} by {stockTake.conductedBy}
              </CardDescription>
            </div>
            <Badge 
              variant={
                stockTake.status === 'completed' ? 'success' : 
                stockTake.status === 'in_progress' ? 'warning' : 'default'
              }
            >
              {stockTake.status === 'completed' ? 'Completed' : 
               stockTake.status === 'in_progress' ? 'In Progress' : 'Pending'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Location: <span className="font-medium">{stockTake.location}</span>
              </p>
              <p className="text-sm text-gray-500">
                Branch: <span className="font-medium">{stockTake.branch}</span>
              </p>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead className="text-right">Expected</TableHead>
                  <TableHead className="text-right">Actual Count</TableHead>
                  <TableHead className="text-right">Discrepancy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No medications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map(item => {
                    const discrepancy = calculateDiscrepancy(item.medicationId, item.expectedQuantity);
                    return (
                      <TableRow key={item.medicationId}>
                        <TableCell>{item.medicationName}</TableCell>
                        <TableCell className="text-right">{item.expectedQuantity}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="0"
                            value={actualCounts[item.medicationId] || 0}
                            onChange={(e) => handleCountChange(item.medicationId, e.target.value)}
                            className="w-24 ml-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={
                            discrepancy < 0 ? 'text-red-500' : 
                            discrepancy > 0 ? 'text-green-500' : 'text-gray-500'
                          }>
                            {discrepancy > 0 ? `+${discrepancy}` : discrepancy}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          {stockTake.notes && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{stockTake.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/pharmacy/stock-take')}
          >
            Cancel
          </Button>
          
          <div className="space-x-2">
            <Button 
              type="button"
              variant="outline"
              disabled={isSubmitting || !hasChanges}
              className="flex items-center gap-2"
              onClick={handleSubmit}
            >
              <Save className="h-4 w-4" />
              Save Progress
            </Button>
            
            <Button 
              type="button"
              disabled={isSubmitting || stockTake.status === 'completed'}
              className="flex items-center gap-2"
              onClick={handleComplete}
            >
              <CheckCircle className="h-4 w-4" />
              Complete Stock Take
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StockTakeEntryForm;
