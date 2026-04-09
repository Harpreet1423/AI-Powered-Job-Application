import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../lib/utils';
import ProfileForm from '../components/dashboard/ProfileForm';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <motion.div className="space-y-6" {...pageEntrance}>
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-gray-600">Manage your account information and settings.</p>
      </div>

      {/* User Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <User className="h-10 w-10" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user?.role || 'Member'}
              </Badge>

              <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600 sm:flex-row sm:gap-6">
                {user?.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-gray-400" />
                    {user.email}
                  </span>
                )}
                {user?.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {user.location}
                  </span>
                )}
                {user?.createdAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    Member since {formatDate(user.createdAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <ProfileForm />
    </motion.div>
  );
}
