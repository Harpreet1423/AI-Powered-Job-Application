import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Get all jobs (public) with filtering, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search, location, type, minSalary, maxSalary, skills,
      page = 1, limit = 12, sort = 'newest',
    } = req.query;

    const where = { status: 'active' };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (location) where.location = location;
    if (type) where.type = type;
    if (minSalary) where.salaryMax = { gte: parseInt(minSalary) };
    if (maxSalary) where.salaryMin = { lte: parseInt(maxSalary) };
    if (skills) {
      where.skills = { contains: skills };
    }

    const orderBy = sort === 'oldest' ? { createdAt: 'asc' }
      : sort === 'salary-high' ? { salaryMax: 'desc' }
      : sort === 'salary-low' ? { salaryMin: 'asc' }
      : { createdAt: 'desc' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      req.prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          recruiter: { select: { id: true, name: true, avatar: true } },
          _count: { select: { applications: true } },
        },
      }),
      req.prisma.job.count({ where }),
    ]);

    res.json({
      jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get single job
router.get('/:id', async (req, res, next) => {
  try {
    const job = await req.prisma.job.findUnique({
      where: { id: req.params.id },
      include: {
        recruiter: { select: { id: true, name: true, avatar: true, bio: true } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (err) {
    next(err);
  }
});

// Create job (recruiter only)
router.post('/', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const { title, company, location, type, salaryMin, salaryMax, description, skills, deadline } = req.body;

    if (!title || !company || !location || !type || !description) {
      return res.status(400).json({ error: 'Title, company, location, type, and description are required' });
    }

    const job = await req.prisma.job.create({
      data: {
        title,
        company,
        location,
        type,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        description,
        skills: Array.isArray(skills) ? skills.join(',') : (skills || ''),
        deadline: deadline ? new Date(deadline) : null,
        recruiterId: req.user.id,
      },
      include: {
        recruiter: { select: { id: true, name: true, avatar: true } },
      },
    });

    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
});

// Update job (recruiter owner only)
router.put('/:id', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const job = await req.prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const { title, company, location, type, salaryMin, salaryMax, description, skills, deadline, status } = req.body;

    const updated = await req.prisma.job.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(company && { company }),
        ...(location && { location }),
        ...(type && { type }),
        ...(salaryMin !== undefined && { salaryMin: salaryMin ? parseInt(salaryMin) : null }),
        ...(salaryMax !== undefined && { salaryMax: salaryMax ? parseInt(salaryMax) : null }),
        ...(description && { description }),
        ...(skills && { skills: Array.isArray(skills) ? skills.join(',') : skills }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status && { status }),
      },
      include: {
        recruiter: { select: { id: true, name: true, avatar: true } },
        _count: { select: { applications: true } },
      },
    });

    res.json({ job: updated });
  } catch (err) {
    next(err);
  }
});

// Delete job (recruiter owner only)
router.delete('/:id', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const job = await req.prisma.job.findUnique({ where: { id: req.params.id } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    await req.prisma.job.delete({ where: { id: req.params.id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Get recruiter's jobs
router.get('/recruiter/my-jobs', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const jobs = await req.prisma.job.findMany({
      where: { recruiterId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { applications: true } },
      },
    });
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
});

// Save/unsave job (seeker)
router.post('/:id/save', authenticate, authorize('seeker'), async (req, res, next) => {
  try {
    const existing = await req.prisma.savedJob.findUnique({
      where: { userId_jobId: { userId: req.user.id, jobId: req.params.id } },
    });

    if (existing) {
      await req.prisma.savedJob.delete({ where: { id: existing.id } });
      return res.json({ saved: false, message: 'Job unsaved' });
    }

    await req.prisma.savedJob.create({
      data: { userId: req.user.id, jobId: req.params.id },
    });
    res.json({ saved: true, message: 'Job saved' });
  } catch (err) {
    next(err);
  }
});

// Get saved jobs
router.get('/seeker/saved', authenticate, authorize('seeker'), async (req, res, next) => {
  try {
    const savedJobs = await req.prisma.savedJob.findMany({
      where: { userId: req.user.id },
      include: {
        job: {
          include: {
            recruiter: { select: { id: true, name: true, avatar: true } },
            _count: { select: { applications: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ savedJobs });
  } catch (err) {
    next(err);
  }
});

export default router;
