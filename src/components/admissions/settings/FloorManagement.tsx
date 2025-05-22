import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import {
  Building,
  MapPin,
  Bed,
  Plus,
  Edit,
  Save,
  X,
  Trash2
} from 'lucide-react';
import { ColoredIcon } from '../../ui/colored-icon';
import { useToast } from '../../../context/ToastContext';

interface WardLocation {
  id: string;
  branch: string;
  floors: string[];
}

interface FloorManagementProps {
  className?: string;
}

const FloorManagement: React.FC<FloorManagementProps> = ({ className }) => {
  const { showToast } = useToast();
  const [wardLocations, setWardLocations] = useState<WardLocation[]>([
    {
      id: '1',
      branch: 'Fedha',
      floors: ['1st floor']
    },
    {
      id: '2',
      branch: 'Utawala',
      floors: ['1st floor', '2nd floor']
    },
    {
      id: '3',
      branch: 'Tassia',
      floors: ['1st floor']
    },
    {
      id: '4',
      branch: 'Machakos',
      floors: ['2nd floor']
    },
    {
      id: '5',
      branch: 'Kitengela',
      floors: ['2nd floor', '3rd floor']
    }
  ]);

  const [editingLocation, setEditingLocation] = useState<WardLocation | null>(null);
  const [newLocation, setNewLocation] = useState<Partial<WardLocation> | null>(null);
  const [newFloor, setNewFloor] = useState<string>('');

  // Handle edit location
  const handleEditLocation = (location: WardLocation) => {
    setEditingLocation({ ...location });
  };

  // Handle update location
  const handleUpdateLocation = () => {
    if (!editingLocation) return;

    try {
      setWardLocations(
        wardLocations.map(loc => 
          loc.id === editingLocation.id ? editingLocation : loc
        )
      );
      showToast('success', `${editingLocation.branch} Branch updated successfully`);
      setEditingLocation(null);
    } catch (error) {
      console.error('Error updating location:', error);
      showToast('error', 'Failed to update branch location');
    }
  };

  // Handle add new location
  const handleAddLocation = () => {
    setNewLocation({
      branch: '',
      floors: []
    });
  };

  // Handle save new location
  const handleSaveNewLocation = () => {
    if (!newLocation || !newLocation.branch || !newLocation.floors?.length) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    try {
      const newLocationWithId: WardLocation = {
        id: Date.now().toString(),
        branch: newLocation.branch,
        floors: newLocation.floors
      };

      setWardLocations([...wardLocations, newLocationWithId]);
      showToast('success', `${newLocation.branch} Branch added successfully`);
      setNewLocation(null);
    } catch (error) {
      console.error('Error adding location:', error);
      showToast('error', 'Failed to add branch location');
    }
  };

  // Handle add floor to editing location
  const handleAddFloorToEditing = () => {
    if (!editingLocation || !newFloor) return;

    if (editingLocation.floors.includes(newFloor)) {
      showToast('error', 'This floor already exists for this branch');
      return;
    }

    setEditingLocation({
      ...editingLocation,
      floors: [...editingLocation.floors, newFloor]
    });
    setNewFloor('');
  };

  // Handle add floor to new location
  const handleAddFloorToNew = () => {
    if (!newLocation || !newFloor) return;

    if (newLocation.floors?.includes(newFloor)) {
      showToast('error', 'This floor already exists for this branch');
      return;
    }

    setNewLocation({
      ...newLocation,
      floors: [...(newLocation.floors || []), newFloor]
    });
    setNewFloor('');
  };

  // Handle remove floor from editing location
  const handleRemoveFloorFromEditing = (floor: string) => {
    if (!editingLocation) return;

    setEditingLocation({
      ...editingLocation,
      floors: editingLocation.floors.filter(f => f !== floor)
    });
  };

  // Handle remove floor from new location
  const handleRemoveFloorFromNew = (floor: string) => {
    if (!newLocation) return;

    setNewLocation({
      ...newLocation,
      floors: newLocation.floors?.filter(f => f !== floor) || []
    });
  };

  // Handle delete location
  const handleDeleteLocation = (id: string) => {
    try {
      setWardLocations(wardLocations.filter(loc => loc.id !== id));
      showToast('success', 'Branch location deleted successfully');
    } catch (error) {
      console.error('Error deleting location:', error);
      showToast('error', 'Failed to delete branch location');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-blue-700 flex items-center">
          <ColoredIcon icon={Building} color="blue" size="sm" variant="outline" className="mr-2" />
          Ward Locations Management
        </h3>
        <Button
          onClick={handleAddLocation}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Branch
        </Button>
      </div>

      {/* New Location Form */}
      {newLocation && (
        <Card className="mb-4 border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add New Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Branch Name*</label>
                <Input
                  value={newLocation.branch}
                  onChange={e => setNewLocation({...newLocation, branch: e.target.value})}
                  placeholder="e.g. Nairobi Branch"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Floors*</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFloor}
                    onChange={e => setNewFloor(e.target.value)}
                    placeholder="e.g. 1st floor"
                    className="flex-1"
                  />
                  <Button onClick={handleAddFloorToNew} disabled={!newFloor}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Floor
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newLocation.floors?.map((floor, index) => (
                    <div key={index} className="flex items-center bg-white px-2 py-1 rounded-full border border-blue-200">
                      <ColoredIcon icon={Bed} color="teal" size="xs" variant="text" className="mr-1" />
                      <span className="text-sm">{floor}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveFloorFromNew(floor)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewLocation(null)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button onClick={handleSaveNewLocation}>
                <Save className="h-4 w-4 mr-1" />
                Save Branch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ward Locations List */}
      <div className="space-y-4">
        {wardLocations.map(location => (
          <Card key={location.id} className={`border-amber-200 shadow-sm ${editingLocation?.id === location.id ? 'bg-amber-50' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center">
                  <ColoredIcon icon={MapPin} color="amber" size="sm" variant="outline" className="mr-2" />
                  {location.branch} Branch
                </CardTitle>
                {editingLocation?.id !== location.id && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditLocation(location)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editingLocation?.id === location.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Branch Name*</label>
                    <Input
                      value={editingLocation.branch}
                      onChange={e => setEditingLocation({...editingLocation, branch: e.target.value})}
                      placeholder="e.g. Nairobi Branch"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Floors*</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newFloor}
                        onChange={e => setNewFloor(e.target.value)}
                        placeholder="e.g. 1st floor"
                        className="flex-1"
                      />
                      <Button onClick={handleAddFloorToEditing} disabled={!newFloor}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Floor
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editingLocation.floors.map((floor, index) => (
                        <div key={index} className="flex items-center bg-white px-2 py-1 rounded-full border border-amber-200">
                          <ColoredIcon icon={Bed} color="teal" size="xs" variant="text" className="mr-1" />
                          <span className="text-sm">{floor}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 text-gray-500 hover:text-red-500"
                            onClick={() => handleRemoveFloorFromEditing(floor)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setEditingLocation(null)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateLocation}>
                      <Save className="h-4 w-4 mr-1" />
                      Update Branch
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {location.floors.map((floor, index) => (
                    <div key={index} className="flex items-center p-2 bg-white border border-amber-100 rounded-md">
                      <ColoredIcon icon={Bed} color="teal" size="xs" variant="text" className="mr-2" />
                      <span>Wards are in {floor}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FloorManagement;
