import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search } from 'lucide-react';
import { api } from '../lib/api';
import JobCard from '../components/jobs/JobCard';
import JobCardSkeleton from '../components/jobs/JobCardSkeleton';
import { Button } from '../components/ui/button';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function SeekerSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const data = await api.getSavedJobs();
        setSavedJobs(data.jobs || data.savedJobs || []);
      } catch {
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedJobs();
  }, []);

  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
        <p className="mt-1 text-gray-600">
          Jobs you have bookmarked for later review.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
          <Heart className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No saved jobs yet</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            When you find a job you like, click the save button to bookmark it here.
          </p>
          <Link to="/jobs" className="mt-6">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
