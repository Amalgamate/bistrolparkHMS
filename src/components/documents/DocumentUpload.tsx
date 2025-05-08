import React, { useState, useRef } from 'react';
import { X, Upload, File, FileText, ImageIcon, Archive, Image } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface DocumentUploadProps {
  onClose: () => void;
  onUpload: (document: any) => void;
  patientId?: string;
  patientName?: string;
}

// Document types
const documentTypes = [
  { value: 'medical', label: 'Medical Record' },
  { value: 'lab', label: 'Lab Result' },
  { value: 'imaging', label: 'Imaging/Scan' },
  { value: 'consent', label: 'Consent Form' },
  { value: 'insurance', label: 'Insurance Document' },
  { value: 'identification', label: 'Identification' },
  { value: 'other', label: 'Other' }
];

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onClose, onUpload, patientId, patientName }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);

      // Auto-fill document name if empty
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Get file icon based on file type
  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="w-12 h-12 text-gray-400" />;

    const fileType = selectedFile.name.split('.').pop()?.toLowerCase() || '';

    switch (fileType) {
      case 'pdf':
        return <FileText className="w-12 h-12 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <ImageIcon className="w-12 h-12 text-blue-500" />;
      case 'dicom':
        return <Image className="w-12 h-12 text-purple-500" />;
      case 'zip':
      case 'rar':
        return <Archive className="w-12 h-12 text-yellow-500" />;
      default:
        return <File className="w-12 h-12 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      showToast('error', 'Please select a file to upload');
      return;
    }

    if (!documentName.trim()) {
      showToast('error', 'Please enter a document name');
      return;
    }

    if (!documentType) {
      showToast('error', 'Please select a document type');
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      // Create a new document object
      const newDocument = {
        id: `doc-${Date.now()}`,
        name: documentName.trim(),
        type: documentType,
        patientId: patientId || undefined,
        patientName: patientName || undefined,
        uploadedBy: 'Current User', // This would come from auth context in a real app
        uploadDate: new Date().toISOString().split('T')[0],
        fileType: selectedFile.name.split('.').pop() || '',
        fileSize: formatFileSize(selectedFile.size),
        status: 'active',
        tags: tags,
        url: URL.createObjectURL(selectedFile) // This would be a server URL in a real app
      };

      onUpload(newDocument);
      showToast('success', 'Document uploaded successfully');
      setIsUploading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upload Document</h2>
        <button
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {selectedFile ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  {getFileIcon()}
                  <div className="mt-2 text-sm font-medium text-gray-900">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</div>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="w-12 h-12 text-gray-400" />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  Drag and drop your file here, or{' '}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    browse
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, JPG, PNG, DICOM, ZIP (max 20MB)
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.gif,.dicom,.zip,.rar"
            />
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                Document Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                Document Type <span className="text-red-500">*</span>
              </label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select a type</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {patientId ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Patient
                </label>
                <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-sm font-medium">{patientName}</p>
                  <p className="text-xs text-gray-500">ID: {patientId}</p>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="patientSearch" className="block text-sm font-medium text-gray-700">
                  Patient (Optional)
                </label>
                <input
                  type="text"
                  id="patientSearch"
                  placeholder="Search for a patient..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty if this document is not associated with a specific patient
                </p>
              </div>
            )}

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add tags and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add
                </button>
              </div>

              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        className="ml-1 text-blue-500 hover:text-blue-700"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;
