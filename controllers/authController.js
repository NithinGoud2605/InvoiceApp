const AWS = require('aws-sdk');
const crypto = require('crypto');
const { User } = require('../models'); // Local DB model, if needed
const computeSecretHash = require('../utils/computeSecretHash');

// Update AWS region from environment variable or default
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

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
        { Name: 'name', Value: name }
      ]
    };

    cognito.signUp(params, async (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Sign up failed' });
      }
      await User.create({
        email,
        name,
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
      return res.json({ message: 'User confirmed successfully', data });
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
      
      // Return the Cognito tokens directly.
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

// --- NEW: Forgot Password ---
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      SecretHash: computeSecretHash(email)
    };
    
    cognito.forgotPassword(params, (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Forgot password failed' });
      }
      return res.json({
        message: 'A password reset code has been sent to your email.',
        data
      });
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmForgotPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const cognito = new AWS.CognitoIdentityServiceProvider();
    const params = {
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: computeSecretHash(email)
    };
    
    cognito.confirmForgotPassword(params, (err, data) => {
      if (err) {
        return res.status(400).json({ message: err.message || 'Password reset confirmation failed' });
      }
      return res.json({
        message: 'Password has been reset successfully.',
        data
      });
    });
  } catch (err) {
    next(err);
  }
};
