import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Image } from '../entity/Image';
import { nanoid } from 'nanoid';  // Use ES module syntax for nanoid

const CLOUD_FRONT_DOMAIN = process.env.CLOUD_FRONT_DOMAIN || 'd1234567890abc.cloudfront.net';

// Handle the file upload and save metadata to the database
export const uploadImage = async (req: Request, res: Response) => {
  const file = req.file as Express.MulterS3.File;
  
  if (file) {
    // Generate the CloudFront URL using the S3 key and CloudFront domain
    const cloudFrontUrl = `https://${CLOUD_FRONT_DOMAIN}/${file.key}`;
    const imageRepo = AppDataSource.getRepository(Image);
    const user = (req as any).user;  // Ensure req.user is populated by middleware

    try {
      // Generate a short URL using nanoid
      const shortUrl = nanoid(7);  // Generate a 7-character short URL

      // Create and save image metadata
      const image = new Image();
      image.url = cloudFrontUrl;
      image.key = file.key;
      image.createdAt = new Date();
      image.shortUrl = shortUrl;  // Assign the generated short URL
      image.user = user;  // Associate image with the logged-in user

      await imageRepo.save(image);

      // Render the upload-success.ejs view with the short URL
      res.render('upload-success', {
        shortUrl: `${req.protocol}://${req.get('host')}/i/${shortUrl}`
      });
    } catch (error) {
      console.error('Error saving image metadata:', error);
      res.status(500).send('Failed to save image metadata.');
    }
  } else {
    res.status(400).send('Failed to upload image.');
  }
};
