import React, { useState } from 'react';

export const GrievanceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    category: '',
    applicationId: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Grievance submitting: ', formData);
    alert('Grievance submitted successfully. Ticket ID: GRV-' + Date.now());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Lodge a Grievance</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              <option value="payment">Payment not received</option>
              <option value="verification">Verification delayed</option>
              <option value="technical">Technical issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="applicationId" className="block text-sm font-medium text-gray-700">Application ID (Optional)</label>
            <input
              type="text"
              id="applicationId"
              value={formData.applicationId}
              onChange={(e) => setFormData({...formData, applicationId: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g. app-1"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Describe your issue in detail..."
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Grievance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
