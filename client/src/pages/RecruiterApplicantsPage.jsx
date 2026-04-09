import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, Briefcase, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import ApplicantCard from '../components/dashboard/ApplicantCard';
import { Skeleton } from '../components/ui/skeleton';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function RecruiterApplicantsPage() {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Fetch recruiter's jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getMyJobs();
        setJobs(data.jobs || []);
      } catch {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // If jobId is in URL, fetch applicants for that job
  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  const fetchApplicants = async (id) => {
    setLoadingApplicants(true);
    try {
      const data = await api.getJobApplications(id);
      setApplicants(data.applications || []);
      setSelectedJob(id);
    } catch {
      toast.error('Failed to load applicants');
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.updateApplicationStatus(applicationId, newStatus);
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status: newStatus } : a
        )
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const currentJobTitle = jobs.find((j) => j.id === selectedJob)?.title || jobs.find((j) => String(j.id) === String(jobId))?.title;

  // Show applicants view
  if (jobId || selectedJob) {
    return (
      <motion.div className="space-y-6" {...pageEntrance}>
        {/* Header */}
        <div>
          <button
            onClick={() => {
              setSelectedJob(null);
              setApplicants([]);
              if (jobId) {
                window.history.back();
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Applicants{currentJobTitle ? ` for "${currentJobTitle}"` : ''}
          </h1>
          <p className="mt-1 text-gray-600">
            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Applicants List */}
        {loadingApplicants ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        ) : applicants.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
            <Users className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">No applicants yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              Applications will appear here when candidates apply to this job.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant, index) => (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ApplicantCard
                  application={applicant}
                  onStatusChange={handleStatusChange}
                />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }

  // Job Selector view (no jobId in URL)
  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">View Applicants</h1>
        <p className="mt-1 text-gray-600">
          Select a job listing to view its applicants.
        </p>
      </div>

      {/* Job List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16 text-center">
          <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No job listings</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Post a job first to start receiving applications.
          </p>
          <Link to="/dashboard/recruiter/post-job" className="mt-4">
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Post a Job
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {job.title}
                    </h3>
                    <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-3.5 w-3.5" />
                      {job._count?.applications || 0} applicants
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => fetchApplicants(job.id)}
                  >
                    <Users className="h-4 w-4" />
                    View Applicants
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
