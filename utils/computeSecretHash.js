// utils/computeSecretHash.js
const crypto = require('crypto');

function computeSecretHash(username) {
  const clientSecret = process.env.COGNITO_CLIENT_SECRET;
  const clientId = process.env.COGNITO_CLIENT_ID;
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
}

module.exports = computeSecretHash;
