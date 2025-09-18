import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import axios from 'axios';

export function FileUpload({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await axios.post('/api/certificates/parse-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        onFileUpload(response.data.data);
      } else {
        setError(response.data.error || 'Failed to parse Excel file');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  const downloadSampleTemplate = async () => {
    try {
      const response = await axios.get('/api/certificates/sample-template', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificate_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download sample template');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Recipients Data</h2>
        
        {/* Sample template download */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Need a template?</h3>
              <p className="text-blue-700 text-sm">Download our sample Excel template to get started</p>
            </div>
            <button
              onClick={downloadSampleTemplate}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>
        </div>

        {/* File upload area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive || dragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              ) : (
                <div className="bg-gray-100 rounded-full p-3">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isUploading ? 'Processing...' : 'Drop your Excel file here, or click to browse'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports .xlsx, .xls, and .csv files (max 10MB)
              </p>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {/* Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Excel File Requirements
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Must contain columns: <strong>name</strong> and <strong>email</strong></li>
            <li>• Optional columns: <strong>course</strong>, <strong>date</strong></li>
            <li>• First row should contain column headers</li>
            <li>• Maximum 100 recipients per upload</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
