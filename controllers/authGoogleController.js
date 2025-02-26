const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleSignIn = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    // Verify the token using Google's library
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, name, sub } = payload;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        name,
        cognitoSub: sub
      });
    } else {
      // Optionally update user details if needed
      user.name = name;
      await user.save();
    }

    const appToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.APP_JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Google sign in successful', token: appToken });
  } catch (err) {
    console.error('Error in Google sign in:', err);  // Log full error details
    return res.status(500).json({ message: 'Google sign in failed', error: err.message });
  }
  
};
