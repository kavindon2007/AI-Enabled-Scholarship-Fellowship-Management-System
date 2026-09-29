import React from 'react';
import { Scheme } from '../../types';

interface SchemeSelectorProps {
  schemes: Scheme[];
  selectedSchemeId?: string;
  onSelect: (schemeId: string) => void;
}

export const SchemeSelector: React.FC<SchemeSelectorProps> = ({ schemes, selectedSchemeId, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schemes.map(scheme => (
        <div
          key={scheme.id}
          className={`border rounded-lg p-6 cursor-pointer transition-all ${
            selectedSchemeId === scheme.id
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-opacity-50'
              : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
          }`}
          onClick={() => onSelect(scheme.id)}
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">{scheme.name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{scheme.description}</p>
          <div className="text-sm font-medium text-gray-700 mb-2">Eligibility:</div>
          <ul className="list-disc list-inside text-sm text-gray-600 mb-4 space-y-1">
            {scheme.eligibilityCriteria.map((c, i) => (
              <li key={i} className="truncate">{c}</li>
            ))}
          </ul>
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
            <button
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                selectedSchemeId === scheme.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
              }`}
            >
              {selectedSchemeId === scheme.id ? 'Selected' : 'Select'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
