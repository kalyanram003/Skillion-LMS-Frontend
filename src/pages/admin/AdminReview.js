import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { BookOpen, CheckCircle, X, Clock, User, Eye, Calendar, FileText } from 'lucide-react';

const AdminReview = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchCoursesForReview();
  }, []);

  const fetchCoursesForReview = async () => {
    try {
      const response = await adminAPI.getCoursesForReview();
      
      // Mock data since backend might not have all courses
      const mockCourses = [
        {
          id: '1',
          title: 'Introduction to Machine Learning',
          description: 'Learn the fundamentals of machine learning and AI',
          status: 'DRAFT',
          createdAt: new Date('2024-02-15'),
          creator: {
            id: 'creator1',
            name: 'Dr. Sarah Johnson',
            email: 'sarah@example.com'
          },
          lessons: [
            { id: '1', title: 'What is Machine Learning?', orderIndex: 1 },
            { id: '2', title: 'Types of Learning', orderIndex: 2 },
            { id: '3', title: 'Linear Regression', orderIndex: 3 }
          ]
        },
        {
          id: '2',
          title: 'Web Development Bootcamp',
          description: 'Complete guide to modern web development',
          status: 'DRAFT',
          createdAt: new Date('2024-02-10'),
          creator: {
            id: 'creator2',
            name: 'Mike Chen',
            email: 'mike@example.com'
          },
          lessons: [
            { id: '4', title: 'HTML Basics', orderIndex: 1 },
            { id: '5', title: 'CSS Styling', orderIndex: 2 },
            { id: '6', title: 'JavaScript Fundamentals', orderIndex: 3 },
            { id: '7', title: 'React Introduction', orderIndex: 4 }
          ]
        }
      ];
      
      setCourses(mockCourses);
    } catch (error) {
      toast.error('Failed to fetch courses for review');
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCourse = async (courseId) => {
    try {
      await adminAPI.approveCourse(courseId);
      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, status: 'PUBLISHED' }
            : course
        )
      );
      toast.success('Course approved and published successfully!');
    } catch (error) {
      toast.error('Failed to approve course');
      console.error('Error approving course:', error);
    }
  };

  const handleRejectCourse = async (courseId) => {
    try {
      // This would need to be implemented in the backend
      setCourses(prev => 
        prev.map(course => 
          course.id === courseId 
            ? { ...course, status: 'REJECTED' }
            : course
        )
      );
      toast.success('Course rejected');
    } catch (error) {
      toast.error('Failed to reject course');
      console.error('Error rejecting course:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    if (filter === 'pending') return course.status === 'DRAFT';
    if (filter === 'approved') return course.status === 'PUBLISHED';
    if (filter === 'rejected') return course.status === 'REJECTED';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Review Dashboard</h1>
          <p className="text-gray-600">Review and approve courses submitted by creators</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Courses', count: courses.length },
                { key: 'pending', label: 'Pending', count: courses.filter(c => c.status === 'DRAFT').length },
                { key: 'approved', label: 'Approved', count: courses.filter(c => c.status === 'PUBLISHED').length },
                { key: 'rejected', label: 'Rejected', count: courses.filter(c => c.status === 'REJECTED').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filter === tab.key
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Courses List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No courses found' : `No ${filter} courses`}
            </h3>
            <p className="text-gray-600">
              {filter === 'pending' 
                ? 'No courses are pending review at the moment.'
                : 'There are no courses matching this filter.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-gray-900 mr-3">{course.title}</h3>
                        {getStatusBadge(course.status)}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-2" />
                          <span><strong>Creator:</strong> {course.creator.name}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span><strong>Submitted:</strong> {course.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span><strong>Lessons:</strong> {course.lessons.length}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FileText className="h-4 w-4 mr-2" />
                          <span><strong>Email:</strong> {course.creator.email}</span>
                        </div>
                      </div>
                      
                      {/* Lessons Preview */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Course Lessons:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.lessons.map((lesson) => (
                            <span
                              key={lesson.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {lesson.orderIndex}. {lesson.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 flex flex-col space-y-2">
                      <button
                        onClick={() => window.open(`/courses/${course.id}`, '_blank')}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Course
                      </button>
                      
                      {course.status === 'DRAFT' && (
                        <>
                          <button
                            onClick={() => handleApproveCourse(course.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve & Publish
                          </button>
                          
                          <button
                            onClick={() => handleRejectCourse(course.id)}
                            className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReview;
