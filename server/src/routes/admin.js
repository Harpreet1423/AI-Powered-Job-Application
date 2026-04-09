import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get all users
router.get('/users', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const users = await req.prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, avatar: true, location: true, createdAt: true,
        _count: { select: { jobs: true, applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete('/users/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    await req.prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Get all jobs (admin)
router.get('/jobs', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const jobs = await req.prisma.job.findMany({
      include: {
        recruiter: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

// Get platform stats
router.get('/stats', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const [userCount, jobCount, applicationCount, activeJobs] = await Promise.all([
      req.prisma.user.count(),
      req.prisma.job.count(),
      req.prisma.application.count(),
      req.prisma.job.count({ where: { status: 'active' } }),
    ]);

    const recentUsers = await req.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    res.json({
      stats: { userCount, jobCount, applicationCount, activeJobs },
      recentUsers,
    });
  } catch (err) {
    next(err);
  }
});

// Delete job (admin)
router.delete('/jobs/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    await req.prisma.job.delete({ where: { id: req.params.id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

export default router;
