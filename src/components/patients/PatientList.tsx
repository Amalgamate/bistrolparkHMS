import React, { useState } from 'react';
import {
  Search, Filter, Plus, Edit, Trash2, Eye, MoreHorizontal,
  FileText, Calendar, Clock, User, Phone, Mail, MapPin
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';
import '../../styles/theme.css';

interface PatientListProps {
  onAddPatient: () => void;
  onViewPatient: (patientId: number) => void;
  onEditPatient: (patientId: number) => void;
  onDeletePatient: (patientId: number) => void;
}

export const PatientList: React.FC<PatientListProps> = ({
  onAddPatient,
  onViewPatient,
  onEditPatient,
  onDeletePatient
}) => {
  const { patients, deletePatient } = usePatient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           patient.phone.includes(searchTerm) ||
           patient.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Toggle action menu for a patient
  const toggleActionMenu = (patientId: number) => {
    setShowActionMenu(showActionMenu === patientId ? null : patientId);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-[#2B4F60] flex items-center">
          <User className="mr-2 text-[#0100F6]" />
          Patient Management
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-control pl-10"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>

            <button className="btn btn-primary" onClick={onAddPatient}>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <div className="tabs inline-flex">
          <button
            className={`tab ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Table View
          </button>
          <button
            className={`tab ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            <User className="w-4 h-4 mr-2" />
            Card View
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Contact</th>
                <th>Blood Group</th>
                <th>Last Visit</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-md bg-secondary flex items-center justify-center text-primary font-semibold">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
                        <div className="text-sm text-muted">
                          {patient.gender}, {calculateAge(patient.dateOfBirth)} years
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-muted" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-2 text-muted" />
                        <span>{patient.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary">{patient.bloodGroup}</span>
                  </td>
                  <td>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted" />
                      <span>{formatDate(patient.lastVisit)}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${patient.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td>
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <button
                          className="btn-icon btn-sm bg-secondary"
                          onClick={() => onViewPatient(patient.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="btn-icon btn-sm bg-accent"
                          onClick={() => onEditPatient(patient.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="btn-icon btn-sm bg-warning"
                          onClick={() => toggleActionMenu(patient.id)}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      {showActionMenu === patient.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-secondary"
                            onClick={() => {
                              onViewPatient(patient.id);
                              setShowActionMenu(null);
                            }}
                          >
                            <Eye className="w-4 h-4 inline mr-2" />
                            View Details
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-primary hover:bg-secondary"
                            onClick={() => {
                              onEditPatient(patient.id);
                              setShowActionMenu(null);
                            }}
                          >
                            <Edit className="w-4 h-4 inline mr-2" />
                            Edit Patient
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this patient?')) {
                                deletePatient(patient.id);
                                onDeletePatient(patient.id);
                                showToast('success', `Patient ${patient.firstName} ${patient.lastName} has been deleted`);
                                setShowActionMenu(null);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 inline mr-2" />
                            Delete Patient
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map(patient => (
            <div key={patient.id} className="card">
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-3">
                  <div className="avatar avatar-md bg-secondary flex items-center justify-center text-primary font-semibold">
                    {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
                    <div className="text-sm text-muted">
                      {patient.gender}, {calculateAge(patient.dateOfBirth)} years
                    </div>
                  </div>
                </div>
                <span className={`badge ${patient.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {patient.status}
                </span>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-muted" />
                  <span className="truncate">{patient.address}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted" />
                    <span>Last Visit: {formatDate(patient.lastVisit)}</span>
                  </div>
                  <span className="badge badge-secondary">{patient.bloodGroup}</span>
                </div>
              </div>

              <div className="p-4 border-t flex justify-between">
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onViewPatient(patient.id)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  className="btn btn-sm btn-accent"
                  onClick={() => onEditPatient(patient.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this patient?')) {
                      deletePatient(patient.id);
                      onDeletePatient(patient.id);
                      showToast('success', `Patient ${patient.firstName} ${patient.lastName} has been deleted`);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPatients.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-md p-8">
          <img src="/empty-state.png" alt="No patients" className="h-32 mx-auto mb-4 opacity-60" />
          <div className="text-lg font-medium text-[#2B4F60] mb-2">No patients found</div>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
          <button
            className="btn btn-primary mt-4"
            onClick={onAddPatient}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Patient
          </button>
        </div>
      )}
    </div>
  );
};
