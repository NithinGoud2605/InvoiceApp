// utils/s3Uploader.js
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const s3 = new AWS.S3();

async function uploadToS3(buffer, key) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf'
    // Remove ACL because the bucket doesn't allow ACLs
    // ACL: 'private'
  };

  const data = await s3.upload(params).promise();
  return data.Location;
}

function getPreSignedUrl(key, expiresIn = 60) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: expiresIn
  };
  return s3.getSignedUrl('getObject', params);
}

module.exports = {
  uploadToS3,
  getPreSignedUrl
};
