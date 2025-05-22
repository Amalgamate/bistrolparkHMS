import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define approval types
export type ApprovalType =
  // Inventory & Procurement
  | 'requisition'
  | 'purchase_order'
  | 'stock_transfer'
  | 'stock_adjustment'
  | 'write_off'
  // HR & Staff
  | 'leave_request'
  | 'shift_swap'
  | 'overtime'
  | 'recruitment'
  // Clinical
  | 'patient_referral'
  | 'discharge'
  | 'procedure'
  | 'treatment_plan'
  // Finance
  | 'budget'
  | 'expense'
  | 'capital_expenditure'
  | 'petty_cash';

// Define approval status
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';

// Define approval priority
export type ApprovalPriority = 'low' | 'medium' | 'high';

// Define approval item
export interface ApprovalItem {
  id: string;
  reference: string;
  type: ApprovalType;
  requestedBy: string;
  requestedDate: string;
  priority: ApprovalPriority;
  status: ApprovalStatus;
  details: any; // This will hold the specific details of the approval item
  approvers: string[];
  currentApprover: string;
  comments: ApprovalComment[];
  history: ApprovalHistory[];
}

// Define approval comment
export interface ApprovalComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
}

// Define approval history
export interface ApprovalHistory {
  id: string;
  action: 'created' | 'approved' | 'rejected' | 'escalated' | 'commented';
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
}

// Define approval workflow
export interface ApprovalWorkflow {
  id: string;
  name: string;
  type: ApprovalType;
  steps: ApprovalStep[];
  active: boolean;
}

// Define approval step
export interface ApprovalStep {
  id: string;
  name: string;
  approverType: 'role' | 'user';
  approverId: string;
  order: number;
  required: boolean;
}

// Define approval delegation
export interface ApprovalDelegation {
  id: string;
  fromUserId: string;
  toUserId: string;
  types: ApprovalType[];
  startDate: string;
  endDate: string;
  active: boolean;
}

// Define context type
interface ApprovalContextType {
  pendingApprovals: ApprovalItem[];
  approvedItems: ApprovalItem[];
  rejectedItems: ApprovalItem[];
  workflows: ApprovalWorkflow[];
  delegations: ApprovalDelegation[];

  // Approval actions
  approveItem: (id: string, comment?: string) => Promise<boolean>;
  rejectItem: (id: string, comment: string) => Promise<boolean>;
  escalateItem: (id: string, toUserId: string, comment: string) => Promise<boolean>;
  addComment: (id: string, comment: string) => Promise<boolean>;

  // Workflow actions
  createWorkflow: (workflow: Omit<ApprovalWorkflow, 'id'>) => Promise<string>;
  updateWorkflow: (id: string, workflow: Partial<ApprovalWorkflow>) => Promise<boolean>;
  deleteWorkflow: (id: string) => Promise<boolean>;

  // Delegation actions
  createDelegation: (delegation: Omit<ApprovalDelegation, 'id'>) => Promise<string>;
  updateDelegation: (id: string, delegation: Partial<ApprovalDelegation>) => Promise<boolean>;
  deleteDelegation: (id: string) => Promise<boolean>;

  // Query functions
  getApprovalById: (id: string) => ApprovalItem | null;
  getApprovalsByType: (type: ApprovalType) => ApprovalItem[];
  getApprovalsByStatus: (status: ApprovalStatus) => ApprovalItem[];
  getApprovalsByUser: (userId: string) => ApprovalItem[];
  getWorkflowById: (id: string) => ApprovalWorkflow | null;
  getWorkflowsByType: (type: ApprovalType) => ApprovalWorkflow[];
}

// Create context with default values
const ApprovalContext = createContext<ApprovalContextType>({
  pendingApprovals: [],
  approvedItems: [],
  rejectedItems: [],
  workflows: [],
  delegations: [],

  approveItem: async () => false,
  rejectItem: async () => false,
  escalateItem: async () => false,
  addComment: async () => false,

  createWorkflow: async () => '',
  updateWorkflow: async () => false,
  deleteWorkflow: async () => false,

  createDelegation: async () => '',
  updateDelegation: async () => false,
  deleteDelegation: async () => false,

  getApprovalById: () => null,
  getApprovalsByType: () => [],
  getApprovalsByStatus: () => [],
  getApprovalsByUser: () => [],
  getWorkflowById: () => null,
  getWorkflowsByType: () => [],
});

// Provider component
export const ApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [approvedItems, setApprovedItems] = useState<ApprovalItem[]>([]);
  const [rejectedItems, setRejectedItems] = useState<ApprovalItem[]>([]);
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  const [delegations, setDelegations] = useState<ApprovalDelegation[]>([]);

  // Approval actions
  const approveItem = async (id: string, comment?: string): Promise<boolean> => {
    // Implementation will connect to API
    // For now, just update the local state
    const item = pendingApprovals.find(a => a.id === id);
    if (!item) return false;

    const updatedItem = {
      ...item,
      status: 'approved' as ApprovalStatus,
      history: [
        ...item.history,
        {
          id: Date.now().toString(),
          action: 'approved',
          userId: 'current-user-id', // This would come from auth context
          userName: 'Current User', // This would come from auth context
          timestamp: new Date().toISOString(),
          details: comment
        }
      ]
    };

    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    setApprovedItems([...approvedItems, updatedItem]);
    return true;
  };

  const rejectItem = async (id: string, comment: string): Promise<boolean> => {
    // Implementation will connect to API
    // For now, just update the local state
    const item = pendingApprovals.find(a => a.id === id);
    if (!item) return false;

    const updatedItem = {
      ...item,
      status: 'rejected' as ApprovalStatus,
      history: [
        ...item.history,
        {
          id: Date.now().toString(),
          action: 'rejected',
          userId: 'current-user-id', // This would come from auth context
          userName: 'Current User', // This would come from auth context
          timestamp: new Date().toISOString(),
          details: comment
        }
      ]
    };

    setPendingApprovals(pendingApprovals.filter(a => a.id !== id));
    setRejectedItems([...rejectedItems, updatedItem]);
    return true;
  };

  const escalateItem = async (id: string, toUserId: string, comment: string): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  const addComment = async (id: string, comment: string): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  // Workflow actions
  const createWorkflow = async (workflow: Omit<ApprovalWorkflow, 'id'>): Promise<string> => {
    // Implementation will connect to API
    return '';
  };

  const updateWorkflow = async (id: string, workflow: Partial<ApprovalWorkflow>): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  const deleteWorkflow = async (id: string): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  // Delegation actions
  const createDelegation = async (delegation: Omit<ApprovalDelegation, 'id'>): Promise<string> => {
    // Implementation will connect to API
    return '';
  };

  const updateDelegation = async (id: string, delegation: Partial<ApprovalDelegation>): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  const deleteDelegation = async (id: string): Promise<boolean> => {
    // Implementation will connect to API
    return false;
  };

  // Query functions
  const getApprovalById = (id: string): ApprovalItem | null => {
    const item = [...pendingApprovals, ...approvedItems, ...rejectedItems].find(a => a.id === id);
    return item || null;
  };

  const getApprovalsByType = (type: ApprovalType): ApprovalItem[] => {
    return [...pendingApprovals, ...approvedItems, ...rejectedItems].filter(a => a.type === type);
  };

  const getApprovalsByStatus = (status: ApprovalStatus): ApprovalItem[] => {
    return [...pendingApprovals, ...approvedItems, ...rejectedItems].filter(a => a.status === status);
  };

  const getApprovalsByUser = (userId: string): ApprovalItem[] => {
    return [...pendingApprovals, ...approvedItems, ...rejectedItems].filter(a => a.currentApprover === userId);
  };

  const getWorkflowById = (id: string): ApprovalWorkflow | null => {
    const workflow = workflows.find(w => w.id === id);
    return workflow || null;
  };

  const getWorkflowsByType = (type: ApprovalType): ApprovalWorkflow[] => {
    return workflows.filter(w => w.type === type);
  };

  return (
    <ApprovalContext.Provider
      value={{
        pendingApprovals,
        approvedItems,
        rejectedItems,
        workflows,
        delegations,

        approveItem,
        rejectItem,
        escalateItem,
        addComment,

        createWorkflow,
        updateWorkflow,
        deleteWorkflow,

        createDelegation,
        updateDelegation,
        deleteDelegation,

        getApprovalById,
        getApprovalsByType,
        getApprovalsByStatus,
        getApprovalsByUser,
        getWorkflowById,
        getWorkflowsByType,
      }}
    >
      {children}
    </ApprovalContext.Provider>
  );
};

// Hook for using the context
export const useApproval = () => {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApproval must be used within an ApprovalProvider');
  }
  return context;
};
