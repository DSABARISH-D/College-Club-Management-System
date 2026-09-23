import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import Navbar from './components/layout/Navbar';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import ExploreClubs from './pages/student/ExploreClubs';
import ClubDetails from './pages/student/ClubDetails';
import MyClubs from './pages/student/MyClubs';
import { ActivitiesPage, ActivityDetail } from './pages/student/Activities';
import Announcements from './pages/student/Announcements';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMembers from './pages/admin/ManageMembers';
import ManageActivities from './pages/admin/ManageActivities';
import ActivityForm from './pages/admin/ActivityForm';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import AnnouncementForm from './pages/admin/AnnouncementForm';
import ManagePosts from './pages/admin/ManagePosts';
import PostForm from './pages/admin/PostForm';
import ClubSettings from './pages/admin/ClubSettings';

// Coordinator pages
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CoordinatorClubsList from './pages/coordinator/ClubsList';
import CoordinatorClubMembers from './pages/coordinator/ClubMembers';
import CoordinatorAnalyticsDashboard from './pages/coordinator/AnalyticsDashboard';

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="STUDENT">
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/explore" element={
        <ProtectedRoute requiredRole="STUDENT">
          <ExploreClubs />
        </ProtectedRoute>
      } />
      <Route path="/clubs/:slug" element={
        <ProtectedRoute requiredRole="STUDENT">
          <ClubDetails />
        </ProtectedRoute>
      } />
      <Route path="/my-clubs" element={
        <ProtectedRoute requiredRole="STUDENT">
          <MyClubs />
        </ProtectedRoute>
      } />
      <Route path="/activities" element={
        <ProtectedRoute requiredRole="STUDENT">
          <ActivitiesPage />
        </ProtectedRoute>
      } />
      <Route path="/activities/:id" element={
        <ProtectedRoute requiredRole="STUDENT">
          <ActivityDetail />
        </ProtectedRoute>
      } />
      <Route path="/announcements" element={
        <ProtectedRoute requiredRole="STUDENT">
          <Announcements />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/members" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ManageMembers />
        </ProtectedRoute>
      } />
      <Route path="/admin/activities" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ManageActivities />
        </ProtectedRoute>
      } />
      <Route path="/admin/activities/new" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ActivityForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/posts" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ManagePosts />
        </ProtectedRoute>
      } />
      <Route path="/admin/posts/new" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <PostForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/activities/:id/edit" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ActivityForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ManageAnnouncements />
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements/new" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <AnnouncementForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/announcements/:id/edit" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <AnnouncementForm />
        </ProtectedRoute>
      } />
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredRole="CLUB_ADMIN">
          <ClubSettings />
        </ProtectedRoute>
      } />

      {/* Coordinator routes */}
      <Route path="/coordinator" element={
        <ProtectedRoute requiredRole="CLUB_COORDINATOR">
          <CoordinatorDashboard />
        </ProtectedRoute>
      } />
      <Route path="/coordinator/clubs" element={
        <ProtectedRoute requiredRole="CLUB_COORDINATOR">
          <CoordinatorClubsList />
        </ProtectedRoute>
      } />
      <Route path="/coordinator/clubs/:id/members" element={
        <ProtectedRoute requiredRole="CLUB_COORDINATOR">
          <CoordinatorClubMembers />
        </ProtectedRoute>
      } />
      <Route path="/coordinator/analytics" element={
        <ProtectedRoute requiredRole="CLUB_COORDINATOR">
          <CoordinatorAnalyticsDashboard />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Page not found</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
