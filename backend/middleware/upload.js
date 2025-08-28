


// D:\JobseekerWeb\backend\middleware\upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'resume' ? 'uploads/resumes/' : 'uploads/logos/';
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const userId = req.user?.id || 'unknown';
    cb(null, `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume' && file.mimetype !== 'application/pdf') {
      return cb(new Error('Invalid file type: Only PDF files are allowed for resumes'));
    }
    if (file.fieldname === 'companyLogo' && !file.mimetype.startsWith('image/')) {
      return cb(new Error('Invalid file type: Only image files are allowed for company logos'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for all files
  },
});

module.exports = upload;