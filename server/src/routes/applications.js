import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';

const router = Router();

// Apply for a job (seeker)
router.post('/', authenticate, authorize('seeker'), uploadResume.single('resume'), async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    const job = await req.prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== 'active') {
      return res.status(404).json({ error: 'Job not found or no longer active' });
    }

    // Check duplicate
    const existing = await req.prisma.application.findUnique({
      where: { jobId_seekerId: { jobId, seekerId: req.user.id } },
    });
    if (existing) {
      return res.status(409).json({ error: 'You have already applied for this job' });
    }

    const application = await req.prisma.application.create({
      data: {
        jobId,
        seekerId: req.user.id,
        resumeUrl: req.file ? `/uploads/${req.file.filename}` : null,
        coverLetter: coverLetter || null,
      },
      include: {
        job: { select: { id: true, title: true, company: true } },
      },
    });

    res.status(201).json({ application });
  } catch (err) {
    next(err);
  }
});

// Get seeker's applications
router.get('/my-applications', authenticate, authorize('seeker'), async (req, res, next) => {
  try {
    const applications = await req.prisma.application.findMany({
      where: { seekerId: req.user.id },
      include: {
        job: {
          include: {
            recruiter: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });
    res.json({ applications });
  } catch (err) {
    next(err);
  }
});

// Get applicants for a job (recruiter)
router.get('/job/:jobId', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const job = await req.prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.recruiterId !== req.user.id) return res.status(403).json({ error: 'Not authorized' });

    const applications = await req.prisma.application.findMany({
      where: { jobId: req.params.jobId },
      include: {
        seeker: { select: { id: true, name: true, email: true, avatar: true, bio: true, location: true } },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json({ applications });
  } catch (err) {
    next(err);
  }
});

// Update application status (recruiter)
router.put('/:id/status', authenticate, authorize('recruiter'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'reviewed', 'interview', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await req.prisma.application.findUnique({
      where: { id: req.params.id },
      include: { job: true },
    });

    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (application.job.recruiterId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await req.prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        seeker: { select: { id: true, name: true, email: true, avatar: true } },
        job: { select: { id: true, title: true, company: true } },
      },
    });

    res.json({ application: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
