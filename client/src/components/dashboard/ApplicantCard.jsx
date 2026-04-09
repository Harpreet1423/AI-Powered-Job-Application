import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Download, FileText, ChevronDown } from 'lucide-react';
import { cn, timeAgo } from '../../lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import StatusBadge from '../jobs/StatusBadge';

const statuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ApplicantCard({ application, onStatusChange }) {
  const { id, seeker, status, appliedAt, resumeUrl, coverLetter } = application;
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = (newStatus) => {
    if (newStatus !== status) {
      onStatusChange?.(id, newStatus);
    }
    setShowStatusMenu(false);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="rounded-xl border bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            {seeker?.avatar && <AvatarImage src={seeker.avatar} alt={seeker.name} />}
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {getInitials(seeker?.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{seeker?.name}</h4>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mail className="h-3 w-3" />
                {seeker?.email}
              </span>
              {seeker?.location && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {seeker.location}
                </span>
              )}
            </div>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Applied Date */}
      <p className="text-xs text-muted-foreground mt-3">
        Applied {timeAgo(appliedAt)}
      </p>

      {/* Actions Row */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {/* Status Change Dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStatusMenu((prev) => !prev)}
            className="text-xs"
          >
            Change Status
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 ml-1 transition-transform',
                showStatusMenu && 'rotate-180'
              )}
            />
          </Button>
          <AnimatePresence>
            {showStatusMenu && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-1 z-10 rounded-md border bg-white shadow-lg py-1 min-w-[140px]"
              >
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={cn(
                      'w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-gray-100 transition-colors',
                      s === status && 'font-semibold bg-gray-50'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resume Download */}
        {resumeUrl && (
          <Button variant="outline" size="sm" asChild className="text-xs">
            <a href={resumeUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5 mr-1" />
              Resume
            </a>
          </Button>
        )}

        {/* Cover Letter Toggle */}
        {coverLetter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCoverLetter((prev) => !prev)}
            className="text-xs"
          >
            <FileText className="h-3.5 w-3.5 mr-1" />
            {showCoverLetter ? 'Hide' : 'View'} Cover Letter
          </Button>
        )}
      </div>

      {/* Expandable Cover Letter */}
      <AnimatePresence>
        {showCoverLetter && coverLetter && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {coverLetter}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
