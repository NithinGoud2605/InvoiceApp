// controllers/uploadController.js
const multer = require('multer');

// Simple storage config; adapt to your needs (S3, local disk, etc.)
const upload = multer({ dest: 'uploads/' });

exports.uploadFile = [
  upload.single('file'),
  async (req, res) => {
    // Access file info from req.file
    return res.json({ message: "File uploaded successfully", file: req.file });
  }
];
