import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { User, Link as LinkIcon, FileText, Send } from 'lucide-react';

const CreatorApply = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    bio: '',
    portfolioUrl: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.bio.trim()) {
      toast.error('Please provide a bio');
      return;
    }
    
    if (!formData.portfolioUrl.trim()) {
      toast.error('Please provide a portfolio URL');
      return;
    }
    
    setLoading(true);

    try {
      // This endpoint would need to be implemented in the backend
      await userAPI.applyAsCreator(formData.bio, formData.portfolioUrl);
      toast.success('Creator application submitted successfully! You will be notified once reviewed.');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Error submitting application:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 mb-4">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Apply as a Creator</h1>
          <p className="text-gray-600">
            Share your expertise by creating courses and helping others learn
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio Section */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Tell us about yourself
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={6}
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe your background, expertise, and why you want to become a creator on our platform..."
                  value={formData.bio}
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Minimum 100 characters. This will be displayed on your creator profile.
                </p>
              </div>

              {/* Portfolio URL */}
              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  <LinkIcon className="h-4 w-4 inline mr-2" />
                  Portfolio URL
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  name="portfolioUrl"
                  required
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://your-portfolio.com"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Link to your portfolio, website, or examples of your work
                </p>
              </div>

              {/* Current User Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Application Details</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><span className="font-medium">Name:</span> {user?.name}</div>
                  <div><span className="font-medium">Email:</span> {user?.email}</div>
                  <div><span className="font-medium">Current Role:</span> {user?.role}</div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Creator Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Provide high-quality, educational content</li>
                  <li>• Respect copyright and intellectual property</li>
                  <li>• Maintain professional communication with learners</li>
                  <li>• Follow our community guidelines and terms of service</li>
                </ul>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits of Being a Creator</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-green-100">
                    <User className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Share Knowledge</h4>
                  <p className="text-sm text-gray-500">Help others learn and grow in their careers</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-100">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Build Authority</h4>
                  <p className="text-sm text-gray-500">Establish yourself as an expert in your field</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-100">
                    <LinkIcon className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Grow Network</h4>
                  <p className="text-sm text-gray-500">Connect with learners and other creators</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-md bg-yellow-100">
                    <User className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-gray-900">Track Impact</h4>
                  <p className="text-sm text-gray-500">See how your courses help learners succeed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorApply;
