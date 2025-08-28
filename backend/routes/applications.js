// // D:\JobseekerWeb\backend\routes\applications.js

// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Application = require('../models/Application');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
// const upload = require('../middleware/upload');

// router.post('/', auth, upload.single('resume'), async (req, res) => {
//   try {
//     const { jobId } = req.body;
//     console.log('Application request:', { jobId, userId: req.user.id, file: req.file });
//     if (!jobId) {
//       console.warn('Job ID missing');
//       return res.status(400).json({ msg: 'Job ID is required' });
//     }
//     if (!mongoose.isValidObjectId(jobId)) {
//       console.warn('Invalid job ID:', jobId);
//       return res.status(400).json({ msg: 'Invalid job ID' });
//     }
//     const job = await require('../models/Job').findById(jobId);
//     if (!job || job.status !== 'approved') {
//       console.warn('Job not found or not approved:', jobId);
//       return res.status(404).json({ msg: 'Job not found or not approved' });
//     }
//     const application = new Application({
//       userId: req.user.id,
//       jobId,
//       resume: req.file ? `/uploads/resumes/${req.file.filename}` : '',
//       status: 'pending',
//     });
//     await application.save();
//     console.log('Application created:', { id: application._id, userId: application.userId, jobId: application.jobId });
//     res.status(201).json({ msg: 'Application submitted', application: await application.populate('jobId', 'title company') });
//   } catch (err) {
//     console.error('Apply job error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.get('/', auth, async (req, res) => {
//   try {
//     console.log('Fetching applications for user:', req.user.id);
//     const applications = await Application.find({ userId: req.user.id }).populate('jobId', 'title company');
//     console.log('Fetched applications:', applications.map(app => ({ id: app._id, jobId: app.jobId, status: app.status })));
//     res.json(applications);
//   } catch (err) {
//     console.error('Get applications error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.get('/user/:id', auth, admin, async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid user ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid user ID' });
//     }
//     const applications = await Application.find({ userId: req.params.id }).populate('jobId', 'title company');
//     console.log('Fetched applications for user:', req.params.id, applications.length);
//     res.json(applications);
//   } catch (err) {
//     console.error('Get user applications error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.put('/:id/status', auth, admin, async (req, res) => {
//   const { status } = req.body;
//   try {
//     if (!['pending', 'approved', 'rejected'].includes(status)) {
//       console.warn('Invalid status:', status);
//       return res.status(400).json({ msg: 'Invalid status' });
//     }
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid application ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid application ID' });
//     }
//     const application = await Application.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     ).populate('jobId', 'title company');
//     if (!application) {
//       console.warn('Application not found:', req.params.id);
//       return res.status(404).json({ msg: 'Application not found' });
//     }
//     console.log('Application status updated:', { id: application._id, status });
//     res.json({ msg: 'Application status updated', application });
//   } catch (err) {
//     console.error('Update application status error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/admin');
const upload = require('../middleware/upload');

// Middleware validation (for debugging)
if (typeof authMiddleware !== 'function') {
  console.error('authMiddleware is not a function:', authMiddleware);
  throw new Error('authMiddleware must be a function');
}
if (typeof adminMiddleware !== 'function') {
  console.error('adminMiddleware is not a function:', adminMiddleware);
  throw new Error('adminMiddleware must be a function');
}

// Submit a job application (authenticated users)
router.post('/', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.body;
    console.log('Application request:', { jobId, userId: req.user.id, resume: req.file ? req.file.path : null });
    if (!jobId) {
      console.warn('Job ID missing');
      return res.status(400).json({ msg: 'Job ID is required' });
    }
    if (!mongoose.isValidObjectId(jobId)) {
      console.warn('Invalid job ID:', jobId);
      return res.status(400).json({ msg: 'Invalid job ID' });
    }
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'approved') {
      console.warn('Job not found or not approved:', jobId);
      return res.status(404).json({ msg: 'Job not found or not approved' });
    }
    const existingApplication = await Application.findOne({ userId: req.user.id, jobId });
    if (existingApplication) {
      console.warn('User already applied for job:', { userId: req.user.id, jobId });
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }
    const application = new Application({
      userId: req.user.id,
      jobId,
      resume: req.file ? req.file.path : null, // Allow null resume
      status: 'pending',
    });
    await application.save();
    console.log('Application created:', { id: application._id, userId: application.userId, jobId: application.jobId });
    res.status(201).json({ msg: 'Application submitted', application: await application.populate('jobId', 'title company') });
  } catch (err) {
    console.error('Apply job error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all applications for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching applications for user:', req.user.id);
    const applications = await Application.find({ userId: req.user.id }).populate('jobId', 'title company');
    console.log('Fetched applications:', applications.map(app => ({ id: app._id, jobId: app.jobId._id, status: app.status })));
    res.json(applications);
  } catch (err) {
    console.error('Get applications error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all applications for a user (admin only)
router.get('/user/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn('Invalid user ID:', req.params.id);
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    const applications = await Application.find({ userId: req.params.id }).populate('jobId', 'title company');
    console.log('Fetched applications for user:', req.params.id, applications.length);
    res.json(applications);
  } catch (err) {
    console.error('Get user applications error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update application status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      console.warn('Invalid status:', status);
      return res.status(400).json({ msg: 'Invalid status' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn('Invalid application ID:', req.params.id);
      return res.status(400).json({ msg: 'Invalid application ID' });
    }
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('jobId', 'title company');
    if (!application) {
      console.warn('Application not found:', req.params.id);
      return res.status(404).json({ msg: 'Application not found' });
    }
    console.log('Application status updated:', { id: application._id, status });
    res.json({ msg: 'Application status updated', application });
  } catch (err) {
    console.error('Update application status error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all applications for a job (admin only)
router.get('/job/:jobId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.jobId)) {
      console.warn('Invalid job ID:', req.params.jobId);
      return res.status(400).json({ msg: 'Invalid job ID' });
    }
    const applications = await Application.find({ jobId: req.params.jobId }).populate('userId', 'name email');
    console.log('Fetched applications for job:', req.params.jobId, applications.length);
    res.json(applications);
  } catch (err) {
    console.error('Get job applications error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;