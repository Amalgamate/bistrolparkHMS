import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  FileImage,
  Plus,
  Search,
  Filter,
  Clock,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useRadiology, RadiologyTest } from '../../context/RadiologyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

const RadiologyTests: React.FC = () => {
  const { 
    radiologyTests, 
    addRadiologyTest,
    updateRadiologyTest,
    deleteRadiologyTest,
    getRadiologyTestsByCategory
  } = useRadiology();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [selectedTest, setSelectedTest] = useState<RadiologyTest | null>(null);
  const [showTestDetailsDialog, setShowTestDetailsDialog] = useState(false);
  const [showAddTestDialog, setShowAddTestDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // New test form state
  const [newTest, setNewTest] = useState<Omit<RadiologyTest, 'id'>>({
    name: '',
    category: '',
    description: '',
    price: 0,
    preparationInstructions: '',
    duration: 30,
    active: true
  });
  
  // Get all unique categories
  const categories = [...new Set(radiologyTests.map(test => test.category))];
  
  // Filter tests based on search term and category
  const filteredTests = radiologyTests.filter(test => {
    const matchesSearch = 
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (test.description && test.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || test.category === filterCategory;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesCategory;
    } else if (activeTab === 'active') {
      return matchesSearch && matchesCategory && test.active;
    } else if (activeTab === 'inactive') {
      return matchesSearch && matchesCategory && !test.active;
    }
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort tests by category and name
  const sortedTests = [...filteredTests].sort((a, b) => {
    // First sort by category
    const categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
  
  // Handle viewing test details
  const handleViewTest = (test: RadiologyTest) => {
    setSelectedTest(test);
    setShowTestDetailsDialog(true);
  };
  
  // Handle adding a new test
  const handleAddTest = () => {
    addRadiologyTest(newTest);
    setShowAddTestDialog(false);
    setNewTest({
      name: '',
      category: '',
      description: '',
      price: 0,
      preparationInstructions: '',
      duration: 30,
      active: true
    });
  };
  
  // Handle updating a test
  const handleUpdateTest = () => {
    if (selectedTest) {
      updateRadiologyTest(selectedTest.id, selectedTest);
      setShowTestDetailsDialog(false);
    }
  };
  
  // Handle deleting a test
  const handleDeleteTest = () => {
    if (selectedTest) {
      deleteRadiologyTest(selectedTest.id);
      setShowDeleteConfirmDialog(false);
      setShowTestDetailsDialog(false);
    }
  };
  
  // Handle toggling test active status
  const handleToggleActive = (testId: string, active: boolean) => {
    updateRadiologyTest(testId, { active });
    
    // Update the selected test if it's the one being modified
    if (selectedTest && selectedTest.id === testId) {
      setSelectedTest({ ...selectedTest, active });
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Radiology Tests</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddTestDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Add New Test
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tests..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterCategory} onValueChange={(value: any) => setFilterCategory(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedTests.length === 0 ? (
            <Card className="p-6 text-center">
              <FileImage className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No radiology tests found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Test Name</div>
                <div>Category</div>
                <div>Duration</div>
                <div>Price</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedTests.map(test => (
                  <div key={test.id} className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{test.name}</div>
                    <div className="text-sm">{test.category}</div>
                    <div className="text-sm">{test.duration} min</div>
                    <div className="text-sm">{formatPrice(test.price)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          checked={test.active} 
                          onCheckedChange={(checked) => handleToggleActive(test.id, checked)}
                          id={`active-${test.id}`}
                        />
                        <Label htmlFor={`active-${test.id}`}>
                          {test.active ? 'Active' : 'Inactive'}
                        </Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewTest(test)}
                      >
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedTest(test);
                          setShowTestDetailsDialog(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Test Details Dialog */}
      <Dialog open={showTestDetailsDialog} onOpenChange={setShowTestDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Radiology Test Details</DialogTitle>
          </DialogHeader>
          
          {selectedTest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Test Name</Label>
                  <Input 
                    id="name" 
                    value={selectedTest.name} 
                    onChange={(e) => setSelectedTest({ ...selectedTest, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={selectedTest.category} 
                    onChange={(e) => setSelectedTest({ ...selectedTest, category: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KES)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={selectedTest.price} 
                    onChange={(e) => setSelectedTest({ ...selectedTest, price: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    value={selectedTest.duration} 
                    onChange={(e) => setSelectedTest({ ...selectedTest, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={selectedTest.description || ''} 
                  onChange={(e) => setSelectedTest({ ...selectedTest, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preparationInstructions">Preparation Instructions</Label>
                <Textarea 
                  id="preparationInstructions" 
                  value={selectedTest.preparationInstructions || ''} 
                  onChange={(e) => setSelectedTest({ ...selectedTest, preparationInstructions: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={selectedTest.active} 
                  onCheckedChange={(checked) => setSelectedTest({ ...selectedTest, active: checked })}
                  id="active"
                />
                <Label htmlFor="active">Active</Label>
              </div>
              
              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500"
                  onClick={() => setShowDeleteConfirmDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Test
                </Button>
                <Button variant="outline" onClick={() => setShowTestDetailsDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateTest}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add New Test Dialog */}
      <Dialog open={showAddTestDialog} onOpenChange={setShowAddTestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Radiology Test</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Test Name</Label>
                <Input 
                  id="new-name" 
                  value={newTest.name} 
                  onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                  placeholder="e.g., Chest X-Ray"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-category">Category</Label>
                <Select 
                  value={newTest.category} 
                  onValueChange={(value) => setNewTest({ ...newTest, category: value })}
                >
                  <SelectTrigger id="new-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                    <SelectItem value="new">+ Add New Category</SelectItem>
                  </SelectContent>
                </Select>
                {newTest.category === 'new' && (
                  <Input 
                    className="mt-2"
                    placeholder="Enter new category name"
                    onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-price">Price (KES)</Label>
                <Input 
                  id="new-price" 
                  type="number" 
                  value={newTest.price} 
                  onChange={(e) => setNewTest({ ...newTest, price: parseFloat(e.target.value) })}
                  placeholder="e.g., 2500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-duration">Duration (minutes)</Label>
                <Input 
                  id="new-duration" 
                  type="number" 
                  value={newTest.duration} 
                  onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) })}
                  placeholder="e.g., 30"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Textarea 
                id="new-description" 
                value={newTest.description || ''} 
                onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                placeholder="Brief description of the test"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-preparationInstructions">Preparation Instructions</Label>
              <Textarea 
                id="new-preparationInstructions" 
                value={newTest.preparationInstructions || ''} 
                onChange={(e) => setNewTest({ ...newTest, preparationInstructions: e.target.value })}
                placeholder="Instructions for patient preparation"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={newTest.active} 
                onCheckedChange={(checked) => setNewTest({ ...newTest, active: checked })}
                id="new-active"
              />
              <Label htmlFor="new-active">Active</Label>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddTestDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddTest}
                disabled={!newTest.name || !newTest.category || newTest.price <= 0}
              >
                Add Test
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 text-red-800 rounded-md">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <p>Are you sure you want to delete this test? This action cannot be undone.</p>
            </div>
            
            {selectedTest && (
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedTest.name}</p>
                <p className="text-sm text-gray-500">{selectedTest.category}</p>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirmDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteTest}>
                Delete Test
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RadiologyTests;
