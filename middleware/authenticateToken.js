const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer'

  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, "Nural@123"); // Use your secret key

    // Attach the decoded user info to the request object
    req.user = decoded;

    // Proceed to the next middleware/route
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
