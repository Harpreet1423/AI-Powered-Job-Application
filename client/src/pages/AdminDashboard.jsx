import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Trash2,
  Shield,
} from 'lucide-react';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import StatsCard from '../components/dashboard/StatsCard';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, usersData, jobsData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminJobs(),
      ]);
      setStats(
        statsData.stats || {
          totalUsers: 0,
          totalJobs: 0,
          totalApplications: 0,
          activeJobs: 0,
        }
      );
      setUsers(usersData.users || []);
      setJobs(jobsData.jobs || []);
    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    setDeletingUserId(userId);
    try {
      await api.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    setDeletingJobId(jobId);
    try {
      await api.deleteAdminJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Job deleted');
    } catch {
      toast.error('Failed to delete job');
    } finally {
      setDeletingJobId(null);
    }
  };

  const roleColors = {
    admin: 'bg-red-100 text-red-700 border-red-200',
    recruiter: 'bg-blue-100 text-blue-700 border-blue-200',
    seeker: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <motion.div className="space-y-8" {...pageEntrance}>
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
          <Shield className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Platform overview and management.</p>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-28" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            icon={Briefcase}
            color="purple"
          />
          <StatsCard
            title="Total Applications"
            value={stats.totalApplications}
            icon={FileText}
            color="green"
          />
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={TrendingUp}
            color="amber"
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Users</CardTitle>
            <Badge variant="outline">{users.length} total</Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            ) : users.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No users found</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-xs capitalize ${roleColors[user.role] || ''}`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {user.email} &middot; Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                    {user.role !== 'admin' && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUserId === user.id}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 flex-shrink-0 ml-2"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg">Job Listings</CardTitle>
            <Badge variant="outline">{jobs.length} total</Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-500">No jobs found</p>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {job.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {job.company} &middot;{' '}
                        {job._count?.applications || 0} applicants &middot;{' '}
                        {formatDate(job.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={deletingJobId === job.id}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 flex-shrink-0 ml-2"
                      title="Delete Job"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
