import React from 'react';
import {
  DollarSign,
  CreditCard,
  Receipt,
  TrendingUp,
  FileText,
  BarChart,
  Calendar,
  Landmark,
  BookOpen,
  Stethoscope,
  Truck,
  CheckCircle,
  User,
  AlertTriangle,
  Edit
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface FinanceModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const FinanceModuleMenu: React.FC<FinanceModuleMenuProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    { id: 'transactions', label: 'Transactions', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'accounting', label: 'Accounting', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'accounts', label: 'Accounts', icon: <Landmark className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing', icon: <Receipt className="w-4 h-4" /> },
    { id: 'bill-consultation', label: 'Bill Consultation', icon: <Stethoscope className="w-4 h-4" /> },
    { id: 'bill-transport', label: 'Bill Transport', icon: <Truck className="w-4 h-4" /> },
    { id: 'patient-charges', label: 'Patient Charges', icon: <User className="w-4 h-4" /> },
    { id: 'billing-limits', label: 'Billing Limits', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'invoices', label: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expenses', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'financial-reports', label: 'Financial Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'charges-reports', label: 'Charges Reports', icon: <Edit className="w-4 h-4" /> },
    { id: 'analytics', label: 'Financial Analytics', icon: <BarChart className="w-4 h-4" /> },
    { id: 'fiscal-calendar', label: 'Fiscal Calendar', icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Finance Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`finance-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `finance-${item.id}`
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

export default FinanceModuleMenu;
