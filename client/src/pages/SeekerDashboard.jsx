import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Clock, Video, CheckCircle2, Brain, Search } from 'lucide-react';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import StatsCard from '../components/dashboard/StatsCard';
import StatusBadge from '../components/jobs/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function SeekerDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await api.getMyApplications();
        setApplications(data.applications || []);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
  };

  const recentApplications = applications.slice(0, 5);

  return (
    <motion.div className="space-y-8" {...pageEntrance}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Welcome back! Here is an overview of your job search.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          icon={FileText}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Interviews"
          value={stats.interview}
          icon={Video}
          color="purple"
        />
        <StatsCard
          title="Accepted"
          value={stats.accepted}
          icon={CheckCircle2}
          color="green"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <Link to="/dashboard/seeker/applications">
              <Button variant="ghost" size="sm" className="text-blue-600">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between animate-pulse">
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-gray-200" />
                      <div className="h-3 w-28 rounded bg-gray-200" />
                    </div>
                    <div className="h-6 w-20 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No applications yet</p>
                <Link to="/jobs" className="mt-3 inline-block">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Search className="h-4 w-4" />
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.job?.title || 'Untitled Job'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {app.job?.company || 'Unknown Company'} &middot;{' '}
                        {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              to="/dashboard/seeker/resume-analyzer"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">AI Resume Analyzer</p>
                <p className="text-xs text-gray-500">
                  Get AI-powered feedback on your resume
                </p>
              </div>
            </Link>

            <Link
              to="/jobs"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Browse Jobs</p>
                <p className="text-xs text-gray-500">
                  Explore the latest job opportunities
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/seeker/saved-jobs"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Saved Jobs</p>
                <p className="text-xs text-gray-500">
                  View your bookmarked positions
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
