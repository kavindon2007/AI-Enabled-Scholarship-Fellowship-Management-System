import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, FileText, CheckCircle, Upload } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gov-blue-dark text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.2,-55.4,76.5,-40.7C83.7,-26,87.9,-10.5,86.1,4.4C84.3,19.3,76.5,33.5,66.1,45.2C55.7,56.9,42.7,66.1,28.2,73.1C13.7,80.1,-2.3,84.9,-17.6,81.9C-32.9,78.9,-47.5,68.2,-59.8,55.1C-72.1,42,-82.1,26.5,-86.3,9.7C-90.5,-7.1,-88.9,-25.2,-79.8,-40C-70.7,-54.8,-54.1,-66.3,-38.7,-72C-23.3,-77.7,-9.1,-77.6,3.6,-82.3C16.3,-87,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight mb-4">
              Empowering Education for Scheduled Tribes
            </h2>
            <p className="text-lg text-gray-200 mb-8 max-w-xl">
              Apply for government scholarships and fellowships seamlessly through our AI-powered unified portal. Transparent, fast, and accessible for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/schemes" className="bg-gov-orange hover:bg-gov-orange-light text-white font-bold py-3 px-6 rounded shadow-gov flex items-center justify-center transition-colors">
                Explore Schemes <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/auth/login" className="bg-white text-gov-blue hover:bg-gray-100 font-bold py-3 px-6 rounded shadow-gov flex items-center justify-center transition-colors">
                Check Application Status
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Information Strip */}
      <section className="bg-gov-blue-light text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-medium gap-2">
          <div className="flex items-center">
            <span className="bg-gov-orange text-white px-2 py-1 rounded text-xs font-bold mr-3 animate-pulse">NEW</span>
            <span>National Fellowship for ST Students applications are now open for 2026-27</span>
          </div>
          <Link to="/announcements" className="underline hover:text-gray-200">View all announcements</Link>
        </div>
      </section>

      {/* Entry Cards */}
      <section className="py-16 px-4 bg-gov-bg">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gov-blue mb-12 font-heading">Portal Services</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="bg-white p-8 rounded-gov shadow-gov border border-gov-border hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-blue-100 text-gov-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">For Students</h4>
              <p className="text-gov-textMuted mb-6 h-20">
                Discover eligible scholarships, apply online with intelligent document scanning, and track your application status easily.
              </p>
              <Link to="/schemes" className="text-gov-blue font-bold hover:underline inline-flex items-center">
                Find Scholarships <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* AI OCR Lab Card */}
            <div className="bg-white p-8 rounded-gov shadow-gov border border-gov-orange hover:shadow-lg transition-shadow text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gov-orange text-white text-xs font-bold px-3 py-1 rounded-bl-gov">
                DEMO LAB
              </div>
              <div className="w-16 h-16 bg-orange-100 text-gov-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">AI Document Scanner</h4>
              <p className="text-gov-textMuted mb-6 h-20">
                Test our intelligent OCR engine that automatically extracts and validates data from your certificates to speed up application.
              </p>
              <Link to="/ocr-demo" className="text-gov-orange font-bold hover:underline inline-flex items-center">
                Try OCR Demo <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Officer Card */}
            <div className="bg-white p-8 rounded-gov shadow-gov border border-gov-border hover:shadow-lg transition-shadow text-center">
              <div className="w-16 h-16 bg-green-100 text-gov-green rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold mb-3">For Officers & Nodal</h4>
              <p className="text-gov-textMuted mb-6 h-20">
                Manage applications, verify documents with AI assistance, and process disbursements efficiently in one unified dashboard.
              </p>
              <Link to="/auth/login" className="text-gov-green font-bold hover:underline inline-flex items-center">
                Officer Login <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white border-t border-gov-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gov-blue mb-2">5+</div>
            <div className="text-sm font-medium text-gov-textMuted uppercase tracking-wide">Active Schemes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gov-orange mb-2">10,000+</div>
            <div className="text-sm font-medium text-gov-textMuted uppercase tracking-wide">Students Enrolled</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gov-green mb-2">₹50 Cr+</div>
            <div className="text-sm font-medium text-gov-textMuted uppercase tracking-wide">Disbursed via DBT</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gov-blue-light mb-2">98%</div>
            <div className="text-sm font-medium text-gov-textMuted uppercase tracking-wide">AI Extraction Accuracy</div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
