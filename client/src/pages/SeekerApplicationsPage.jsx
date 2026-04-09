import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Building2, Calendar, ExternalLink, Briefcase } from 'lucide-react';
import { api } from '../lib/api';
import { formatDate } from '../lib/utils';
import StatusBadge from '../components/jobs/StatusBadge';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const statusFilters = ['All', 'Pending', 'Reviewed', 'Interview', 'Accepted', 'Rejected'];

export default function SeekerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

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

  const filteredApplications =
    activeFilter === 'All'
      ? applications
      : applications.filter(
          (a) => a.status?.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="mt-1 text-gray-600">Track the status of all your job applications.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
              activeFilter === status
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status}
            {status !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({applications.filter((a) =>
                  a.status?.toLowerCase() === status.toLowerCase()
                ).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">
            {activeFilter === 'All'
              ? 'No applications yet'
              : `No ${activeFilter.toLowerCase()} applications`}
          </h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            {activeFilter === 'All'
              ? 'Start applying to jobs to see your applications here.'
              : 'Try a different filter to see more results.'}
          </p>
          {activeFilter === 'All' && (
            <Link to="/jobs" className="mt-4">
              <Button variant="outline" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {app.job?.title || 'Untitled Job'}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {app.job?.company || 'Unknown Company'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    {app.job?.id && (
                      <Link to={`/jobs/${app.job.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Job
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                {app.coverLetter && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 font-medium mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{app.coverLetter}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
