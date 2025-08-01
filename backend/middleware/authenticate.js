const jwt = require('jsonwebtoken');

const authenticate = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: true, message: 'Access denied. No token provided.' });
      }
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      // Check if role is allowed if allowedRoles is provided
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: true, message: 'Access denied. Insufficient permissions.' });
      }
      
      next();
    } catch (err) {
      console.error('Authentication error:', err);
      res.status(401).json({ error: true, message: 'Invalid token.' });
    }
  };
};

module.exports = authenticate;
