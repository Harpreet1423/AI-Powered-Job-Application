import { Clock, Eye, Video, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';

const statusConfig = {
  pending: {
    icon: Clock,
    className: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  reviewed: {
    icon: Eye,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  interview: {
    icon: Video,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  accepted: {
    icon: CheckCircle2,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  rejected: {
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('gap-1 text-xs font-medium capitalize', config.className)}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}
