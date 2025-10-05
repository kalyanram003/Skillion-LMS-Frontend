import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { BookOpen, Award, TrendingUp, Calendar, Download, CheckCircle } from 'lucide-react';
import Certificate from '../../components/Certificate';

const Progress = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalLessons: 0,
    completedLessons: 0,
  });
  const [showCertificate, setShowCertificate] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await enrollmentAPI.getProgress();
      
      // Mock data since backend doesn't implement this yet
      const mockEnrollments = [
        {
          id: '1',
          course: {
            id: '1',
            title: 'Introduction to Web Development',
            description: 'Learn the basics of HTML, CSS, and JavaScript',
            creator: { name: 'John Doe' }
          },
          status: 'ENROLLED',
          completedLessonIds: ['1', '2'],
          certificateSerialHash: null,
          certificateIssuedAt: null,
          enrolledAt: new Date('2024-01-15'),
          progress: 40
        },
        {
          id: '2',
          course: {
            id: '2',
            title: 'Advanced React Patterns',
            description: 'Master advanced React concepts and patterns',
            creator: { name: 'Jane Smith' }
          },
          status: 'COMPLETED',
          completedLessonIds: ['3', '4', '5', '6'],
          certificateSerialHash: 'CERT-123456789',
          certificateIssuedAt: new Date('2024-02-01'),
          enrolledAt: new Date('2024-01-20'),
          progress: 100
        }
      ];
      
      setEnrollments(mockEnrollments);
      
      // Calculate stats
      const totalCourses = mockEnrollments.length;
      const completedCourses = mockEnrollments.filter(e => e.status === 'COMPLETED').length;
      const totalLessons = mockEnrollments.reduce((sum, e) => sum + (e.course.lessons?.length || 0), 0);
      const completedLessons = mockEnrollments.reduce((sum, e) => sum + e.completedLessonIds.length, 0);
      
      setStats({
        totalCourses,
        completedCourses,
        totalLessons,
        completedLessons
      });
      
    } catch (error) {
      toast.error('Failed to fetch progress data');
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (enrollment) => {
    if (!enrollment.certificateSerialHash) return;
    
    // In a real implementation, this would generate and download a PDF certificate
    toast.info('Certificate download would be implemented here');
    console.log('Downloading certificate for enrollment:', enrollment.id);
  };

  const viewCertificate = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowCertificate(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Learning Progress</h1>
          <p className="text-gray-600">Track your course completion and achievements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completedCourses}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Lessons</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalLessons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.completedLessons}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Progress */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Course Progress</h3>
            
            {enrollments.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No enrollments yet</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course.</p>
                <Link
                  to="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Link
                            to={`/courses/${enrollment.course.id}`}
                            className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                          >
                            {enrollment.course.title}
                          </Link>
                          {enrollment.status === 'COMPLETED' && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-4">{enrollment.course.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="mr-4">By {enrollment.course.creator.name}</span>
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Enrolled on {enrollment.enrolledAt.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-700">Progress</span>
                            <span className="text-gray-900 font-medium">{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-2">
                        {enrollment.status === 'COMPLETED' && enrollment.certificateSerialHash ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => viewCertificate(enrollment)}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <Award className="h-4 w-4 mr-2" />
                              View Certificate
                            </button>
                            <button
                              onClick={() => downloadCertificate(enrollment)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </button>
                          </div>
                        ) : enrollment.status === 'ENROLLED' ? (
                          <Link
                            to={`/courses/${enrollment.course.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            Continue Learning
                          </Link>
                        ) : null}
                        
                        {enrollment.certificateSerialHash && (
                          <div className="text-xs text-gray-500">
                            Certificate ID: {enrollment.certificateSerialHash}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Modal */}
        {showCertificate && selectedEnrollment && (
          <Certificate
            enrollment={selectedEnrollment}
            course={selectedEnrollment.course}
            onClose={() => {
              setShowCertificate(false);
              setSelectedEnrollment(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Progress;
