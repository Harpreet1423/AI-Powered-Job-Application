import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  ArrowLeft,
  Heart,
  Share2,
  Users,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { formatSalary, formatDate } from '../lib/utils';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ApplicationModal from '../components/jobs/ApplicationModal';
import StatusBadge from '../components/jobs/StatusBadge';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function JobDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await api.getJob(id);
        setJob(data.job || data);
        setSaved(data.job?.isSaved || data.isSaved || false);
      } catch {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleSaveJob = async () => {
    if (!user) {
      toast.error('Please log in to save jobs');
      return;
    }
    setSavingJob(true);
    try {
      await api.saveJob(id);
      setSaved((prev) => !prev);
      toast.success(saved ? 'Job removed from saved' : 'Job saved successfully');
    } catch {
      toast.error('Failed to save job');
    } finally {
      setSavingJob(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const skillList = job?.skills
    ? job.skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border bg-white p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex gap-3 mb-6">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-xl border bg-white p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Job not found</h2>
            <p className="mt-2 text-gray-500">This job listing may have been removed.</p>
            <Link to="/jobs" className="mt-4 inline-block">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <motion.main
        className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        {...pageEntrance}
      >
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="rounded-xl border bg-white p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold text-lg">
                    {job.company?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="mt-1 flex items-center gap-1.5 text-gray-600">
                      <Building2 className="h-4 w-4" />
                      {job.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSaveJob}
                    disabled={savingJob}
                    title={saved ? 'Unsave' : 'Save'}
                  >
                    <Heart
                      className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`}
                    />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.location && (
                  <Badge variant="outline" className="gap-1 text-sm">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </Badge>
                )}
                {job.type && (
                  <Badge variant="outline" className="gap-1 text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    {job.type}
                  </Badge>
                )}
                {(job.salaryMin || job.salaryMax) && (
                  <Badge variant="outline" className="gap-1 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
                    <DollarSign className="h-3.5 w-3.5" />
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </Badge>
                )}
                {job.createdAt && (
                  <Badge variant="outline" className="gap-1 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    Posted {formatDate(job.createdAt)}
                  </Badge>
                )}
              </div>

              <Separator className="my-6" />

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </div>
              </div>

              {/* Skills */}
              {skillList.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skillList.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-sm px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Card */}
            <div className="rounded-xl border bg-white p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Job Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <p className="text-sm font-medium text-gray-900">{job.company}</p>
                  </div>
                </div>
                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Salary Range</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </p>
                    </div>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">{job.location}</p>
                    </div>
                  </div>
                )}
                {job.type && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Job Type</p>
                      <p className="text-sm font-medium text-gray-900">{job.type}</p>
                    </div>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">Application Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(job.deadline)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Applicants</p>
                    <p className="text-sm font-medium text-gray-900">
                      {job._count?.applications ?? 0} applied
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Action Buttons */}
              <div className="space-y-3">
                {user?.role === 'seeker' && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => setShowApplyModal(true)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Apply Now
                  </Button>
                )}
                {!user && (
                  <Link to="/login" className="block">
                    <Button className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Log In to Apply
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleSaveJob}
                  disabled={savingJob}
                >
                  <Heart
                    className={`h-4 w-4 ${saved ? 'fill-red-500 text-red-500' : ''}`}
                  />
                  {saved ? 'Saved' : 'Save Job'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      <Footer />

      {/* Application Modal */}
      {showApplyModal && (
        <ApplicationModal
          jobId={id}
          jobTitle={job.title}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            toast.success('Application submitted successfully!');
          }}
        />
      )}
    </div>
  );
}
