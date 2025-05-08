import React from 'react';
import { Shield, Calendar, DollarSign, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface Insurance {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  holderName: string;
  coverageType?: string;
  coverageLimit?: number;
  expiryDate?: string;
}

interface InsuranceInfoProps {
  insurance?: Insurance;
}

export const InsuranceInfo: React.FC<InsuranceInfoProps> = ({ insurance }) => {
  if (!insurance) {
    return (
      <div className="text-center py-8 bg-white rounded-md shadow-sm">
        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900">No Insurance Information</h3>
        <p className="mt-1 text-sm text-gray-500">This patient has no insurance records.</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Check if insurance is active
  const isActive = () => {
    if (!insurance.expiryDate) return true;
    const today = new Date();
    const expiryDate = new Date(insurance.expiryDate);
    return expiryDate > today;
  };

  // Get days until expiry
  const getDaysUntilExpiry = () => {
    if (!insurance.expiryDate) return null;
    const today = new Date();
    const expiryDate = new Date(insurance.expiryDate);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const active = isActive();

  // Get provider icon based on name
  const getProviderIcon = () => {
    const provider = insurance.provider.toLowerCase();
    
    if (provider.includes('sha')) {
      return <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">SHA</div>;
    } else if (provider.includes('jubilee')) {
      return <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">JI</div>;
    } else if (provider.includes('britam')) {
      return <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">BI</div>;
    } else if (provider.includes('aar')) {
      return <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">AAR</div>;
    } else if (provider.includes('cic')) {
      return <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">CIC</div>;
    } else {
      return <Shield className="w-10 h-10 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-3">
        <h3 className="text-lg font-medium text-gray-900">Insurance Information</h3>
      </div>

      <div className="p-4">
        <div className="flex items-center mb-4">
          {getProviderIcon()}
          <div className="ml-3">
            <p className="text-lg font-semibold text-gray-900">{insurance.provider}</p>
            <div className="flex items-center">
              {active ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Expired
                </span>
              )}
              
              {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  {daysUntilExpiry} days remaining
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <FileText className="w-4 h-4 mr-1" />
              <span>Policy Number</span>
            </div>
            <p className="font-medium">{insurance.policyNumber}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <FileText className="w-4 h-4 mr-1" />
              <span>Group Number</span>
            </div>
            <p className="font-medium">{insurance.groupNumber}</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <User className="w-4 h-4 mr-1" />
              <span>Policy Holder</span>
            </div>
            <p className="font-medium">{insurance.holderName}</p>
          </div>
          
          {insurance.coverageType && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Shield className="w-4 h-4 mr-1" />
                <span>Coverage Type</span>
              </div>
              <p className="font-medium">{insurance.coverageType}</p>
            </div>
          )}
          
          {insurance.coverageLimit && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <DollarSign className="w-4 h-4 mr-1" />
                <span>Coverage Limit</span>
              </div>
              <p className="font-medium">{formatCurrency(insurance.coverageLimit)}</p>
            </div>
          )}
          
          {insurance.expiryDate && (
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Expiry Date</span>
              </div>
              <p className="font-medium">{insurance.expiryDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
