const axios = require('axios');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authCallback = async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Authorization code not provided' });
    }
    
    const domain = 'invoiceapp.auth.us-east-1.amazoncognito.com'; // your Cognito domain
    const clientId = process.env.COGNITO_CLIENT_ID;
    const clientSecret = process.env.COGNITO_CLIENT_SECRET;
    const redirectUri = 'http://localhost:5173/auth/callback';
    
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenResponse = await axios.post(
      `https://${domain}/oauth2/token`,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`
        }
      }
    );
    
    const { id_token, access_token, refresh_token } = tokenResponse.data;
    const decoded = jwt.decode(id_token);
    const { email, name, sub } = decoded;
    
    let user = await User.findOne({ where: { cognitoSub: sub } });
    if (!user) {
      user = await User.create({ email, name, cognitoSub: sub });
    }
    
    // Redirect or return tokens
    const redirectTo = `http://localhost:5173/dashboard?token=${encodeURIComponent(id_token)}`;
    return res.redirect(redirectTo);
  } catch (err) {
    console.error("Error during auth callback:", err);
    return res.status(500).json({ message: 'Authentication callback failed' });
  }
};
