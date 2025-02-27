const { CognitoJwtVerifier } = require('aws-jwt-verify');
const logger = require('../utils/logger');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID
});

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = await verifier.verify(token);
    req.user = {
      sub: payload.sub,       // Cognito user sub
      email: payload.email,
      cognitoGroups: payload['cognito:groups'] || []
    };
    next();
  } catch (err) {
    logger.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (role) => (req, res, next) => {
  if (!req.user?.cognitoGroups?.includes(role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
};

module.exports = { requireAuth, requireRole };
