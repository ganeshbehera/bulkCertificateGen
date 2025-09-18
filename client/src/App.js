import React, { useState } from 'react';
import axios from 'axios';
import { FileUpload } from './components/FileUpload';
import { RecipientsList } from './components/RecipientsList';
import { CertificateConfig } from './components/CertificateConfig';
import { EmailConfig } from './components/EmailConfig';
import { ProgressTracker } from './components/ProgressTracker';
import { Header } from './components/Header';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [certificateConfig, setCertificateConfig] = useState({
    title: 'CERTIFICATE OF',
    subtitle: 'This is to certify that',
    titleColor: '#2B5797',
    subtitleColor: '#000000',
    nameColor: '#2B5797',
    achievementColor: '#2B5797',
    dateColor: '#000000',
    backgroundStart: '#ffffff',
    backgroundEnd: '#ffffff',
    borderColor: '#C8860D'
  });
  const [emailConfig, setEmailConfig] = useState({
    service: 'gmail',
    user: '',
    password: '',
    subject: 'Your Certificate of Completion',
    body: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const steps = [
    { id: 1, title: 'Upload Excel', description: 'Upload recipient data' },
    { id: 2, title: 'Review Data', description: 'Verify recipients' },
    { id: 3, title: 'Certificate Design', description: 'Customize certificate' },
    { id: 4, title: 'Email Setup', description: 'Configure email settings' },
    { id: 5, title: 'Generate & Send', description: 'Process certificates' }
  ];

  const handleFileUpload = (data) => {
    setRecipients(data);
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleGenerateAndSend = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      // Step 1: Generate certificates
      const generateResponse = await axios.post('/api/certificates/generate-bulk', {
        recipients,
        certificateConfig
      });

      if (!generateResponse.data.success) {
        throw new Error('Failed to generate certificates');
      }

      // Step 2: Send emails with certificates
      const emailResponse = await axios.post('/api/email/send-bulk', {
        recipients: generateResponse.data.results.filter(r => r.status === 'success'),
        emailConfig,
        emailTemplate: {
          subject: emailConfig.subject,
          body: emailConfig.body
        }
      });

      setResults({
        certificates: generateResponse.data,
        emails: emailResponse.data,
        totalGenerated: generateResponse.data.totalGenerated,
        totalSent: emailResponse.data.totalSent,
        totalFailed: emailResponse.data.totalFailed
      });

    } catch (error) {
      console.error('Error in generate and send process:', error);
      setResults({
        error: error.response?.data?.error || error.message || 'An error occurred',
        totalGenerated: 0,
        totalSent: 0,
        totalFailed: recipients.length
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <FileUpload onFileUpload={handleFileUpload} />;
      case 2:
        return (
          <RecipientsList 
            recipients={recipients} 
            onNext={(updatedRecipients) => {
              setRecipients(updatedRecipients);
              handleNextStep();
            }}
            onBack={handlePrevStep}
          />
        );
      case 3:
        return (
          <CertificateConfig 
            config={certificateConfig}
            setConfig={setCertificateConfig}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 4:
        return (
          <EmailConfig 
            config={emailConfig}
            setConfig={setEmailConfig}
            onNext={handleNextStep}
            onBack={handlePrevStep}
          />
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate & Send Certificates</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Summary</h3>
                <p className="text-blue-700">
                  Ready to generate {recipients.length} certificates and send them via email.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateAndSend}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Generate & Send'}
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProgressTracker steps={steps} currentStep={currentStep} />
        
        <div className="mt-8">
          {renderCurrentStep()}
        </div>

        {results && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Results</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">Successfully Sent</p>
                <p className="text-2xl font-bold text-green-600">{results.totalSent || 0}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">Failed</p>
                <p className="text-2xl font-bold text-red-600">{results.totalFailed || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
