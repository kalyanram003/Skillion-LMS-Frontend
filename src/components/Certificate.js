import React from 'react';
import { Award, CheckCircle, Calendar, Hash } from 'lucide-react';

const Certificate = ({ enrollment, course, onClose }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Certificate Header */}
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <Award className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate of Completion</h2>
            <p className="text-gray-600">This certifies that</p>
          </div>

          {/* Certificate Content */}
          <div className="border-2 border-yellow-300 rounded-lg p-8 mb-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {enrollment.learner?.name || 'Student Name'}
              </h3>
              
              <p className="text-lg text-gray-700 mb-6">
                has successfully completed the course
              </p>
              
              <h4 className="text-2xl font-semibold text-primary-600 mb-6">
                {course.title}
              </h4>
              
              <div className="flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-green-600 mr-2" />
                <span className="text-lg font-medium text-green-600">100% Complete</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Completed: {formatDate(enrollment.certificateIssuedAt)}</span>
                </div>
                <div className="flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  <span>ID: {enrollment.certificateSerialHash}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <p>This certificate is digitally verified and can be verified using the certificate ID.</p>
            <p>Issued by MicroCourses LMS Platform</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Award className="h-5 w-5 mr-2" />
              Print Certificate
            </button>
            
            <button
              onClick={onClose}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
