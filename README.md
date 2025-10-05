# MicroCourses LMS Frontend

A modern React-based frontend for the MicroCourses Learning Management System. This frontend provides an interactive interface for learners, creators, and administrators to manage courses, track progress, and issue certificates.

## Features

### For Learners
- **Course Discovery**: Browse and search published courses
- **Interactive Learning**: Watch video lessons with auto-generated transcripts
- **Progress Tracking**: Monitor completion status and progress percentage
- **Certificate Generation**: Earn certificates with unique serial hashes upon 100% completion
- **Enrollment Management**: Enroll in courses and track learning journey

### For Creators
- **Creator Application**: Apply to become a course creator with bio and portfolio
- **Course Creation**: Create and manage courses with lessons
- **Content Management**: Upload video content with auto-transcript generation
- **Dashboard**: Track course performance and enrollments
- **Course Status**: Manage draft and published courses

### For Administrators
- **Course Review**: Review and approve/reject submitted courses
- **Creator Management**: Approve creator applications
- **Content Moderation**: Ensure quality and compliance
- **Analytics**: Monitor platform usage and course performance

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing for SPA navigation
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful icon library
- **React Toastify**: Toast notifications for user feedback

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Main navigation component
│   └── ProtectedRoute.js # Route protection wrapper
├── contexts/           # React context providers
│   └── AuthContext.js  # Authentication state management
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── learner/       # Learner-specific pages
│   ├── creator/       # Creator-specific pages
│   └── admin/         # Admin-specific pages
├── services/          # API service layer
│   └── api.js         # Axios configuration and API calls
├── App.js             # Main application component
└── index.js           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on [http://localhost:8090](https://skillion-lms-backend.onrender.com)

### Installation

1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in the Frontend directory:

```env
REACT_APP_API_URL=http://localhost:8090/api
```

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Courses
- `GET /api/courses` - Get published courses (paginated)
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create new course (Creator only)
- `GET /api/lessons/course/{courseId}` - Get course lessons
- `GET /api/lessons/{id}` - Get lesson details

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `POST /api/enrollments/{id}/complete-lesson` - Mark lesson complete
- `GET /api/enrollments/progress` - Get user progress

### Admin
- `GET /api/admin/review/courses` - Get courses for review
- `PATCH /api/admin/review/courses/{id}/approve` - Approve course
- `PATCH /api/admin/review/creators/{id}/approve` - Approve creator

## Key Features Implementation

### Role-Based Access Control
- Different navigation and features based on user role (LEARNER, CREATOR, ADMIN)
- Protected routes that require authentication and specific roles
- Dynamic UI elements based on user permissions

### Progress Tracking
- Visual progress bars for course completion
- Lesson-by-lesson completion tracking
- Certificate generation upon 100% completion

### Interactive Learning
- Video player with controls
- Auto-generated transcripts display
- Sequential lesson unlocking
- Navigation between lessons

### Content Management
- Course creation with title and description
- Lesson management with ordering
- Draft and published course states
- Admin approval workflow

## Build and Deployment

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Deployment

The build folder can be deployed to any static hosting service:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the MicroCourses LMS system. Please refer to the main project license for details.
