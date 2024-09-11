import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import s3 from '../config/awsS3';

// Configure Multer to use S3 for image storage with the new S3Client
const upload = multer({
  storage: multerS3({
    s3: s3 as any,  // Casting s3 as any because multer-s3 expects v2 S3 but we're using S3Client
    bucket: process.env.AWS_BUCKET_NAME || '',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // Unique file name
    }
  })
});

export default upload;
