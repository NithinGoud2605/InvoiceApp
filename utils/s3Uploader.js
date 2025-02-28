const AWS = require('aws-sdk');

console.log('AWS_REGION:', process.env.AWS_REGION);
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);

AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });
const s3 = new AWS.S3();

async function uploadToS3(buffer, key) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf'
  };

  try {
    const data = await s3.upload(params).promise();
    console.log('S3 upload success:', data);
    return data.Location;
  } catch (err) {
    console.error('S3 upload error:', err);
    throw err;
  }
}

function getPreSignedUrl(key, expiresIn = 300) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: expiresIn
  };
  return s3.getSignedUrl('getObject', params);
}

async function deleteFromS3(key) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key
  };
  try {
    const data = await s3.deleteObject(params).promise();
    console.log('S3 delete success:', data);
    return data;
  } catch (err) {
    console.error('S3 delete error:', err);
    throw err;
  }
}

module.exports = {
  uploadToS3,
  getPreSignedUrl,
  deleteFromS3
};
