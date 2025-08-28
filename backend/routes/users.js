// // // D:\JobseekerWeb\backend\routes\users.js

// // const express = require('express');
// // const router = express.Router();
// // const mongoose = require('mongoose');
// // const User = require('../models/User');
// // const auth = require('../middleware/auth');
// // const admin = require('../middleware/admin');

// // // Get all users (for admin dashboard)
// // router.get('/', auth, admin, async (req, res) => {
// //   try {
// //     const users = await User.find().select('name email role');
// //     console.log('Fetched users:', users.length);
// //     res.json(users);
// //   } catch (err) {
// //     console.error('Get users error:', err.message);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // });

// // // Get user by ID
// // router.get('/:id', auth, admin, async (req, res) => {
// //   try {
// //     if (!mongoose.isValidObjectId(req.params.id)) {
// //       console.warn('Invalid user ID:', req.params.id);
// //       return res.status(400).json({ msg: 'Invalid user ID' });
// //     }
// //     const user = await User.findById(req.params.id).select('name email role');
// //     if (!user) {
// //       console.warn('User not found:', req.params.id);
// //       return res.status(404).json({ msg: 'User not found' });
// //     }
// //     console.log('Fetched user:', user._id);
// //     res.json(user);
// //   } catch (err) {
// //     console.error('Get user error:', err.message);
// //     res.status(500).json({ msg: 'Server error', error: err.message });
// //   }
// // });

// // module.exports = router;


// // backend/routes/users.js
// const express = require('express');
// const router = express.Router();
// const mongoose = require('mongoose');
// const User = require('../models/User');
// const { authMiddleware } = require('../middleware/auth'); // Renamed for clarity
// const { adminMiddleware } = require('../middleware/admin');
// const upload = require('../middleware/upload'); // For file uploads

// // Get Current User Profile
// router.get('/profile', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) {
//       console.warn('User not found:', req.user.id);
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     console.log('Fetched profile:', user._id);
//     res.json(user);
//   } catch (err) {
//     console.error('Get profile error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Update Current User Profile
// router.put('/profile', authMiddleware, upload.single('resume'), async (req, res) => {
//   try {
//     const { name, contact, profileImage } = req.body;
//     const updateData = { name, contact, profileImage };
    
//     // Handle resume file upload
//     if (req.file) {
//       updateData.resumeLink = `/uploads/resumes/${req.file.filename}`;
//     }

//     const user = await User.findByIdAndUpdate(
//       req.user.id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!user) {
//       console.warn('User not found:', req.user.id);
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     console.log('Profile updated:', user._id);
//     res.json(user);
//   } catch (err) {
//     console.error('Update profile error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Get all users (for admin dashboard)
// router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     const users = await User.find().select('name email role');
//     console.log('Fetched users:', users.length);
//     res.json(users);
//   } catch (err) {
//     console.error('Get users error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// // Get user by ID (for admin)
// router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
//   try {
//     if (!mongoose.isValidObjectId(req.params.id)) {
//       console.warn('Invalid user ID:', req.params.id);
//       return res.status(400).json({ msg: 'Invalid user ID' });
//     }
//     const user = await User.findById(req.params.id).select('name email role contact profileImage resumeLink');
//     if (!user) {
//       console.warn('User not found:', req.params.id);
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     console.log('Fetched user:', user._id);
//     res.json(user);
//   } catch (err) {
//     console.error('Get user error:', err.message);
//     res.status(500).json({ msg: 'Server error', error: err.message });
//   }
// });

// module.exports = router;


// D:\JobseekerWeb\backend\routes\users.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth'); // Ensure this is a function
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

// Get Current User Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.warn('User not found:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('Fetched profile:', user._id);
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Update Current User Profile
router.put('/profile', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    const { name, contact, profileImage } = req.body;
    const updateData = { name, contact, profileImage };
    
    // Handle resume file upload
    if (req.file) {
      updateData.resumeLink = `/uploads/resumes/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      console.warn('User not found:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log('Profile updated:', user._id);
    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get all users (for admin dashboard)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('name email role');
    console.log('Fetched users:', users.length);
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Get user by ID (for admin)
router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      console.warn('Invalid user ID:', req.params.id);
      return res.status(400).json({ msg: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).select('name email role contact profileImage resumeLink');
    if (!user) {
      console.warn('User not found:', req.params.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('Fetched user:', user._id);
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;