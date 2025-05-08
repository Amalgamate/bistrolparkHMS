import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  X,
  ChevronDown,
  FileText,
  File,
  Image,
  ImageIcon,
  Archive,
  Trash2,
  Eye,
  Share2,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentPreview from '../components/documents/DocumentPreview';
import { useToast } from '../context/ToastContext';

// Document types
type DocumentType = 'all' | 'medical' | 'lab' | 'imaging' | 'consent' | 'insurance' | 'identification';

// Document status
type DocumentStatus = 'all' | 'active' | 'archived';

// Document interface
interface Document {
  id: string;
  name: string;
  type: DocumentType;
  patientId?: string;
  patientName?: string;
  uploadedBy: string;
  uploadDate: string;
  fileType: string;
  fileSize: string;
  status: 'active' | 'archived';
  tags: string[];
  url: string;
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    name: 'Patient Consent Form',
    type: 'consent',
    patientId: 'P-001',
    patientName: 'John Doe',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: '2023-11-15',
    fileType: 'pdf',
    fileSize: '1.2 MB',
    status: 'active',
    tags: ['consent', 'surgery', 'admission'],
    url: '/documents/consent-form-001.pdf'
  },
  {
    id: 'doc-002',
    name: 'X-Ray Report',
    type: 'imaging',
    patientId: 'P-002',
    patientName: 'Jane Smith',
    uploadedBy: 'Dr. Michael Chen',
    uploadDate: '2023-11-10',
    fileType: 'jpg',
    fileSize: '3.5 MB',
    status: 'active',
    tags: ['x-ray', 'chest', 'radiology'],
    url: '/documents/xray-report-002.jpg'
  },
  {
    id: 'doc-003',
    name: 'Blood Test Results',
    type: 'lab',
    patientId: 'P-001',
    patientName: 'John Doe',
    uploadedBy: 'Dr. Emily Rodriguez',
    uploadDate: '2023-11-05',
    fileType: 'pdf',
    fileSize: '0.8 MB',
    status: 'active',
    tags: ['blood test', 'lab', 'routine'],
    url: '/documents/blood-test-003.pdf'
  },
  {
    id: 'doc-004',
    name: 'Insurance Card',
    type: 'insurance',
    patientId: 'P-003',
    patientName: 'Robert Johnson',
    uploadedBy: 'Front Desk',
    uploadDate: '2023-10-28',
    fileType: 'png',
    fileSize: '0.5 MB',
    status: 'active',
    tags: ['insurance', 'billing', 'verification'],
    url: '/documents/insurance-card-004.png'
  },
  {
    id: 'doc-005',
    name: 'National ID',
    type: 'identification',
    patientId: 'P-002',
    patientName: 'Jane Smith',
    uploadedBy: 'Front Desk',
    uploadDate: '2023-10-25',
    fileType: 'jpg',
    fileSize: '0.7 MB',
    status: 'active',
    tags: ['id', 'verification', 'registration'],
    url: '/documents/national-id-005.jpg'
  },
  {
    id: 'doc-006',
    name: 'Medical History Form',
    type: 'medical',
    patientId: 'P-003',
    patientName: 'Robert Johnson',
    uploadedBy: 'Dr. James Wilson',
    uploadDate: '2023-10-20',
    fileType: 'pdf',
    fileSize: '1.5 MB',
    status: 'archived',
    tags: ['medical history', 'intake', 'assessment'],
    url: '/documents/medical-history-006.pdf'
  },
  {
    id: 'doc-007',
    name: 'MRI Scan Results',
    type: 'imaging',
    patientId: 'P-001',
    patientName: 'John Doe',
    uploadedBy: 'Dr. Sarah Johnson',
    uploadDate: '2023-10-15',
    fileType: 'dicom',
    fileSize: '15.2 MB',
    status: 'active',
    tags: ['mri', 'brain', 'radiology'],
    url: '/documents/mri-scan-007.dicom'
  }
];

const DocumentCenter: React.FC = () => {
  const { showToast } = useToast();

  // State
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentPreview, setShowDocumentPreview] = useState<Document | null>(null);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    // Apply search term filter
    const matchesSearch =
      searchTerm === '' ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.patientName && doc.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Apply type filter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;

    // Apply status filter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'dicom':
        return <Image className="w-8 h-8 text-purple-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="w-8 h-8 text-yellow-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  // Handle document upload
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  // Handle document upload completion
  const handleUploadComplete = (newDocument: Document) => {
    setDocuments([newDocument, ...documents]);
    showToast('success', 'Document uploaded successfully');
  };

  // Handle document view
  const handleViewDocument = (document: Document) => {
    setShowDocumentPreview(document);
  };

  // Handle document delete
  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
      showToast('success', 'Document deleted successfully');
    }
  };

  // Handle document download
  const handleDownloadDocument = (document: Document) => {
    // In a real application, this would trigger a download from the server
    // For this demo, we'll just show a toast message
    showToast('info', `Downloading ${document.name}`);

    // Simulate a download delay
    setTimeout(() => {
      showToast('success', `${document.name} downloaded successfully`);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2B4F60]">Document Center</h2>
            <p className="text-sm text-muted">Upload, manage, and share documents</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-md shadow-sm p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents by name, patient, or tags..."
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-[#F5B800] focus:border-[#F5B800] py-2.5 text-sm"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative">
                <button
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Document Type</h3>
                    </div>
                    <div className="p-2">
                      {(['all', 'medical', 'lab', 'imaging', 'consent', 'insurance', 'identification'] as DocumentType[]).map((type) => (
                        <div
                          key={type}
                          className={`px-3 py-2 text-sm rounded-md cursor-pointer ${typeFilter === type ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                          onClick={() => setTypeFilter(type)}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                      ))}
                    </div>

                    <div className="p-2 border-t border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Status</h3>
                    </div>
                    <div className="p-2">
                      {(['all', 'active', 'archived'] as DocumentStatus[]).map((status) => (
                        <div
                          key={status}
                          className={`px-3 py-2 text-sm rounded-md cursor-pointer ${statusFilter === status ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={handleUpload}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(typeFilter !== 'all' || statusFilter !== 'all') && (
            <div className="flex flex-wrap items-center mb-4 gap-2">
              <span className="text-sm text-gray-500 mr-1">Filters:</span>

              {typeFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Type: {typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}
                  <button
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => setTypeFilter('all')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {statusFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  <button
                    className="ml-1 text-green-500 hover:text-green-700"
                    onClick={() => setStatusFilter('all')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Document List */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((document) => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(document.fileType)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{document.name}</div>
                            <div className="text-xs text-gray-500">{document.fileType.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.patientName || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{document.patientId || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{format(new Date(document.uploadDate), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-gray-500">by {document.uploadedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {document.fileSize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          document.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewDocument(document)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => handleDownloadDocument(document)}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-900">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      <FileText className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm font-medium">No documents found</p>
                      <p className="mt-1 text-sm text-gray-500">Upload a document or adjust your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
            <DocumentUpload
              onClose={() => setShowUploadModal(false)}
              onUpload={handleUploadComplete}
            />
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showDocumentPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <DocumentPreview
              document={showDocumentPreview}
              onClose={() => setShowDocumentPreview(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCenter;
