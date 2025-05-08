import React, { useState, useEffect } from 'react';
import { Code, Download, ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ApiDocumentation: React.FC = () => {
  const { showToast } = useToast();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Fetch the markdown content
    fetch('/docs/api-documentation.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load API documentation');
        }
        return response.text();
      })
      .then(text => {
        setMarkdownContent(text);
      })
      .catch(error => {
        console.error('Error loading API documentation:', error);
        showToast('error', 'Failed to load API documentation');
      });
  }, [showToast]);

  const handleCopyUrl = () => {
    const url = window.location.origin + '/docs/api-documentation.md';
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        showToast('success', 'Documentation URL copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy URL:', err);
        showToast('error', 'Failed to copy URL');
      });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/docs/api-documentation.md';
    link.download = 'bristol-park-hospital-api-documentation.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    window.open('/docs/api-documentation.md', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#2B3990]">API Documentation</h2>
          <p className="text-gray-600 mt-1">
            Documentation for backend developers to integrate with the Bristol Park Hospital API
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyUrl}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            title="Copy documentation URL"
          >
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            title="Download documentation"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={openInNewTab}
            className="flex items-center px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center">
          <Code className="w-5 h-5 text-[#2B3990] mr-2" />
          <h3 className="text-lg font-semibold">API Integration Guide</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            This documentation provides guidelines for backend developers to integrate the React frontend with the Java backend.
            It includes information about API endpoints, authentication, and data formats.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
            <h4 className="font-medium text-gray-800 mb-2">Key Integration Points:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Authentication and user management</li>
              <li>Patient registration and management</li>
              <li>Document management and generation</li>
              <li>Branch-specific data handling</li>
              <li>Insurance provider integration (SHA)</li>
              <li>Payment processing (M-Pesa)</li>
            </ul>
          </div>
          
          <div className="flex justify-center">
            <iframe 
              src="/docs/api-documentation.md" 
              className="w-full h-[500px] border border-gray-200 rounded-md"
              title="API Documentation"
            />
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
            <p className="text-blue-700">
              For any questions or issues related to the API integration, please contact the development team at{' '}
              <a href="mailto:dev@bristolparkhospital.com" className="underline">dev@bristolparkhospital.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
