import React from 'react';
import {
  BookOpen,
  DollarSign,
  CreditCard,
  FileText,
  BarChart,
  Landmark,
  Calculator,
  Briefcase,
  Receipt,
  PieChart,
  TrendingUp,
  Calendar,
  CheckSquare,
  Wallet,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface AccountingModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const AccountingModuleMenu: React.FC<AccountingModuleMenuProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    { id: 'chart-of-accounts', label: 'Chart of Accounts', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'general-ledger', label: 'General Ledger', icon: <FileText className="w-4 h-4" /> },
    { id: 'journal-entries', label: 'Journal Entries', icon: <Calculator className="w-4 h-4" /> },
    { id: 'accounts-payable', label: 'Accounts Payable', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'accounts-receivable', label: 'Accounts Receivable', icon: <Receipt className="w-4 h-4" /> },
    { id: 'banking', label: 'Banking', icon: <Landmark className="w-4 h-4" /> },
    { id: 'petty-cash', label: 'Petty Cash', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'budgeting', label: 'Budgeting', icon: <PieChart className="w-4 h-4" /> },
    { id: 'reconciliation', label: 'Reconciliation', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'inpatient-deposits', label: 'Inpatient Cash Deposits', icon: <Wallet className="w-4 h-4" /> },
    { id: 'shifts', label: 'Shift Management', icon: <Clock className="w-4 h-4" /> },
    { id: 'financial-reports', label: 'Financial Reports', icon: <BarChart className="w-4 h-4" /> },
    { id: 'fiscal-periods', label: 'Fiscal Periods', icon: <Calendar className="w-4 h-4" /> },
    { id: 'tax-management', label: 'Tax Management', icon: <Briefcase className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Accounting Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`accounting-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `accounting-${item.id}`
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountingModuleMenu;
