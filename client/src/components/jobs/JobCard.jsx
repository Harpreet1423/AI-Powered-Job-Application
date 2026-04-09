import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, DollarSign, Users, Building2 } from 'lucide-react';
import { cn, formatSalary, timeAgo } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

function generateColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
    'bg-orange-500',
  ];
  return colors[Math.abs(hash) % colors.length];
}

const locationStyles = {
  remote: 'bg-green-100 text-green-700 border-green-200',
  hybrid: 'bg-blue-100 text-blue-700 border-blue-200',
  onsite: 'bg-orange-100 text-orange-700 border-orange-200',
};

const typeStyles = {
  'full-time': 'bg-blue-100 text-blue-700 border-blue-200',
  'part-time': 'bg-purple-100 text-purple-700 border-purple-200',
  contract: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function JobCard({ job }) {
  const {
    id,
    title,
    company,
    location,
    type,
    salaryMin,
    salaryMax,
    skills,
    createdAt,
    _count,
  } = job;

  const skillList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : [];
  const visibleSkills = skillList.slice(0, 4);
  const extraCount = skillList.length - 4;

  const locationKey = location?.toLowerCase();
  const typeKey = type?.toLowerCase();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <div className="rounded-xl border bg-white p-5 shadow-sm transition-shadow duration-200 group-hover:shadow-lg">
        {/* Header: Company + Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm',
                generateColor(company || '')
              )}
            >
              {company?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-gray-400" />
                {company}
              </p>
            </div>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-1">
          {title}
        </h3>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium gap-1',
              locationStyles[locationKey] || 'bg-gray-100 text-gray-700'
            )}
          >
            <MapPin className="h-3 w-3" />
            {location}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-medium gap-1',
              typeStyles[typeKey] || 'bg-gray-100 text-gray-700'
            )}
          >
            <Clock className="h-3 w-3" />
            {type}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs font-medium gap-1 bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            <DollarSign className="h-3 w-3" />
            {formatSalary(salaryMin, salaryMax)}
          </Badge>
        </div>

        {/* Skills */}
        {skillList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
              >
                {skill}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-block rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                +{extraCount} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Users className="h-3.5 w-3.5" />
            <span>{_count?.applications ?? 0} applicant{(_count?.applications ?? 0) !== 1 ? 's' : ''}</span>
          </div>
          <Link to={`/jobs/${id}`}>
            <Button variant="outline" size="sm" className="text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
