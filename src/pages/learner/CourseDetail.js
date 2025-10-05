import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI, enrollmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { BookOpen, Clock, User, Play, CheckCircle, Lock } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    checkEnrollment();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const [courseResponse, lessonsResponse] = await Promise.all([
        courseAPI.getCourseById(id),
        courseAPI.getLessonsByCourse(id)
      ]);
      
      setCourse(courseResponse.data);
      setLessons(lessonsResponse.data.items || []);
    } catch (error) {
      toast.error('Failed to fetch course details');
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    // This would need to be implemented in the backend
    // For now, we'll assume no enrollment initially
    setEnrollment(null);
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const response = await enrollmentAPI.enrollInCourse(id);
      setEnrollment(response.data);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      toast.error('Failed to enroll in course');
      console.error('Error enrolling:', error);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg shadow p-8">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
            <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or is not published.</p>
            <Link to="/courses" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500">
              ← Back to courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completedLessons = enrollment?.completedLessonIds || [];
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <User className="h-5 w-5 mr-2" />
                <span className="mr-4">By {course.creator?.name || 'Unknown Creator'}</span>
                <Clock className="h-5 w-5 mr-2" />
                <span>{totalLessons} lessons</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>
            <div className="ml-8">
              <div className="h-20 w-20 bg-primary-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Section */}
        {!enrollment ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to start learning?</h2>
              <p className="text-gray-600 mb-4">Enroll in this course to access all lessons and track your progress.</p>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enrolling...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Enroll Now
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Your Progress</h2>
                <div className="flex items-center">
                  <div className="w-64 bg-gray-200 rounded-full h-2 mr-4">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {completedLessons.length} of {totalLessons} lessons completed
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">{Math.round(progressPercentage)}%</div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
        )}

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Course Lessons</h2>
            <p className="text-gray-600 mt-1">Complete lessons in order to unlock the next one.</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {lessons.length === 0 ? (
              <div className="p-6 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons available</h3>
                <p className="text-gray-600">This course doesn't have any lessons yet.</p>
              </div>
            ) : (
              lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = enrollment && index > 0 && !completedLessons.includes(lessons[index - 1].id);
                const canAccess = !enrollment || index === 0 || isCompleted || completedLessons.includes(lessons[index - 1].id);

                return (
                  <div key={lesson.id} className={`p-6 ${!canAccess ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                          ) : isLocked ? (
                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <Lock className="h-6 w-6 text-gray-400" />
                            </div>
                          ) : (
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Play className="h-6 w-6 text-primary-600" />
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <h3 className={`text-lg font-medium ${!canAccess ? 'text-gray-500' : 'text-gray-900'}`}>
                            {index + 1}. {lesson.title}
                          </h3>
                          {isCompleted && (
                            <p className="text-sm text-green-600 mt-1">✓ Completed</p>
                          )}
                          {isLocked && (
                            <p className="text-sm text-gray-500 mt-1">Locked - Complete previous lesson</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-4">
                        {canAccess ? (
                          <Link
                            to={`/learn/${lesson.id}`}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          >
                            {isCompleted ? 'Review' : 'Start'}
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed"
                          >
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Back to Courses */}
        <div className="mt-6">
          <Link 
            to="/courses" 
            className="inline-flex items-center text-primary-600 hover:text-primary-500"
          >
            ← Back to all courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
