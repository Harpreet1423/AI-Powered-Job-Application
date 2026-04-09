import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Heart,
  Brain,
  User,
  PlusCircle,
  List,
  Users,
  BarChart3,
  Settings,
  Briefcase,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = {
  seeker: [
    { label: 'My Applications', href: '/dashboard/seeker', icon: FileText },
    { label: 'Saved Jobs', href: '/dashboard/seeker/saved', icon: Heart },
    { label: 'Resume Analyzer', href: '/dashboard/seeker/resume', icon: Brain },
    { label: 'Profile', href: '/dashboard/seeker/profile', icon: User },
  ],
  recruiter: [
    { label: 'Post Job', href: '/dashboard/recruiter', icon: PlusCircle },
    { label: 'My Listings', href: '/dashboard/recruiter/listings', icon: List },
    { label: 'Applicants', href: '/dashboard/recruiter/applicants', icon: Users },
    { label: 'Profile', href: '/dashboard/recruiter/profile', icon: User },
  ],
  admin: [
    { label: 'Dashboard', href: '/dashboard/admin', icon: BarChart3 },
    { label: 'Users', href: '/dashboard/admin/users', icon: Users },
    { label: 'Jobs', href: '/dashboard/admin/jobs', icon: Briefcase },
    { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ],
};

function SidebarContent({ links, pathname, user, onLogout, onClose }) {
  return (
    <div className="flex h-full flex-col justify-between">
      {/* Top section */}
      <div>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            JobFlow
          </Link>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav links */}
        <nav className="mt-4 flex flex-col gap-1 px-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom user section */}
      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {user?.name
              ? user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-gray-400">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={() => {
            onLogout();
            onClose?.();
          }}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const role = user?.role || 'seeker';
  const links = sidebarLinks[role] || sidebarLinks.seeker;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col bg-[#0f172a]">
        <SidebarContent
          links={links}
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] lg:hidden"
            >
              <SidebarContent
                links={links}
                pathname={pathname}
                user={user}
                onLogout={handleLogout}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            JobFlow
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
