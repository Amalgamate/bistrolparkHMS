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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../context/ToastContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { ArrowLeft, Download, Search, AlertTriangle, Calendar, ArrowUpDown } from 'lucide-react';
import { format, differenceInDays, isBefore } from 'date-fns';
import { Badge } from '../ui/badge';

const MedicineExpiryReport: React.FC = () => {
  const { showToast } = useToast();
  const { getMedicineExpiryReport } = usePharmacy();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [monthsFilter, setMonthsFilter] = useState<number>(12);
  const [sortField, setSortField] = useState<string>('expiryDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get medicine expiry report
  const medicineExpiryReport = getMedicineExpiryReport(monthsFilter);

  // Filter items based on search query
  const filteredItems = medicineExpiryReport.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'batchNumber':
        comparison = a.batchNumber.localeCompare(b.batchNumber);
        break;
      case 'expiryDate':
        comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        break;
      case 'daysRemaining':
        const daysA = differenceInDays(new Date(a.expiryDate), new Date());
        const daysB = differenceInDays(new Date(b.expiryDate), new Date());
        comparison = daysA - daysB;
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
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
      const headers = ['Medication', 'Generic Name', 'Batch Number', 'Expiry Date', 'Days Remaining', 'Quantity', 'Unit Price', 'Total Value'];
      const rows = sortedItems.map(item => {
        const expiryDate = new Date(item.expiryDate);
        const daysRemaining = differenceInDays(expiryDate, new Date());
        const totalValue = item.quantity * item.unitPrice;
        
        return [
          item.name,
          item.genericName,
          item.batchNumber,
          format(expiryDate, 'yyyy-MM-dd'),
          daysRemaining.toString(),
          item.quantity.toString(),
          item.unitPrice.toString(),
          totalValue.toFixed(2)
        ];
      });
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `medicine-expiry-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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

  // Calculate total value of expiring medications
  const totalValue = sortedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

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
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Medicine Batch Expiry Report</CardTitle>
              <CardDescription>
                Medications expiring within the next {monthsFilter} months
              </CardDescription>
            </div>
            <Badge variant="warning" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {sortedItems.length} Expiring Items
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select
                  value={monthsFilter.toString()}
                  onValueChange={(value) => setMonthsFilter(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Next 1 month</SelectItem>
                    <SelectItem value="3">Next 3 months</SelectItem>
                    <SelectItem value="6">Next 6 months</SelectItem>
                    <SelectItem value="12">Next 12 months</SelectItem>
                    <SelectItem value="24">Next 24 months</SelectItem>
                  </SelectContent>
                </Select>
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
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Medication
                      {sortField === 'name' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('batchNumber')}
                  >
                    <div className="flex items-center gap-1">
                      Batch Number
                      {sortField === 'batchNumber' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('expiryDate')}
                  >
                    <div className="flex items-center gap-1">
                      Expiry Date
                      {sortField === 'expiryDate' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('daysRemaining')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Days Remaining
                      {sortField === 'daysRemaining' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Quantity
                      {sortField === 'quantity' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No medications expiring within the selected timeframe
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map(item => {
                    const expiryDate = new Date(item.expiryDate);
                    const daysRemaining = differenceInDays(expiryDate, new Date());
                    const isExpired = isBefore(expiryDate, new Date());
                    const totalValue = item.quantity * item.unitPrice;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.genericName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.batchNumber}</TableCell>
                        <TableCell>{format(expiryDate, 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                          <span className={
                            isExpired ? 'text-red-500 font-medium' : 
                            daysRemaining <= 30 ? 'text-amber-500 font-medium' : 
                            daysRemaining <= 90 ? 'text-yellow-500' : ''
                          }>
                            {isExpired ? 'Expired' : daysRemaining}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={
                            isExpired ? 'destructive' : 
                            daysRemaining <= 30 ? 'warning' : 
                            'outline'
                          }>
                            {isExpired ? 'Expired' : 
                             daysRemaining <= 30 ? 'Critical' : 
                             daysRemaining <= 90 ? 'Warning' : 'Upcoming'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium mb-2">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Expiring Items</p>
                <p className="text-lg font-medium">{sortedItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Already Expired</p>
                <p className="text-lg font-medium text-red-500">
                  {sortedItems.filter(item => isBefore(new Date(item.expiryDate), new Date())).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Value</p>
                <p className="text-lg font-medium">${totalValue.toFixed(2)}</p>
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
            variant="default"
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

export default MedicineExpiryReport;
