import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JobCard from '../components/jobs/JobCard';
import JobFilters from '../components/jobs/JobFilters';
import JobCardSkeleton from '../components/jobs/JobCardSkeleton';
import { Button } from '../components/ui/button';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Salary: High to Low', value: 'salary_desc' },
  { label: 'Salary: Low to High', value: 'salary_asc' },
];

export default function JobListingsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
  });
  const [sort, setSort] = useState('newest');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        sort,
      };
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.type) params.type = filters.type;
      if (filters.salaryMin) params.salaryMin = filters.salaryMin;
      if (filters.salaryMax) params.salaryMax = filters.salaryMax;
      if (filters.skills) params.skills = filters.skills;

      const data = await api.getJobs(params);
      setJobs(data.jobs || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      }));
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <motion.main
        className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        {...pageEntrance}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
          <p className="mt-2 text-gray-600">
            Discover opportunities that match your skills and interests
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <JobFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="fixed bottom-6 right-6 z-40 lg:hidden">
            <Button
              onClick={() => setShowFilters(true)}
              className="h-14 w-14 rounded-full shadow-lg"
              size="icon"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowFilters(false)}
              />
              <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-gray-50 p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-md hover:bg-gray-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <JobFilters filters={filters} onFilterChange={handleFilterChange} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top Bar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-600">
                {loading ? 'Searching...' : `${pagination.total} job${pagination.total !== 1 ? 's' : ''} found`}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPagination((prev) => ({ ...prev, page: 1 }));
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Grid */}
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-20 text-center">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No jobs found</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-sm">
                  Try adjusting your filters or search terms to find more opportunities.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() =>
                    handleFilterChange({
                      search: '',
                      location: '',
                      type: '',
                      salaryMin: '',
                      salaryMax: '',
                      skills: '',
                    })
                  }
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => goToPage(pagination.page - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.totalPages ||
                      Math.abs(p - pagination.page) <= 1
                  )
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) =>
                    p === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === pagination.page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(p)}
                        className="min-w-[36px]"
                      >
                        {p}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => goToPage(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
