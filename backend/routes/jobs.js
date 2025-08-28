// // D:\JobseekerWeb\backend\routes\jobs.js

// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Job = require('../models/Job');
// const auth = require('../middleware/auth');
// const admin = require('../middleware/admin');
// const upload = require('../middleware/upload');

// router.get('/', async (req, res) => {
//   try {
//     const jobs = await Job.find({ status: 'approved' });
//     console.log('Fetched approved jobs:', jobs.length);
//     res.json(jobs);
//   } catch (err) {
//     console.error('Get jobs error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.get('/all', auth, admin, async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     console.log('Fetched all jobs for admin:', jobs.length);
//     res.json(jobs);
//   } catch (err) {
//     console.error('Get all jobs error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.get('/:id', async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid job ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid job ID' });
//     }
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       console.warn('Job not found:', req.params.id);
//       return res.status(404).json({ msg: 'Job not found' });
//     }
//     if (job.status !== 'approved') {
//       console.warn('Job not approved:', req.params.id);
//       return res.status(403).json({ msg: 'Job not approved' });
//     }
//     console.log('Fetched job:', job._id);
//     res.json(job);
//   } catch (err) {
//     console.error('Get job error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// router.post('/', auth, admin, upload.single('companyLogo'), async (req, res) => {
//   try {
//     const { title, company, experience, salary, location, openings } = req.body;
//     console.log('Received job data:', req.body, 'File:', req.file);
//     if (!title || !company || !experience || !location) {
//       console.warn('Missing required fields:', req.body);
//       return res.status(400).json({ msg: 'Missing required fields' });
//     }
//     const job = new Job({
//       title,
//       company,
//       companyLogo: req.file ? `/uploads/logos/${req.file.filename}` : '',
//       experience,
//       salary,
//       location,
//       openings: parseInt(openings) || 1,
//       status: 'pending',
//     });
//     await job.save();
//     console.log('Job created:', job._id);
//     res.status(201).json({ msg: 'Job created, awaiting approval' });
//   } catch (err) {
//     console.error('Create job error:', err.message);
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
//     const job = await Job.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     if (!job) {
//       console.warn('Job not found for status update:', req.params.id);
//       return res.status(404).json({ msg: 'Job not found' });
//     }
//     console.log('Job status updated:', job._id, status);
//     res.json({ msg: 'Job status updated', job });
//   } catch (err) {
//     console.error('Update job status error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// module.exports = router;


// // D:\JobseekerWeb\backend\routes\jobs.js
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const Job = require('../models/Job');
// const { authMiddleware } = require('../middleware/auth');
// const { adminMiddleware } = require('../middleware/admin');
// const upload = require('../middleware/upload');

// // Middleware validation (for debugging)
// if (typeof authMiddleware !== 'function') {
//   console.error('authMiddleware is not a function:', authMiddleware);
//   throw new Error('authMiddleware must be a function');
// }
// if (typeof adminMiddleware !== 'function') {
//   console.error('adminMiddleware is not a function:', adminMiddleware);
//   throw new Error('adminMiddleware must be a function');
// }
// if (typeof upload.single !== 'function') {
//   console.error('upload.single is not a function:', upload.single);
//   throw new Error('upload.single must be a function');
// }

// // Get all approved jobs (public)
// router.get('/', async (req, res) => {
//   try {
//     const jobs = await Job.find({ status: 'approved' });
//     console.log('Fetched approved jobs:', jobs.length);
//     res.json(jobs);
//   } catch (err) {
//     console.error('Get jobs error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Get all jobs (admin only)
// router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const jobs = await Job.find();
//     console.log('Fetched all jobs for admin:', jobs.length);
//     res.json(jobs);
//   } catch (err) {
//     console.error('Get all jobs error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Get job by ID (public, approved jobs only)
// router.get('/:id', async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid job ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid job ID' });
//     }
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       console.warn('Job not found:', req.params.id);
//       return res.status(404).json({ msg: 'Job not found' });
//     }
//     if (job.status !== 'approved') {
//       console.warn('Job not approved:', req.params.id);
//       return res.status(403).json({ msg: 'Job not approved' });
//     }
//     console.log('Fetched job:', job._id);
//     res.json(job);
//   } catch (err) {
//     console.error('Get job error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Create a job (admin only)
// router.post('/', authMiddleware, adminMiddleware, upload.single('companyLogo'), async (req, res) => {
//   try {
//     const { title, company, experience, salary, location, openings } = req.body;
//     console.log('Received job data:', req.body, 'File:', req.file);
//     if (!title || !company || !experience || !location) {
//       console.warn('Missing required fields:', req.body);
//       return res.status(400).json({ msg: 'Missing required fields' });
//     }
//     const job = new Job({
//       title,
//       company,
//       companyLogo: req.file ? `/uploads/logos/${req.file.filename}` : '',
//       experience,
//       salary,
//       location,
//       openings: parseInt(openings) || 1,
//       status: 'pending',
//       postedBy: req.user.id, // Added to track job creator
//     });
//     await job.save();
//     console.log('Job created:', job._id);
//     res.status(201).json({ msg: 'Job created, awaiting approval', job });
//   } catch (err) {
//     console.error('Create job error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Update job status (admin only)
// router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
//   const { status } = req.body;
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid job ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid job ID' });
//     }
//     if (!['pending', 'approved', 'rejected'].includes(status)) {
//       console.warn('Invalid status:', status);
//       return res.status(400).json({ msg: 'Invalid status' });
//     }
//     const job = await Job.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     );
//     if (!job) {
//       console.warn('Job not found for status update:', req.params.id);
//       return res.status(404).json({ msg: 'Job not found' });
//     }
//     console.log('Job status updated:', job._id, status);
//     res.json({ msg: 'Job status updated', job });
//   } catch (err) {
//     console.error('Update job status error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = require('../models/Job');
const { authMiddleware } = require('../middleware/auth');
const { adminMiddleware } = require('../middleware/admin');
const upload = require('../middleware/upload');

// Create a new job (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('companyLogo'), async (req, res) => {
  try {
    const { title, company, experience, salary, location, openings } = req.body;
    console.log('Create job request:', { title, company, userId: req.user.id });
    if (!title || !company || !experience || !location || !openings) {
      console.warn('Missing required fields:', { title, company, experience, location, openings });
      return res.status(400).json({ msg: 'All required fields must be provided' });
    }
    const job = new Job({
      title,
      company,
      companyLogo: req.file ? req.file.path : '',
      experience,
      salary,
      location,
      openings,
      status: 'approved', // Set to approved for admin-created jobs
      postedBy: req.user.id,
    });
    await job.save();
    console.log('Job created:', { id: job._id, title, company });
    res.status(201).json({ msg: 'Job created successfully', job });
  } catch (err) {
    console.error('Create job error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all approved jobs (public)
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'approved' });
    console.log('Fetched approved jobs:', jobs.length);
    res.json(jobs);
  } catch (err) {
    console.error('Get jobs error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all jobs (admin only, includes pending/rejected)
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find();
    console.log('Fetched all jobs:', jobs.length);
    res.json(jobs);
  } catch (err) {
    console.error('Get all jobs error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update job status (admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  try {
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      console.warn('Invalid status:', status);
      return res.status(400).json({ msg: 'Invalid status' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn('Invalid job ID:', req.params.id);
      return res.status(400).json({ msg: 'Invalid job ID' });
    }
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!job) {
      console.warn('Job not found:', req.params.id);
      return res.status(404).json({ msg: 'Job not found' });
    }
    console.log('Job status updated:', { id: job._id, status });
    res.json({ msg: 'Job status updated', job });
  } catch (err) {
    console.error('Update job status error:', { message: err.message, stack: err.stack });
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;