import React from 'react';
import { Award } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Certificate Generator</h1>
            <p className="text-gray-600 text-sm">Generate and send certificates in bulk</p>
          </div>
        </div>
      </div>
    </header>
  );
}
