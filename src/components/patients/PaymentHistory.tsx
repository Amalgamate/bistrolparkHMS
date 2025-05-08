import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  Shield, 
  Smartphone, 
  Building, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw
} from 'lucide-react';

interface Payment {
  id: number;
  date: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Mobile Money' | 'Insurance' | 'Corporate';
  paymentType: 'Consultation' | 'Medication' | 'Lab Test' | 'Procedure' | 'Admission' | 'Other';
  reference: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  insuranceProvider?: string;
  insuranceCoverage?: number;
  patientResponsibility?: number;
  description?: string;
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments = [] }) => {
  const [expandedPayment, setExpandedPayment] = useState<number | null>(null);

  const toggleExpand = (paymentId: number) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'Card':
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case 'Mobile Money':
        return <Smartphone className="w-5 h-5 text-purple-600" />;
      case 'Insurance':
        return <Shield className="w-5 h-5 text-indigo-600" />;
      case 'Corporate':
        return <Building className="w-5 h-5 text-orange-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  // Get payment status icon and color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'Paid':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-green-600 bg-green-50',
        };
      case 'Pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-yellow-600 bg-yellow-50',
        };
      case 'Failed':
        return {
          icon: <XCircle className="w-4 h-4" />,
          color: 'text-red-600 bg-red-50',
        };
      case 'Refunded':
        return {
          icon: <RotateCcw className="w-4 h-4" />,
          color: 'text-blue-600 bg-blue-50',
        };
      default:
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          color: 'text-gray-600 bg-gray-50',
        };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-md shadow-sm">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No Payment History</h3>
        <p className="mt-1 text-sm text-gray-500">This patient has no payment records yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
        <span className="text-sm text-gray-500">{payments.length} transactions</span>
      </div>

      <div className="divide-y divide-gray-200">
        {payments.map((payment) => {
          const isExpanded = expandedPayment === payment.id;
          const statusDetails = getStatusDetails(payment.status);

          return (
            <div key={payment.id} className="px-4 py-3">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleExpand(payment.id)}
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getPaymentMethodIcon(payment.paymentMethod)}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {payment.paymentType} - {payment.reference}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{payment.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusDetails.color}`}>
                      {statusDetails.icon}
                      <span className="ml-1">{payment.status}</span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-3 pl-10 pr-2 pb-2 text-sm">
                  <div className="bg-gray-50 rounded-md p-3">
                    {payment.description && (
                      <p className="text-gray-700 mb-2">{payment.description}</p>
                    )}
                    
                    {payment.insuranceProvider && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Insurance Provider</p>
                          <p className="font-medium flex items-center">
                            <Shield className="w-3 h-3 mr-1 text-indigo-600" />
                            {payment.insuranceProvider}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Insurance Coverage</p>
                          <p className="font-medium text-green-600">
                            {formatCurrency(payment.insuranceCoverage || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Patient Responsibility</p>
                          <p className="font-medium">
                            {formatCurrency(payment.patientResponsibility || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="font-medium">{payment.paymentMethod}</p>
                        </div>
                      </div>
                    )}
                    
                    {!payment.insuranceProvider && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-xs text-gray-500">Payment Method</p>
                          <p className="font-medium">{payment.paymentMethod}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Reference</p>
                          <p className="font-medium">{payment.reference}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
