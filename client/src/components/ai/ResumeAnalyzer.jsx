import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Upload,
  FileText,
  Brain,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Loader2,
  BarChart3,
  Zap,
  Award,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Helper: circular‑progress SVG used for the ATS score + section scores     */
/* -------------------------------------------------------------------------- */

function CircularScore({ score, size = 160, strokeWidth = 10, delay = 0 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75
      ? 'text-emerald-500'
      : score >= 50
        ? 'text-amber-500'
        : 'text-red-500';

  const bgRing =
    score >= 75
      ? 'stroke-emerald-500/15'
      : score >= 50
        ? 'stroke-amber-500/15'
        : 'stroke-red-500/15';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgRing}
        />
        {/* animated foreground ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn('drop-shadow-md', color)}
          stroke="currentColor"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay }}
        />
      </svg>
      <motion.span
        className={cn(
          'absolute font-extrabold tracking-tight',
          color,
          size >= 140 ? 'text-5xl' : 'text-lg'
        )}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.5 }}
      >
        {score}
      </motion.span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helper: animated horizontal bar                                           */
/* -------------------------------------------------------------------------- */

const barColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
];

function CategoryBar({ label, score, index }) {
  const color = barColors[index % barColors.length];
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground capitalize">{label}</span>
        <span className="font-semibold tabular-nums text-foreground">
          {score}
          <span className="text-muted-foreground font-normal">/100</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{
            duration: 1,
            ease: 'easeOut',
            delay: 0.15 * index,
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Analysis loading steps animation                                          */
/* -------------------------------------------------------------------------- */

const analysisSteps = [
  { icon: FileText, text: 'Parsing PDF document...' },
  { icon: Brain, text: 'Analyzing content with AI...' },
  { icon: Target, text: 'Matching against job requirements...' },
  { icon: BarChart3, text: 'Scoring resume sections...' },
  { icon: Sparkles, text: 'Generating personalized feedback...' },
];

function AnalysisLoader() {
  const [activeStep, setActiveStep] = useState(0);

  useState(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < analysisSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 2200);
    return () => clearInterval(interval);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 py-16"
    >
      {/* Pulsing brain icon */}
      <div className="relative">
        <motion.div
          className="absolute -inset-6 rounded-full bg-gradient-to-r from-violet-500/20 to-blue-500/20 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Brain className="h-10 w-10" />
        </motion.div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
          AI Analysis in Progress
        </h3>
        <p className="text-sm text-muted-foreground">
          This usually takes 15-30 seconds
        </p>
      </div>

      {/* Step indicators */}
      <div className="w-full max-w-sm space-y-3">
        {analysisSteps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-500',
                isDone && 'text-emerald-600',
                isActive &&
                  'bg-gradient-to-r from-violet-500/10 to-blue-500/10 text-violet-700 dark:text-violet-300 font-medium',
                !isDone && !isActive && 'text-muted-foreground'
              )}
            >
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-500" />
              ) : (
                <Icon className="h-4 w-4 shrink-0 opacity-40" />
              )}
              <span>{step.text}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted/60">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-600"
          initial={{ width: '5%' }}
          animate={{ width: '92%' }}
          transition={{ duration: 14, ease: 'linear' }}
        />
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section mini score badge                                                  */
/* -------------------------------------------------------------------------- */

function MiniScore({ score }) {
  const color =
    score >= 75
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
      : score >= 50
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tabular-nums',
        color
      )}
    >
      {score}/100
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stagger container / item variants for framer-motion                       */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

/* ========================================================================== */
/*  MAIN COMPONENT                                                            */
/* ========================================================================== */

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  /* ------ Dropzone config ------------------------------------------------- */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5 MB
    onDrop: (accepted, rejected) => {
      if (rejected.length) {
        toast.error('Please upload a valid PDF file (max 5 MB)');
        return;
      }
      if (accepted.length) {
        setFile(accepted[0]);
        toast.success('Resume selected!');
      }
    },
  });

  /* ------ Submit handler -------------------------------------------------- */
  const handleAnalyze = async () => {
    if (!file) {
      toast.error('Please upload your resume first');
      return;
    }

    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const data = await api.analyzeResume(formData);
      setAnalysis(data.analysis ?? data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  /* ------ Reset ----------------------------------------------------------- */
  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setAnalysis(null);
  };

  /* ====================================================================== */
  /*  RENDER                                                                 */
  /* ====================================================================== */

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* ---------- HEADER ------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-300">
          <Sparkles className="h-4 w-4" />
          Powered by AI
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Resume Analyzer
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Get instant, AI-powered feedback on your resume. Optimize for ATS
          systems, improve clarity, and land more interviews.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ================================================================ */}
        {/*  STATE 1 -- UPLOAD FORM                                         */}
        {/* ================================================================ */}
        {!analysis && !analyzing && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Drag-and-drop zone */}
            <Card className="overflow-hidden border-2 border-dashed transition-colors hover:border-violet-400 dark:hover:border-violet-600">
              <div
                {...getRootProps()}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-4 p-10 text-center transition-colors',
                  isDragActive &&
                    'bg-violet-50/60 dark:bg-violet-950/30 border-violet-500'
                )}
              >
                <input {...getInputProps()} />

                <motion.div
                  animate={
                    isDragActive
                      ? { scale: 1.1, rotate: [0, -5, 5, 0] }
                      : { scale: 1 }
                  }
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-2xl',
                    file
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                      : 'bg-gradient-to-br from-violet-100 to-blue-100 text-violet-600 dark:from-violet-900/40 dark:to-blue-900/40 dark:text-violet-400'
                  )}
                >
                  {file ? (
                    <FileText className="h-8 w-8" />
                  ) : (
                    <Upload className="h-8 w-8" />
                  )}
                </motion.div>

                {file ? (
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove &amp; choose another
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-foreground">
                      {isDragActive
                        ? 'Drop your resume here...'
                        : 'Drop your resume PDF here'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse &middot; PDF only &middot; up to 5 MB
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Job description textarea */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-blue-500" />
                  Job Description
                  <Badge variant="secondary" className="ml-auto text-xs">
                    Optional
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for a tailored analysis. We'll match your resume against the specific requirements and keywords..."
                  rows={6}
                  className="w-full resize-none rounded-lg border bg-muted/30 px-4 py-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-shadow"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Adding a job description dramatically improves keyword matching
                  and relevance scoring.
                </p>
              </CardContent>
            </Card>

            {/* Analyze button */}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!file}
                className="w-full h-14 text-base font-semibold gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                <Brain className="h-5 w-5" />
                Analyze Resume
                <Sparkles className="h-4 w-4 opacity-70" />
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/*  LOADING STATE                                                   */}
        {/* ================================================================ */}
        {analyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-violet-200 dark:border-violet-800">
              <CardContent className="p-2">
                <AnalysisLoader />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/*  STATE 2 -- RESULTS                                              */}
        {/* ================================================================ */}
        {analysis && !analyzing && (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* ----- (a) ATS Score ---------------------------------------- */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <div className="relative">
                  {/* Decorative gradient strip */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-blue-500 to-purple-600" />
                  <CardContent className="flex flex-col items-center gap-4 pt-10 pb-8">
                    <CircularScore score={analysis.atsScore} size={180} strokeWidth={12} />
                    <div className="text-center space-y-1">
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2 justify-center">
                        <Award className="h-5 w-5 text-violet-500" />
                        ATS Compatibility Score
                      </h2>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {analysis.atsScore >= 75
                          ? 'Great! Your resume is well-optimized for applicant tracking systems.'
                          : analysis.atsScore >= 50
                            ? 'Decent score, but there is room for improvement to pass more ATS filters.'
                            : 'Your resume needs significant improvements to pass ATS filters.'}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>

            {/* ----- (b) Overall Summary ---------------------------------- */}
            <motion.div variants={itemVariants}>
              <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-violet-500 via-blue-500 to-purple-500">
                <Card className="rounded-[10px] border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Zap className="h-5 w-5 text-amber-500" />
                      AI Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {analysis.overallSummary}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* ----- (c) Category Breakdown ------------------------------- */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {analysis.categories &&
                    Object.entries(analysis.categories).map(
                      ([key, score], idx) => (
                        <CategoryBar
                          key={key}
                          label={key.replace(/([A-Z])/g, ' $1').trim()}
                          score={score}
                          index={idx}
                        />
                      )
                    )}
                </CardContent>
              </Card>
            </motion.div>

            {/* ----- (d) Strengths ---------------------------------------- */}
            {analysis.strengths?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-emerald-200 dark:border-emerald-900/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.strengths.map((s, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i }}
                          className="flex items-start gap-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 p-3"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          <span className="text-sm text-foreground">{s}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ----- (e) Improvements ------------------------------------- */}
            {analysis.improvements?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-amber-200 dark:border-amber-900/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="h-5 w-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.improvements.map((item, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 * i }}
                          className="flex items-start gap-3 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 p-3"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          <span className="text-sm text-foreground">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ----- (f) Missing Keywords --------------------------------- */}
            {analysis.missingKeywords?.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-red-200 dark:border-red-900/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-red-700 dark:text-red-400">
                      <XCircle className="h-5 w-5" />
                      Missing Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      These keywords from the job description were not found in
                      your resume. Consider incorporating them naturally.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((kw, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.04 * i }}
                        >
                          <Badge
                            variant="outline"
                            className="border-red-300 text-red-700 bg-red-50 dark:border-red-800 dark:text-red-400 dark:bg-red-950/30"
                          >
                            {kw}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ----- (g) Section-by-Section Feedback ---------------------- */}
            {analysis.sectionFeedback && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-violet-500" />
                      Section-by-Section Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {Object.entries(analysis.sectionFeedback).map(
                        ([section, data]) => (
                          <AccordionItem key={section} value={section}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <span className="capitalize font-semibold">
                                  {section}
                                </span>
                                <MiniScore score={data.score} />
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {data.feedback}
                              </p>

                              {data.suggestions?.length > 0 && (
                                <>
                                  <Separator />
                                  <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                                      Suggestions
                                    </h4>
                                    <ul className="space-y-2">
                                      {data.suggestions.map((sug, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2 text-sm"
                                        >
                                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500" />
                                          <span>{sug}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ----- (h) Analyze Another ---------------------------------- */}
            <motion.div variants={itemVariants} className="pt-2 pb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  onClick={handleReset}
                  className="flex-1 h-12 gap-2 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 shadow-lg shadow-violet-500/20"
                >
                  <Upload className="h-4 w-4" />
                  Analyze Another Resume
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    const lines = [];
                    lines.push('Resume Analysis Results');
                    lines.push('='.repeat(40));
                    lines.push('');
                    lines.push(`ATS Score: ${analysis.atsScore}/100`);
                    lines.push('');
                    if (analysis.overallSummary) {
                      lines.push('Overall Summary:');
                      lines.push(analysis.overallSummary);
                      lines.push('');
                    }
                    if (analysis.categories) {
                      lines.push('Category Scores:');
                      Object.entries(analysis.categories).forEach(([key, val]) => {
                        lines.push(`  ${key}: ${val.score}/100 - ${val.feedback}`);
                      });
                      lines.push('');
                    }
                    if (analysis.strengths?.length > 0) {
                      lines.push('Strengths:');
                      analysis.strengths.forEach((s) => lines.push(`  - ${s}`));
                      lines.push('');
                    }
                    if (analysis.improvements?.length > 0) {
                      lines.push('Areas for Improvement:');
                      analysis.improvements.forEach((s) => lines.push(`  - ${s}`));
                      lines.push('');
                    }
                    if (analysis.missingKeywords?.length > 0) {
                      lines.push('Missing Keywords:');
                      analysis.missingKeywords.forEach((kw) => lines.push(`  - ${kw}`));
                      lines.push('');
                    }
                    if (analysis.sectionFeedback) {
                      lines.push('Section Feedback:');
                      Object.entries(analysis.sectionFeedback).forEach(([section, fb]) => {
                        lines.push(`  ${section}: ${fb}`);
                      });
                      lines.push('');
                    }
                    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'resume-analysis.txt';
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Results downloaded');
                  }}
                  className="h-12 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Results
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
