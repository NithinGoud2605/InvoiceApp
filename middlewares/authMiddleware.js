const { CognitoJwtVerifier } = require('aws-jwt-verify');
const { User } = require('../models'); // Ensure User model is included
const logger = require('../utils/logger');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'id',
  clientId: process.env.COGNITO_CLIENT_ID
});

const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = await verifier.verify(token);
    console.log('✅ Decoded Cognito Token:', payload);

    let user = await User.findOne({ where: { cognitoSub: payload.sub } });

    // Create user if not found
    if (!user) {
      console.log('ℹ️ Creating new user in database');
      user = await User.create({
        cognitoSub: payload.sub,
        email: payload.email,
        name: payload.name || 'Unknown',
      });
    }

    req.user = {
      id: user.id,
      cognitoSub: user.cognitoSub,
      email: user.email,
    };

    console.log('✅ Authenticated User ID:', req.user.id);
    next();
  } catch (err) {
    logger.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { requireAuth };
