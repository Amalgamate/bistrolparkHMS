import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Middleware to verify JWT token
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user from payload to request
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user has admin role
const adminAuth = (req, res, next) => {
  // First verify token
  auth(req, res, () => {
    // Check if user is admin, bristol-admin, or super-admin
    const adminRoles = ['admin', 'bristol-admin', 'super-admin'];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied, admin privileges required',
        currentRole: req.user.role,
        requiredRoles: adminRoles
      });
    }

    next();
  });
};

// Middleware to check if user has doctor role
const doctorAuth = (req, res, next) => {
  // First verify token
  auth(req, res, () => {
    // Check if user is doctor or any admin role
    const allowedRoles = ['doctor', 'admin', 'bristol-admin', 'super-admin'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied, doctor privileges required',
        currentRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }

    next();
  });
};

// Export with multiple names for compatibility
export { auth, adminAuth, doctorAuth, auth as authenticateToken };
