import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../ui/tabs';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../ui/table';
import { Badge } from '../../ui/badge';
import {
  Building2,
  Bed,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  CheckCircle2,
  AlertTriangle,
  Building,
  Layers
} from 'lucide-react';
import { useAdmission, Room, Bed as BedType } from '../../../context/AdmissionContext';
import { useToast } from '../../../context/ToastContext';

interface FacilityManagementProps {
  onClose: () => void;
}

const FacilityManagement: React.FC<FacilityManagementProps> = ({ onClose }) => {
  const { rooms, updateRoom } = useAdmission();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('rooms');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingBed, setEditingBed] = useState<{ roomId: string, bed: BedType } | null>(null);
  const [newRoom, setNewRoom] = useState<Partial<Room> | null>(null);
  const [newBed, setNewBed] = useState<{ roomId: string, bed: Partial<BedType> } | null>(null);

  // Get unique floors and wings from rooms
  const floors = [...new Set(rooms.map(room => room.floor))];
  const wings = [...new Set(rooms.map(room => room.wing))];

  // Handle room edit
  const handleEditRoom = (room: Room) => {
    setEditingRoom({ ...room });
  };

  // Handle room update
  const handleUpdateRoom = () => {
    if (!editingRoom) return;

    try {
      updateRoom(editingRoom.id, editingRoom);
      showToast('success', `Room ${editingRoom.name} updated successfully`);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error updating room:', error);
      showToast('error', 'Failed to update room');
    }
  };

  // Handle room status change
  const handleRoomStatusChange = (roomId: string, status: 'Available' | 'Maintenance') => {
    try {
      updateRoom(roomId, { status });
      showToast('success', `Room status updated to ${status}`);
    } catch (error) {
      console.error('Error updating room status:', error);
      showToast('error', 'Failed to update room status');
    }
  };

  // Handle bed edit
  const handleEditBed = (roomId: string, bed: BedType) => {
    setEditingBed({ roomId, bed: { ...bed } });
  };

  // Handle bed update
  const handleUpdateBed = () => {
    if (!editingBed) return;

    try {
      const room = rooms.find(r => r.id === editingBed.roomId);
      if (!room || !room.beds) return;

      const updatedBeds = room.beds.map(b =>
        b.id === editingBed.bed.id ? editingBed.bed : b
      );

      updateRoom(editingBed.roomId, { beds: updatedBeds });
      showToast('success', `Bed ${editingBed.bed.number} updated successfully`);
      setEditingBed(null);
    } catch (error) {
      console.error('Error updating bed:', error);
      showToast('error', 'Failed to update bed');
    }
  };

  // Handle bed status change
  const handleBedStatusChange = (roomId: string, bedId: string, status: 'Available' | 'Maintenance') => {
    try {
      const room = rooms.find(r => r.id === roomId);
      if (!room || !room.beds) return;

      const updatedBeds = room.beds.map(b =>
        b.id === bedId ? { ...b, status } : b
      );

      updateRoom(roomId, { beds: updatedBeds });
      showToast('success', `Bed status updated to ${status}`);
    } catch (error) {
      console.error('Error updating bed status:', error);
      showToast('error', 'Failed to update bed status');
    }
  };

  // Handle new room creation
  const handleAddRoom = () => {
    setNewRoom({
      name: '',
      type: 'Basic',
      status: 'Available',
      floor: '',
      wing: '',
      dailyRate: 0,
      features: []
    });
  };

  // Handle new bed creation
  const handleAddBed = (roomId: string) => {
    setNewBed({
      roomId,
      bed: {
        number: '',
        status: 'Available'
      }
    });
  };

  // Handle save new room
  const handleSaveNewRoom = () => {
    if (!newRoom || !newRoom.name || !newRoom.floor || !newRoom.wing) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    try {
      // In a real app, this would be an API call
      showToast('success', `Room ${newRoom.name} created successfully`);
      setNewRoom(null);
    } catch (error) {
      console.error('Error creating room:', error);
      showToast('error', 'Failed to create room');
    }
  };

  // Handle save new bed
  const handleSaveNewBed = () => {
    if (!newBed || !newBed.bed.number) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    try {
      const room = rooms.find(r => r.id === newBed.roomId);
      if (!room) return;

      const newBedObj: BedType = {
        id: `BED${Date.now()}`,
        number: newBed.bed.number,
        status: newBed.bed.status || 'Available'
      };

      const updatedBeds = room.beds ? [...room.beds, newBedObj] : [newBedObj];

      updateRoom(newBed.roomId, { beds: updatedBeds });
      showToast('success', `Bed ${newBed.bed.number} added successfully`);
      setNewBed(null);
    } catch (error) {
      console.error('Error adding bed:', error);
      showToast('error', 'Failed to add bed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Facility Management</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="rooms" className="flex items-center gap-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Building2 size={16} />
            Rooms
          </TabsTrigger>
          <TabsTrigger value="floors" className="flex items-center gap-1 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Layers size={16} />
            Floors & Wings
          </TabsTrigger>
          <TabsTrigger value="beds" className="flex items-center gap-1 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
            <Bed size={16} />
            Beds
          </TabsTrigger>
        </TabsList>

        {/* Rooms Management */}
        <TabsContent value="rooms">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-blue-700 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Rooms Management
            </h3>
            <Button
              onClick={handleAddRoom}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Room
            </Button>
          </div>

          {newRoom && (
            <Card className="mb-4 border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Add New Room</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Room Name*</label>
                    <Input
                      value={newRoom.name}
                      onChange={e => setNewRoom({...newRoom, name: e.target.value})}
                      placeholder="e.g. Executive Suite 101"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Room Type*</label>
                    <Select
                      value={newRoom.type}
                      onValueChange={value => setNewRoom({...newRoom, type: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Executive">Executive Suite</SelectItem>
                        <SelectItem value="Premium">Premium Room</SelectItem>
                        <SelectItem value="Basic">Basic Room</SelectItem>
                        <SelectItem value="Ward">Ward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Floor*</label>
                    <Input
                      value={newRoom.floor}
                      onChange={e => setNewRoom({...newRoom, floor: e.target.value})}
                      placeholder="e.g. 1st Floor"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Wing*</label>
                    <Input
                      value={newRoom.wing}
                      onChange={e => setNewRoom({...newRoom, wing: e.target.value})}
                      placeholder="e.g. East Wing"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Daily Rate (KSh)*</label>
                    <Input
                      type="number"
                      value={newRoom.dailyRate?.toString() || ''}
                      onChange={e => setNewRoom({...newRoom, dailyRate: parseInt(e.target.value) || 0})}
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select
                      value={newRoom.status}
                      onValueChange={value => setNewRoom({...newRoom, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewRoom(null)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveNewRoom}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Room
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Floor</TableHead>
                  <TableHead>Wing</TableHead>
                  <TableHead>Daily Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map(room => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.type}</TableCell>
                    <TableCell>{room.floor}</TableCell>
                    <TableCell>{room.wing}</TableCell>
                    <TableCell>KSh {room.dailyRate.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={
                        room.status === 'Available' ? 'success' :
                        room.status === 'Maintenance' ? 'warning' : 'secondary'
                      }>
                        {room.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {room.status !== 'Occupied' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRoomStatusChange(
                              room.id,
                              room.status === 'Available' ? 'Maintenance' : 'Available'
                            )}
                          >
                            {room.status === 'Available' ? (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Floors & Wings Management */}
        <TabsContent value="floors">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-purple-700 flex items-center mb-4">
              <Layers className="h-5 w-5 mr-2 text-purple-600" />
              Floors & Wings Management
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border-purple-200 shadow-sm">
              <CardHeader className="bg-purple-50 border-b border-purple-100">
                <CardTitle className="text-lg text-purple-800">Floors</CardTitle>
                <CardDescription>Manage hospital floors</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {floors.map((floor, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border border-purple-100 rounded-md hover:bg-purple-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                          <Layers className="h-4 w-4 text-purple-600" />
                        </div>
                        <span className="font-medium">{floor}</span>
                      </div>
                      <div className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {rooms.filter(r => r.floor === floor).length} rooms
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 shadow-sm">
              <CardHeader className="bg-indigo-50 border-b border-indigo-100">
                <CardTitle className="text-lg text-indigo-800">Wings</CardTitle>
                <CardDescription>Manage hospital wings</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {wings.map((wing, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-white border border-indigo-100 rounded-md hover:bg-indigo-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                          <Building className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{wing}</span>
                      </div>
                      <div className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {rooms.filter(r => r.wing === wing).length} rooms
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Beds Management */}
        <TabsContent value="beds">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-teal-700 flex items-center mb-4">
              <Bed className="h-5 w-5 mr-2 text-teal-600" />
              Beds Management
            </h3>
          </div>

          <div className="space-y-6">
            {rooms.filter(room => room.type === 'Ward').map(room => (
              <Card key={room.id} className="border-teal-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-2 bg-teal-50 border-b border-teal-100">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-teal-800 flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-teal-600" />
                      {room.name}
                    </CardTitle>
                    <Button
                      size="sm"
                      onClick={() => handleAddBed(room.id)}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Bed
                    </Button>
                  </div>
                  <CardDescription className="text-teal-600">{room.floor} • {room.wing}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {newBed && newBed.roomId === room.id && (
                    <div className="mb-6 p-4 border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium mb-3 text-teal-800 flex items-center">
                        <Plus className="h-4 w-4 mr-2 text-teal-600" />
                        Add New Bed
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs font-medium mb-1 block text-teal-700">Bed Number*</label>
                          <Input
                            value={newBed.bed.number}
                            onChange={e => setNewBed({
                              ...newBed,
                              bed: {...newBed.bed, number: e.target.value}
                            })}
                            placeholder="e.g. Bed 7"
                            className="h-9 text-sm border-teal-200 focus-visible:ring-teal-500"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block text-teal-700">Status</label>
                          <Select
                            value={newBed.bed.status}
                            onValueChange={value => setNewBed({
                              ...newBed,
                              bed: {...newBed.bed, status: value as any}
                            })}
                          >
                            <SelectTrigger className="h-9 text-sm border-teal-200">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Available">
                                <div className="flex items-center">
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" />
                                  <span>Available</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Maintenance">
                                <div className="flex items-center">
                                  <AlertTriangle className="h-3.5 w-3.5 mr-2 text-amber-500" />
                                  <span>Maintenance</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setNewBed(null)}
                          className="border-teal-200 text-teal-700 hover:bg-teal-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSaveNewBed}
                          className="bg-teal-600 hover:bg-teal-700"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save Bed
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {room.beds?.map(bed => (
                      <div
                        key={bed.id}
                        className={`
                          p-4 border rounded-lg shadow-sm transition-all hover:shadow-md
                          ${bed.status === 'Available' ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' :
                            bed.status === 'Maintenance' ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-white' :
                            'border-sky-200 bg-gradient-to-br from-sky-50 to-white'}
                        `}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className={`
                              h-8 w-8 rounded-full flex items-center justify-center mr-2
                              ${bed.status === 'Available' ? 'bg-emerald-100' :
                                bed.status === 'Maintenance' ? 'bg-amber-100' :
                                'bg-sky-100'}
                            `}>
                              <Bed className={`
                                h-4 w-4
                                ${bed.status === 'Available' ? 'text-emerald-600' :
                                  bed.status === 'Maintenance' ? 'text-amber-600' :
                                  'text-sky-600'}
                              `} />
                            </div>
                            <span className="font-medium">{bed.number}</span>
                          </div>
                          <Badge variant={
                            bed.status === 'Available' ? 'success' :
                            bed.status === 'Maintenance' ? 'warning' : 'secondary'
                          }>
                            {bed.status}
                          </Badge>
                        </div>

                        {bed.status === 'Occupied' && bed.patientName && (
                          <div className="text-xs bg-white p-2 rounded-md border border-sky-100 mb-3">
                            <div className="font-medium text-sky-800">{bed.patientName}</div>
                            <div className="text-gray-600 mt-1">
                              Since: {bed.admissionDate ? new Date(bed.admissionDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`
                              h-8 px-2 border
                              ${bed.status === 'Available' ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' :
                                bed.status === 'Maintenance' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' :
                                'border-sky-200 text-sky-700 hover:bg-sky-50'}
                            `}
                            onClick={() => handleEditBed(room.id, bed)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          {bed.status !== 'Occupied' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className={`
                                h-8 px-2 border
                                ${bed.status === 'Available' ? 'border-amber-200 text-amber-700 hover:bg-amber-50' :
                                  'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
                              `}
                              onClick={() => handleBedStatusChange(
                                room.id,
                                bed.id,
                                bed.status === 'Available' ? 'Maintenance' : 'Available'
                              )}
                            >
                              {bed.status === 'Available' ? (
                                <>
                                  <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                                  Maintenance
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                                  Available
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacilityManagement;
