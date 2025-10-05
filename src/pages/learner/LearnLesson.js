import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonAPI, enrollmentAPI } from '../../services/api';
import { toast } from 'react-toastify';
import { Play, CheckCircle, ArrowLeft, ArrowRight, FileText, Clock } from 'lucide-react';

const LearnLesson = () => {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const response = await lessonAPI.getLessonById(lessonId);
      setLesson(response.data);
      setCourse(response.data.course);
      
      // Check if lesson is completed (this would need backend implementation)
      setIsCompleted(false);
    } catch (error) {
      toast.error('Failed to fetch lesson');
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!lesson || !course) return;
    
    setCompleting(true);
    try {
      // Find enrollment ID - this would need to be implemented properly
      const enrollmentId = 'temp-enrollment-id'; // This should come from context or API
      
      await enrollmentAPI.completeLesson(enrollmentId, lessonId);
      setIsCompleted(true);
      toast.success('Lesson completed! Great job!');
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
      console.error('Error completing lesson:', error);
    } finally {
      setCompleting(false);
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
              <div className="h-64 bg-gray-200 rounded mb-6"></div>
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

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Lesson not found</h1>
            <p className="mt-2 text-gray-600">The lesson you're looking for doesn't exist.</p>
            <Link to="/courses" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-500">
              ← Back to courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sortedLessons = course?.lessons?.sort((a, b) => a.orderIndex - b.orderIndex) || [];
  const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? sortedLessons[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              to={`/courses/${course?.id}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to course
            </Link>
            
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>Lesson {currentIndex + 1} of {sortedLessons.length}</span>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isCompleted ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Completed</span>
                </div>
              ) : (
                <div className="flex items-center text-primary-600">
                  <Play className="h-5 w-5 mr-2" />
                  <span className="font-medium">In Progress</span>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showTranscript ? 'Hide' : 'Show'} Transcript
            </button>
          </div>
        </div>

        {/* Video/Content Player */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
            {lesson.contentUrl ? (
              <video
                controls
                className="w-full h-full"
                poster=""
              >
                <source src={lesson.contentUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Video content not available</p>
                <p className="text-sm opacity-75">Content URL: {lesson.contentUrl}</p>
              </div>
            )}
          </div>
          
          {/* Transcript */}
          {showTranscript && lesson.transcript && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Transcript</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{lesson.transcript}</p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {prevLesson && (
                <Link
                  to={`/learn/${prevLesson.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {!isCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {completing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
              
              {nextLesson && (
                <Link
                  to={`/learn/${nextLesson.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Course Lessons</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {sortedLessons.map((l, index) => {
              const isCurrentLesson = l.id === lessonId;
              const isCompleted = false; // This should come from enrollment data
              
              return (
                <div key={l.id} className={`p-4 ${isCurrentLesson ? 'bg-primary-50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isCurrentLesson ? (
                          <Play className="h-5 w-5 text-primary-600" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${isCurrentLesson ? 'text-primary-900' : 'text-gray-900'}`}>
                          {index + 1}. {l.title}
                        </p>
                        {isCompleted && (
                          <p className="text-xs text-green-600">Completed</p>
                        )}
                      </div>
                    </div>
                    
                    {isCurrentLesson ? (
                      <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    ) : (
                      <Link
                        to={`/learn/${l.id}`}
                        className="text-sm text-primary-600 hover:text-primary-500"
                      >
                        {isCompleted ? 'Review' : 'Start'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnLesson;
