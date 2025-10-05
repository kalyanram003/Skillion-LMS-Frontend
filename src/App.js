import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Learner Pages
import Courses from './pages/learner/Courses';
import CourseDetail from './pages/learner/CourseDetail';
import LearnLesson from './pages/learner/LearnLesson';
import Progress from './pages/learner/Progress';

// Creator Pages
import CreatorApply from './pages/creator/CreatorApply';
import CreatorDashboard from './pages/creator/CreatorDashboard';

// Admin Pages
import AdminReview from './pages/admin/AdminReview';

// Common Components
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/" replace />} 
            />

            {/* Learner Routes */}
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute allowedRoles={['LEARNER', 'CREATOR', 'ADMIN']}>
                  <Courses />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses/:id" 
              element={
                <ProtectedRoute allowedRoles={['LEARNER', 'CREATOR', 'ADMIN']}>
                  <CourseDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/learn/:lessonId" 
              element={
                <ProtectedRoute allowedRoles={['LEARNER', 'CREATOR', 'ADMIN']}>
                  <LearnLesson />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute allowedRoles={['LEARNER']}>
                  <Progress />
                </ProtectedRoute>
              } 
            />

            {/* Creator Routes */}
            <Route 
              path="/creator/apply" 
              element={
                <ProtectedRoute allowedRoles={['LEARNER']}>
                  <CreatorApply />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/creator/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['CREATOR']}>
                  <CreatorDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/review/courses" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminReview />
                </ProtectedRoute>
              } 
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
