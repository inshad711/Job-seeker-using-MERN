// // D:\JobseekerWeb\backend\middleware\admin.js
// module.exports = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ msg: 'Admin access required' });
//   }
// };

// D:\JobseekerWeb\backend\middleware\admin.js
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Admin middleware - Access granted for user:', req.user.id);
    next();
  } else {
    console.warn('Admin middleware - Access denied for user:', req.user?.id || 'unknown');
    res.status(403).json({ msg: 'Admin access required' });
  }
};

module.exports = { adminMiddleware };