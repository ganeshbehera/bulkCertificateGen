import React, { useState } from 'react';
import { Palette, Eye, RotateCcw } from 'lucide-react';

export function CertificateConfig({ config, setConfig, onNext, onBack }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const handleConfigChange = (field, value) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
  };

  const generatePreview = async () => {
    setIsGeneratingPreview(true);
    try {
      const response = await fetch('/api/certificates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const previewUrl = URL.createObjectURL(blob);
        setPreviewUrl(previewUrl);
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Failed to generate preview. Please try again.');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const resetToDefaults = () => {
    setConfig({
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
    setPreviewUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Certificate Design</h2>
              <p className="text-gray-600">Customize your certificate appearance</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={resetToDefaults}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={generatePreview}
              disabled={isGeneratingPreview}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              <span>{isGeneratingPreview ? 'Generating...' : 'Preview'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Text Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certificate Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => handleConfigChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => handleConfigChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.titleColor}
                      onChange={(e) => handleConfigChange('titleColor', e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.titleColor}
                      onChange={(e) => handleConfigChange('titleColor', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.nameColor}
                      onChange={(e) => handleConfigChange('nameColor', e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.nameColor}
                      onChange={(e) => handleConfigChange('nameColor', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Border Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.borderColor}
                      onChange={(e) => handleConfigChange('borderColor', e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.borderColor}
                      onChange={(e) => handleConfigChange('borderColor', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Start
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.backgroundStart}
                      onChange={(e) => handleConfigChange('backgroundStart', e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.backgroundStart}
                      onChange={(e) => handleConfigChange('backgroundStart', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px] flex items-center justify-center">
              {isGeneratingPreview ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Generating preview...</p>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Certificate Preview"
                  className="max-w-full max-h-full object-contain rounded"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Click "Preview" to see your certificate design</p>
                </div>
              )}
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
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Continue to Email Setup
          </button>
        </div>
      </div>
    </div>
  );
}
