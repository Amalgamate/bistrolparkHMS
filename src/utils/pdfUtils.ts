import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';

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
    accent: [245, 184, 0], // #F5B800
    text: {
      dark: [0, 0, 0],
      medium: [80, 80, 80],
      light: [120, 120, 120]
    },
    background: {
      light: [240, 240, 240],
      ultraLight: [248, 249, 250]
    }
  },
  fonts: {
    title: {
      size: 20,
      style: 'bold'
    },
    subtitle: {
      size: 16,
      style: 'normal'
    },
    heading: {
      size: 14,
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
      width: 40,
      height: 40
    },
    headerHeight: 60,
    addressPosition: {
      x: 14,
      y: 60
    },
    contactPosition: {
      x: 14,
      y: 65
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
  const pageWidth = doc.internal.pageSize.width;

  // Generate serial number if branch and document type are provided
  const serialNumber = branchId && documentType
    ? generateSerialNumber(branchId, documentType)
    : '';

  // Create a modern header background
  doc.setFillColor(...PDF_STYLES.colors.primary);
  doc.rect(0, 0, pageWidth, PDF_STYLES.layout.headerHeight, 'F');

  // Add a thin accent line below the header
  doc.setFillColor(...PDF_STYLES.colors.secondary);
  doc.rect(0, PDF_STYLES.layout.headerHeight, pageWidth, 3, 'F');

  // Add logo if enabled
  if (includeLogo) {
    // Create a circular logo background
    doc.setFillColor(255, 255, 255);
    const logoX = PDF_STYLES.layout.logoPosition.x;
    const logoY = PDF_STYLES.layout.logoPosition.y;
    const logoWidth = PDF_STYLES.layout.logoPosition.width;
    const logoHeight = PDF_STYLES.layout.logoPosition.height;

    // Draw white circle for logo background
    doc.circle(logoX + logoWidth/2, logoY + logoHeight/2, logoWidth/2, 'F');

    // Add hospital initials in primary color
    doc.setTextColor(...PDF_STYLES.colors.primary);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(
      'BPH',
      logoX + logoWidth/2,
      logoY + logoHeight/2 + 6,
      { align: 'center' }
    );
  }

  // Add title and branch name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(PDF_STYLES.fonts.title.size);
  doc.setFont(undefined, 'bold');
  doc.text('BRISTOL PARK HOSPITAL', pageWidth/2, 25, { align: 'center' });

  // Add branch name if provided
  if (branchId) {
    const branchName = branchId.charAt(0).toUpperCase() + branchId.slice(1);
    doc.setFontSize(PDF_STYLES.fonts.subtitle.size);
    doc.setFont(undefined, 'normal');
    doc.text(`${branchName} Branch`, pageWidth/2, 40, { align: 'center' });
  }

  // Add contact information
  const phoneNumber = '+254 700 123 456';
  const email = 'info@bristolparkhospital.com';
  const website = 'www.bristolparkhospital.com';

  doc.setFontSize(PDF_STYLES.fonts.small.size);
  doc.setTextColor(255, 255, 255);
  doc.text(`Tel: ${phoneNumber} | Email: ${email} | ${website}`, pageWidth/2, 50, { align: 'center' });

  // Add address if requested
  if (includeAddress && branchId) {
    // This would ideally come from the settings context
    const addressMap: Record<string, string> = {
      'fedha': '123 Fedha Road, Nairobi, Kenya',
      'utawala': '45 Utawala Road, Nairobi, Kenya',
      'machakos': '78 Machakos Street, Machakos, Kenya',
      'tassia': '90 Tassia Avenue, Nairobi, Kenya',
      'kitengela': '56 Kitengela Road, Kajiado, Kenya'
    };

    const address = addressMap[branchId] || 'Bristol Park Hospital, Nairobi, Kenya';

    // Add address below the header
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);
    doc.text(`Address: ${address}`, 14, PDF_STYLES.layout.headerHeight + 10);
  }

  // Add document information box on the right side
  const infoBoxWidth = 80;
  const infoBoxHeight = 30;
  const infoBoxX = pageWidth - infoBoxWidth - 14;
  const infoBoxY = PDF_STYLES.layout.headerHeight + 10;

  // Draw info box with light background
  doc.setFillColor(...PDF_STYLES.colors.background.ultraLight);
  doc.setDrawColor(...PDF_STYLES.colors.primary);
  doc.roundedRect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, 2, 2, 'FD');

  // Add document info
  doc.setFontSize(PDF_STYLES.fonts.small.size);
  doc.setTextColor(...PDF_STYLES.colors.text.medium);

  // Add generation date
  doc.text(`Generated: ${format(new Date(), 'MMMM d, yyyy')}`, infoBoxX + 5, infoBoxY + 10);

  // Add serial number if available
  if (serialNumber) {
    doc.text(`Document #: ${serialNumber}`, infoBoxX + 5, infoBoxY + 20);
  }

  // Add document type if available
  if (documentType) {
    const documentTypeMap: Record<string, string> = {
      'PAT': 'Patient Record',
      'REG': 'Patient Register',
      'INV': 'Invoice',
      'REC': 'Receipt',
      'LAB': 'Lab Results',
      'PRE': 'Prescription'
    };

    const docTypeName = documentTypeMap[documentType] || documentType;
    doc.setFontSize(PDF_STYLES.fonts.normal.size);
    doc.setTextColor(...PDF_STYLES.colors.primary);
    doc.text(`Document Type: ${docTypeName}`, infoBoxX + 5, infoBoxY + 30);
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

    // Add footer background
    doc.setFillColor(...PDF_STYLES.colors.background.ultraLight);
    doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');

    // Add blue line across the top of the footer
    doc.setDrawColor(...PDF_STYLES.colors.primary);
    doc.setLineWidth(1.5);
    doc.line(0, pageHeight - 25, pageWidth, pageHeight - 25);

    // Add thinner red line below the blue line
    doc.setDrawColor(...PDF_STYLES.colors.secondary);
    doc.setLineWidth(0.75);
    doc.line(0, pageHeight - 23, pageWidth, pageHeight - 23);

    // Footer text
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);

    if (footerText) {
      doc.text(footerText, pageWidth/2, pageHeight - 18, { align: 'center' });
    }

    // Left side: Hospital contact info
    doc.setFontSize(PDF_STYLES.fonts.small.size);
    doc.setTextColor(...PDF_STYLES.colors.text.medium);
    doc.text('Tel: +254 700 123 456 | www.bristolparkhospital.com', 14, pageHeight - 10);

    // Center: Page number and hospital name
    const hospitalText = branchName
      ? `Bristol Park Hospital - ${branchName} Branch`
      : 'Bristol Park Hospital';

    doc.text(`Page ${i} of ${pageCount}`, pageWidth/2, pageHeight - 10, { align: 'center' });

    // Right side: Serial number and copyright
    const currentYear = new Date().getFullYear();
    if (serialNumber) {
      doc.text(`${serialNumber} | © ${currentYear}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    } else {
      doc.text(`© ${currentYear} Bristol Park Hospital`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }
  }
};


export const addSectionHeading = (doc: jsPDF, text: string, yPos: number): number => {
  // Add a subtle background for the section heading
  const pageWidth = doc.internal.pageSize.width;
  doc.setFillColor(...PDF_STYLES.colors.background.ultraLight);
  doc.setDrawColor(...PDF_STYLES.colors.primary);
  doc.roundedRect(10, yPos - 6, pageWidth - 20, 10, 1, 1, 'FD');

  // Add section heading text
  doc.setFontSize(PDF_STYLES.fonts.heading.size);
  doc.setTextColor(...PDF_STYLES.colors.primary);
  doc.setFont(undefined, 'bold');
  doc.text(text, 14, yPos);

  // Add a small accent indicator
  doc.setFillColor(...PDF_STYLES.colors.secondary);
  doc.rect(14, yPos + 3, 30, 1, 'F');

  return yPos + 10;
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
    // Calculate or use provided age
    let age: number | string;

    if (typeof patient.age === 'number') {
      // If age is already provided, use it
      age = patient.age;
    } else {
      try {
        // Try to calculate from dateOfBirth
        const today = new Date();
        const birthDate = new Date(patient.dateOfBirth);
        age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
      } catch (error) {
        console.error('Error calculating age:', error);
        age = 'N/A';
      }
    }

    // Format last visit date if available
    let lastVisit = 'N/A';
    try {
      if (patient.lastVisit) {
        // Check if lastVisit is already a formatted string (like "10 May 2024")
        if (typeof patient.lastVisit === 'string' && patient.lastVisit.includes(' ')) {
          lastVisit = patient.lastVisit;
        } else {
          // Try to parse as a date
          lastVisit = format(new Date(patient.lastVisit), 'MM/dd/yyyy');
        }
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      lastVisit = String(patient.lastVisit || 'N/A');
    }

    // Handle name formatting
    let fullName: string;
    if (patient.name) {
      // If full name is already provided
      fullName = patient.name;
    } else if (patient.firstName || patient.lastName) {
      // Construct from first and last name
      fullName = `${patient.firstName || ''} ${patient.lastName || ''}`.trim();
    } else {
      // Fallback
      fullName = 'Unknown';
    }

    return [
      patient.id || 'N/A',
      fullName,
      patient.gender || 'N/A',
      age,
      patient.phone || 'N/A',
      patient.status || 'N/A',
      lastVisit
    ];
  });

  // Add the table using the imported autoTable function
  autoTable(doc, {
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

  // Add notes - get the final Y position after the table
  const finalY = (doc as any).lastAutoTable?.finalY + 10 || yPos + 50;
  doc.setFontSize(PDF_STYLES.fonts.small.size);
  doc.setTextColor(...PDF_STYLES.colors.text.medium);
  doc.text(`This report includes ${patients.length} patients. Generated on ${format(new Date(), 'MMMM d, yyyy')}`, 14, finalY);

  // Add standard footer with serial number and branch name
  const branchName = branchId ? branchId.charAt(0).toUpperCase() + branchId.slice(1) : undefined;
  addStandardFooter(doc, 'Bristol Park Hospital - Patient Register', serialNumber, branchName);

  return doc;
};
