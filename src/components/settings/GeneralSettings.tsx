import React, { useState } from 'react';
import {
  Mail,
  Ruler,
  Calendar,
  DollarSign,
  CreditCard,
  Server,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useInsurance, Insurance } from '../../context/InsuranceContext';
import { useToast } from '../../context/ToastContext';

interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile' | 'card' | 'bank' | 'cash' | 'other';
  active: boolean;
  details: Record<string, string>;
}

const GeneralSettings: React.FC = () => {
  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    email: true,
    units: false,
    integrations: false,
    fiscal: false,
    insurance: false,
    payments: false,
    etims: false
  });

  // Email settings
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [smtpServer, setSmtpServer] = useState('');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUsername, setSmtpUsername] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [emailSender, setEmailSender] = useState('');

  // Units of measure
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [volumeUnit, setVolumeUnit] = useState('ml');

  // Fiscal settings
  const [salesTax, setSalesTax] = useState('16');
  const [purchaseTax, setPurchaseTax] = useState('16');
  const [currency, setCurrency] = useState('KES');

  // Insurance providers
  const {
    insuranceProviders,
    addInsurance,
    updateInsurance,
    deleteInsurance
  } = useInsurance();
  const { showToast } = useToast();

  const [showAddInsurance, setShowAddInsurance] = useState(false);
  const [editingInsuranceId, setEditingInsuranceId] = useState<string | null>(null);
  const [newInsurance, setNewInsurance] = useState<Omit<Insurance, 'id'>>({
    name: '',
    code: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    active: true
  });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      name: 'M-Pesa',
      type: 'mobile',
      active: true,
      details: {
        shortCode: '123456',
        callbackUrl: 'https://bristolparkhospital.com/api/mpesa/callback'
      }
    },
    {
      id: '2',
      name: 'Cash',
      type: 'cash',
      active: true,
      details: {}
    }
  ]);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [newPayment, setNewPayment] = useState<Omit<PaymentMethod, 'id'>>({
    name: '',
    type: 'mobile',
    active: true,
    details: {}
  });

  // eTIMS settings
  const [etimsMode, setEtimsMode] = useState('test');
  const [etimsApiKey, setEtimsApiKey] = useState('');
  const [etimsEndpoint, setEtimsEndpoint] = useState('');

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle insurance form change
  const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setNewInsurance({
        ...newInsurance,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setNewInsurance({
        ...newInsurance,
        [name]: value
      });
    }
  };

  // Add new insurance provider
  const handleAddInsurance = () => {
    if (newInsurance.name.trim() === '') {
      showToast('error', 'Insurance name is required');
      return;
    }

    addInsurance(newInsurance);
    showToast('success', `${newInsurance.name} has been added successfully`);
    setShowAddInsurance(false);
    setNewInsurance({
      name: '',
      code: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      active: true
    });
  };

  // Handle payment method form change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setNewPayment({
        ...newPayment,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else if (name.startsWith('details.')) {
      const detailKey = name.replace('details.', '');
      setNewPayment({
        ...newPayment,
        details: {
          ...newPayment.details,
          [detailKey]: value
        }
      });
    } else {
      setNewPayment({
        ...newPayment,
        [name]: value
      });
    }
  };

  // Add new payment method
  const handleAddPayment = () => {
    if (newPayment.name.trim() === '') {
      alert('Payment method name is required');
      return;
    }

    const newId = (paymentMethods.length + 1).toString();
    setPaymentMethods([...paymentMethods, { ...newPayment, id: newId }]);
    setShowAddPayment(false);
    setNewPayment({
      name: '',
      type: 'mobile',
      active: true,
      details: {}
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 mb-6">
        Configure general system settings for your hospital
      </p>

      {/* Email Settings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('email')}
        >
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Email Configuration</h3>
          </div>
          {expandedSections.email ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.email && (
          <div className="p-6">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="useCustomEmail"
                  checked={useCustomEmail}
                  onChange={(e) => setUseCustomEmail(e.target.checked)}
                  className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                />
                <label htmlFor="useCustomEmail" className="ml-2 block text-sm font-medium text-gray-700">
                  Use Custom Email Servers
                </label>
              </div>

              {useCustomEmail && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Server
                    </label>
                    <input
                      type="text"
                      value={smtpServer}
                      onChange={(e) => setSmtpServer(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., smtp.gmail.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., 587"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={smtpUsername}
                      onChange={(e) => setSmtpUsername(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., user@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSmtpPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      value={emailSender}
                      onChange={(e) => setEmailSender(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., noreply@bristolparkhospital.com"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Email Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Units of Measure */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('units')}
        >
          <div className="flex items-center">
            <Ruler className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Units of Measure</h3>
          </div>
          {expandedSections.units ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.units && (
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Configure measurement units used throughout the system. These settings will affect how data is displayed and recorded.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <select
                  value={temperatureUnit}
                  onChange={(e) => setTemperatureUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume
                </label>
                <select
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                >
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (l)</option>
                  <option value="oz">Fluid Ounces (oz)</option>
                  <option value="pt">Pints (pt)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Units Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Integrations */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('integrations')}
        >
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Integrations</h3>
          </div>
          {expandedSections.integrations ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.integrations && (
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Calendar Integration</h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect your hospital's appointment system with external calendar services.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="googleCalendar"
                        className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                      />
                      <label htmlFor="googleCalendar" className="ml-2 block text-sm font-medium text-gray-700">
                        Google Calendar
                      </label>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">Not Connected</span>
                  </div>
                  <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Connect Google Calendar
                  </button>
                </div>

                <div className="border border-gray-200 rounded-md p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="outlookCalendar"
                        className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                      />
                      <label htmlFor="outlookCalendar" className="ml-2 block text-sm font-medium text-gray-700">
                        Microsoft Outlook
                      </label>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600">Not Connected</span>
                  </div>
                  <button className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                    Connect Outlook Calendar
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">SHA API Integration</h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect to SHA (Social Health Authority) for insurance verification and claims.
              </p>

              <div className="border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="shaApi"
                      className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                    />
                    <label htmlFor="shaApi" className="ml-2 block text-sm font-medium text-gray-700">
                      Enable SHA API Integration
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SHA API Key
                    </label>
                    <input
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="Enter your SHA API key"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SHA Facility Code
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="Enter your facility code"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SHA API Endpoint
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="https://api.sha.go.ke/v1/"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Integration Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fiscal Localization */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('fiscal')}
        >
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Fiscal Localization</h3>
          </div>
          {expandedSections.fiscal ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.fiscal && (
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">🇰🇪 Kenya Taxes</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure default tax rates for Kenya.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Tax (%)
                  </label>
                  <input
                    type="text"
                    value={salesTax}
                    onChange={(e) => setSalesTax(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default tax applied to sales</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase Tax (%)
                  </label>
                  <input
                    type="text"
                    value={purchaseTax}
                    onChange={(e) => setPurchaseTax(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Default tax applied to purchases</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Currency Settings</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure the main currency used in your hospital.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                >
                  <option value="KES">Kenyan Shilling (KES)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Main currency of your company</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Fiscal Settings
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Insurance Management */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('insurance')}
        >
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Insurance Management</h3>
          </div>
          {expandedSections.insurance ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.insurance && (
          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Manage insurance providers for patient registration and billing.
              </p>
              <button
                onClick={() => setShowAddInsurance(true)}
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Insurance Provider
              </button>
            </div>

            {/* Add Insurance Form */}
            {showAddInsurance && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium">
                    {editingInsuranceId ? 'Edit Insurance Provider' : 'Add New Insurance Provider'}
                  </h4>
                  <button
                    onClick={() => {
                      setShowAddInsurance(false);
                      setEditingInsuranceId(null);
                      setNewInsurance({
                        name: '',
                        code: '',
                        contactPerson: '',
                        phone: '',
                        email: '',
                        address: '',
                        active: true
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newInsurance.name}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., SHA Insurance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Code
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newInsurance.code}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., SHA001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={newInsurance.contactPerson}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newInsurance.phone}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., +254 700 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newInsurance.email}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., contact@insurance.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={newInsurance.address}
                      onChange={handleInsuranceChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      placeholder="e.g., Nairobi, Kenya"
                    />
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="insuranceActive"
                    name="active"
                    checked={newInsurance.active}
                    onChange={(e) => setNewInsurance({...newInsurance, active: e.target.checked})}
                    className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                  />
                  <label htmlFor="insuranceActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      setShowAddInsurance(false);
                      setEditingInsuranceId(null);
                      setNewInsurance({
                        name: '',
                        code: '',
                        contactPerson: '',
                        phone: '',
                        email: '',
                        address: '',
                        active: true
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  {editingInsuranceId ? (
                    <button
                      onClick={() => {
                        if (newInsurance.name.trim() === '') {
                          showToast('error', 'Insurance name is required');
                          return;
                        }

                        updateInsurance(editingInsuranceId, newInsurance);
                        showToast('success', `${newInsurance.name} has been updated successfully`);
                        setShowAddInsurance(false);
                        setEditingInsuranceId(null);
                        setNewInsurance({
                          name: '',
                          code: '',
                          contactPerson: '',
                          phone: '',
                          email: '',
                          address: '',
                          active: true
                        });
                      }}
                      className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
                    >
                      Update Insurance
                    </button>
                  ) : (
                    <button
                      onClick={handleAddInsurance}
                      className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
                    >
                      Add Insurance
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Insurance List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {insuranceProviders.map((insurance) => (
                    <tr key={insurance.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{insurance.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{insurance.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{insurance.contactPerson}</div>
                        <div className="text-sm text-gray-500">{insurance.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          insurance.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {insurance.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            // Set up editing for this insurance provider
                            const provider = insuranceProviders.find(p => p.id === insurance.id);
                            if (provider) {
                              setNewInsurance({
                                name: provider.name,
                                code: provider.code,
                                contactPerson: provider.contactPerson,
                                phone: provider.phone,
                                email: provider.email,
                                address: provider.address,
                                active: provider.active
                              });
                              setEditingInsuranceId(provider.id);
                              setShowAddInsurance(true);
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${insurance.name}?`)) {
                              deleteInsurance(insurance.id);
                              showToast('success', `${insurance.name} has been deleted`);
                            }
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('payments')}
        >
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">Payment Methods</h3>
          </div>
          {expandedSections.payments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.payments && (
          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Configure payment methods for patient billing and invoices.
              </p>
              <button
                onClick={() => setShowAddPayment(true)}
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={16} />
                Add Payment Method
              </button>
            </div>

            {/* M-Pesa Configuration */}
            <div className="mb-6 border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-800 mb-3">M-Pesa Integration</h4>
              <p className="text-sm text-gray-600 mb-4">
                Configure M-Pesa payment integration for mobile payments.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Short Code
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="e.g., 174379"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consumer Key
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="Enter your consumer key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consumer Secret
                  </label>
                  <input
                    type="password"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="Enter your consumer secret"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Callback URL
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="e.g., https://bristolparkhospital.com/api/mpesa/callback"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="mpesaActive"
                  className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                  checked={true}
                />
                <label htmlFor="mpesaActive" className="ml-2 block text-sm text-gray-900">
                  Enable M-Pesa Payments
                </label>
              </div>
            </div>

            {/* Payment Methods List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentMethods.map((method) => (
                    <tr key={method.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{method.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 capitalize">{method.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          method.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {method.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* eTIMS Configuration */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('etims')}
        >
          <div className="flex items-center">
            <Server className="w-5 h-5 text-[#2B3990] mr-2" />
            <h3 className="text-lg font-semibold">eTIMS Configuration</h3>
          </div>
          {expandedSections.etims ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {expandedSections.etims && (
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              Configure Electronic Tax Invoice Management System (eTIMS) settings for KRA compliance.
            </p>

            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">eTIMS Server Mode</h4>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="etimsProduction"
                    name="etimsMode"
                    value="production"
                    checked={etimsMode === 'production'}
                    onChange={() => setEtimsMode('production')}
                    className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300"
                  />
                  <label htmlFor="etimsProduction" className="ml-2 block text-sm text-gray-900">
                    Production: Connection to eTIMS in production mode
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="etimsTest"
                    name="etimsMode"
                    value="test"
                    checked={etimsMode === 'test'}
                    onChange={() => setEtimsMode('test')}
                    className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300"
                  />
                  <label htmlFor="etimsTest" className="ml-2 block text-sm text-gray-900">
                    Test: Connection to eTIMS in test mode
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  eTIMS API Key
                </label>
                <input
                  type="password"
                  value={etimsApiKey}
                  onChange={(e) => setEtimsApiKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  placeholder="Enter your eTIMS API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  eTIMS Endpoint URL
                </label>
                <input
                  type="text"
                  value={etimsEndpoint}
                  onChange={(e) => setEtimsEndpoint(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  placeholder={etimsMode === 'production' ? 'https://etims.kra.go.ke/api/' : 'https://etims-test.kra.go.ke/api/'}
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save eTIMS Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralSettings;
