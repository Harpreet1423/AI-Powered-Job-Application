import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  TrendingUp,
  PlusCircle,
  List,
  BarChart3,
} from 'lucide-react';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import StatsCard from '../components/dashboard/StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getMyJobs();
        setJobs(data.jobs || []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const activeJobs = jobs.filter((j) => j.status === 'active');
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j._count?.applications || 0),
    0
  );
  const avgApplicants =
    jobs.length > 0 ? Math.round(totalApplicants / jobs.length) : 0;

  const recentJobs = jobs.slice(0, 5);

  return (
    <motion.div className="space-y-8" {...pageEntrance}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
          <p className="mt-1 text-gray-600">
            Manage your job listings and view applicant activity.
          </p>
        </div>
        <Link to="/dashboard/recruiter/post-job">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Listings"
          value={jobs.length}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs.length}
          icon={BarChart3}
          color="green"
        />
        <StatsCard
          title="Total Applicants"
          value={totalApplicants}
          icon={Users}
          color="purple"
        />
        <StatsCard
          title="Avg Applicants/Job"
          value={avgApplicants}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Listings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Recent Listings</CardTitle>
            <Link to="/dashboard/recruiter/listings">
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
                      <div className="h-4 w-44 rounded bg-gray-200" />
                      <div className="h-3 w-28 rounded bg-gray-200" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-gray-200" />
                  </div>
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="py-8 text-center">
                <Briefcase className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No job listings yet</p>
                <Link to="/dashboard/recruiter/post-job" className="mt-3 inline-block">
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {job._count?.applications || 0} applicants &middot;{' '}
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        job.status === 'active'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }
                    >
                      {job.status || 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link
              to="/dashboard/recruiter/post-job"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <PlusCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Post New Job</p>
                <p className="text-xs text-gray-500">
                  Create a new job listing to attract talent
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/recruiter/listings"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <List className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">View All Listings</p>
                <p className="text-xs text-gray-500">
                  Manage and edit your existing job posts
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/recruiter/applicants"
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">View Applicants</p>
                <p className="text-xs text-gray-500">
                  Review and manage job applications
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
