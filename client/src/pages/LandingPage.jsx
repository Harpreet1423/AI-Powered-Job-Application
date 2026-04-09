import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Brain,
  Upload,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Star,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const stats = [
  { label: 'Jobs Available', value: '10,000+', icon: Briefcase },
  { label: 'Companies', value: '5,000+', icon: Building2 },
  { label: 'Job Seekers', value: '50,000+', icon: Users },
  { label: 'Success Rate', value: '95%', icon: TrendingUp },
];

const steps = [
  {
    number: 1,
    title: 'Create Profile',
    description: 'Sign up and build your professional profile with your skills and experience.',
    icon: Users,
  },
  {
    number: 2,
    title: 'Find Jobs',
    description: 'Browse thousands of curated job listings filtered to match your preferences.',
    icon: Search,
  },
  {
    number: 3,
    title: 'Get AI Feedback',
    description: 'Upload your resume and get instant AI-powered insights and improvement tips.',
    icon: Brain,
  },
];

const aiFeatures = [
  'Instant resume score and feedback',
  'Skill gap analysis against job requirements',
  'Personalized improvement suggestions',
  'ATS compatibility check',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Gradient Background Decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute top-[20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-purple-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[30%] h-[300px] w-[300px] rounded-full bg-indigo-400/15 blur-[80px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4" />
              AI-Powered Job Platform
            </motion.div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered Insights
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-600 sm:text-xl">
              JobFlow connects talented professionals with top companies. Leverage our AI-powered
              resume analyzer to stand out from the crowd and land your perfect role.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/jobs">
                <Button size="lg" className="gap-2 px-8 text-base">
                  <Search className="h-5 w-5" />
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="gap-2 px-8 text-base">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 gap-6 lg:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm border"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
            whileInView="animate"
            initial="initial"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Jobs</h2>
            <p className="mt-4 text-lg text-gray-600">
              Discover top opportunities from leading companies
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-sm">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Top Company</p>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Featured Position</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Exciting opportunities will appear here. Browse jobs to explore all listings.
                </p>
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                    Full-time
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                    Remote
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 text-center">
            <Link to="/jobs">
              <Button variant="outline" className="gap-2">
                View All Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-14"
            {...fadeInUp}
            whileInView="animate"
            initial="initial"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </motion.div>

          <motion.div
            className="grid gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={fadeInUp}
                className="relative rounded-2xl bg-white p-8 shadow-sm border text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <div className="mb-4 mt-2 flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                    <step.icon className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Feature Showcase */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-600 to-blue-700" />
        <div className="absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-white blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid items-center gap-12 lg:grid-cols-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Smart Resume Analyzer
              </h2>
              <p className="mt-4 text-lg text-white/80 leading-relaxed">
                Our advanced AI analyzes your resume against industry standards and job requirements,
                providing actionable feedback to help you stand out.
              </p>
              <ul className="mt-6 space-y-3">
                {aiFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-purple-700 hover:bg-white/90"
                  >
                    <Upload className="h-5 w-5" />
                    Try Resume Analyzer
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Resume Analysis</p>
                    <p className="text-sm text-white/60">AI-powered insights</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">Overall Score</span>
                      <span className="text-sm font-bold text-green-400">85/100</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-2 w-[85%] rounded-full bg-green-400" />
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/10 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/80">ATS Compatibility</span>
                      <span className="text-sm font-bold text-blue-400">92%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/20">
                      <div className="h-2 w-[92%] rounded-full bg-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-white/80">3 improvement suggestions found</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of professionals who have found their dream jobs through JobFlow.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button size="lg" className="gap-2 px-8 text-base">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
