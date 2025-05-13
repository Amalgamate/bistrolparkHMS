import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { useLab, LabTest, LabTestCategory } from '../../../context/LabContext';

const LabTestPrices: React.FC = () => {
  const { labTests, addLabTest, updateLabTest, deleteLabTest } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<LabTestCategory | 'all'>('all');
  const [filteredTests, setFilteredTests] = useState(labTests);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<LabTest | null>(null);
  
  // Form state for new/edit test
  const [formData, setFormData] = useState({
    name: '',
    category: 'hematology' as LabTestCategory,
    price: 0,
    turnaroundTime: 0,
    requiresFasting: false,
    sampleType: '',
    active: true
  });

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = labTests;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(test => 
        test.name.toLowerCase().includes(query) ||
        test.category.toLowerCase().includes(query) ||
        test.sampleType.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(test => test.category === categoryFilter);
    }

    setFilteredTests(filtered);
  }, [labTests, searchQuery, categoryFilter]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle add new test
  const handleAddTest = () => {
    addLabTest(formData);
    setIsAddDialogOpen(false);
    resetForm();
  };

  // Handle edit test
  const handleEditTest = () => {
    if (currentTest) {
      updateLabTest(currentTest.id, formData);
      setIsEditDialogOpen(false);
      setCurrentTest(null);
      resetForm();
    }
  };

  // Handle delete test
  const handleDeleteTest = (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      deleteLabTest(id);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'hematology',
      price: 0,
      turnaroundTime: 0,
      requiresFasting: false,
      sampleType: '',
      active: true
    });
  };

  // Open edit dialog
  const openEditDialog = (test: LabTest) => {
    setCurrentTest(test);
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price,
      turnaroundTime: test.turnaroundTime,
      requiresFasting: test.requiresFasting,
      sampleType: test.sampleType,
      active: test.active
    });
    setIsEditDialogOpen(true);
  };

  // Format category for display
  const formatCategory = (category: LabTestCategory) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Lab Test Prices</CardTitle>
            <CardDescription>Manage laboratory test prices and details</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lab Test</DialogTitle>
                <DialogDescription>
                  Enter the details for the new laboratory test.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Test Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange(value, 'category')}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hematology">Hematology</SelectItem>
                      <SelectItem value="biochemistry">Biochemistry</SelectItem>
                      <SelectItem value="microbiology">Microbiology</SelectItem>
                      <SelectItem value="immunology">Immunology</SelectItem>
                      <SelectItem value="urinalysis">Urinalysis</SelectItem>
                      <SelectItem value="imaging">Imaging</SelectItem>
                      <SelectItem value="pathology">Pathology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price (KES)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="turnaroundTime" className="text-right">
                    Turnaround Time (hours)
                  </Label>
                  <Input
                    id="turnaroundTime"
                    name="turnaroundTime"
                    type="number"
                    value={formData.turnaroundTime}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sampleType" className="text-right">
                    Sample Type
                  </Label>
                  <Input
                    id="sampleType"
                    name="sampleType"
                    value={formData.sampleType}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">
                    <Label htmlFor="requiresFasting">
                      Requires Fasting
                    </Label>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="requiresFasting"
                      checked={formData.requiresFasting}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(checked as boolean, 'requiresFasting')
                      }
                    />
                    <Label htmlFor="requiresFasting">
                      Patient must fast before test
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right">
                    <Label htmlFor="active">
                      Active
                    </Label>
                  </div>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange(checked as boolean, 'active')
                      }
                    />
                    <Label htmlFor="active">
                      Test is available for ordering
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTest}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search tests..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as LabTestCategory | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hematology">Hematology</SelectItem>
                <SelectItem value="biochemistry">Biochemistry</SelectItem>
                <SelectItem value="microbiology">Microbiology</SelectItem>
                <SelectItem value="immunology">Immunology</SelectItem>
                <SelectItem value="urinalysis">Urinalysis</SelectItem>
                <SelectItem value="imaging">Imaging</SelectItem>
                <SelectItem value="pathology">Pathology</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Lab Tests Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price (KES)</TableHead>
                <TableHead>Turnaround Time</TableHead>
                <TableHead>Sample Type</TableHead>
                <TableHead>Fasting Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No lab tests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredTests.map(test => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>{formatCategory(test.category)}</TableCell>
                    <TableCell>{test.price.toLocaleString()}</TableCell>
                    <TableCell>
                      {test.turnaroundTime} {test.turnaroundTime === 1 ? 'hour' : 'hours'}
                    </TableCell>
                    <TableCell>{test.sampleType}</TableCell>
                    <TableCell>
                      {test.requiresFasting ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Required
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Not Required
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {test.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditDialog(test)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteTest(test.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lab Test</DialogTitle>
            <DialogDescription>
              Update the details for this laboratory test.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Test Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange(value, 'category')}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hematology">Hematology</SelectItem>
                  <SelectItem value="biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="microbiology">Microbiology</SelectItem>
                  <SelectItem value="immunology">Immunology</SelectItem>
                  <SelectItem value="urinalysis">Urinalysis</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                  <SelectItem value="pathology">Pathology</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">
                Price (KES)
              </Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-turnaroundTime" className="text-right">
                Turnaround Time (hours)
              </Label>
              <Input
                id="edit-turnaroundTime"
                name="turnaroundTime"
                type="number"
                value={formData.turnaroundTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-sampleType" className="text-right">
                Sample Type
              </Label>
              <Input
                id="edit-sampleType"
                name="sampleType"
                value={formData.sampleType}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="edit-requiresFasting">
                  Requires Fasting
                </Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="edit-requiresFasting"
                  checked={formData.requiresFasting}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(checked as boolean, 'requiresFasting')
                  }
                />
                <Label htmlFor="edit-requiresFasting">
                  Patient must fast before test
                </Label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label htmlFor="edit-active">
                  Active
                </Label>
              </div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(checked as boolean, 'active')
                  }
                />
                <Label htmlFor="edit-active">
                  Test is available for ordering
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTest}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default LabTestPrices;
