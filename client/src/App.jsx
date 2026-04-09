import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import LandingPage from './pages/LandingPage';
import JobListingsPage from './pages/JobListingsPage';
import JobDetailPage from './pages/JobDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard Pages
import SeekerDashboard from './pages/SeekerDashboard';
import SeekerApplicationsPage from './pages/SeekerApplicationsPage';
import SeekerSavedJobsPage from './pages/SeekerSavedJobsPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import ProfilePage from './pages/ProfilePage';

import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterPostJobPage from './pages/RecruiterPostJobPage';
import RecruiterListingsPage from './pages/RecruiterListingsPage';
import RecruiterApplicantsPage from './pages/RecruiterApplicantsPage';

import AdminDashboard from './pages/AdminDashboard';

// Layout & Auth
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/jobs" element={<JobListingsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Seeker Dashboard */}
        <Route element={<ProtectedRoute roles={['seeker']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
            <Route path="/dashboard/seeker/applications" element={<SeekerApplicationsPage />} />
            <Route path="/dashboard/seeker/saved" element={<SeekerSavedJobsPage />} />
            <Route path="/dashboard/seeker/resume-analyzer" element={<ResumeAnalyzerPage />} />
            <Route path="/dashboard/seeker/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Recruiter Dashboard */}
        <Route element={<ProtectedRoute roles={['recruiter']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
            <Route path="/dashboard/recruiter/post-job" element={<RecruiterPostJobPage />} />
            <Route path="/dashboard/recruiter/listings" element={<RecruiterListingsPage />} />
            <Route path="/dashboard/recruiter/applicants" element={<RecruiterApplicantsPage />} />
            <Route path="/dashboard/recruiter/applicants/:jobId" element={<RecruiterApplicantsPage />} />
            <Route path="/dashboard/recruiter/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/dashboard/admin/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
