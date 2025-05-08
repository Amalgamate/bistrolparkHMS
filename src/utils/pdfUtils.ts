import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

// Branch prefixes for document serial numbers
export const BRANCH_PREFIXES = {
  'fedha': 'FDH',
  'utawala': 'UTW',
  'machakos': 'MCK',
  'tassia': 'TSA',
  'kitengela': 'KTG',
  'default': 'BPH'
};

// Common PDF styling options
const PDF_STYLES = {
  colors: {
    primary: [43, 57, 144], // #2B3990
    secondary: [166, 31, 31], // #A61F1F
    text: {
      dark: [0, 0, 0],
      medium: [80, 80, 80],
      light: [120, 120, 120]
    },
    background: {
      light: [240, 240, 240]
    }
  },
  fonts: {
    title: {
      size: 18,
      style: 'bold'
    },
    subtitle: {
      size: 14,
      style: 'normal'
    },
    heading: {
      size: 12,
      style: 'bold'
    },
    normal: {
      size: 10,
      style: 'normal'
    },
    small: {
      size: 8,
      style: 'normal'
    }
  },
  layout: {
    margins: {
      top: 15,
      right: 15,
      bottom: 15,
      left: 15
    },
    logoPosition: {
      x: 14,
      y: 15,
      width: 30,
      height: 30
    },
    addressPosition: {
      x: 14,
      y: 30
    }
  }
};

export const generateSerialNumber = (branchId: string, documentType: string): string => {
  const prefix = BRANCH_PREFIXES[branchId as keyof typeof BRANCH_PREFIXES] || BRANCH_PREFIXES.default;
  const timestamp = Date.now().toString();
  const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  return `${prefix}-${documentType}-${timestamp.substring(timestamp.length - 6)}-${randomDigits}`;
};
export const createBrandedPDF = (
  branchId?: string,
  documentType?: string,
  includeAddress: boolean = true,
  includeLogo: boolean = true
): jsPDF => {
  const doc = new jsPDF();

  // Generate serial number if branch and document type are provided
  const serialNumber = branchId && documentType
    ? generateSerialNumber(branchId, documentType)
    : '';

  // Add logo if enabled
  if (includeLogo) {
    try {
      // Try to get the logo from localStorage (custom uploaded logo)
      const savedLogo = localStorage.getItem('bristolParkLogo');
      // Default logo path
      const defaultLogoPath = '/bristol-logo.png';

      if (savedLogo) {
        // If we have a saved custom logo, use it
        doc.addImage(
          savedLogo,
          'AUTO',
          PDF_STYLES.layout.logoPosition.x,
          PDF_STYLES.layout.logoPosition.y,
          PDF_STYLES.layout.logoPosition.width,
          PDF_STYLES.layout.logoPosition.height
        );
      } else {
        // Otherwise, use the default logo from public directory
        doc.addImage(
          defaultLogoPath,
          'AUTO',
          PDF_STYLES.layout.logoPosition.x,
          PDF_STYLES.layout.logoPosition.y,
          PDF_STYLES.layout.logoPosition.width,
          PDF_STYLES.layout.logoPosition.height
        );
      }
    } catch (error) {
      console.error('Error adding logo to PDF:', error);

      // Fallback to a colored rectangle with hospital colors if image loading fails
      doc.setDrawColor(...PDF_STYLES.colors.primary);
      doc.setFillColor(...PDF_STYLES.colors.primary);
      doc.rect(
        PDF_STYLES.layout.logoPosition.x,
        PDF_STYLES.layout.logoPosition.y,
        PDF_STYLES.layout.logoPosition.width,
        PDF_STYLES.layout.logoPosition.height,
        'F'
      );

      // Add hospital initials in white
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.text(
        'BPH',
        PDF_STYLES.layout.logoPosition.x + (PDF_STYLES.layout.logoPosition.width / 2),
        PDF_STYLES.layout.logoPosition.y + (PDF_STYLES.layout.logoPosition.height / 2) + 5,
        { align: 'center' }
      );
    }
  }

  // Add title
  doc.setFontSize(PDF_STYLES.fonts.title.size);
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.text('Bristol Park Hospital', 105, 15, { align: 'center' });

  // Add branch name if provided
  if (branchId) {
    const branchName = branchId.charAt(0).toUpperCase() + branchId.slice(1);
    doc.setFontSize(PDF_STYLES.fonts.subtitle.size);
    doc.text(`${branchName} Branch`, 105, 25, { align: 'center' });
  }

  // Add address if requested
  if (includeAddress && branchId) {
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);

    // This would ideally come from the settings context
    const addressMap: Record<string, string> = {
      'fedha': '123 Fedha Road, Nairobi',
      'utawala': '45 Utawala Road, Nairobi',
      'machakos': '78 Machakos Street, Machakos',
      'tassia': '90 Tassia Avenue, Nairobi',
      'kitengela': '56 Kitengela Road, Kajiado'
    };

    const address = addressMap[branchId] || 'Bristol Park Hospital, Nairobi';
    doc.text(address, PDF_STYLES.layout.addressPosition.x, PDF_STYLES.layout.addressPosition.y);
  }

  // Add generation date
  doc.setFontSize(PDF_STYLES.fonts.small.size);
  doc.setTextColor(...PDF_STYLES.colors.text.light);
  doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy')}`, 195, 15, { align: 'right' });

  // Add serial number if available
  if (serialNumber) {
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);
    doc.text(`Document #: ${serialNumber}`, 195, 20, { align: 'right' });
  }

  return doc;
};


export const addStandardFooter = (
  doc: jsPDF,
  footerText: string,
  serialNumber?: string,
  branchName?: string
): void => {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Add blue line across the bottom
    doc.setDrawColor(...PDF_STYLES.colors.primary);
    doc.setLineWidth(1.5);
    doc.line(10, pageHeight - 20, pageWidth - 10, pageHeight - 20);

    // Add thinner red line below the blue line
    doc.setDrawColor(...PDF_STYLES.colors.secondary);
    doc.setLineWidth(0.75);
    doc.line(10, pageHeight - 18, pageWidth - 10, pageHeight - 18);

    // Footer text
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.light);

    if (footerText) {
      doc.text(footerText, 105, pageHeight - 25, { align: 'center' });
    }

    // Page number and hospital name
    const hospitalText = branchName
      ? `Bristol Park Hospital - ${branchName} Branch`
      : 'Bristol Park Hospital';

    doc.text(`Page ${i} of ${pageCount} - ${hospitalText}`, 105, pageHeight - 10, { align: 'center' });

    // Serial number on the right side
    if (serialNumber) {
      doc.text(serialNumber, 195, pageHeight - 10, { align: 'right' });
    }
  }
};


export const addSectionHeading = (doc: jsPDF, text: string, yPos: number): number => {
  doc.setFontSize(PDF_STYLES.fonts.heading.size);
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.text(text, 14, yPos);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, yPos + 2, 196, yPos + 2);

  return yPos + 8;
};


export const generatePatientPDF = (
  patient: any,
  includeVisits = true,
  includeMedicalHistory = true,
  includeInsurance = true,
  branchId?: string
): jsPDF => {
  // Create branded PDF with branch info and serial number
  const doc = createBrandedPDF(
    branchId,
    'PAT', // Document type code for Patient records
    true,  // Include address
    true   // Include logo
  );

  // Generate serial number for this document
  const serialNumber = branchId
    ? generateSerialNumber(branchId, 'PAT')
    : generateSerialNumber('default', 'PAT');

  // Add subtitle
  doc.setFontSize(PDF_STYLES.fonts.subtitle.size);
  doc.setTextColor(...PDF_STYLES.colors.text.dark);
  doc.text('Patient Medical Record', 105, 35, { align: 'center' });

  // Patient information section
  let yPos = 50;
  yPos = addSectionHeading(doc, 'Patient Information', yPos);

  doc.setFontSize(PDF_STYLES.fonts.normal.size);
  doc.setTextColor(...PDF_STYLES.colors.text.dark);

  // Patient details
  doc.text(`Name: ${patient.firstName} ${patient.lastName}`, 14, yPos);
  doc.text(`ID: ${patient.id}`, 120, yPos);
  yPos += 7;

  doc.text(`Gender: ${patient.gender}`, 14, yPos);

  // Calculate age if dateOfBirth is available
  if (patient.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(patient.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    doc.text(`Age: ${age} years`, 120, yPos);
  }
  yPos += 7;

  if (patient.dateOfBirth) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date(patient.dateOfBirth).toLocaleDateString(undefined, options);
    doc.text(`Date of Birth: ${formattedDate}`, 14, yPos);
  }
  doc.text(`Status: ${patient.status}`, 120, yPos);
  yPos += 7;

  doc.text(`Phone: ${patient.phone}`, 14, yPos);
  doc.text(`Blood Group: ${patient.bloodGroup || 'Unknown'}`, 120, yPos);
  yPos += 7;

  if (patient.email) {
    doc.text(`Email: ${patient.email}`, 14, yPos);
  }
  if (patient.nationalId) {
    doc.text(`National ID: ${patient.nationalId}`, 120, yPos);
  }
  yPos += 7;

  if (patient.address) {
    doc.text(`Address: ${patient.address}`, 14, yPos);
  }
  yPos += 12;

  // Insurance information
  if (includeInsurance && patient.insuranceProvider) {
    yPos = addSectionHeading(doc, 'Insurance Information', yPos);

    doc.setFontSize(PDF_STYLES.fonts.normal.size);
    doc.setTextColor(...PDF_STYLES.colors.text.dark);
    doc.text(`Provider: ${patient.insuranceProvider}`, 14, yPos);

    if (patient.insuranceNumber) {
      doc.text(`Policy Number: ${patient.insuranceNumber}`, 120, yPos);
    }
    yPos += 7;

    if (patient.insuranceGroupNumber) {
      doc.text(`Group Number: ${patient.insuranceGroupNumber}`, 14, yPos);
      yPos += 7;
    }

    if (patient.insuranceCoverageType) {
      doc.text(`Coverage Type: ${patient.insuranceCoverageType}`, 14, yPos);
      yPos += 7;
    }

    yPos += 5;
  }

  // Add standard footer with serial number and branch name
  const branchName = branchId ? branchId.charAt(0).toUpperCase() + branchId.slice(1) : undefined;
  addStandardFooter(doc, 'Confidential Medical Record', serialNumber, branchName);

  return doc;
};


export const generatePatientListPDF = (
  patients: any[],
  title = 'Patient Register',
  filters?: any,
  branchId?: string
): jsPDF => {
  // Create branded PDF with branch info and serial number
  const doc = createBrandedPDF(
    branchId,
    'REG', // Document type code for Registers
    true,  // Include address
    true   // Include logo
  );

  // Generate serial number for this document
  const serialNumber = branchId
    ? generateSerialNumber(branchId, 'REG')
    : generateSerialNumber('default', 'REG');

  // Add subtitle
  doc.setFontSize(PDF_STYLES.fonts.subtitle.size);
  doc.setTextColor(...PDF_STYLES.colors.text.dark);
  doc.text(title, 105, 35, { align: 'center' });

  // Add filters if provided
  let yPos = 50;
  if (filters) {
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);
    doc.text('Applied Filters:', 14, yPos);
    yPos += 5;

    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'All') {
        doc.text(`• ${key}: ${value}`, 14, yPos);
        yPos += 5;
      }
    });

    yPos += 5;
  }

  // Prepare table data
  const tableColumn = ["ID", "Name", "Gender", "Age", "Phone", "Status", "Last Visit"];
  const tableRows = patients.map(patient => {
    // Calculate age
    const today = new Date();
    const birthDate = new Date(patient.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Format last visit date if available
    const lastVisit = patient.lastVisit
      ? format(new Date(patient.lastVisit), 'MM/dd/yyyy')
      : 'N/A';

    return [
      patient.id,
      `${patient.firstName} ${patient.lastName}`,
      patient.gender,
      age,
      patient.phone,
      patient.status,
      lastVisit
    ];
  });

  // Add the table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: {
      fillColor: PDF_STYLES.colors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: { fillColor: PDF_STYLES.colors.background.light },
    margin: { top: 10 }
  });

  // Add notes
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(PDF_STYLES.fonts.small.size);
  doc.setTextColor(...PDF_STYLES.colors.text.medium);
  doc.text(`This report includes ${patients.length} patients. Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, finalY);

  // Add standard footer with serial number and branch name
  const branchName = branchId ? branchId.charAt(0).toUpperCase() + branchId.slice(1) : undefined;
  addStandardFooter(doc, 'Bristol Park Hospital - Patient Register', serialNumber, branchName);

  return doc;
};
