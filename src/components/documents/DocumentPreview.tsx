import React from 'react';
import { X, Download, Share2, Printer, FileText, ImageIcon, File, Image, Archive, Calendar, User, Tag, Info } from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  type: string;
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

interface DocumentPreviewProps {
  document: Document;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
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

  // Determine if the document is an image that can be previewed
  const isPreviewableImage = ['jpg', 'jpeg', 'png', 'gif'].includes(document.fileType.toLowerCase());

  // Determine if the document is a PDF that can be embedded
  const isPdf = document.fileType.toLowerCase() === 'pdf';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Document Preview</h2>
        <button
          className="text-gray-400 hover:text-gray-500"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document Preview */}
        <div className="md:col-span-2 bg-gray-50 rounded-lg border border-gray-200 p-4 flex flex-col">
          <div className="flex-1 min-h-[400px] flex items-center justify-center">
            {isPreviewableImage ? (
              <img
                src={document.url}
                alt={document.name}
                className="max-w-full max-h-[400px] object-contain"
              />
            ) : isPdf ? (
              <iframe
                src={document.url}
                title={document.name}
                className="w-full h-[400px] border-0"
              />
            ) : (
              <div className="text-center p-8">
                {getFileIcon(document.fileType)}
                <p className="mt-4 text-sm text-gray-500">
                  Preview not available for this file type
                </p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Download className="w-4 h-4 mr-2" />
                  Download to View
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4 space-x-4">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>

        {/* Document Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Details</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-start">
                  {getFileIcon(document.fileType)}
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900">{document.name}</h4>
                    <p className="text-sm text-gray-500">{document.fileType.toUpperCase()} • {document.fileSize}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Uploaded on {format(new Date(document.uploadDate), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-4 h-4 mr-2" />
                  Uploaded by {document.uploadedBy}
                </div>
              </div>

              {document.patientName && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Patient</h4>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{document.patientName}</p>
                      {document.patientId && (
                        <p className="text-xs text-gray-500">ID: {document.patientId}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Document Type</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {document.type.charAt(0).toUpperCase() + document.type.slice(1)}
                </span>
              </div>

              {document.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <Tag className="w-4 h-4 mr-2 text-gray-500" />
                    <h4 className="text-sm font-medium text-gray-900">Tags</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <Info className="w-4 h-4 mr-2 text-gray-500" />
                  <h4 className="text-sm font-medium text-gray-900">Status</h4>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  document.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
