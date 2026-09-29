import React from 'react';
import { DynamicFormRenderer } from '../../components/forms/DynamicFormRenderer';

export const ApplicationForm: React.FC = () => {
  const schema: any[] = [
    { name: 'firstName', label: 'First Name', type: 'text', required: true },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true },
    { name: 'gender', label: 'Gender', type: 'select', options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' }
    ], required: true },
    { name: 'income', label: 'Annual Family Income (₹)', type: 'number', required: true },
  ];

  const handleSubmit = (data: Record<string, any>) => {
    console.log('Form Submitted', data);
    // Call API or global state
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Apply for Pre-Matric Scholarship
          </h3>
          <DynamicFormRenderer schema={schema} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
