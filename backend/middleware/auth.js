

// D:\JobseekerWeb\backend\middleware\auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware - Received headers:', req.headers);
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Auth middleware - Token extracted:', token ? '[token present]' : 'no token found');
  
  if (!token) {
    console.warn('No token provided in Authorization header');
    return res.status(401).json({ msg: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Auth middleware - Token verification error:', err.message);
    res.status(401).json({ msg: 'Invalid token', error: err.message });
  }
};

module.exports = { authMiddleware };