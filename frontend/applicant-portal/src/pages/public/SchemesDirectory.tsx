import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, BookOpen, GraduationCap, ArrowRight, CheckCircle, Clock } from 'lucide-react';

export const SchemesDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // DEMO DATA based on AI-SFMS context
  const schemes = [
    {
      id: 'NFST',
      code: 'NFST',
      name: 'National Fellowship for ST Students',
      type: 'Fellowship',
      educationLevel: 'M.Phil / Ph.D',
      status: 'OPEN',
      deadline: '2026-10-31',
      description: 'Financial assistance to ST students to pursue higher studies such as M.Phil and Ph.D.',
      selectionMode: 'Merit Cascade',
      amount: '₹31,000 - ₹35,000 / month'
    },
    {
      id: 'NOS',
      code: 'NOS',
      name: 'National Overseas Scholarship',
      type: 'Scholarship',
      educationLevel: 'Masters / Ph.D (Abroad)',
      status: 'OPEN',
      deadline: '2026-11-15',
      description: 'Financial assistance to selected ST students to pursue Masters and Ph.D courses abroad.',
      selectionMode: 'Interview Tiers',
      amount: 'Full Tuition + Maintenance'
    },
    {
      id: 'TOP_CLASS',
      code: 'TOP_CLASS',
      name: 'Top Class Education for ST Students',
      type: 'Scholarship',
      educationLevel: 'Undergraduate / Postgraduate',
      status: 'CLOSED',
      deadline: '2026-08-31',
      description: 'Recognizing and promoting quality education amongst ST students by providing full financial support.',
      selectionMode: 'Threshold based',
      amount: 'Full Tuition + Living Expenses'
    }
  ];

  const filteredSchemes = schemes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="bg-gov-blue text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold font-heading">Scholarship Schemes</h1>
          <p className="mt-2 text-blue-100 max-w-2xl">
            Browse available scholarships and fellowships offered by the Ministry of Tribal Affairs. 
            Check eligibility requirements and apply online.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Filters and Search */}
        <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by scheme name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded p-2 focus:ring-gov-blue focus:border-gov-blue"
            />
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            <select className="border border-gray-300 rounded p-2 text-sm text-gray-700 focus:ring-gov-blue">
              <option value="">All Types</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Fellowship">Fellowship</option>
            </select>
            <select className="border border-gray-300 rounded p-2 text-sm text-gray-700 focus:ring-gov-blue">
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <button className="bg-gray-100 p-2 rounded border border-gray-300 hover:bg-gray-200" title="More Filters">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-6">
          {filteredSchemes.map(scheme => (
            <div key={scheme.id} className="bg-white border border-gov-border rounded-gov shadow-gov overflow-hidden hover:border-gov-blue transition-colors">
              <div className="flex flex-col md:flex-row">
                
                {/* Left Area - Info */}
                <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2 py-1 rounded border border-gray-200 uppercase tracking-wide">
                        {scheme.code}
                      </span>
                      <span className="text-sm font-bold text-gov-orange">{scheme.type}</span>
                    </div>
                    {scheme.status === 'OPEN' ? (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" /> OPEN
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full flex items-center border border-red-200">
                        <Clock className="w-3 h-3 mr-1" /> CLOSED
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-gov-blue font-heading mb-2">{scheme.name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{scheme.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-700">
                      <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-semibold mr-1">Level:</span> {scheme.educationLevel}
                    </div>
                    <div className="flex items-center text-gray-700">
                      <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-semibold mr-1">Selection:</span> {scheme.selectionMode}
                    </div>
                  </div>
                </div>

                {/* Right Area - Action */}
                <div className="w-full md:w-64 bg-gray-50 p-6 flex flex-col justify-center items-center text-center">
                  <div className="mb-4 w-full">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wide mb-1">Financial Support</p>
                    <p className="text-sm font-bold text-gov-green">{scheme.amount}</p>
                  </div>
                  
                  {scheme.status === 'OPEN' ? (
                    <>
                      <p className="text-xs text-red-600 font-bold mb-3">Closes: {scheme.deadline}</p>
                      <button className="w-full bg-gov-orange hover:bg-gov-orange-dark text-white font-bold py-2 px-4 rounded transition-colors mb-2">
                        Start Application
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500 mb-3">Closed: {scheme.deadline}</p>
                      <button className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded cursor-not-allowed mb-2">
                        Applications Closed
                      </button>
                    </>
                  )}
                  
                  <button className="w-full bg-white border border-gov-blue text-gov-blue hover:bg-blue-50 font-bold py-2 px-4 rounded transition-colors flex items-center justify-center">
                    Check Requirements <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredSchemes.length === 0 && (
            <div className="text-center py-12 bg-white rounded shadow-sm border border-gray-200">
              <p className="text-gray-500">No schemes found matching your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
