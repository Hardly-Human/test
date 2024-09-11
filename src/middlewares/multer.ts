import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from '../config/awsS3';
import path from 'path';

// Multer S3 configuration
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    acl: 'private',  // Bucket is private
    contentType: multerS3.AUTO_CONTENT_TYPE,  // Automatically set content-type based on file
    key: function (req, file, cb) {
      // Generate a unique filename
      const uniqueFileName = `${Date.now()}_${path.basename(file.originalname)}`;
      cb(null, uniqueFileName);
    },
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    contentDisposition: 'inline'  // Ensure files are displayed, not downloaded
  }),
});

export default upload;

