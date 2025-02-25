// controllers/authController.js
const AWS = require('aws-sdk');
const crypto = require('crypto');
const { User } = require('../models'); // Optional: for storing a local user record

// Update AWS region from environment variable
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

// Helper function to compute the SecretHash
function computeSecretHash(username) {
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const clientId = process.env.COGNITO_CLIENT_ID;
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }
    
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      SecretHash: computeSecretHash(email),
      UserAttributes: [
        { Name: 'email', Value: email },
        // Provide the name attribute (this satisfies the required name.formatted mapping)
        { Name: 'name', Value: name }
      ]
    };

    cognito.signUp(params, async (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Sign up failed' });
      }
      
      // Optionally, create a record in your local DB
      await User.create({
        email,
        cognitoSub: data.UserSub
      });
      
      return res.json({
        message: 'User registered. Please check your email for a confirmation code.',
        userSub: data.UserSub
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      SecretHash: computeSecretHash(email)
    };
    
    cognito.confirmSignUp(params, (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Confirmation failed' });
      }
      return res.json({
        message: 'User confirmed successfully',
        data
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: computeSecretHash(email)
      }
    };
    
    cognito.initiateAuth(params, (err, data) => {
      if (err) {
        return res.status(401).json({ message: err.message || 'Login failed' });
      }
      
      const { AuthenticationResult } = data;
      return res.json({
        message: 'Login successful',
        idToken: AuthenticationResult.IdToken,
        accessToken: AuthenticationResult.AccessToken,
        refreshToken: AuthenticationResult.RefreshToken
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  // Logout is usually handled on the client by clearing tokens.
  return res.json({ message: 'Logout is typically handled on the client side.' });
};

exports.refresh = async (req, res, next) => {
  try {
    const { email, refreshToken } = req.body;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: computeSecretHash(email)
      }
    };
    
    cognito.initiateAuth(params, (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Token refresh failed' });
      }
      
      const { AuthenticationResult } = data;
      return res.json({
        message: 'Token refreshed successfully',
        idToken: AuthenticationResult.IdToken,
        accessToken: AuthenticationResult.AccessToken
      });
    });
  } catch (err) {
    next(err);
  }
};
