// config/cognito.js
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID, // e.g., 'us-east-1_dhdmutWQv'
  ClientId: process.env.COGNITO_CLIENT_ID,        // e.g., '56ungteq2qkpej9om3km2sh8kc'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

module.exports = {
  userPool,
  AmazonCognitoIdentity,
  AWS,
};
