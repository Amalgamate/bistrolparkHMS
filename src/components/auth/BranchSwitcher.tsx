import React, { useState, useRef, useEffect } from 'react';
import { Building, MapPin, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';

const BranchSwitcher: React.FC = () => {
  const { user, switchBranch } = useAuth();
  const { branches } = useSettings();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter branches to only show those the user has access to
  const allowedBranches = branches.filter(branch =>
    user?.allowedBranches?.includes(branch.id)
  );

  // Don't show the component if user only has access to one branch
  if (!user || allowedBranches.length <= 1) {
    return null;
  }

  const handleBranchSwitch = async (branchId: string) => {
    if (branchId === user.branch) {
      setIsOpen(false);
      return;
    }

    setSelectedBranchId(branchId);
    setIsLoading(true);

    try {
      const result = await switchBranch(branchId);

      if (result.success) {
        showToast(
          'success',
          `You are now working in ${branches.find(b => b.id === branchId)?.name} branch`,
          'Branch Switched'
        );
      } else {
        showToast(
          'error',
          result.message || 'Failed to switch branch',
          'Branch Switch Failed'
        );
      }
    } catch (error) {
      showToast(
        'error',
        'An unexpected error occurred',
        'Error'
      );
    } finally {
      setIsLoading(false);
      setSelectedBranchId(null);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="flex items-center p-1.5 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Branch"
      >
        <Building className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Overlay to capture clicks outside the menu */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-[1000] border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700">Switch Branch</h3>
              <p className="text-xs text-gray-500 mt-1">
                Select a branch to switch your working context
              </p>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {allowedBranches.map((branch) => (
                <button
                  key={branch.id}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    branch.id === user.branch ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleBranchSwitch(branch.id)}
                  disabled={isLoading}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-[#2B3990]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      <div className="text-xs text-gray-500">{branch.address}</div>
                    </div>
                  </div>
                  <div>
                    {isLoading && selectedBranchId === branch.id ? (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    ) : branch.id === user.branch ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : branch.allowRemoteAccess ? null : (
                      <AlertCircle className="w-4 h-4 text-amber-500" title="Requires physical presence" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BranchSwitcher;
