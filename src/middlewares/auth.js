const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const authHeader = req.headers.authorization;
  console.log(req.params);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Hi1');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1].trim();

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log('Ho2');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
