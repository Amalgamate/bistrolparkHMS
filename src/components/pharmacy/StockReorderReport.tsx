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
import { ArrowLeft, Download, Search, AlertTriangle, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';

const StockReorderReport: React.FC = () => {
  const { showToast } = useToast();
  const { getStockReorderReport } = usePharmacy();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Get stock reorder report
  const stockReorderReport = getStockReorderReport();

  // Filter items based on search query
  const filteredItems = stockReorderReport.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'genericName':
        comparison = a.genericName.localeCompare(b.genericName);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'quantity':
        comparison = a.quantity - b.quantity;
        break;
      case 'reorderLevel':
        comparison = a.reorderLevel - b.reorderLevel;
        break;
      case 'deficit':
        comparison = (a.reorderLevel - a.quantity) - (b.reorderLevel - b.quantity);
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
      const headers = ['Medication', 'Generic Name', 'Category', 'Current Stock', 'Reorder Level', 'Deficit', 'Unit Price'];
      const rows = sortedItems.map(item => [
        item.name,
        item.genericName,
        item.category,
        item.quantity.toString(),
        item.reorderLevel.toString(),
        (item.reorderLevel - item.quantity).toString(),
        item.unitPrice.toString()
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
      link.setAttribute('download', `stock-reorder-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
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

  // Calculate total estimated cost
  const totalEstimatedCost = sortedItems.reduce((sum, item) => {
    const deficit = item.reorderLevel - item.quantity;
    return sum + (deficit > 0 ? deficit * item.unitPrice : 0);
  }, 0);

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
              <CardTitle className="text-2xl">Stock Reorder Report</CardTitle>
              <CardDescription>
                Medications that need to be reordered
              </CardDescription>
            </div>
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {sortedItems.length} Items Below Reorder Level
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Report Date: <span className="font-medium">{format(new Date(), 'PPP')}</span>
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
                    onClick={() => handleSort('genericName')}
                  >
                    <div className="flex items-center gap-1">
                      Generic Name
                      {sortField === 'genericName' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {sortField === 'category' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Current Stock
                      {sortField === 'quantity' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('reorderLevel')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Reorder Level
                      {sortField === 'reorderLevel' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer"
                    onClick={() => handleSort('deficit')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Deficit
                      {sortField === 'deficit' && (
                        <ArrowUpDown className={`h-3 w-3 ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Estimated Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No medications below reorder level
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedItems.map(item => {
                    const deficit = item.reorderLevel - item.quantity;
                    const estimatedCost = deficit > 0 ? deficit * item.unitPrice : 0;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.genericName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">
                          <span className={item.quantity === 0 ? 'text-red-500 font-medium' : ''}>
                            {item.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">{item.reorderLevel}</TableCell>
                        <TableCell className="text-right text-red-500 font-medium">{deficit}</TableCell>
                        <TableCell className="text-right">${estimatedCost.toFixed(2)}</TableCell>
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
                <p className="text-sm text-gray-500">Total Items</p>
                <p className="text-lg font-medium">{sortedItems.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Critical Items (Stock = 0)</p>
                <p className="text-lg font-medium text-red-500">
                  {sortedItems.filter(item => item.quantity === 0).length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Estimated Cost</p>
                <p className="text-lg font-medium">${totalEstimatedCost.toFixed(2)}</p>
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

export default StockReorderReport;
