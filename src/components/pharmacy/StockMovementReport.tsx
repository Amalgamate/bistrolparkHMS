import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { usePharmacy } from '../../context/PharmacyContext';
import { ArrowLeft, Download, Search, Calendar, ArrowUpDown } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { Badge } from '../ui/badge';

const StockMovementReport: React.FC = () => {
  const { showToast } = useToast();
  const { getStockMovementSummary } = usePharmacy();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [sortField, setSortField] = useState<string>('medicationName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get stock movement summary
  const stockMovementSummary = getStockMovementSummary(startDate, endDate);

  // Filter items based on search query
  const filteredItems = stockMovementSummary.filter(item => 
    item.medicationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'medicationName':
        comparison = a.medicationName.localeCompare(b.medicationName);
        break;
      case 'openingBalance':
        comparison = a.openingBalance - b.openingBalance;
        break;
      case 'received':
        comparison = a.received - b.received;
        break;
      case 'dispensed':
        comparison = a.dispensed - b.dispensed;
        break;
      case 'adjusted':
        comparison = a.adjusted - b.adjusted;
        break;
      case 'transferred':
        comparison = a.transferred - b.transferred;
        break;
      case 'closingBalance':
        comparison = a.closingBalance - b.closingBalance;
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle export
  const handleExport = () => {
    try {
      // Create CSV content
      const headers = ['Medication', 'Opening Balance', 'Received', 'Dispensed', 'Adjusted', 'Transferred', 'Closing Balance'];
      const rows = sortedItems.map(item => [
        item.medicationName,
        item.openingBalance.toString(),
        item.received.toString(),
        item.dispensed.toString(),
        item.adjusted.toString(),
        item.transferred.toString(),
        item.closingBalance.toString()
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `stock-movement-${startDate}-to-${endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('success', 'Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      showToast('error', 'Failed to export report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/pharmacy')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleExport}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Stock Movement Summary</CardTitle>
          <CardDescription>
            View stock movement summary for all medications
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">Start Date</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium mb-1">End Date</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
            
            <div className="relative w-full md:w-64">
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
          
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('medicationName')}
                  >
                    <div className="flex items-center gap-1">
                      Medication
                      {sortField === 'medicationName' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('openingBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Opening Balance
                      {sortField === 'openingBalance' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('received')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Received
                      {sortField === 'received' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('dispensed')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Dispensed
                      {sortField === 'dispensed' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('adjusted')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Adjusted
                      {sortField === 'adjusted' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('transferred')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Transferred
                      {sortField === 'transferred' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('closingBalance')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Closing Balance
                      {sortField === 'closingBalance' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No stock movements found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map(item => (
                    <TableRow key={item.medicationId}>
                      <TableCell>{item.medicationName}</TableCell>
                      <TableCell className="text-right">{item.openingBalance}</TableCell>
                      <TableCell className="text-right">{item.received}</TableCell>
                      <TableCell className="text-right">{item.dispensed}</TableCell>
                      <TableCell className="text-right">{item.adjusted}</TableCell>
                      <TableCell className="text-right">{item.transferred}</TableCell>
                      <TableCell className="text-right">{item.closingBalance}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-lg font-medium">{sortedItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date Range</p>
                <p className="text-lg font-medium">
                  {format(new Date(startDate), 'MMM d, yyyy')} - {format(new Date(endDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Dispensed</p>
                <p className="text-lg font-medium">
                  {sortedItems.reduce((sum, item) => sum + item.dispensed, 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/pharmacy')}
          >
            Back
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StockMovementReport;
