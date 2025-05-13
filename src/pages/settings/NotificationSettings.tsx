import React, { useState } from 'react';
import { Save, AlertCircle, Check } from 'lucide-react';

const NotificationSettings: React.FC = () => {
  const [smsSettings, setSmsSettings] = useState({
    enabled: false,
    provider: 'twilio',
    accountSid: '',
    authToken: '',
    fromNumber: '',
    defaultMessage: 'Reminder: You have an appointment at Bristol Park Hospital on {date} at {time} with {doctor}.',
    sendReminders: true,
    reminderTime: '1day'
  });

  const [emailSettings, setEmailSettings] = useState({
    enabled: true,
    smtpServer: 'smtp.bristolparkhospital.com',
    smtpPort: '587',
    username: 'notifications@bristolparkhospital.com',
    password: '',
    fromEmail: 'notifications@bristolparkhospital.com',
    defaultSubject: 'Your Appointment at Bristol Park Hospital',
    defaultMessage: 'Dear {patient},\n\nThis is a reminder that you have an appointment scheduled at Bristol Park Hospital on {date} at {time} with {doctor}.\n\nPlease arrive 15 minutes before your scheduled time.\n\nRegards,\nBristol Park Hospital',
    sendReminders: true,
    reminderTime: '1day'
  });

  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: false,
    provider: '',
    apiKey: '',
    fromNumber: '',
    defaultMessage: 'Reminder: You have an appointment at Bristol Park Hospital on {date} at {time} with {doctor}.',
    sendReminders: false,
    reminderTime: '1day'
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setSmsSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setEmailSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setWhatsappSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('success');
      setSaveMessage('Notification settings saved successfully');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
        
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>
      
      {saveStatus === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded flex items-center">
          <Check size={20} className="mr-2" />
          {saveMessage}
        </div>
      )}
      
      {saveStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded flex items-center">
          <AlertCircle size={20} className="mr-2" />
          {saveMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Email Notifications</h2>
          <p className="text-sm text-gray-500">Configure email notification settings for appointments</p>
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="emailEnabled"
              name="enabled"
              checked={emailSettings.enabled}
              onChange={handleEmailChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailEnabled" className="ml-2 block text-sm text-gray-700">
              Enable email notifications
            </label>
          </div>
          
          {emailSettings.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  name="smtpServer"
                  value={emailSettings.smtpServer}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="text"
                  name="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={emailSettings.username}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={emailSettings.password}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Email
                </label>
                <input
                  type="email"
                  name="fromEmail"
                  value={emailSettings.fromEmail}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Subject
                </label>
                <input
                  type="text"
                  name="defaultSubject"
                  value={emailSettings.defaultSubject}
                  onChange={handleEmailChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Message
                </label>
                <textarea
                  name="defaultMessage"
                  value={emailSettings.defaultMessage}
                  onChange={handleEmailChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Available variables: {'{patient}'}, {'{date}'}, {'{time}'}, {'{doctor}'}, {'{department}'}
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailSendReminders"
                  name="sendReminders"
                  checked={emailSettings.sendReminders}
                  onChange={handleEmailChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="emailSendReminders" className="ml-2 block text-sm text-gray-700">
                  Send appointment reminders
                </label>
              </div>
              
              {emailSettings.sendReminders && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Time
                  </label>
                  <select
                    name="reminderTime"
                    value={emailSettings.reminderTime}
                    onChange={handleEmailChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1hour">1 hour before</option>
                    <option value="2hours">2 hours before</option>
                    <option value="1day">1 day before</option>
                    <option value="2days">2 days before</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">SMS Notifications</h2>
          <p className="text-sm text-gray-500">Configure SMS notification settings for appointments</p>
        </div>
        
        <div className="p-6">
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="smsEnabled"
              name="enabled"
              checked={smsSettings.enabled}
              onChange={handleSmsChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="smsEnabled" className="ml-2 block text-sm text-gray-700">
              Enable SMS notifications
            </label>
          </div>
          
          {smsSettings.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMS Provider
                </label>
                <select
                  name="provider"
                  value={smsSettings.provider}
                  onChange={handleSmsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="twilio">Twilio</option>
                  <option value="africastalking">Africa's Talking</option>
                  <option value="nexmo">Nexmo (Vonage)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account SID / API Key
                </label>
                <input
                  type="text"
                  name="accountSid"
                  value={smsSettings.accountSid}
                  onChange={handleSmsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Token / API Secret
                </label>
                <input
                  type="password"
                  name="authToken"
                  value={smsSettings.authToken}
                  onChange={handleSmsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Number
                </label>
                <input
                  type="text"
                  name="fromNumber"
                  value={smsSettings.fromNumber}
                  onChange={handleSmsChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Message
                </label>
                <textarea
                  name="defaultMessage"
                  value={smsSettings.defaultMessage}
                  onChange={handleSmsChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Available variables: {'{patient}'}, {'{date}'}, {'{time}'}, {'{doctor}'}, {'{department}'}
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsSendReminders"
                  name="sendReminders"
                  checked={smsSettings.sendReminders}
                  onChange={handleSmsChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="smsSendReminders" className="ml-2 block text-sm text-gray-700">
                  Send appointment reminders
                </label>
              </div>
              
              {smsSettings.sendReminders && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder Time
                  </label>
                  <select
                    name="reminderTime"
                    value={smsSettings.reminderTime}
                    onChange={handleSmsChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1hour">1 hour before</option>
                    <option value="2hours">2 hours before</option>
                    <option value="1day">1 day before</option>
                    <option value="2days">2 days before</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 opacity-60">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-gray-900">WhatsApp Notifications</h2>
            <p className="text-sm text-gray-500">Configure WhatsApp notification settings for appointments</p>
          </div>
          <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
            Coming Soon
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-center text-gray-500 italic">
            WhatsApp integration is not available in the current system. This feature will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
