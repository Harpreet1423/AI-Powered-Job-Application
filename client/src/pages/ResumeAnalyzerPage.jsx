import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ResumeAnalyzer from '../components/ai/ResumeAnalyzer';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function ResumeAnalyzerPage() {
  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 h-32 w-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-4 left-4 h-24 w-24 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold">AI Resume Analyzer</h1>
          </div>
          <p className="text-white/80 max-w-xl leading-relaxed">
            Upload your resume and get instant AI-powered feedback. Our analyzer evaluates your
            resume against industry standards and provides actionable suggestions to help you
            stand out to employers.
          </p>
        </div>
      </div>

      {/* Resume Analyzer Component */}
      <ResumeAnalyzer />
    </motion.div>
  );
}
