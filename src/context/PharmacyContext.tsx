import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from './ToastContext';
import { useRealTimeNotification } from './RealTimeNotificationContext';

// Define types
export type MedicationStatus = 'pending' | 'dispensed' | 'partially_dispensed' | 'out_of_stock' | 'cancelled';
export type PatientType = 'outpatient' | 'inpatient' | 'walkin';
export type TransferType = 'internal' | 'external';
export type StockTakeStatus = 'pending' | 'in_progress' | 'completed';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  dispensed?: number;
  status?: MedicationStatus;
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  tokenNumber: number;
  doctorId: string;
  doctorName: string;
  medications: Medication[];
  status: MedicationStatus;
  createdAt: string;
  updatedAt: string;
  dispensedAt?: string;
  dispensedBy?: string;
  paymentStatus?: 'pending' | 'paid' | 'insurance' | 'waived';
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  totalAmount?: number;
  notes?: string;
  patientType?: PatientType;
  isWalkIn?: boolean;
  isConfirmed?: boolean;
}

export interface MedicationInventory {
  id: string;
  name: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
  location: string;
  branch: string;
  createdAt: string;
  updatedAt: string;
  isExpired?: boolean;
  isExpiringSoon?: boolean;
}

export interface StockMovement {
  id: string;
  medicationId: string;
  medicationName: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason?: string;
  performedBy: string;
  performedAt: string;
  reference?: string;
}

export interface MedicationTransfer {
  id: string;
  transferType: TransferType;
  fromLocation: string;
  toLocation: string;
  medications: Array<{
    medicationId: string;
    medicationName: string;
    quantity: number;
  }>;
  status: 'pending' | 'completed' | 'cancelled';
  requestedBy: string;
  requestedAt: string;
  completedBy?: string;
  completedAt?: string;
  notes?: string;
}

export interface StockTake {
  id: string;
  name: string;
  status: StockTakeStatus;
  startDate: string;
  endDate?: string;
  location: string;
  branch: string;
  conductedBy: string;
  items: Array<{
    medicationId: string;
    medicationName: string;
    expectedQuantity: number;
    actualQuantity: number;
    discrepancy: number;
    notes?: string;
  }>;
  notes?: string;
}

// Define context type
interface PharmacyContextType {
  prescriptions: Prescription[];
  medicationInventory: MedicationInventory[];
  stockMovements: StockMovement[];
  medicationTransfers: MedicationTransfer[];
  stockTakes: StockTake[];

  // Prescription management
  getPrescription: (id: string) => Prescription | undefined;
  getPrescriptionsByPatient: (patientId: string) => Prescription[];
  getPrescriptionsByStatus: (status: MedicationStatus) => Prescription[];
  updatePrescriptionStatus: (id: string, status: MedicationStatus, notes?: string) => void;
  dispenseMedication: (prescriptionId: string, medicationId: string, quantity: number) => void;
  dispensePrescription: (prescriptionId: string, dispensedBy: string) => void;
  createWalkInPrescription: (prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  confirmPrescription: (id: string) => void;
  dispenseDrugs: (prescriptionId: string, patientType: PatientType, dispensedBy: string) => void;
  reverseConfirmedRequest: (id: string, reason: string) => void;
  deleteUndispensedDrugs: (prescriptionId: string, reason: string) => void;

  // Inventory management
  getMedication: (id: string) => MedicationInventory | undefined;
  getMedicationsByCategory: (category: string) => MedicationInventory[];
  addMedicationToInventory: (medication: Omit<MedicationInventory, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMedicationInventory: (id: string, updates: Partial<MedicationInventory>) => void;
  checkMedicationAvailability: (medicationName: string, quantity: number) => { available: boolean; currentStock: number };
  editMedicationDetails: (id: string, updates: Partial<MedicationInventory>) => void;

  // Stock movement and reporting
  getStockMovements: (medicationId?: string) => StockMovement[];
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'performedAt'>) => void;
  getStockMovementSummary: (startDate: string, endDate: string) => Array<{
    medicationId: string;
    medicationName: string;
    openingBalance: number;
    received: number;
    dispensed: number;
    adjusted: number;
    transferred: number;
    closingBalance: number;
  }>;

  // Stock reorder and expiry
  getStockReorderReport: () => Array<MedicationInventory>;
  getMedicineExpiryReport: (months?: number) => Array<MedicationInventory>;

  // Stock take
  createStockTake: (stockTake: Omit<StockTake, 'id' | 'status'>) => void;
  updateStockTake: (id: string, updates: Partial<StockTake>) => void;
  getStockTake: (id: string) => StockTake | undefined;
  getStockTakeReport: (id: string) => StockTake | undefined;

  // Internal transfers
  createMedicationTransfer: (transfer: Omit<MedicationTransfer, 'id' | 'requestedAt' | 'status'>) => void;
  updateMedicationTransfer: (id: string, updates: Partial<MedicationTransfer>) => void;
  getMedicationTransfer: (id: string) => MedicationTransfer | undefined;
  getMedicationTransferReport: () => Array<MedicationTransfer>;

  // Pharmacy returns
  createPharmacyReturn: (medicationId: string, quantity: number, reason: string, returnedBy: string) => void;
  getPharmacyReturnsReport: (startDate: string, endDate: string) => Array<{
    medicationId: string;
    medicationName: string;
    quantity: number;
    reason: string;
    returnedBy: string;
    returnedAt: string;
  }>;

  // Pricing
  updateMedicationPrice: (id: string, newPrice: number) => void;
  getMedicationPrices: () => Array<{
    medicationId: string;
    medicationName: string;
    unitPrice: number;
    lastUpdated: string;
  }>;
}

// Create context
const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

// Sample initial data for prescriptions
const initialPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientId: 'P001',
    patientName: 'John Doe',
    tokenNumber: 101,
    doctorId: 'D001',
    doctorName: 'Dr. Sarah Johnson',
    medications: [
      {
        id: 'M001',
        name: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Three times daily',
        duration: '7 days',
        instructions: 'Take after meals',
        quantity: 21,
        status: 'pending'
      },
      {
        id: 'M002',
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'As needed',
        duration: '3 days',
        instructions: 'Take for fever or pain',
        quantity: 9,
        status: 'pending'
      }
    ],
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    paymentStatus: 'pending'
  }
];

// Sample initial data for medication inventory
const initialMedicationInventory: MedicationInventory[] = [
  {
    id: 'INV001',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'ABC Pharmaceuticals',
    batchNumber: 'B12345',
    expiryDate: '2025-12-31',
    quantity: 500,
    reorderLevel: 100,
    unitPrice: 15.0,
    location: 'Shelf A1',
    branch: 'Fedha',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'INV002',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesics',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'XYZ Pharmaceuticals',
    batchNumber: 'B67890',
    expiryDate: '2025-06-30',
    quantity: 1000,
    reorderLevel: 200,
    unitPrice: 5.0,
    location: 'Shelf B2',
    branch: 'Fedha',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample initial data for stock movements
const initialStockMovements: StockMovement[] = [
  {
    id: 'SM001',
    medicationId: 'INV001',
    medicationName: 'Amoxicillin',
    type: 'in',
    quantity: 100,
    reason: 'Initial stock',
    performedBy: 'Admin',
    performedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    reference: 'PO12345'
  }
];

// Sample initial data for medication transfers
const initialMedicationTransfers: MedicationTransfer[] = [];

// Sample initial data for stock takes
const initialStockTakes: StockTake[] = [];

// Provider component
export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [medicationInventory, setMedicationInventory] = useState<MedicationInventory[]>(initialMedicationInventory);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [medicationTransfers, setMedicationTransfers] = useState<MedicationTransfer[]>(initialMedicationTransfers);
  const [stockTakes, setStockTakes] = useState<StockTake[]>(initialStockTakes);
  const { showToast } = useToast();
  const { notifyPrescriptionReady, notifyRole } = useRealTimeNotification();

  // Prescription management functions
  const getPrescription = useCallback((id: string) => {
    return prescriptions.find(prescription => prescription.id === id);
  }, [prescriptions]);

  const getPrescriptionsByPatient = useCallback((patientId: string) => {
    return prescriptions.filter(prescription => prescription.patientId === patientId);
  }, [prescriptions]);

  const getPrescriptionsByStatus = useCallback((status: MedicationStatus) => {
    return prescriptions.filter(prescription => prescription.status === status);
  }, [prescriptions]);

  const updatePrescriptionStatus = useCallback((id: string, status: MedicationStatus, notes?: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== id) return prescription;

      return {
        ...prescription,
        status,
        notes: notes ? (prescription.notes ? `${prescription.notes}\n${notes}` : notes) : prescription.notes,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const dispenseMedication = useCallback((prescriptionId: string, medicationId: string, quantity: number) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== prescriptionId) return prescription;

      const updatedMedications = prescription.medications.map(medication => {
        if (medication.id !== medicationId) return medication;

        const dispensed = (medication.dispensed || 0) + quantity;
        const status: MedicationStatus =
          dispensed >= medication.quantity ? 'dispensed' :
          dispensed > 0 ? 'partially_dispensed' : 'pending';

        return {
          ...medication,
          dispensed,
          status
        };
      });

      // Check if all medications are dispensed
      const allDispensed = updatedMedications.every(med => med.status === 'dispensed');
      const anyDispensed = updatedMedications.some(med => med.status === 'dispensed' || med.status === 'partially_dispensed');

      const newStatus: MedicationStatus =
        allDispensed ? 'dispensed' :
        anyDispensed ? 'partially_dispensed' : 'pending';

      return {
        ...prescription,
        medications: updatedMedications,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
    }));

    // Update inventory
    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      const medication = prescription.medications.find(m => m.id === medicationId);
      if (medication) {
        updateMedicationInventory(medication.name, quantity);
      }
    }
  }, [prescriptions]);

  const dispensePrescription = useCallback((prescriptionId: string, dispensedBy: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== prescriptionId) return prescription;

      return {
        ...prescription,
        status: 'dispensed',
        dispensedAt: new Date().toISOString(),
        dispensedBy,
        updatedAt: new Date().toISOString()
      };
    }));

    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      showToast('success', `Prescription for ${prescription.patientName} has been dispensed`);

      // Notify patient
      notifyRole('front_office', 'PRESCRIPTION_DISPENSED',
        `Prescription for patient ${prescription.patientName} (Token #${prescription.tokenNumber}) has been dispensed`,
        {
          patientId: prescription.patientId,
          patientName: prescription.patientName,
          tokenNumber: prescription.tokenNumber,
          priority: 'normal'
        }
      );
    }
  }, [prescriptions, showToast, notifyRole]);

  // Inventory management functions
  const getMedication = useCallback((id: string) => {
    return medicationInventory.find(medication => medication.id === id);
  }, [medicationInventory]);

  const getMedicationsByCategory = useCallback((category: string) => {
    return medicationInventory.filter(medication => medication.category === category);
  }, [medicationInventory]);

  const addMedicationToInventory = useCallback((medication: Omit<MedicationInventory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMedication: MedicationInventory = {
      ...medication,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setMedicationInventory(prev => [...prev, newMedication]);
    showToast('success', `${medication.name} added to inventory`);
  }, [showToast]);

  const updateMedicationInventory = useCallback((medicationName: string, quantityDispensed: number) => {
    setMedicationInventory(prev => prev.map(medication => {
      if (medication.name !== medicationName) return medication;

      const newQuantity = medication.quantity - quantityDispensed;

      // Check if reorder level is reached
      if (newQuantity <= medication.reorderLevel) {
        showToast('warning', `${medication.name} inventory is low (${newQuantity} remaining). Please reorder.`);

        // Notify pharmacy manager
        notifyRole('pharmacy', 'INVENTORY_LOW',
          `${medication.name} inventory is low (${newQuantity} remaining). Please reorder.`,
          {
            medicationName: medication.name,
            currentStock: newQuantity,
            reorderLevel: medication.reorderLevel,
            priority: 'high'
          }
        );
      }

      return {
        ...medication,
        quantity: newQuantity,
        updatedAt: new Date().toISOString()
      };
    }));
  }, [showToast, notifyRole]);

  const updateMedicationInventoryById = useCallback((id: string, updates: Partial<MedicationInventory>) => {
    setMedicationInventory(prev => prev.map(medication => {
      if (medication.id !== id) return medication;

      return {
        ...medication,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const checkMedicationAvailability = useCallback((medicationName: string, quantity: number) => {
    const medication = medicationInventory.find(med => med.name === medicationName);

    if (!medication) {
      return { available: false, currentStock: 0 };
    }

    return {
      available: medication.quantity >= quantity,
      currentStock: medication.quantity
    };
  }, [medicationInventory]);

  // New prescription management functions
  const createWalkInPrescription = useCallback((prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newPrescription: Prescription = {
      ...prescription,
      id: `RX${uuidv4().substring(0, 8)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isWalkIn: true,
      patientType: 'walkin'
    };

    setPrescriptions(prev => [...prev, newPrescription]);
    showToast('success', `Walk-in prescription created for ${prescription.patientName}`);
  }, [showToast]);

  const confirmPrescription = useCallback((id: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== id) return prescription;

      return {
        ...prescription,
        isConfirmed: true,
        updatedAt: new Date().toISOString()
      };
    }));

    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      showToast('success', `Prescription for ${prescription.patientName} has been confirmed`);
    }
  }, [prescriptions, showToast]);

  const dispenseDrugs = useCallback((prescriptionId: string, patientType: PatientType, dispensedBy: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== prescriptionId) return prescription;

      return {
        ...prescription,
        status: 'dispensed',
        patientType,
        dispensedAt: new Date().toISOString(),
        dispensedBy,
        updatedAt: new Date().toISOString()
      };
    }));

    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      showToast('success', `Drugs for ${prescription.patientName} (${patientType}) have been dispensed`);

      // Add stock movement for each medication
      prescription.medications.forEach(medication => {
        if (medication.dispensed && medication.dispensed > 0) {
          addStockMovement({
            medicationId: medication.id,
            medicationName: medication.name,
            type: 'out',
            quantity: medication.dispensed,
            reason: `Dispensed to ${prescription.patientName} (${patientType})`,
            performedBy: dispensedBy,
            reference: prescriptionId
          });
        }
      });
    }
  }, [prescriptions, showToast]);

  const reverseConfirmedRequest = useCallback((id: string, reason: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== id) return prescription;

      return {
        ...prescription,
        isConfirmed: false,
        notes: prescription.notes ? `${prescription.notes}\nReversed: ${reason}` : `Reversed: ${reason}`,
        updatedAt: new Date().toISOString()
      };
    }));

    const prescription = prescriptions.find(p => p.id === id);
    if (prescription) {
      showToast('info', `Confirmed request for ${prescription.patientName} has been reversed`);
    }
  }, [prescriptions, showToast]);

  const deleteUndispensedDrugs = useCallback((prescriptionId: string, reason: string) => {
    setPrescriptions(prev => prev.map(prescription => {
      if (prescription.id !== prescriptionId) return prescription;

      return {
        ...prescription,
        status: 'cancelled',
        notes: prescription.notes ? `${prescription.notes}\nDeleted: ${reason}` : `Deleted: ${reason}`,
        updatedAt: new Date().toISOString()
      };
    }));

    const prescription = prescriptions.find(p => p.id === prescriptionId);
    if (prescription) {
      showToast('info', `Undispensed drugs for ${prescription.patientName} have been deleted`);
    }
  }, [prescriptions, showToast]);

  // New inventory management functions
  const editMedicationDetails = useCallback((id: string, updates: Partial<MedicationInventory>) => {
    setMedicationInventory(prev => prev.map(medication => {
      if (medication.id !== id) return medication;

      return {
        ...medication,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }));

    const medication = medicationInventory.find(m => m.id === id);
    if (medication) {
      showToast('success', `${medication.name} details have been updated`);
    }
  }, [medicationInventory, showToast]);

  // Stock movement functions
  const getStockMovements = useCallback((medicationId?: string) => {
    if (medicationId) {
      return stockMovements.filter(movement => movement.medicationId === medicationId);
    }
    return stockMovements;
  }, [stockMovements]);

  const addStockMovement = useCallback((movement: Omit<StockMovement, 'id' | 'performedAt'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: `SM${uuidv4().substring(0, 8)}`,
      performedAt: new Date().toISOString()
    };

    setStockMovements(prev => [...prev, newMovement]);

    // Update inventory quantity based on movement type
    if (movement.medicationId) {
      setMedicationInventory(prev => prev.map(medication => {
        if (medication.id !== movement.medicationId && medication.name !== movement.medicationName) return medication;

        let quantityChange = 0;
        switch (movement.type) {
          case 'in':
            quantityChange = movement.quantity;
            break;
          case 'out':
            quantityChange = -movement.quantity;
            break;
          case 'adjustment':
            quantityChange = movement.quantity; // Can be positive or negative
            break;
          case 'transfer':
            // For transfers, we handle separately based on from/to location
            if (medication.location === movement.fromLocation) {
              quantityChange = -movement.quantity;
            } else if (medication.location === movement.toLocation) {
              quantityChange = movement.quantity;
            }
            break;
        }

        return {
          ...medication,
          quantity: medication.quantity + quantityChange,
          updatedAt: new Date().toISOString()
        };
      }));
    }
  }, []);

  const getStockMovementSummary = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Filter movements within date range
    const filteredMovements = stockMovements.filter(movement => {
      const movementDate = new Date(movement.performedAt).getTime();
      return movementDate >= start && movementDate <= end;
    });

    // Group by medication
    const medicationMap = new Map<string, {
      medicationId: string;
      medicationName: string;
      openingBalance: number;
      received: number;
      dispensed: number;
      adjusted: number;
      transferred: number;
      closingBalance: number;
    }>();

    // Initialize with all medications in inventory
    medicationInventory.forEach(medication => {
      medicationMap.set(medication.id, {
        medicationId: medication.id,
        medicationName: medication.name,
        openingBalance: 0, // Will calculate below
        received: 0,
        dispensed: 0,
        adjusted: 0,
        transferred: 0,
        closingBalance: medication.quantity
      });
    });

    // Calculate movements
    filteredMovements.forEach(movement => {
      const entry = medicationMap.get(movement.medicationId);
      if (!entry) return;

      switch (movement.type) {
        case 'in':
          entry.received += movement.quantity;
          break;
        case 'out':
          entry.dispensed += movement.quantity;
          break;
        case 'adjustment':
          entry.adjusted += movement.quantity;
          break;
        case 'transfer':
          entry.transferred += movement.quantity;
          break;
      }
    });

    // Calculate opening balance (closing - (received - dispensed - adjusted - transferred))
    medicationMap.forEach(entry => {
      entry.openingBalance = entry.closingBalance - (entry.received - entry.dispensed - entry.adjusted - entry.transferred);
    });

    return Array.from(medicationMap.values());
  }, [stockMovements, medicationInventory]);

  // Stock reorder and expiry functions
  const getStockReorderReport = useCallback(() => {
    return medicationInventory.filter(medication => medication.quantity <= medication.reorderLevel);
  }, [medicationInventory]);

  const getMedicineExpiryReport = useCallback((months: number = 3) => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + months);

    return medicationInventory.filter(medication => {
      const expiryDate = new Date(medication.expiryDate);
      return expiryDate <= futureDate;
    }).map(medication => ({
      ...medication,
      isExpiringSoon: true,
      isExpired: new Date(medication.expiryDate) <= today
    }));
  }, [medicationInventory]);

  // Stock take functions
  const createStockTake = useCallback((stockTake: Omit<StockTake, 'id' | 'status'>) => {
    const newStockTake: StockTake = {
      ...stockTake,
      id: `ST${uuidv4().substring(0, 8)}`,
      status: 'pending'
    };

    setStockTakes(prev => [...prev, newStockTake]);
    showToast('success', `Stock take "${stockTake.name}" has been created`);
  }, [showToast]);

  const updateStockTake = useCallback((id: string, updates: Partial<StockTake>) => {
    setStockTakes(prev => prev.map(stockTake => {
      if (stockTake.id !== id) return stockTake;

      return {
        ...stockTake,
        ...updates
      };
    }));

    const stockTake = stockTakes.find(st => st.id === id);
    if (stockTake) {
      showToast('success', `Stock take "${stockTake.name}" has been updated`);

      // If status changed to completed, update inventory based on actual counts
      if (updates.status === 'completed' && stockTake.status !== 'completed') {
        stockTake.items.forEach(item => {
          if (item.discrepancy !== 0) {
            // Add adjustment stock movement
            addStockMovement({
              medicationId: item.medicationId,
              medicationName: item.medicationName,
              type: 'adjustment',
              quantity: item.discrepancy,
              reason: `Stock take adjustment: ${stockTake.name}`,
              performedBy: stockTake.conductedBy,
              reference: stockTake.id
            });
          }
        });
      }
    }
  }, [stockTakes, showToast, addStockMovement]);

  const getStockTake = useCallback((id: string) => {
    return stockTakes.find(stockTake => stockTake.id === id);
  }, [stockTakes]);

  const getStockTakeReport = getStockTake;

  // Internal transfers functions
  const createMedicationTransfer = useCallback((transfer: Omit<MedicationTransfer, 'id' | 'requestedAt' | 'status'>) => {
    const newTransfer: MedicationTransfer = {
      ...transfer,
      id: `TR${uuidv4().substring(0, 8)}`,
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };

    setMedicationTransfers(prev => [...prev, newTransfer]);
    showToast('success', `Medication transfer from ${transfer.fromLocation} to ${transfer.toLocation} has been created`);
  }, [showToast]);

  const updateMedicationTransfer = useCallback((id: string, updates: Partial<MedicationTransfer>) => {
    setMedicationTransfers(prev => prev.map(transfer => {
      if (transfer.id !== id) return transfer;

      return {
        ...transfer,
        ...updates
      };
    }));

    const transfer = medicationTransfers.find(t => t.id === id);
    if (transfer) {
      showToast('success', `Medication transfer has been updated`);

      // If status changed to completed, create stock movements
      if (updates.status === 'completed' && transfer.status !== 'completed') {
        transfer.medications.forEach(med => {
          addStockMovement({
            medicationId: med.medicationId,
            medicationName: med.medicationName,
            type: 'transfer',
            quantity: med.quantity,
            fromLocation: transfer.fromLocation,
            toLocation: transfer.toLocation,
            reason: `Transfer: ${transfer.transferType}`,
            performedBy: updates.completedBy || transfer.requestedBy,
            reference: transfer.id
          });
        });
      }
    }
  }, [medicationTransfers, showToast, addStockMovement]);

  const getMedicationTransfer = useCallback((id: string) => {
    return medicationTransfers.find(transfer => transfer.id === id);
  }, [medicationTransfers]);

  const getMedicationTransferReport = useCallback(() => {
    return medicationTransfers;
  }, [medicationTransfers]);

  // Pharmacy returns functions
  const createPharmacyReturn = useCallback((medicationId: string, quantity: number, reason: string, returnedBy: string) => {
    const medication = medicationInventory.find(med => med.id === medicationId);
    if (!medication) {
      showToast('error', 'Medication not found');
      return;
    }

    // Add stock movement for return
    addStockMovement({
      medicationId,
      medicationName: medication.name,
      type: 'in',
      quantity,
      reason: `Return: ${reason}`,
      performedBy: returnedBy,
      reference: `RET${Date.now()}`
    });

    showToast('success', `${quantity} units of ${medication.name} have been returned`);
  }, [medicationInventory, showToast, addStockMovement]);

  const getPharmacyReturnsReport = useCallback((startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    // Filter return movements within date range
    return stockMovements
      .filter(movement => {
        const movementDate = new Date(movement.performedAt).getTime();
        return (
          movementDate >= start &&
          movementDate <= end &&
          movement.type === 'in' &&
          movement.reason.startsWith('Return:')
        );
      })
      .map(movement => ({
        medicationId: movement.medicationId,
        medicationName: movement.medicationName,
        quantity: movement.quantity,
        reason: movement.reason.replace('Return: ', ''),
        returnedBy: movement.performedBy,
        returnedAt: movement.performedAt
      }));
  }, [stockMovements]);

  // Pricing functions
  const updateMedicationPrice = useCallback((id: string, newPrice: number) => {
    setMedicationInventory(prev => prev.map(medication => {
      if (medication.id !== id) return medication;

      return {
        ...medication,
        unitPrice: newPrice,
        updatedAt: new Date().toISOString()
      };
    }));

    const medication = medicationInventory.find(m => m.id === id);
    if (medication) {
      showToast('success', `Price for ${medication.name} has been updated to ${newPrice}`);
    }
  }, [medicationInventory, showToast]);

  const getMedicationPrices = useCallback(() => {
    return medicationInventory.map(medication => ({
      medicationId: medication.id,
      medicationName: medication.name,
      unitPrice: medication.unitPrice,
      lastUpdated: medication.updatedAt
    }));
  }, [medicationInventory]);

  return (
    <PharmacyContext.Provider
      value={{
        prescriptions,
        medicationInventory,
        stockMovements,
        medicationTransfers,
        stockTakes,

        // Prescription management
        getPrescription,
        getPrescriptionsByPatient,
        getPrescriptionsByStatus,
        updatePrescriptionStatus,
        dispenseMedication,
        dispensePrescription,
        createWalkInPrescription,
        confirmPrescription,
        dispenseDrugs,
        reverseConfirmedRequest,
        deleteUndispensedDrugs,

        // Inventory management
        getMedication,
        getMedicationsByCategory,
        addMedicationToInventory,
        updateMedicationInventory: updateMedicationInventoryById,
        checkMedicationAvailability,
        editMedicationDetails,

        // Stock movement and reporting
        getStockMovements,
        addStockMovement,
        getStockMovementSummary,

        // Stock reorder and expiry
        getStockReorderReport,
        getMedicineExpiryReport,

        // Stock take
        createStockTake,
        updateStockTake,
        getStockTake,
        getStockTakeReport,

        // Internal transfers
        createMedicationTransfer,
        updateMedicationTransfer,
        getMedicationTransfer,
        getMedicationTransferReport,

        // Pharmacy returns
        createPharmacyReturn,
        getPharmacyReturnsReport,

        // Pricing
        updateMedicationPrice,
        getMedicationPrices
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

// Hook for using the context
export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (context === undefined) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
