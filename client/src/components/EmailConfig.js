import React, { useState } from 'react';
import { Mail, TestTube, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export function EmailConfig({ config, setConfig, onNext, onBack }) {
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleConfigChange = (field, value) => {
    setConfig({ ...config, [field]: value });
    setTestResult(null); // Clear test result when config changes
  };

  const testEmailConfig = async () => {
    if (!config.user || !config.password) {
      setTestResult({ success: false, message: 'Please enter email and password' });
      return;
    }

    setIsTestingConfig(true);
    try {
      const response = await axios.post('/api/email/test-config', {
        emailConfig: config
      });

      setTestResult({ success: true, message: response.data.message });
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: error.response?.data?.details || 'Email configuration test failed'
      });
    } finally {
      setIsTestingConfig(false);
    }
  };

  const emailServices = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'outlook', label: 'Outlook' },
    { value: 'yahoo', label: 'Yahoo' },
    { value: 'hotmail', label: 'Hotmail' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-100 p-2 rounded-lg">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Email Configuration</h2>
            <p className="text-gray-600">Set up email settings to send certificates</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Settings */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">SMTP Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Service
                  </label>
                  <select
                    value={config.service}
                    onChange={(e) => handleConfigChange('service', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {emailServices.map((service) => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={config.user}
                    onChange={(e) => handleConfigChange('user', e.target.value)}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Password
                  </label>
                  <input
                    type="password"
                    value={config.password}
                    onChange={(e) => handleConfigChange('password', e.target.value)}
                    placeholder="Your app-specific password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For Gmail, use an App Password instead of your regular password
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={testEmailConfig}
                    disabled={isTestingConfig}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    <TestTube className="h-4 w-4" />
                    <span>{isTestingConfig ? 'Testing...' : 'Test Configuration'}</span>
                  </button>
                </div>

                {/* Test Result */}
                {testResult && (
                  <div className={`p-3 rounded-lg ${
                    testResult.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {testResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        testResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {testResult.success ? 'Success' : 'Error'}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Gmail Setup Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Gmail Setup Instructions</h4>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Enable 2-factor authentication on your Google account</li>
                <li>Go to Google Account settings → Security → App passwords</li>
                <li>Generate a new app password for "Mail"</li>
                <li>Use this app password instead of your regular password</li>
              </ol>
            </div>
          </div>

          {/* Email Template */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Email Template</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={config.subject}
                    onChange={(e) => handleConfigChange('subject', e.target.value)}
                    placeholder="Your Certificate of Completion"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Body (HTML)
                  </label>
                  <textarea
                    value={config.body}
                    onChange={(e) => handleConfigChange('body', e.target.value)}
                    placeholder="Leave empty to use default template"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Available placeholders: {'{'}{'{'} name {'}'}{'}'}, {'{'}{'{'} email {'}'}{'}'}, {'{'}{'{'} course {'}'}{'}'}, {'{'}{'{'} date {'}'}{'}'}
                  </p>
                </div>
              </div>
            </div>

            {/* Default Template Preview */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Default Template Preview</h4>
              <div className="text-sm text-gray-600 space-y-2">
                <p><strong>Subject:</strong> Your Certificate of Completion</p>
                <div className="bg-white p-3 rounded border">
                  <h3 className="font-bold text-gray-800">Congratulations, {'{'}{'{'} name {'}'}{'}'}!</h3>
                  <p className="mt-2">We are pleased to present you with your certificate. Please find it attached to this email.</p>
                  <p className="mt-2">Thank you for your participation and dedication.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={onNext}
            disabled={!testResult?.success}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testResult?.success ? 'Continue to Generate' : 'Test Configuration First'}
          </button>
        </div>
      </div>
    </div>
  );
}
