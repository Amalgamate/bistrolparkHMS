import React, { useState, useRef, useEffect } from 'react';
import { FileText, Upload, Save, Trash2, Plus, Image, Check, X, Download, Eye, MapPin, Building } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { jsPDF } from 'jspdf';
import { BRANCH_PREFIXES, generateSerialNumber } from '../../utils/pdfUtils';

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'patient' | 'invoice' | 'prescription' | 'lab' | 'referral' | 'discharge' | 'register' | 'custom';
  previewUrl: string;
  isDefault: boolean;
}

const DocumentLayout: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { branches } = useSettings();
  const previewIframeRef = useRef<HTMLIFrameElement>(null);

  const [activeTab, setActiveTab] = useState<string>('templates');
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('all');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([
    {
      id: '1',
      name: 'Patient Medical Record',
      type: 'patient',
      previewUrl: '/document-templates/patient-record.svg',
      isDefault: true
    },
    {
      id: '2',
      name: 'Detailed Invoice',
      type: 'invoice',
      previewUrl: '/document-templates/invoice.svg',
      isDefault: true
    },
    {
      id: '3',
      name: 'Prescription Form',
      type: 'prescription',
      previewUrl: '/document-templates/prescription.svg',
      isDefault: true
    },
    {
      id: '4',
      name: 'Laboratory Results',
      type: 'lab',
      previewUrl: '/document-templates/lab-results.svg',
      isDefault: false
    },
    {
      id: '5',
      name: 'Medical Referral',
      type: 'referral',
      previewUrl: '/document-templates/referral.svg',
      isDefault: false
    },
    {
      id: '6',
      name: 'Discharge Summary',
      type: 'discharge',
      previewUrl: '/document-templates/discharge.svg',
      isDefault: false
    },
    {
      id: '7',
      name: 'Patient Register',
      type: 'register',
      previewUrl: '/document-templates/patient-register.svg',
      isDefault: true
    }
  ]);

  // Template and preview state
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Branding settings
  const [logoUrl, setLogoUrl] = useState<string>('/bristol-logo.png');
  const [headerColor, setHeaderColor] = useState<string>('#2B3990');
  const [accentColor, setAccentColor] = useState<string>('#A61F1F');
  const [fontFamily, setFontFamily] = useState<string>('Arial');

  // Document settings
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [footerText, setFooterText] = useState<string>('Bristol Park Hospital - Excellence in Healthcare');
  const [showPageNumbers, setShowPageNumbers] = useState<boolean>(true);
  const [showDateStamp, setShowDateStamp] = useState<boolean>(true);
  const [showBranchInfo, setShowBranchInfo] = useState<boolean>(true);
  const [showSerialNumber, setShowSerialNumber] = useState<boolean>(true);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [showAddress, setShowAddress] = useState<boolean>(true);

  // Branch settings
  const [selectedBranchId, setSelectedBranchId] = useState<string>(user?.branch || 'fedha');

  // Add alignment state variables
  const [logoAlignment, setLogoAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [addressAlignment, setAddressAlignment] = useState<'left' | 'center' | 'right'>('left');
  const [termsAlignment, setTermsAlignment] = useState<'left' | 'center' | 'right'>('center');

  // Get current branch details
  const currentBranch = branches.find(branch => branch.id === selectedBranchId) || branches[0];

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('error', 'Logo file size must be less than 2MB');
        return;
      }

      // Check file type
      if (!file.type.match('image/(jpeg|jpg|png|gif|svg+xml)')) {
        showToast('error', 'Logo must be an image file (JPEG, PNG, GIF, SVG)');
        return;
      }

      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      setLogoUrl(url);

      // In a real app, you would upload this to a server
      // For now, we'll store it in localStorage to persist between sessions
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          localStorage.setItem('bristolParkLogo', reader.result as string);
          showToast('success', 'Logo uploaded and saved successfully');
        } catch (error) {
          console.error('Error saving logo to localStorage:', error);
          showToast('warning', 'Logo uploaded but could not be saved permanently');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Load saved logo on component mount
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem('bristolParkLogo');
      if (savedLogo) {
        setLogoUrl(savedLogo);
      }
    } catch (error) {
      console.error('Error loading logo from localStorage:', error);
    }
  }, []);

  // Set a template as default
  const setDefaultTemplate = (id: string) => {
    setTemplates(
      templates.map(template => ({
        ...template,
        isDefault: template.id === id
      }))
    );
    showToast('success', 'Default template updated');
  };

  // Delete a template
  const deleteTemplate = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
      showToast('success', 'Template deleted');
    }
  };

  // Add a new template
  const [showAddTemplateModal, setShowAddTemplateModal] = useState<boolean>(false);
  const [newTemplateName, setNewTemplateName] = useState<string>('');
  const [newTemplateType, setNewTemplateType] = useState<'patient' | 'invoice' | 'prescription' | 'lab' | 'referral' | 'discharge' | 'register' | 'custom'>('patient');

  const addNewTemplate = () => {
    if (!newTemplateName.trim()) {
      showToast('error', 'Template name is required');
      return;
    }

    // Create a new template
    const newTemplate: DocumentTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplateName.trim(),
      type: newTemplateType,
      previewUrl: `/document-templates/${newTemplateType}.svg`,
      isDefault: false
    };

    // Add the new template to the list
    setTemplates([...templates, newTemplate]);

    // Reset form and close modal
    setNewTemplateName('');
    setNewTemplateType('patient');
    setShowAddTemplateModal(false);

    showToast('success', 'New template added successfully');
  };

  // Preview a template
  const previewTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setPreviewUrl(template.previewUrl);
    setShowPreview(true);
  };

  // Save settings
  const saveSettings = () => {
    // In a real app, you would save these to a server
    showToast('success', 'Document settings saved successfully');
  };

  // Generate a preview URL for the PDF
  const generatePreviewUrl = (doc: jsPDF): string => {
    try {
      // Generate the PDF as a data URL
      const pdfDataUri = doc.output('datauristring');
      return pdfDataUri;
    } catch (error) {
      console.error('Error generating preview URL:', error);
      return '';
    }
  };

  // Generate a sample PDF
  const generateSamplePDF = (preview: boolean = false) => {
    try {
      const doc = new jsPDF();

      // Generate a sample serial number
      const serialNumber = showSerialNumber
        ? generateSerialNumber(selectedBranchId, 'DOC')
        : '';

      // Add logo if enabled
      if (showLogo) {
        try {
          // Always use the actual logo from public directory
          const actualLogoUrl = '/bristol-logo.png';

          // Check if we have a custom uploaded logo
          if (logoUrl && logoUrl !== '/bristol-logo.png') {
            // Use the custom uploaded logo
            doc.addImage(
              logoUrl,
              'AUTO',
              14, 15,
              30, 30
            );
          } else {
            // Use the default logo from public directory
            doc.addImage(
              actualLogoUrl,
              'AUTO',
              14, 15,
              30, 30
            );
          }
        } catch (error) {
          console.error('Error adding logo to PDF:', error);

          // Fallback to a colored rectangle if image loading fails
          doc.setDrawColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
          doc.setFillColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
          doc.rect(14, 15, 30, 30, 'F');

          // Add hospital initials in white
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(14);
          doc.text('BPH', 14 + 15, 15 + 15 + 5, { align: 'center' });
        }
      }

      // Add title with the selected color
      doc.setTextColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
      doc.setFontSize(22);
      doc.text('Bristol Park Hospital', 105, 20, { align: 'center' });

      // Add branch name if enabled
      if (showBranchInfo) {
        const branchName = currentBranch.name;
        doc.setFontSize(16);
        doc.text(`${branchName} Branch`, 105, 30, { align: 'center' });
      }

      // Add address if enabled
      if (showAddress && showBranchInfo) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(currentBranch.address, 14, 55);
        doc.text(`Tel: ${currentBranch.phone}`, 14, 60);
      }

      // Add subtitle
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Sample Document', 105, 45, { align: 'center' });

      // Add serial number if enabled
      if (showSerialNumber) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Document #: ${serialNumber}`, 195, 20, { align: 'right' });
      }

      // Add generation date if enabled
      if (showDateStamp) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 195, 15, { align: 'right' });
      }

      // Add content
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('This is a sample document generated with your current settings.', 20, 70);
      doc.text('Header Color: ' + headerColor, 20, 80);
      doc.text('Accent Color: ' + accentColor, 20, 90);
      doc.text('Font Family: ' + fontFamily, 20, 100);

      // Add settings section
      doc.setFontSize(14);
      doc.setTextColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
      doc.text('Document Settings', 20, 120);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 122, 190, 122);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Show Footer: ' + (showFooter ? 'Yes' : 'No'), 20, 135);
      doc.text('Show Page Numbers: ' + (showPageNumbers ? 'Yes' : 'No'), 20, 145);
      doc.text('Show Date Stamp: ' + (showDateStamp ? 'Yes' : 'No'), 20, 155);
      doc.text('Show Branch Info: ' + (showBranchInfo ? 'Yes' : 'No'), 20, 165);
      doc.text('Show Serial Number: ' + (showSerialNumber ? 'Yes' : 'No'), 20, 175);
      doc.text('Show Logo: ' + (showLogo ? 'Yes' : 'No'), 20, 185);
      doc.text('Show Address: ' + (showAddress ? 'Yes' : 'No'), 20, 195);

      // Add alignment settings
      doc.text('Logo Alignment: ' + logoAlignment, 20, 205);
      doc.text('Header Text Alignment: ' + textAlignment, 20, 215);
      doc.text('Address Alignment: ' + addressAlignment, 20, 225);
      doc.text('Footer Text Alignment: ' + termsAlignment, 20, 235);

      // Add branch section
      doc.setFontSize(14);
      doc.setTextColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
      doc.text('Branch Information', 20, 215);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 217, 190, 217);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Branch Name: ' + currentBranch.name, 20, 230);
      doc.text('Branch ID: ' + currentBranch.id, 20, 240);
      doc.text('Branch Prefix: ' + (BRANCH_PREFIXES[currentBranch.id as keyof typeof BRANCH_PREFIXES] || BRANCH_PREFIXES.default), 20, 250);

      // Get page dimensions
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;

      // Add colored lines in footer
      // Blue line
      doc.setDrawColor(parseInt(headerColor.substring(1, 3), 16), parseInt(headerColor.substring(3, 5), 16), parseInt(headerColor.substring(5, 7), 16));
      doc.setLineWidth(1.5);
      doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);

      // Red line (thinner)
      doc.setDrawColor(parseInt(accentColor.substring(1, 3), 16), parseInt(accentColor.substring(3, 5), 16), parseInt(accentColor.substring(5, 7), 16));
      doc.setLineWidth(0.75);
      doc.line(10, pageHeight - 18, pageWidth - 10, pageHeight - 18);

      // Add footer text if enabled
      if (showFooter) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(footerText, 105, pageHeight - 25, { align: 'center' });
      }

      // Add page number if enabled
      if (showPageNumbers) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Page 1 of 1', 195, pageHeight - 10, { align: 'right' });
      }

      // Add serial number in footer if enabled
      if (showSerialNumber) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(serialNumber, 195, pageHeight - 5, { align: 'right' });
      }

      if (preview) {
        // Generate preview URL and show preview
        const previewUrl = generatePreviewUrl(doc);
        setPreviewUrl(previewUrl);
        setShowPreview(true);
        return doc;
      } else {
        // Save the PDF
        doc.save('bristol_park_sample_document.pdf');
        showToast('success', 'Sample PDF generated successfully');
        return doc;
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('error', 'Failed to generate PDF');
      return null;
    }
  };

  // Preview the document
  const previewDocument = () => {
    generateSamplePDF(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#2B3990] mb-6">Document Layout and Design</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`${
              activeTab === 'templates'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('templates')}
          >
            <FileText className="w-5 h-5 mr-2" />
            Document Templates
          </button>
          <button
            className={`${
              activeTab === 'gallery'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('gallery')}
          >
            <Eye className="w-5 h-5 mr-2" />
            Template Gallery
          </button>
          <button
            className={`${
              activeTab === 'branding'
                ? 'border-[#2B3990] text-[#2B3990]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            onClick={() => setActiveTab('branding')}
          >
            <Image className="w-5 h-5 mr-2" />
            Branding and Styling
          </button>
        </nav>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Manage document templates for various purposes
            </p>
            <button
              onClick={() => setShowAddTemplateModal(true)}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add New Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className="h-48 bg-gray-50 flex items-center justify-center cursor-pointer overflow-hidden border-b"
                  onClick={() => previewTemplate(template)}
                >
                  {template.previewUrl ? (
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="max-h-full object-contain hover:scale-105 transition-transform"
                    />
                  ) : (
                    <FileText className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    {template.isDefault && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Type: {template.type.charAt(0).toUpperCase() + template.type.slice(1)}</p>

                  <div className="flex justify-between mt-4">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      onClick={() => previewTemplate(template)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    {!template.isDefault && (
                      <button
                        className="text-green-600 hover:text-green-800 text-sm flex items-center"
                        onClick={() => setDefaultTemplate(template.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Set Default
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template Gallery Tab */}
      {activeTab === 'gallery' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Browse and preview document templates by category
            </p>
            <div className="flex space-x-2">
              <select
                value={activeTemplateCategory}
                onChange={(e) => setActiveTemplateCategory(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
              >
                <option value="all">All Categories</option>
                <option value="patient">Patient Records</option>
                <option value="invoice">Invoices</option>
                <option value="prescription">Prescriptions</option>
                <option value="lab">Lab Results</option>
                <option value="referral">Referrals</option>
                <option value="discharge">Discharge Summaries</option>
                <option value="register">Patient Registers</option>
              </select>
            </div>
          </div>

          {/* Template Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates
              .filter(template => activeTemplateCategory === 'all' || template.type === activeTemplateCategory)
              .map(template => (
                <div
                  key={template.id}
                  className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
                >
                  <div className="p-3 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    {template.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Default
                      </span>
                    )}
                  </div>
                  <div
                    className="h-64 flex items-center justify-center cursor-pointer overflow-hidden p-4 bg-white"
                    onClick={() => previewTemplate(template)}
                  >
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="max-h-full object-contain hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4 bg-gray-50 border-t flex justify-between">
                    <div className="text-sm text-gray-500">
                      Type: {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                        onClick={() => previewTemplate(template)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </button>
                      {!template.isDefault && (
                        <button
                          className="text-green-600 hover:text-green-800 text-sm flex items-center"
                          onClick={() => setDefaultTemplate(template.id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty state if no templates match the filter */}
          {templates.filter(template => activeTemplateCategory === 'all' || template.type === activeTemplateCategory).length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No templates found</h3>
              <p className="mt-1 text-sm text-gray-500">No templates match the selected category.</p>
            </div>
          )}
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visual Identity</h3>

              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Logo
                </label>
                <div className="flex flex-col">
                  <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-4 border border-gray-200">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="max-h-28 max-w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Image className="w-12 h-12 mb-2" />
                        <span className="text-sm">No logo uploaded</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      <span>Upload Logo</span>
                      <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/jpeg,image/png,image/gif,image/svg+xml" />
                    </label>
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoUrl('/bristol-logo.png');
                          localStorage.removeItem('bristolParkLogo');
                          showToast('info', 'Logo reset to default');
                        }}
                        className="py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none flex items-center"
                      >
                        <X className="w-4 h-4 mr-2" />
                        <span>Reset Logo</span>
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Upload a logo image (JPEG, PNG, GIF, SVG). Max size: 2MB. Recommended size: 300x100 pixels.
                  </p>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="w-10 h-10 rounded-md border border-gray-300 p-1"
                    />
                    <input
                      type="text"
                      value={headerColor}
                      onChange={(e) => setHeaderColor(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Accent Color
                  </label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-md border border-gray-300 p-1"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Font */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier">Courier</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Nexa">Nexa</option>
                </select>
              </div>

              {/* Add alignment controls to the branding tab */}
              {/* Logo Alignment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo Alignment
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setLogoAlignment('left')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      logoAlignment === 'left'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoAlignment('center')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      logoAlignment === 'center'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoAlignment('right')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      logoAlignment === 'right'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Text Alignment
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setTextAlignment('left')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      textAlignment === 'left'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlignment('center')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      textAlignment === 'center'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlignment('right')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      textAlignment === 'right'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              {/* Address Alignment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Alignment
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setAddressAlignment('left')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      addressAlignment === 'left'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressAlignment('center')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      addressAlignment === 'center'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddressAlignment('right')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      addressAlignment === 'right'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>

              {/* Terms/Footer Alignment */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Text Alignment
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setTermsAlignment('left')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      termsAlignment === 'left'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setTermsAlignment('center')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      termsAlignment === 'center'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setTermsAlignment('right')}
                    className={`px-3 py-2 border rounded-md text-sm ${
                      termsAlignment === 'right'
                        ? 'bg-[#2B3990] text-white border-[#2B3990]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Right
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Document Settings</h3>

              {/* Branch Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch for Document Preview
                </label>
                <div className="relative">
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm pr-10"
                  >
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} ({BRANCH_PREFIXES[branch.id as keyof typeof BRANCH_PREFIXES] || BRANCH_PREFIXES.default})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Building className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Each branch has a unique prefix for document serial numbers
                </p>
              </div>

              {/* Footer */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Footer Text
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showFooter"
                      checked={showFooter}
                      onChange={(e) => setShowFooter(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showFooter" className="ml-2 block text-sm text-gray-900">
                      Show Footer
                    </label>
                  </div>
                </div>
                <input
                  type="text"
                  value={footerText}
                  onChange={(e) => setFooterText(e.target.value)}
                  disabled={!showFooter}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              {/* Document Elements */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-sm text-gray-700">Document Elements</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showPageNumbers"
                      checked={showPageNumbers}
                      onChange={(e) => setShowPageNumbers(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showPageNumbers" className="ml-2 block text-sm text-gray-900">
                      Show Page Numbers
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showDateStamp"
                      checked={showDateStamp}
                      onChange={(e) => setShowDateStamp(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showDateStamp" className="ml-2 block text-sm text-gray-900">
                      Show Date Stamp
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showBranchInfo"
                      checked={showBranchInfo}
                      onChange={(e) => setShowBranchInfo(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showBranchInfo" className="ml-2 block text-sm text-gray-900">
                      Show Branch Name
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showSerialNumber"
                      checked={showSerialNumber}
                      onChange={(e) => setShowSerialNumber(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showSerialNumber" className="ml-2 block text-sm text-gray-900">
                      Show Serial Number
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showLogo"
                      checked={showLogo}
                      onChange={(e) => setShowLogo(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showLogo" className="ml-2 block text-sm text-gray-900">
                      Show Logo
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showAddress"
                      checked={showAddress}
                      onChange={(e) => setShowAddress(e.target.checked)}
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="showAddress" className="ml-2 block text-sm text-gray-900">
                      Show Address
                    </label>
                  </div>
                </div>
              </div>

              {/* Preview and Download Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <button
                  onClick={previewDocument}
                  className="flex justify-center py-2 px-4 border border-[#2B3990] rounded-md shadow-sm text-sm font-medium text-[#2B3990] bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Preview
                </button>
                <button
                  onClick={() => generateSamplePDF(false)}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2B3990] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2B3990]"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Add Template Modal */}
      {showAddTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Add New Template</h3>
              <button
                onClick={() => setShowAddTemplateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Name
                  </label>
                  <input
                    type="text"
                    id="templateName"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label htmlFor="templateType" className="block text-sm font-medium text-gray-700 mb-1">
                    Template Type
                  </label>
                  <select
                    id="templateType"
                    value={newTemplateType}
                    onChange={(e) => setNewTemplateType(e.target.value as any)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2B3990] focus:ring-[#2B3990] sm:text-sm"
                  >
                    <option value="patient">Patient Record</option>
                    <option value="invoice">Invoice</option>
                    <option value="prescription">Prescription</option>
                    <option value="lab">Lab Results</option>
                    <option value="referral">Referral</option>
                    <option value="discharge">Discharge Summary</option>
                    <option value="register">Patient Register</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-between border-t mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTemplateModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addNewTemplate}
                    className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
                  >
                    Add Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedTemplate ? selectedTemplate.name : 'Document Preview'}
                </h3>
                {selectedTemplate?.isDefault && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateSamplePDF(false)}
                  className="px-3 py-1.5 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 flex items-center text-sm"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-500 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-gray-100">
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  {/* Template preview */}
                  <div className="bg-white shadow-lg rounded-md p-2 mb-4 max-w-full overflow-hidden">
                    {previewUrl.endsWith('.svg') || previewUrl.endsWith('.png') || previewUrl.endsWith('.jpg') ? (
                      <img
                        src={previewUrl}
                        alt="Document Template"
                        className="max-w-full h-auto"
                      />
                    ) : (
                      <iframe
                        ref={previewIframeRef}
                        src={previewUrl}
                        className="w-full h-[70vh] border-0"
                        title="PDF Preview"
                      />
                    )}
                  </div>

                  {/* Template info */}
                  {selectedTemplate && (
                    <div className="w-full max-w-3xl bg-white rounded-md shadow-sm p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Template Information</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p className="font-medium">{selectedTemplate.type.charAt(0).toUpperCase() + selectedTemplate.type.slice(1)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Template ID</p>
                          <p className="font-medium">{selectedTemplate.id}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Failed to load preview</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-between">
              <div className="flex items-center gap-2">
                {selectedTemplate && !selectedTemplate.isDefault && (
                  <button
                    onClick={() => {
                      setDefaultTemplate(selectedTemplate.id);
                      setShowPreview(false);
                    }}
                    className="px-3 py-1.5 border border-green-600 text-green-600 rounded-md hover:bg-green-50 flex items-center text-sm"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Set as Default
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentLayout;




