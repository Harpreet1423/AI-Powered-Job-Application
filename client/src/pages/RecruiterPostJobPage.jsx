import { motion } from 'framer-motion';
import PostJobForm from '../components/dashboard/PostJobForm';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function RecruiterPostJobPage() {
  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="mt-1 text-gray-600">
          Fill in the details below to create a new job listing.
        </p>
      </div>

      {/* Post Job Form */}
      <PostJobForm />
    </motion.div>
  );
}
