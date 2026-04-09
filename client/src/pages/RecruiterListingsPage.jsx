import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Users,
  Edit,
  Trash2,
  Eye,
  Pause,
  Play,
} from 'lucide-react';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function RecruiterListingsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.getMyJobs();
      setJobs(data.jobs || []);
    } catch {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'paused' : 'active';
    setTogglingId(job.id);
    try {
      await api.updateJob(job.id, { status: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
      );
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }
    setDeletingId(jobId);
    try {
      await api.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      toast.success('Job listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Listings</h1>
          <p className="mt-1 text-gray-600">
            Manage all your posted job listings.
          </p>
        </div>
        <Link to="/dashboard/recruiter/post-job">
          <Button className="gap-2">
            <Briefcase className="h-4 w-4" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Listings */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No listings yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Create your first job listing to start attracting candidates.
          </p>
          <Link to="/dashboard/recruiter/post-job" className="mt-4">
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Post Your First Job
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Job Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {job.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={
                          job.status === 'active'
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }
                      >
                        {job.status === 'active' ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {job._count?.applications || 0} applicants
                      </span>
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job.id}`}>
                      <Button variant="outline" size="icon" title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to={`/dashboard/recruiter/applicants/${job.id}`}>
                      <Button variant="outline" size="icon" title="View Applicants">
                        <Users className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleStatus(job)}
                      disabled={togglingId === job.id}
                      title={job.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {job.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(job.id)}
                      disabled={deletingId === job.id}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
