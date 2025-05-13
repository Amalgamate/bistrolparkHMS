import React, { useState } from 'react';
import { useSettings, Branch } from '../context/SettingsContext';
import { Building, MapPin, Phone, Clock, Users, Calendar, Edit, Trash, Save, X, Plus, Settings as SettingsIcon, FileText, Image, Sliders, Code, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentLayout from '../components/settings/DocumentLayout';
import GeneralSettings from '../components/settings/GeneralSettings';
import ApiDocumentation from '../components/settings/ApiDocumentation';

const Settings: React.FC = () => {
  const { branches, addBranch, updateBranch, deleteBranch } = useSettings();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBranch, setNewBranch] = useState<Omit<Branch, 'id'>>({
    name: '',
    address: '',
    phone: '',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: '0',
    dailyPatients: '0',
    appointmentsToday: '0',
    location: {
      latitude: 0,
      longitude: 0,
      radius: 500,
    },
    allowRemoteAccess: false,
  });
  const [editBranch, setEditBranch] = useState<Branch | null>(null);

  // Start editing a branch
  const handleEdit = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setEditBranch({ ...branch });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBranchId(null);
    setEditBranch(null);
  };

  // Save edited branch
  const handleSaveEdit = () => {
    if (editingBranchId && editBranch) {
      updateBranch(editingBranchId, editBranch);
      setEditingBranchId(null);
      setEditBranch(null);
    }
  };

  // Delete a branch
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      deleteBranch(id);
    }
  };

  // Handle input change for editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editBranch) return;

    const { name, value, type } = e.target;

    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setEditBranch({
        ...editBranch,
        location: {
          ...editBranch.location,
          [locationField]: type === 'number' ? parseFloat(value) : value,
        },
      });
    } else if (name === 'allowRemoteAccess') {
      setEditBranch({
        ...editBranch,
        allowRemoteAccess: (e.target as HTMLInputElement).checked,
      });
    } else {
      setEditBranch({
        ...editBranch,
        [name]: value,
      });
    }
  };

  // Handle input change for new branch
  const handleNewBranchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setNewBranch({
        ...newBranch,
        location: {
          ...newBranch.location,
          [locationField]: type === 'number' ? parseFloat(value) : value,
        },
      });
    } else if (name === 'allowRemoteAccess') {
      setNewBranch({
        ...newBranch,
        allowRemoteAccess: (e.target as HTMLInputElement).checked,
      });
    } else {
      setNewBranch({
        ...newBranch,
        [name]: value,
      });
    }
  };

  // Add new branch
  const handleAddBranch = () => {
    if (newBranch.name.trim() === '') {
      alert('Branch name is required');
      return;
    }

    addBranch(newBranch);
    setShowAddForm(false);
    setNewBranch({
      name: '',
      address: '',
      phone: '',
      operatingHours: '8:00 AM - 6:00 PM',
      staffCount: '0',
      dailyPatients: '0',
      appointmentsToday: '0',
      location: {
        latitude: 0,
        longitude: 0,
        radius: 500,
      },
      allowRemoteAccess: false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#2B3990] mb-6">Settings</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            className={`${
              activeTab === 'general'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('general')}
          >
            <Sliders className="w-5 h-5 mr-2" />
            General Settings
          </button>
          <button
            className={`${
              activeTab === 'branches'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('branches')}
          >
            <Building className="w-5 h-5 mr-2" />
            Branch Settings
          </button>
          <button
            className={`${
              activeTab === 'documents'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Document Layout
          </button>
          <button
            className={`${
              activeTab === 'api'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('api')}
          >
            <Code className="w-5 h-5 mr-2" />
            API Documentation
          </button>
          <Link
            to="/settings/notifications"
            className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center"
          >
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </Link>
        </nav>
      </div>

      {/* Branch Settings Tab */}
      {activeTab === 'branches' && (
        <>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Manage your hospital branches and their access settings
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Branch
            </button>
          </div>
        </>
      )}

      {/* Add Branch Form */}
      {activeTab === 'branches' && showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#2B3990]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Branch</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <input
                type="text"
                name="name"
                value={newBranch.name}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., Fedha"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={newBranch.address}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., 123 Fedha Road, Nairobi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={newBranch.phone}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., +254 700 123 456"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                name="operatingHours"
                value={newBranch.operatingHours}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., 8:00 AM - 6:00 PM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                name="location.latitude"
                value={newBranch.location.latitude}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., -1.2921"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                name="location.longitude"
                value={newBranch.location.longitude}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., 36.8219"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geofence Radius (meters)
              </label>
              <input
                type="number"
                name="location.radius"
                value={newBranch.location.radius}
                onChange={handleNewBranchChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., 500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRemoteAccess"
                name="allowRemoteAccess"
                checked={newBranch.allowRemoteAccess}
                onChange={handleNewBranchChange}
                className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
              />
              <label htmlFor="allowRemoteAccess" className="ml-2 block text-sm text-gray-900">
                Allow Remote Access
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBranch}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
            >
              Add Branch
            </button>
          </div>
        </div>
      )}

      {/* Branch List */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#2B3990]"
            >
            {editingBranchId === branch.id && editBranch ? (
              // Edit Mode
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Edit Branch</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveEdit}
                      className="p-1 text-green-600 hover:text-green-800"
                      title="Save"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      title="Cancel"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editBranch.name}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editBranch.address}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editBranch.phone}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Operating Hours
                    </label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={editBranch.operatingHours}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="location.latitude"
                      value={editBranch.location.latitude}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      name="location.longitude"
                      value={editBranch.location.longitude}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Geofence Radius (meters)
                    </label>
                    <input
                      type="number"
                      name="location.radius"
                      value={editBranch.location.radius}
                      onChange={handleEditChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`allowRemoteAccess-${branch.id}`}
                      name="allowRemoteAccess"
                      checked={editBranch.allowRemoteAccess}
                      onChange={handleEditChange}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor={`allowRemoteAccess-${branch.id}`} className="ml-2 block text-sm text-gray-900">
                      Allow Remote Access
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="p-4 bg-[#2B3990] text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 mr-2" />
                      <h2 className="text-lg font-semibold">{branch.name} Branch</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(branch)}
                        className="p-1 text-white hover:text-gray-200"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch.id)}
                        className="p-1 text-white hover:text-gray-200"
                        title="Delete"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Address</p>
                        <p className="text-sm font-medium">{branch.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Contact</p>
                        <p className="text-sm font-medium">{branch.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-gray-500 mr-2" />
                      <div>
                        <p className="text-xs text-gray-500">Hours</p>
                        <p className="text-sm font-medium">{branch.operatingHours}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm">
                          {branch.location.latitude.toFixed(4)}, {branch.location.longitude.toFixed(4)}
                        </span>
                        <span className="ml-2 text-xs text-gray-500">
                          (Radius: {branch.location.radius}m)
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Remote Access</p>
                      <div className="flex items-center">
                        {branch.allowRemoteAccess ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Allowed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Allowed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
        </div>
      )}

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <GeneralSettings />
      )}

      {/* Document Layout Tab */}
      {activeTab === 'documents' && (
        <DocumentLayout />
      )}

      {/* API Documentation Tab */}
      {activeTab === 'api' && (
        <ApiDocumentation />
      )}
    </div>
  );
};

export default Settings;
