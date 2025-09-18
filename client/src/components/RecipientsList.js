import React, { useState } from 'react';
import { Users, Edit2, Trash2, Plus } from 'lucide-react';

export function RecipientsList({ recipients, onNext, onBack }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedRecipient, setEditedRecipient] = useState({});
  const [localRecipients, setLocalRecipients] = useState(recipients);

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedRecipient({ ...localRecipients[index] });
  };

  const handleSave = () => {
    const updated = [...localRecipients];
    updated[editingIndex] = editedRecipient;
    setLocalRecipients(updated);
    setEditingIndex(null);
    setEditedRecipient({});
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedRecipient({});
  };

  const handleDelete = (index) => {
    const updated = localRecipients.filter((_, i) => i !== index);
    setLocalRecipients(updated);
  };

  const handleAddNew = () => {
    const newRecipient = {
      name: '',
      email: '',
      course: '',
      date: new Date().toLocaleDateString()
    };
    setLocalRecipients([...localRecipients, newRecipient]);
    setEditingIndex(localRecipients.length);
    setEditedRecipient(newRecipient);
  };

  const getColumnKeys = () => {
    if (localRecipients.length === 0) return [];
    return Object.keys(localRecipients[0]);
  };

  const columns = getColumnKeys();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Review Recipients</h2>
              <p className="text-gray-600">
                {localRecipients.length} recipient{localRecipients.length !== 1 ? 's' : ''} loaded
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Recipient</span>
          </button>
        </div>

        {/* Recipients table */}
        {localRecipients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {localRecipients.map((recipient, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    {columns.map((column) => (
                      <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editingIndex === index ? (
                          <input
                            type="text"
                            value={editedRecipient[column] || ''}
                            onChange={(e) =>
                              setEditedRecipient({
                                ...editedRecipient,
                                [column]: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          recipient[column] || '-'
                        )}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingIndex === index ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-900 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-gray-600 hover:text-gray-900 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No recipients found. Please upload a valid Excel file.
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={() => onNext(localRecipients)}
            disabled={localRecipients.length === 0 || editingIndex !== null}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Certificate Design
          </button>
        </div>
      </div>
    </div>
  );
}
